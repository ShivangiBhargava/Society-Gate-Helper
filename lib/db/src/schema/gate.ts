import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const visitorEventsTable = pgTable("visitor_events", {
  id: serial("id").primaryKey(),
  eventId: text("event_id").notNull().unique(),
  flatNumber: text("flat_number").notNull(),
  visitorName: text("visitor_name").notNull(),
  visitType: text("visit_type").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull(),
  source: text("source").notNull().default("Ring simulator"),
  receivedAt: timestamp("received_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decisionMessage: text("decision_message"),
});

export const preApprovalRulesTable = pgTable("pre_approval_rules", {
  id: serial("id").primaryKey(),
  flatNumber: text("flat_number").notNull(),
  visitType: text("visit_type").notNull(),
  visitorMatch: text("visitor_match"),
  scheduleLabel: text("schedule_label").notNull(),
  daysOfWeek: text("days_of_week").array().notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
