import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowDownLeft, ArrowUpRight, Bell, CalendarDays, Check, CheckCheck,
  ChevronRight, CircleHelp, Clock3, DoorOpen, FileClock, Filter, Home,
  Package, Pencil, Plus, RefreshCw, Search, ShieldCheck, ShieldQuestion,
  ShieldX, SlidersHorizontal, Trash2, Users, X,
} from 'lucide-react';
import {
  getGetDashboardQueryKey, getHealthCheckQueryKey, getListRulesQueryKey,
  getListVisitsQueryKey, useCreateRule, useDecideVisit, useDeleteRule,
  useGetDashboard, useHealthCheck, useListRules, useListVisits,
  useSimulateVisit, useUpdateRule,
} from '@workspace/api-client-react';
import type {
  DashboardResponse, DayOfWeek, PreApprovalRule, PreApprovalRuleInput,
  VisitDecisionInput, VisitRecord, VisitType,
} from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const weekdays: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const INDIA_TIME_ZONE = 'Asia/Kolkata';

const timeLabel = (value?: string | null) => value ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: INDIA_TIME_ZONE }) : '—';
const dateLabel = (value?: string | null) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: INDIA_TIME_ZONE }) : '—';
const indiaWeekday = (value: Date) => value.toLocaleDateString('en-IN', { weekday: 'long', timeZone: INDIA_TIME_ZONE });
const indiaHour = (value: Date) => Number(new Intl.DateTimeFormat('en-IN', { hour: '2-digit', hourCycle: 'h23', timeZone: INDIA_TIME_ZONE }).format(value));
const greeting = (value: Date) => indiaHour(value) < 12 ? 'Good morning' : indiaHour(value) < 17 ? 'Good afternoon' : 'Good evening';
const titleCase = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'V';
const visitIcon = (type: VisitType) => type === 'delivery' ? <Package size={16} /> : type === 'guest' ? <Users size={16} /> : <ShieldQuestion size={16} />;
const readableError = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';

function useRefreshVisits() {
  const client = useQueryClient();
  return () => {
    void client.invalidateQueries({ queryKey: getListVisitsQueryKey() });
    void client.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
  };
}

function StatusPill({ status }: { status: string }) {
  return <span className={`status-pill ${status}`}>{titleCase(status)}</span>;
}

function SkeletonBlock({ count = 3 }: { count?: number }) {
  return <div aria-label="Loading content" data-testid="loading-skeleton">{Array.from({ length: count }, (_, index) => <div className={`skeleton ${count === 5 ? 'skeleton-card' : 'skeleton-line'}`} key={index} />)}</div>;
}

function QueryError({ onRetry }: { onRetry: () => void }) {
  return <div className="error-state" role="alert" data-testid="error-state"><p>We couldn’t load this view just now. Your gate decisions are not affected.</p><button className="btn btn-secondary btn-small" onClick={onRetry} data-testid="button-retry"><RefreshCw size={13} /> Try again</button></div>;
}

function PageHeading({ eyebrow, title, description, right }: { eyebrow: string; title: string; description: string; right?: ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="heading-copy">{description}</p></div>{right}</div>;
}

function VisitCard({ visit, actions }: { visit: VisitRecord; actions?: ReactNode }) {
  return <article className="panel queue-card" data-testid={`card-visit-${visit.id}`}>
    <div>
      <div className="queue-name" data-testid={`text-visitor-${visit.id}`}>{visit.visitorName}</div>
      <div className="queue-details">
        <span><Home size={12} /> Flat {visit.flatNumber}</span>
        <span>{visitIcon(visit.visitType)} {titleCase(visit.visitType)}</span>
        <span><ArrowDownLeft size={12} /> {visit.provider || 'Independent visitor'}</span>
        <span><Clock3 size={12} /> Arrived {timeLabel(visit.receivedAt)}</span>
      </div>
      <div className="queue-foot"><span className="message-text" data-testid={`text-decision-message-${visit.id}`}>{visit.decisionMessage || (visit.status === 'pending' ? 'Waiting for a resident decision' : 'No additional note')}</span>{visit.eventId && <span className="mono">{visit.eventId}</span>}</div>
    </div>
    <div className="queue-status"><StatusPill status={visit.status} />{actions}</div>
  </article>;
}

function NavLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  const [location] = useLocation();
  return <Link href={href} aria-label={typeof children === 'string' ? children : href} title={typeof children === 'string' ? children : undefined} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`link-${href === '/' ? 'overview' : href.slice(1)}`}>{icon}<span>{children}</span></Link>;
}

function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), refetchInterval: 60000 } });
  const names: Record<string, string> = { '/': 'Society overview', '/guard': 'Guard desk', '/resident': 'Resident approvals', '/rules': 'Pre-approvals', '/log': 'Visitor record' };
  return <div className="app-frame">
    <aside className="sidebar">
      <Link href="/" className="brand" data-testid="link-brand-home"><span className="brand-mark"><DoorOpen size={19} /></span><span><span className="brand-name">Society Gate</span><span className="brand-sub">Visitor desk</span></span></Link>
      <div className="nav-caption">Operations</div>
      <nav aria-label="Main navigation">
        <NavLink href="/" icon={<Home />}>Overview</NavLink>
        <NavLink href="/guard" icon={<ShieldCheck />}>Guard desk</NavLink>
        <NavLink href="/resident" icon={<Bell />}>Resident approvals</NavLink>
        <NavLink href="/rules" icon={<SlidersHorizontal />}>Pre-approvals</NavLink>
        <NavLink href="/log" icon={<FileClock />}>Visitor record</NavLink>
      </nav>
      <div className="sidebar-bottom"><div className="nav-caption">At the gate</div><div className="desk-note"><div className="desk-note-title"><ShieldCheck size={14} /> A human makes the call</div><p>Every arrival is recorded first. Approval never unlocks the gate automatically.</p></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="crumb"><span>Gate operations</span><ChevronRight size={13} /><strong data-testid="text-current-page">{names[location] ?? 'Society Gate'}</strong></div><div className="top-status"><span className="live-dot" style={{ background: health.isError ? '#c46c5d' : undefined }} /><span data-testid="status-connection">{health.isError ? 'Connection issue' : health.isLoading ? 'Connecting…' : 'Desk connected'}</span><span className="user-chip" aria-label="Attendant initials">SG</span></div></header>
      {children}
    </main>
  </div>;
}

function DashboardStats({ data }: { data: DashboardResponse }) {
  const stats = [
    { label: 'Visits today', value: data.summary.visitsToday, icon: <ArrowDownLeft size={13} />, foot: 'All arrivals recorded' },
    { label: 'Awaiting decision', value: data.summary.awaitingDecision, icon: <Clock3 size={13} />, foot: 'Needs resident response', tone: 'alert' },
    { label: 'Approved today', value: data.summary.approvedToday, icon: <Check size={13} />, foot: 'Resident confirmed', tone: 'good' },
    { label: 'Denied today', value: data.summary.deniedToday, icon: <ShieldX size={13} />, foot: 'Held at the entrance', tone: 'danger' },
    { label: 'Active rules', value: data.summary.activeRules, icon: <SlidersHorizontal size={13} />, foot: 'Resident pre-approvals' },
  ];
  return <div className="stat-grid">{stats.map((stat) => <div className={`stat-card ${stat.tone ?? ''}`} key={stat.label} data-testid={`metric-${stat.label.toLowerCase().replaceAll(' ', '-')}`}><div className="stat-label"><span className="stat-icon">{stat.icon}</span>{stat.label}</div><div className="stat-value">{stat.value}</div><div className="stat-foot">{stat.foot}</div></div>)}</div>;
}

function HomePage() {
  const dashboard = useGetDashboard({ query: { queryKey: getGetDashboardQueryKey(), refetchInterval: 15000 } });
  const client = useQueryClient();
  const simulate = useSimulateVisit();
  const [form, setForm] = useState({ flatNumber: '', visitorName: '', visitType: 'delivery' as VisitType, provider: '' });
  const [result, setResult] = useState<{ message: string; duplicate: boolean } | null>(null);
  const [submitError, setSubmitError] = useState('');
  const refresh = () => { void client.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); void client.invalidateQueries({ queryKey: getListVisitsQueryKey() }); };
  const setValue = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault(); setResult(null); setSubmitError('');
    simulate.mutate({ data: { ...form, flatNumber: form.flatNumber.trim(), visitorName: form.visitorName.trim(), provider: form.provider.trim() } }, {
      onSuccess: (response) => { setResult({ message: response.message, duplicate: response.duplicate }); refresh(); setForm((current) => ({ ...current, visitorName: '' })); },
      onError: (error) => setSubmitError(readableError(error)),
    });
  };
  return <div className="page-wrap">
    <PageHeading eyebrow={`${indiaWeekday(new Date())} · Society operations`} title={`${greeting(new Date())}, team.`} description="A clear view of every arrival, decision, and resident pre-approval at the gate." right={<div className="date-label"><CalendarDays size={14} />{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', timeZone: INDIA_TIME_ZONE })}</div>} />
    {dashboard.isLoading ? <><SkeletonBlock count={5} /><div className="skeleton skeleton-line" style={{ height: 290 }} /></> : dashboard.isError ? <QueryError onRetry={() => void dashboard.refetch()} /> : dashboard.data && <>
      <DashboardStats data={dashboard.data} />
      <div className="overview-grid">
        <section className="panel sim-panel">
           <div className="panel-head"><div><h2 className="panel-title">Signed doorbell simulator</h2><p className="panel-subtitle">Send a signed Ring-style event through the live gate flow.</p></div><span className="section-kicker">HMAC demo</span></div>
          <div className="sim-body">
             <div className="sim-callout"><span className="callout-icon"><CircleHelp size={17} /></span><div><strong>Try the resident-to-gate handoff</strong><p>Signed test visits enter the same decision queue. This does not open or control a physical gate.</p></div></div>
            <form onSubmit={submit}>
              <div className="field-grid">
                <div className="field"><label htmlFor="sim-flat">Apartment / flat</label><input id="sim-flat" required placeholder="For example, A-204" value={form.flatNumber} onChange={(event) => setValue('flatNumber', event.target.value)} data-testid="input-sim-flat" /></div>
                <div className="field"><label htmlFor="sim-name">Visitor name</label><input id="sim-name" required placeholder="Name at the entrance" value={form.visitorName} onChange={(event) => setValue('visitorName', event.target.value)} data-testid="input-sim-name" /></div>
                <div className="field"><label htmlFor="sim-type">Visit type</label><select id="sim-type" value={form.visitType} onChange={(event) => setValue('visitType', event.target.value)} data-testid="select-sim-type"><option value="delivery">Delivery</option><option value="guest">Guest</option><option value="unknown">Unknown visitor</option></select></div>
                <div className="field"><label htmlFor="sim-provider">Company / provider</label><input id="sim-provider" required placeholder="e.g. Parcel service" value={form.provider} onChange={(event) => setValue('provider', event.target.value)} data-testid="input-sim-provider" /></div>
              </div>
              {submitError && <div className="alert-error" role="alert" data-testid="error-simulate">{submitError}</div>}
              <div className="form-actions"><span className="fine-print">Arrival will be recorded for the attendant. A resident or guard still makes each decision.</span><button className="btn btn-primary" type="submit" disabled={simulate.isPending} data-testid="button-simulate"><ArrowUpRight size={14} />{simulate.isPending ? 'Sending arrival…' : 'Send a test arrival'}</button></div>
              {result && <div className={`result-banner ${result.duplicate ? 'warning' : ''}`} role="status" data-testid="status-simulation-result"><strong>{result.duplicate ? 'Repeat event noted' : 'Arrival received'}</strong>{result.message}</div>}
            </form>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><div><h2 className="panel-title">Latest arrivals</h2><p className="panel-subtitle">Most recent activity at the entrance</p></div><Link href="/log" className="btn btn-secondary btn-small" data-testid="link-view-log">Full record <ChevronRight size={13} /></Link></div>
          <div className="visit-list">
            {dashboard.data.recentVisits.length === 0 ? <div className="empty-state" data-testid="empty-recent-visits"><span className="empty-mark"><DoorOpen size={19} /></span><strong>No visits recorded yet</strong><p>New arrivals will appear here as soon as they reach the desk.</p></div> : dashboard.data.recentVisits.slice(0, 6).map((visit) => <div className="visit-row" key={visit.id} data-testid={`row-recent-visit-${visit.id}`}><span className={`visitor-avatar ${visit.visitType}`}>{initials(visit.visitorName)}</span><div><div className="visitor-name">{visit.visitorName}<StatusPill status={visit.status} /></div><div className="visitor-meta">Flat {visit.flatNumber} · {titleCase(visit.visitType)} · {visit.provider}</div></div><span className="row-time">{timeLabel(visit.receivedAt)}</span></div>)}
          </div>
        </section>
      </div>
    </>}
  </div>;
}

function DecisionButtons({ visit }: { visit: VisitRecord }) {
  const decide = useDecideVisit();
  const refresh = useRefreshVisits();
  const [error, setError] = useState('');
  const choose = (decision: VisitDecisionInput['decision']) => {
    setError('');
    decide.mutate({ id: visit.id, data: { decision } }, { onSuccess: refresh, onError: (reason) => setError(readableError(reason)) });
  };
  return <div className="visit-actions"><button className="btn btn-approve btn-small" onClick={() => choose('approved')} disabled={decide.isPending} data-testid={`button-approve-${visit.id}`}><Check size={12} /> Approve</button><button className="btn btn-deny btn-small" onClick={() => choose('denied')} disabled={decide.isPending} data-testid={`button-deny-${visit.id}`}><X size={12} /> Deny</button>{error && <span className="message-text" role="alert" data-testid={`error-decision-${visit.id}`}>{error}</span>}</div>;
}

function GateArrivalButton({ visit }: { visit: VisitRecord }) {
  const decide = useDecideVisit();
  const refresh = useRefreshVisits();
  const [error, setError] = useState('');
  return <div className="visit-actions"><button className="btn btn-secondary btn-small" onClick={() => { setError(''); decide.mutate({ id: visit.id, data: { decision: 'at_gate' } }, { onSuccess: refresh, onError: (reason) => setError(readableError(reason)) }); }} disabled={decide.isPending} data-testid={`button-mark-at-gate-${visit.id}`}><DoorOpen size={12} /> Mark at gate</button>{error && <span className="message-text" role="alert" data-testid={`error-gate-${visit.id}`}>{error}</span>}</div>;
}

function VisitsQuery({ pendingOnly = false, decidedOnly = false, flatFilter = '' }: { pendingOnly?: boolean; decidedOnly?: boolean; flatFilter?: string }) {
  const visits = useListVisits({ query: { queryKey: getListVisitsQueryKey(), refetchInterval: 5000 } });
  if (visits.isLoading) return <SkeletonBlock />;
  if (visits.isError) return <QueryError onRetry={() => void visits.refetch()} />;
  const filtered = (visits.data ?? []).filter((visit) => (!pendingOnly || visit.status === 'pending') && (!decidedOnly || visit.status !== 'pending') && (!flatFilter || visit.flatNumber.toLowerCase().includes(flatFilter.toLowerCase())));
  if (!filtered.length) return <div className="panel empty-state" data-testid="empty-visits"><span className="empty-mark"><CheckCheck size={19} /></span><strong>{pendingOnly ? 'All caught up' : 'No visits found'}</strong><p>{pendingOnly ? 'There are no arrivals waiting for a resident decision.' : 'Visits will appear here when the gate records an arrival.'}</p></div>;
  return <div>{filtered.map((visit) => <VisitCard key={visit.id} visit={visit} actions={pendingOnly && visit.status === 'pending' ? <DecisionButtons visit={visit} /> : undefined} />)}</div>;
}

function ResidentPage() {
  const visits = useListVisits({ query: { queryKey: getListVisitsQueryKey(), refetchInterval: 5000 } });
  const pendingCount = visits.data?.filter((visit) => visit.status === 'pending').length ?? 0;
  return <div className="page-wrap"><PageHeading eyebrow="Resident response desk" title="Approvals" description="Review who is waiting at your entrance. Approval records a decision; it does not unlock the gate." right={<span className="status-pill pending" data-testid="text-pending-count">{pendingCount} awaiting decision</span>} />
    {visits.isLoading ? <SkeletonBlock /> : visits.isError ? <QueryError onRetry={() => void visits.refetch()} /> : <div className="layout-stack"><div className="panel"><div className="panel-head"><div><h2 className="panel-title">Needs your decision</h2><p className="panel-subtitle">Check the visitor and flat before responding.</p></div><span className="section-kicker">Manual review</span></div><div style={{ padding: '15px 17px' }}><VisitsQuery pendingOnly /></div></div><div className="panel"><div className="panel-head"><div><h2 className="panel-title">Recent decisions</h2><p className="panel-subtitle">Approved and denied arrivals remain visible in the record.</p></div><Link href="/log" className="btn btn-secondary btn-small" data-testid="link-resident-log">View record <ChevronRight size={13} /></Link></div><div style={{ padding: '15px 17px' }}><VisitsQuery decidedOnly /></div></div></div>}
  </div>;
}

function GuardPage() {
  const visits = useListVisits({ query: { queryKey: getListVisitsQueryKey(), refetchInterval: 5000 } });
  const pending = useMemo(() => visits.data?.filter((visit) => visit.status === 'pending') ?? [], [visits.data]);
  const processed = useMemo(() => visits.data?.filter((visit) => visit.status !== 'pending').slice(0, 12) ?? [], [visits.data]);
  return <div className="page-wrap"><PageHeading eyebrow="Attendant view" title="Gate desk" description="Keep the arrival line moving without losing sight of the resident’s decision." right={<div className="date-label"><span className="live-dot" /> Live visit queue</div>} />
    {visits.isLoading ? <SkeletonBlock /> : visits.isError ? <QueryError onRetry={() => void visits.refetch()} /> : <div className="layout-stack">
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">At the desk <span className="status-pill pending" data-testid="text-guard-pending-count">{pending.length} waiting</span></h2><p className="panel-subtitle">Confirm the identity and flat; follow the resident’s recorded decision.</p></div><span className="section-kicker">Attendant actions</span></div><div style={{ padding: '14px 17px' }}>{pending.length ? pending.map((visit) => <VisitCard key={visit.id} visit={visit} actions={<GateArrivalButton visit={visit} />} />) : <div className="empty-state" data-testid="empty-guard-queue"><span className="empty-mark"><ShieldCheck size={19} /></span><strong>Queue is clear</strong><p>New arrivals will be listed here for an attendant to review.</p></div>}</div></section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Decision status</h2><p className="panel-subtitle">A quick reference for recently handled visits.</p></div><Link href="/log" className="btn btn-secondary btn-small" data-testid="link-guard-log">Open visitor record <ChevronRight size={13} /></Link></div><div style={{ padding: '14px 17px' }}>{processed.length ? processed.map((visit) => <VisitCard key={visit.id} visit={visit} />) : <div className="empty-state" data-testid="empty-guard-decisions"><span className="empty-mark"><FileClock size={19} /></span><strong>No decisions recorded yet</strong><p>Handled visits will appear here.</p></div>}</div></section>
    </div>}
  </div>;
}

const blankRule: PreApprovalRuleInput = { flatNumber: '', visitType: 'delivery', visitorMatch: '', scheduleLabel: '', daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startTime: '09:00', endTime: '18:00', active: true };

function RuleModal({ initial, onClose, onSave, pending }: { initial?: PreApprovalRule; onClose: () => void; onSave: (data: PreApprovalRuleInput) => void; pending: boolean }) {
  const [form, setForm] = useState<PreApprovalRuleInput>(initial ? { flatNumber: initial.flatNumber, visitType: initial.visitType, visitorMatch: initial.visitorMatch ?? '', scheduleLabel: initial.scheduleLabel, daysOfWeek: initial.daysOfWeek, startTime: initial.startTime, endTime: initial.endTime, active: initial.active } : blankRule);
  const [error, setError] = useState('');
  const set = <K extends keyof PreApprovalRuleInput,>(key: K, value: PreApprovalRuleInput[K]) => setForm((current) => ({ ...current, [key]: value }));
  const toggleDay = (day: DayOfWeek) => set('daysOfWeek', form.daysOfWeek.includes(day) ? form.daysOfWeek.filter((item) => item !== day) : weekdays.filter((item) => form.daysOfWeek.includes(item) || item === day));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.daysOfWeek.length) { setError('Choose at least one day for this schedule.'); return; }
    if (form.endTime <= form.startTime) { setError('End time must be later than start time.'); return; }
    setError('');
    onSave({ ...form, flatNumber: form.flatNumber.trim(), visitorMatch: form.visitorMatch?.trim() || null, scheduleLabel: form.scheduleLabel.trim() });
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="rule-modal-title" data-testid="dialog-rule">
    <div className="modal-head"><div><h2 id="rule-modal-title">{initial ? 'Edit pre-approval' : 'Add a pre-approval'}</h2><p>{initial ? 'Review this rule. Only active status can currently be changed.' : 'Set a clear window for a familiar visit to be pre-approved.'}</p></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog" data-testid="button-close-rule"><X size={15} /></button></div>
    <form onSubmit={submit}>
      <div className="modal-content"><div className="field-grid">
        <div className="field"><label htmlFor="rule-flat">Apartment / flat</label><input id="rule-flat" required disabled={!!initial} value={form.flatNumber} onChange={(event) => set('flatNumber', event.target.value)} placeholder="e.g. A-204" data-testid="input-rule-flat" /></div>
        <div className="field"><label htmlFor="rule-type">Visit type</label><select id="rule-type" disabled={!!initial} value={form.visitType} onChange={(event) => set('visitType', event.target.value as VisitType)} data-testid="select-rule-type"><option value="delivery">Delivery</option><option value="guest">Guest</option><option value="unknown">Unknown visitor</option></select></div>
        <div className="field full"><label htmlFor="rule-match">Name or provider match <span style={{ fontWeight: 400 }}>(optional)</span></label><input id="rule-match" disabled={!!initial} value={form.visitorMatch ?? ''} onChange={(event) => set('visitorMatch', event.target.value)} placeholder="For example, daily milk delivery" data-testid="input-rule-match" /></div>
        <div className="field full"><label htmlFor="rule-label">Schedule name</label><input id="rule-label" required disabled={!!initial} value={form.scheduleLabel} onChange={(event) => set('scheduleLabel', event.target.value)} placeholder="Weekday parcel window" data-testid="input-rule-label" /></div>
        <div className="field full"><label>Days of week</label><div className="days-picker">{weekdays.map((day) => <button type="button" disabled={!!initial} key={day} className={`day-button ${form.daysOfWeek.includes(day) ? 'selected' : ''}`} onClick={() => toggleDay(day)} aria-pressed={form.daysOfWeek.includes(day)} data-testid={`button-rule-day-${day.toLowerCase()}`}>{day}</button>)}</div></div>
        <div className="field"><label htmlFor="rule-start">From</label><input id="rule-start" type="time" required disabled={!!initial} value={form.startTime} onChange={(event) => set('startTime', event.target.value)} data-testid="input-rule-start" /></div>
        <div className="field"><label htmlFor="rule-end">Until</label><input id="rule-end" type="time" required disabled={!!initial} value={form.endTime} onChange={(event) => set('endTime', event.target.value)} data-testid="input-rule-end" /></div>
        <div className="field full"><div className="switch-row"><div className="switch-label"><strong>Rule is active</strong><span>Pre-approval is still subject to gate verification.</span></div><button type="button" className={`toggle ${form.active ? 'on' : ''}`} role="switch" aria-checked={form.active} onClick={() => set('active', !form.active)} data-testid="toggle-rule-active"><span /></button></div></div>
      </div>{error && <div className="alert-error" role="alert" data-testid="error-rule-form">{error}</div>}</div>
      <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={onClose} data-testid="button-cancel-rule">Cancel</button><button type="submit" className="btn btn-primary" disabled={pending} data-testid="button-save-rule">{initial ? <Check size={13} /> : <Plus size={13} />}{pending ? 'Saving…' : initial ? 'Save status' : 'Save pre-approval'}</button></div>
    </form>
  </section></div>;
}

function RulesPage() {
  const rules = useListRules({ query: { queryKey: getListRulesQueryKey() } });
  const create = useCreateRule();
  const update = useUpdateRule();
  const remove = useDeleteRule();
  const client = useQueryClient();
  const [modal, setModal] = useState<'create' | PreApprovalRule | null>(null);
  const [actionError, setActionError] = useState('');
  const invalidate = () => { void client.invalidateQueries({ queryKey: getListRulesQueryKey() }); void client.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); };
  const save = (data: PreApprovalRuleInput) => {
    setActionError('');
    if (modal && modal !== 'create') {
      update.mutate({ id: modal.id, data: { active: data.active } }, { onSuccess: () => { invalidate(); setModal(null); }, onError: (error) => setActionError(readableError(error)) });
      return;
    }
    create.mutate({ data }, { onSuccess: () => { invalidate(); setModal(null); }, onError: (error) => setActionError(readableError(error)) });
  };
  const toggle = (rule: PreApprovalRule) => { update.mutate({ id: rule.id, data: { active: !rule.active } }, { onSuccess: invalidate, onError: (error) => setActionError(readableError(error)) }); };
  const deleteRule = (rule: PreApprovalRule) => { if (window.confirm(`Remove the pre-approval for Flat ${rule.flatNumber} — ${rule.scheduleLabel}?`)) remove.mutate({ id: rule.id }, { onSuccess: invalidate, onError: (error) => setActionError(readableError(error)) }); };
  return <div className="page-wrap">
    <PageHeading eyebrow="Resident preferences" title="Pre-approvals" description="Manage familiar visit windows. A rule helps identify an arrival; the attendant still verifies who is at the gate." right={<button className="btn btn-primary" onClick={() => { setActionError(''); setModal('create'); }} data-testid="button-add-rule"><Plus size={14} /> Add pre-approval</button>} />
    {actionError && <div className="alert-error" role="alert" data-testid="error-rule-action">{actionError}</div>}
    {rules.isLoading ? <div className="rules-grid"><SkeletonBlock count={4} /></div> : rules.isError ? <QueryError onRetry={() => void rules.refetch()} /> : rules.data?.length ? <div className="rules-grid">{rules.data.map((rule) => <article className="panel rule-card" key={rule.id} data-testid={`card-rule-${rule.id}`}>
      <div className="rule-top"><span className="flat-tag">Flat {rule.flatNumber}</span><StatusPill status={rule.active ? 'active' : 'paused'} /></div>
      <h2 className="rule-title">{rule.scheduleLabel}</h2><p className="rule-desc">{titleCase(rule.visitType)}{rule.visitorMatch ? ` · ${rule.visitorMatch}` : ' · Any visitor match'}</p>
      <div className="schedule-strip" data-testid={`text-rule-schedule-${rule.id}`}><CalendarDays size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />{rule.daysOfWeek.join(' · ') || 'No days set'}<br /><Clock3 size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />{rule.startTime}–{rule.endTime}</div>
      <div className="rule-bottom"><button className="btn btn-secondary btn-small" disabled={update.isPending} onClick={() => { setActionError(''); setModal(rule); }} data-testid={`button-edit-rule-${rule.id}`}><Pencil size={12} /> Edit details</button><div className="rule-actions"><button className="btn btn-secondary btn-small" disabled={update.isPending} onClick={() => toggle(rule)} data-testid={`button-toggle-rule-${rule.id}`}>{rule.active ? 'Pause' : 'Activate'}</button><button className="btn btn-danger btn-small" disabled={remove.isPending} onClick={() => deleteRule(rule)} aria-label={`Delete ${rule.scheduleLabel}`} data-testid={`button-delete-rule-${rule.id}`}><Trash2 size={12} /></button></div></div>
    </article>)}</div> : <div className="panel empty-state" data-testid="empty-rules"><span className="empty-mark"><SlidersHorizontal size={18} /></span><strong>No pre-approvals yet</strong><p>Create a time window for familiar visits. The attendant will continue to verify each arrival.</p><button className="btn btn-primary" style={{ marginTop: 15 }} onClick={() => setModal('create')} data-testid="button-create-first-rule"><Plus size={13} /> Add first rule</button></div>}
    {modal && <RuleModal initial={modal === 'create' ? undefined : modal} onClose={() => setModal(null)} onSave={save} pending={create.isPending || update.isPending} />}
  </div>;
}

function LogPage() {
  const visits = useListVisits({ query: { queryKey: getListVisitsQueryKey(), refetchInterval: 5000 } });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const filtered = useMemo(() => (visits.data ?? []).filter((visit) => {
    const query = search.toLowerCase().trim();
    const matches = !query || [visit.visitorName, visit.flatNumber, visit.provider, visit.eventId, visit.decisionMessage ?? ''].some((value) => value.toLowerCase().includes(query));
    return matches && (status === 'all' || visit.status === status) && (type === 'all' || visit.visitType === type);
  }), [visits.data, search, status, type]);
  return <div className="page-wrap"><PageHeading eyebrow="Searchable visit record" title="Visitor log" description="A clear record of arrivals and resident decisions, searchable by visitor, flat, or provider." />
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Visit history</h2><p className="panel-subtitle" data-testid="text-log-result-count">{visits.isLoading ? 'Loading record…' : `${filtered.length} ${filtered.length === 1 ? 'visit' : 'visits'} shown`}</p></div><span className="section-kicker"><Filter size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />Filter record</span></div>
      <div style={{ padding: '14px 16px' }}><div className="filter-row"><div className="search-wrap"><Search size={15} /><input type="search" className="search-input" placeholder="Search name, flat, provider, event ID…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search visitor log" data-testid="input-log-search" /></div><select className="select-filter" aria-label="Filter by decision status" value={status} onChange={(event) => setStatus(event.target.value)} data-testid="select-log-status"><option value="all">All decisions</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="denied">Denied</option><option value="at_gate">At gate</option></select><select className="select-filter" aria-label="Filter by visit type" value={type} onChange={(event) => setType(event.target.value)} data-testid="select-log-type"><option value="all">All visit types</option><option value="delivery">Delivery</option><option value="guest">Guest</option><option value="unknown">Unknown</option></select><button className="btn btn-secondary btn-small" onClick={() => { setSearch(''); setStatus('all'); setType('all'); }} data-testid="button-clear-log-filters">Clear filters</button></div></div>
      {visits.isLoading ? <div style={{ padding: '10px 16px 20px' }}><SkeletonBlock /></div> : visits.isError ? <div style={{ padding: 16 }}><QueryError onRetry={() => void visits.refetch()} /></div> : filtered.length ? <div className="table-wrap"><table className="data-table" data-testid="table-visits"><thead><tr><th>Visitor</th><th>Apartment</th><th>Visit type</th><th>Arrival</th><th>Decision</th><th>Source / event</th></tr></thead><tbody>{filtered.map((visit) => <tr key={visit.id} data-testid={`row-log-visit-${visit.id}`}><td className="table-primary">{visit.visitorName}<span className="table-secondary">{visit.provider || 'Independent visitor'}</span></td><td>{visit.flatNumber}</td><td>{titleCase(visit.visitType)}</td><td>{dateLabel(visit.receivedAt)}<span className="table-secondary">{timeLabel(visit.receivedAt)}</span></td><td><StatusPill status={visit.status} />{visit.decidedAt && <span className="table-secondary">Decided {timeLabel(visit.decidedAt)}</span>}</td><td>{visit.source || '—'}<span className="table-secondary mono">{visit.eventId || '—'}</span></td></tr>)}</tbody></table></div> : <div className="empty-state" data-testid="empty-log"><span className="empty-mark"><Search size={18} /></span><strong>{visits.data?.length ? 'No matching visits' : 'No visits in the record'}</strong><p>{visits.data?.length ? 'Try a different name, flat, provider, or filter.' : 'Recorded arrivals will be available here to search.'}</p></div>}
    </section>
  </div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><AppShell><Switch>
    <Route path="/" component={HomePage} />
    <Route path="/guard" component={GuardPage} />
    <Route path="/resident" component={ResidentPage} />
    <Route path="/rules" component={RulesPage} />
    <Route path="/log" component={LogPage} />
    <Route component={NotFound} />
  </Switch></AppShell></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
