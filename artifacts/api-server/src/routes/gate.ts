import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter, type Request } from "express";
import {
  CreateRuleBody,
  CreateRuleResponse,
  DecideVisitBody,
  DecideVisitParams,
  DecideVisitResponse,
  DeleteRuleParams,
  DeleteRuleResponse,
  GetDashboardResponse,
  ListRulesResponse,
  ListVisitsResponse,
  ReceiveRingWebhookBody,
  ReceiveRingWebhookHeader,
  ReceiveRingWebhookResponse,
  SimulateVisitBody,
  SimulateVisitResponse,
  UpdateRuleBody,
  UpdateRuleParams,
  UpdateRuleResponse,
} from "@workspace/api-zod";
import { db, preApprovalRulesTable, visitorEventsTable } from "@workspace/db";

const router: IRouter = Router();
const DEMO_SIMULATOR_SECRET = "society-gate-helper-local-demo";
const INDIA_TIME_ZONE = "Asia/Kolkata";
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type SignedEvent = {
  eventId: string;
  flatNumber: string;
  visitorName: string;
  visitType: "delivery" | "guest" | "unknown";
  provider: string;
};

function hmacFor(rawBody: Buffer, secret: string): string {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

function isValidHmac(rawBody: Buffer, signature: string, secret: string): boolean {
  const normalized = signature.startsWith("sha256=")
    ? signature.slice("sha256=".length)
    : signature;
  if (!/^[a-f\d]{64}$/i.test(normalized)) return false;

  const expected = Buffer.from(hmacFor(rawBody, secret), "hex");
  const supplied = Buffer.from(normalized, "hex");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function getRequestRawBody(req: Request): Buffer {
  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  return rawBody ?? Buffer.from(JSON.stringify(req.body));
}

function indiaDateKey(value: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function currentIndiaSchedule(value: Date): { day: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: INDIA_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const part = (type: string) => parts.find((entry) => entry.type === type)?.value ?? "";
  return { day: part("weekday"), time: `${part("hour")}:${part("minute")}` };
}

function isRuleActiveNow(
  rule: typeof preApprovalRulesTable.$inferSelect,
  now: Date,
): boolean {
  if (!rule.active) return false;
  const { day, time } = currentIndiaSchedule(now);
  if (!rule.daysOfWeek.includes(day)) return false;

  const inWindow =
    rule.startTime <= rule.endTime
      ? time >= rule.startTime && time <= rule.endTime
      : time >= rule.startTime || time <= rule.endTime;
  return inWindow;
}

async function seedDemoData(): Promise<void> {
  const [existing] = await db
    .select({ id: visitorEventsTable.id })
    .from(visitorEventsTable)
    .limit(1);
  if (existing) return;

  const now = new Date();
  const everyDay = DAY_LABELS;
  await db.insert(preApprovalRulesTable).values([
    {
      flatNumber: "402",
      visitType: "guest",
      visitorMatch: "Maya",
      scheduleLabel: "Daily cook · 8:00–9:00 AM",
      daysOfWeek: everyDay,
      startTime: "08:00",
      endTime: "09:00",
      active: true,
    },
    {
      flatNumber: "1203",
      visitType: "delivery",
      visitorMatch: "Amazon",
      scheduleLabel: "Amazon deliveries · any time",
      daysOfWeek: everyDay,
      startTime: "00:00",
      endTime: "23:59",
      active: true,
    },
  ]);
  await db.insert(visitorEventsTable).values([
    {
      eventId: "demo-ring-evt-1001",
      flatNumber: "402",
      visitorName: "Ravi Kumar",
      visitType: "delivery",
      provider: "Zomato",
      status: "pending",
      source: "Ring simulator",
      receivedAt: new Date(now.getTime() - 4 * 60_000),
    },
    {
      eventId: "demo-ring-evt-1002",
      flatNumber: "1203",
      visitorName: "Amazon delivery",
      visitType: "delivery",
      provider: "Amazon",
      status: "approved",
      source: "Ring simulator",
      receivedAt: new Date(now.getTime() - 12 * 60_000),
      decidedAt: new Date(now.getTime() - 12 * 60_000),
      decisionMessage: "Flat 1203: Amazon delivery approved by pre-approval rule",
    },
    {
      eventId: "demo-ring-evt-1003",
      flatNumber: "605",
      visitorName: "Aarav Mehta",
      visitType: "guest",
      provider: "Guest",
      status: "at_gate",
      source: "Ring simulator",
      receivedAt: new Date(now.getTime() - 23 * 60_000),
      decidedAt: new Date(now.getTime() - 21 * 60_000),
      decisionMessage: "Flat 605: guest asked to wait at gate",
    },
  ]);
}

let seedPromise: Promise<void> | undefined;

async function ensureDemoData(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedDemoData().catch((error: unknown) => {
      seedPromise = undefined;
      throw error;
    });
  }
  await seedPromise;
}

async function applySignedEvent(
  event: SignedEvent,
  rawBody: Buffer,
  signature: string,
  secret: string,
): Promise<ReturnType<typeof SimulateVisitResponse.parse>> {
  if (!isValidHmac(rawBody, signature, secret)) {
    throw new Error("Invalid webhook signature");
  }

  const [existing] = await db
    .select()
    .from(visitorEventsTable)
    .where(eq(visitorEventsTable.eventId, event.eventId))
    .limit(1);

  if (existing) {
    return SimulateVisitResponse.parse({
      visit: existing,
      duplicate: true,
      signatureValid: true,
      message: "Duplicate webhook safely ignored. The original visit stays in the log.",
    });
  }

  const now = new Date();
  const rules = await db
    .select()
    .from(preApprovalRulesTable)
    .where(eq(preApprovalRulesTable.active, true));
  const matchedRule = rules.find((rule) => {
    if (rule.flatNumber.toLowerCase() !== event.flatNumber.toLowerCase()) {
      return false;
    }
    if (rule.visitType !== event.visitType || !isRuleActiveNow(rule, now)) {
      return false;
    }
    if (!rule.visitorMatch) return true;
    const searchableVisitor = `${event.visitorName} ${event.provider}`.toLowerCase();
    return searchableVisitor.includes(rule.visitorMatch.toLowerCase());
  });

  const status = matchedRule ? "approved" : "pending";
  const decisionMessage = matchedRule
    ? `Flat ${event.flatNumber}: ${event.provider} ${event.visitType} approved by pre-approval rule`
    : null;
  const [inserted] = await db
    .insert(visitorEventsTable)
    .values({
      ...event,
      status,
      source: "Ring simulator",
      receivedAt: now,
      decidedAt: matchedRule ? now : null,
      decisionMessage,
    })
    .onConflictDoNothing({ target: visitorEventsTable.eventId })
    .returning();

  if (!inserted) {
    const [duplicate] = await db
      .select()
      .from(visitorEventsTable)
      .where(eq(visitorEventsTable.eventId, event.eventId))
      .limit(1);
    if (!duplicate) throw new Error("Event could not be saved");
    return SimulateVisitResponse.parse({
      visit: duplicate,
      duplicate: true,
      signatureValid: true,
      message: "Duplicate webhook safely ignored. The original visit stays in the log.",
    });
  }

  return SimulateVisitResponse.parse({
    visit: inserted,
    duplicate: false,
    signatureValid: true,
    message: matchedRule
      ? "Valid signature. Matching pre-approval rule auto-approved this visit."
      : "Valid signature. Visit sent to the resident for a decision.",
  });
}

router.get("/dashboard", async (req, res): Promise<void> => {
  await ensureDemoData();
  const [visits, rules] = await Promise.all([
    db.select().from(visitorEventsTable).orderBy(desc(visitorEventsTable.receivedAt)),
    db.select().from(preApprovalRulesTable),
  ]);
  const today = indiaDateKey(new Date());
  const visitsToday = visits.filter((visit) => indiaDateKey(visit.receivedAt) === today);
  const response = GetDashboardResponse.parse({
    summary: {
      visitsToday: visitsToday.length,
      awaitingDecision: visits.filter((visit) => visit.status === "pending").length,
      approvedToday: visitsToday.filter((visit) => visit.status === "approved").length,
      deniedToday: visitsToday.filter((visit) => visit.status === "denied").length,
      activeRules: rules.filter((rule) => rule.active).length,
    },
    recentVisits: visits.slice(0, 6),
  });
  req.log.debug("Loaded gate dashboard");
  res.json(response);
});

router.get("/visits", async (req, res): Promise<void> => {
  await ensureDemoData();
  const visits = await db
    .select()
    .from(visitorEventsTable)
    .orderBy(desc(visitorEventsTable.receivedAt));
  res.json(ListVisitsResponse.parse(visits));
});

router.post("/demo/simulate", async (req, res): Promise<void> => {
  const parsed = SimulateVisitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await ensureDemoData();
  const event: SignedEvent = {
    eventId: parsed.data.eventId ?? randomUUID(),
    flatNumber: parsed.data.flatNumber.trim(),
    visitorName: parsed.data.visitorName.trim(),
    visitType: parsed.data.visitType,
    provider: parsed.data.provider.trim(),
  };
  const rawBody = Buffer.from(JSON.stringify(event));
  const signature = `sha256=${hmacFor(rawBody, DEMO_SIMULATOR_SECRET)}`;
  const response = await applySignedEvent(
    event,
    rawBody,
    signature,
    DEMO_SIMULATOR_SECRET,
  );
  req.log.info(
    { eventId: event.eventId, duplicate: response.duplicate },
    "Processed simulated doorbell event",
  );
  res.status(response.duplicate ? 200 : 201).json(response);
});

router.post("/webhooks/ring", async (req, res): Promise<void> => {
  const headers = ReceiveRingWebhookHeader.safeParse({
    "x-ring-signature": req.get("x-ring-signature"),
  });
  const parsed = ReceiveRingWebhookBody.safeParse(req.body);
  if (!headers.success) {
    res.status(400).json({ error: headers.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const secret = process.env.RING_WEBHOOK_SECRET;
  if (!secret) {
    res.status(503).json({ error: "Ring webhook secret is not configured" });
    return;
  }
  await ensureDemoData();
  const rawBody = getRequestRawBody(req);
  const response = await applySignedEvent(
    parsed.data,
    rawBody,
    headers.data["x-ring-signature"],
    secret,
  ).catch((error: unknown) => {
    if (error instanceof Error && error.message === "Invalid webhook signature") {
      return null;
    }
    throw error;
  });
  if (!response) {
    res.status(401).json({ error: "Invalid event signature" });
    return;
  }
  req.log.info(
    { eventId: parsed.data.eventId, duplicate: response.duplicate },
    "Processed Ring webhook",
  );
  res.status(response.duplicate ? 200 : 201).json(
    ReceiveRingWebhookResponse.parse(response),
  );
});

router.patch("/visits/:id/decision", async (req, res): Promise<void> => {
  const params = DecideVisitParams.safeParse(req.params);
  const body = DecideVisitBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [visit] = await db
    .select()
    .from(visitorEventsTable)
    .where(eq(visitorEventsTable.id, params.data.id))
    .limit(1);
  if (!visit) {
    res.status(404).json({ error: "Visit not found" });
    return;
  }
  if (visit.status !== "pending") {
    res.status(409).json({ error: "This visit already has a decision" });
    return;
  }

  const status = body.data.decision;
  const verb = status === "at_gate" ? "asked to wait at gate" : status;
  const [updated] = await db
    .update(visitorEventsTable)
    .set({
      status,
      decidedAt: new Date(),
      decisionMessage: `Flat ${visit.flatNumber}: ${visit.provider} ${visit.visitType} ${verb}`,
    })
    .where(and(eq(visitorEventsTable.id, params.data.id), eq(visitorEventsTable.status, "pending")))
    .returning();
  if (!updated) {
    res.status(409).json({ error: "This visit already has a decision" });
    return;
  }

  req.log.info(
    { visitId: updated.id, decision: status },
    "Recorded resident decision",
  );
  res.json(DecideVisitResponse.parse(updated));
});

router.get("/rules", async (req, res): Promise<void> => {
  await ensureDemoData();
  const rules = await db
    .select()
    .from(preApprovalRulesTable)
    .orderBy(desc(preApprovalRulesTable.createdAt));
  res.json(ListRulesResponse.parse(rules));
});

router.post("/rules", async (req, res): Promise<void> => {
  const parsed = CreateRuleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.startTime > "23:59" || parsed.data.endTime > "23:59") {
    res.status(400).json({ error: "Rule times must be valid 24-hour times" });
    return;
  }
  const [rule] = await db
    .insert(preApprovalRulesTable)
    .values(parsed.data)
    .returning();
  req.log.info({ ruleId: rule.id, flatNumber: rule.flatNumber }, "Created pre-approval rule");
  res.status(201).json(CreateRuleResponse.parse(rule));
});

router.patch("/rules/:id", async (req, res): Promise<void> => {
  const params = UpdateRuleParams.safeParse(req.params);
  const body = UpdateRuleBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [rule] = await db
    .update(preApprovalRulesTable)
    .set({ active: body.data.active })
    .where(eq(preApprovalRulesTable.id, params.data.id))
    .returning();
  if (!rule) {
    res.status(404).json({ error: "Pre-approval rule not found" });
    return;
  }
  res.json(UpdateRuleResponse.parse(rule));
});

router.delete("/rules/:id", async (req, res): Promise<void> => {
  const params = DeleteRuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [rule] = await db
    .delete(preApprovalRulesTable)
    .where(eq(preApprovalRulesTable.id, params.data.id))
    .returning();
  if (!rule) {
    res.status(404).json({ error: "Pre-approval rule not found" });
    return;
  }
  res.status(204).json(DeleteRuleResponse.parse(undefined));
});

export default router;
