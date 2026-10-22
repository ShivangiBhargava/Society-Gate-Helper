import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CheckCheck, Clock3, DoorOpen, ShieldCheck } from 'lucide-react';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;

function SceneStage({ children, paper = false }: { children: ReactNode; paper?: boolean }) {
  return (
    <motion.section
      className={`film-stage ${paper ? 'paper' : ''}`}
      initial={{ opacity: 0, scale: 1.018 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.035 }}
      transition={{ duration: 0.42, ease: EASE }}
    >
      {children}
      <div className="film-grain" />
    </motion.section>
  );
}

function DoorMark({ large = false }: { large?: boolean }) {
  return (
    <div className="door-mark" style={large ? { width: '10vmin', height: '10vmin', borderRadius: '1.1vmin' } : undefined}>
      <DoorOpen size={large ? '5vmin' : '2.2vmin'} strokeWidth={1.15} />
    </div>
  );
}

function BrowserShell({ children }: { children: ReactNode }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <i className="browser-dot" /><i className="browser-dot" /><i className="browser-dot" />
        <div className="browser-address">society-gate.local / operations</div>
      </div>
      {children}
    </div>
  );
}

function SideNav() {
  return (
    <aside className="ui-side">
      <div className="ui-brand"><span className="ui-mark" /> Society Gate</div>
      <div className="ui-nav active">Overview</div>
      <div className="ui-nav">Guard desk</div>
      <div className="ui-nav">Resident approvals</div>
      <div className="ui-nav">Pre-approvals</div>
      <div className="ui-nav">Visitor record</div>
    </aside>
  );
}

export function SceneOverview() {
  const [ready, setReady] = useState(false);
  useSceneTimer([
    { time: 1150, callback: () => setReady(true) },
  ]);

  return (
    <SceneStage>
      <div style={{ position: 'absolute', inset: '7% 6% 6%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1vmin' }}>
          <DoorMark />
          <div>
            <div className="film-kicker">Society Gate · visitor desk</div>
            <h1 className="film-headline" style={{ marginTop: '.8vmin' }}>EVERY ARRIVAL.</h1>
          </div>
        </div>
        <motion.p
          className="film-copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .22, duration: .55, ease: EASE }}
          style={{ position: 'absolute', top: '11.8%', left: '5.7%', fontSize: '1.5vmin' }}
        >
          One desk for arrivals, decisions, and resident pre-approvals.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 28, scale: .985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: .32, duration: .8, ease: EASE }}
          style={{ position: 'absolute', left: 0, right: 0, top: '20%', height: '72%' }}
        >
          <BrowserShell>
            <div className="ui-grid" style={{ height: '53vmin' }}>
              <SideNav />
              <main className="ui-main">
                <div className="ui-top"><span>Gate operations　›　<strong>Society overview</strong></span><span>● Desk connected　 <b>SG</b></span></div>
                <div className="ui-heading">Hello, team.</div>
                <p className="ui-sub">A clear view of every arrival, decision, and resident pre-approval at the gate.</p>
                <div className="metrics">
                  {[
                    ['Visits today', '18', 'All arrivals recorded'],
                    ['Awaiting decision', ready ? '2' : '0', 'Needs resident response'],
                    ['Approved today', '11', 'Resident confirmed'],
                    ['Denied today', '1', 'Held at the entrance'],
                    ['Active rules', '4', 'Resident pre-approvals'],
                  ].map(([label, value, foot], i) => (
                    <motion.div className="metric" key={label} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .58 + i * .09, duration: .45, ease: EASE }}>
                      <div className="metric-label">{label}</div><div className="metric-val">{value}</div><div className="metric-foot">{foot}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="overview-panels">
                  <section className="ui-panel">
                    <div className="ui-panel-head"><span>Signed doorbell simulator</span><span className="ui-kicker">HMAC demo</span></div>
                    <div className="sim-fields">
                      <label className="sim-field">Apartment / flat<span className="sim-input">B-704</span></label>
                      <label className="sim-field">Visitor name<span className="sim-input">{ready ? 'Neha Iyer' : 'Name at the entrance'}</span></label>
                      <label className="sim-field">Visit type<span className="sim-input">Guest</span></label>
                      <label className="sim-field">Company / provider<span className="sim-input">Mehta family</span></label>
                      <span className="film-caption" style={{ gridColumn: '1 / -1', fontSize: '.68vmin' }}>Test event only · no physical gate control</span>
                    </div>
                  </section>
                  <section className="ui-panel">
                    <div className="ui-panel-head"><span>Latest arrivals</span><span className="ui-kicker">Live queue</span></div>
                    <div className="recent-row"><b>Ravi Kumar</b><span>Flat 402</span><span className="tiny-status">Pending</span></div>
                    <div className="recent-row"><b>Amazon delivery</b><span>Flat 1203</span><span className="pill success" style={{ padding: '.3vmin .5vmin', fontSize: '.58vmin' }}>Approved</span></div>
                    <div className="recent-row"><b>Aarav Mehta</b><span>Flat 605</span><span className="pill teal" style={{ padding: '.3vmin .5vmin', fontSize: '.58vmin' }}>At gate</span></div>
                  </section>
                </div>
              </main>
            </div>
          </BrowserShell>
        </motion.div>
        <motion.div
          className="scene-tag"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, duration: .5, ease: EASE }}
        >
          A signed test event <span style={{ color: '#dda74f' }}>↗</span>
        </motion.div>
      </div>
    </SceneStage>
  );
}

export function SceneSimulator() {
  const [signed, setSigned] = useState(false);
  const [routed, setRouted] = useState(false);
  useSceneTimer([
    { time: 2100, callback: () => setSigned(true) },
    { time: 4250, callback: () => setRouted(true) },
  ]);

  return (
    <SceneStage>
      <div style={{ position: 'absolute', inset: '7% 6%' }}>
        <div className="film-kicker">Society operations / signed event simulator</div>
        <motion.div style={{ display: 'flex', gap: '1.15vmin', marginTop: '1.2vmin' }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, ease: EASE }}>
          {['SIGNED.', 'RECORDED.', 'ROUTED.'].map((word, i) => <motion.h1 key={word} className="film-headline" style={{ fontSize: '4.65vmin', color: i === 1 ? '#e2bd76' : undefined }} initial={{ opacity: 0, scale: 1.4, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .12 + i * .18, duration: .52, ease: EASE }}>{word}</motion.h1>)}
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: '2.2vmin', position: 'absolute', top: '25%', left: '2%', right: '2%', bottom: '3%' }}>
          <motion.div className="browser" initial={{ x: -35, opacity: 0, rotateY: -4 }} animate={{ x: 0, opacity: 1, rotateY: 0 }} transition={{ delay: .22, duration: .7, ease: EASE }} style={{ transformOrigin: 'center left' }}>
            <div className="browser-bar"><i className="browser-dot" /><i className="browser-dot" /><i className="browser-dot" /><div className="browser-address">/demo/simulate</div></div>
            <div style={{ padding: '2vmin 2.5vmin 1.8vmin', background: '#f8f7f2', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong style={{ color: '#304452', fontSize: '1.45vmin' }}>Signed doorbell simulator</strong><span className="ui-kicker">HMAC DEMO</span></div>
              <p style={{ color: '#7a8589', fontSize: '1.08vmin', margin: '.55vmin 0 1.4vmin' }}>Send a signed Ring-style event through the live gate flow.</p>
              <div className="sim-fields" style={{ padding: 0, gap: '1vmin' }}>
                {[
                  ['Apartment / flat', 'B-704'],
                  ['Visitor name', 'Neha Iyer'],
                  ['Visit type', 'Guest'],
                  ['Company / provider', 'Mehta family'],
                ].map(([label, value], i) => (
                  <motion.label className="sim-field" key={label} style={{ fontSize: '.95vmin', gap: '.38vmin' }} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .42 + i * .15, duration: .35, ease: EASE }}>
                    {label}<span className="sim-input" style={{ fontSize: '1.1vmin', padding: '.8vmin 1vmin' }}>{value}<span style={{ color: '#d8a34d' }}>{i === 1 ? '▏' : ''}</span></span>
                  </motion.label>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.3vmin' }}>
                <span className="film-caption" style={{ fontSize: '.78vmin', maxWidth: '25vmin' }}>This does not open or control a physical gate.</span>
                <motion.div className="mini-button" style={{ fontSize: '.92vmin', padding: '.7vmin 1.15vmin' }} animate={signed ? { scale: [1, .96, 1] } : { scale: 1 }} transition={{ duration: .3 }}>↗　Send a test arrival</motion.div>
              </div>
            </div>
          </motion.div>
          <div style={{ position: 'relative', padding: '1.3vmin 0' }}>
            <div className="film-kicker" style={{ color: '#aab4b6' }}>Signed event payload</div>
            <motion.div style={{ height: '1px', background: '#dda74f', transformOrigin: 'left', margin: '1vmin 0 1.4vmin' }} initial={{ scaleX: 0 }} animate={{ scaleX: signed ? 1 : .55 }} transition={{ duration: .8, ease: EASE }} />
            <AnimatePresence mode="sync">
              {signed && (
                <motion.div key="packet" initial={{ opacity: 0, scale: .88, rotateY: -12, x: 24 }} animate={{ opacity: 1, scale: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, scale: .94 }} transition={{ duration: .65, ease: EASE }} style={{ padding: '1.7vmin', border: '1px solid rgba(221,167,79,.47)', background: 'rgba(221,167,79,.075)', borderRadius: '.55vmin' }}>
                  <div className="pill success"><Check size="1vmin" /> EVENT VERIFIED</div>
                  <div className="mono" style={{ color: '#d8dcd7', fontSize: '1.1vmin', lineHeight: 2.1, marginTop: '1.1vmin' }}>
                    <div><span style={{ color: '#8c999d' }}>signature</span>　sha256 · valid</div>
                    <div><span style={{ color: '#8c999d' }}>eventId</span>　sg-demo-0482</div>
                    <div><span style={{ color: '#8c999d' }}>source</span>　Ring simulator</div>
                    <div><span style={{ color: '#8c999d' }}>visit</span>　Neha Iyer / B-704</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: routed ? 1 : 0, y: routed ? 0 : 20 }}
              transition={{ duration: .55, ease: EASE }}
              style={{ marginTop: '1.3vmin', padding: '1.2vmin 1.4vmin', borderLeft: '.35vmin solid #dda74f', background: 'rgba(255,255,255,.065)' }}
            >
              <div className="film-kicker" style={{ color: '#d6b775' }}>Next</div>
              <strong style={{ display: 'block', marginTop: '.45vmin', fontSize: '1.45vmin', color: '#f2efe6' }}>Resident decision queue</strong>
              <span style={{ display: 'block', color: '#aeb8b7', fontSize: '1vmin', marginTop: '.4vmin' }}>Valid signature. Visit sent for a decision.</span>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .35, duration: .7 }} className="accent-line" style={{ position: 'absolute', bottom: '1%', left: 0, width: '100%' }} />
      </div>
    </SceneStage>
  );
}

export function SceneResident() {
  const [approved, setApproved] = useState(false);
  const [warning, setWarning] = useState(false);
  useSceneTimer([
    { time: 1550, callback: () => setApproved(true) },
    { time: 3850, callback: () => setWarning(true) },
  ]);

  return (
    <SceneStage>
      <div style={{ position: 'absolute', inset: '8% 7%' }}>
        <div className="film-kicker">Resident response desk</div>
        <motion.h1 className="film-headline" style={{ marginTop: '1.1vmin', fontSize: '5vmin' }} initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55, ease: EASE }}>A HUMAN MAKES THE CALL.</motion.h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr .55fr', gap: '4.5vmin', alignItems: 'center', position: 'absolute', top: '28%', left: '4%', right: '2%' }}>
          <motion.div className="browser" initial={{ y: 28, opacity: 0, scale: .97 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: .18, duration: .7, ease: EASE }}>
            <div className="browser-bar"><i className="browser-dot" /><i className="browser-dot" /><i className="browser-dot" /><div className="browser-address">Resident approvals / waiting</div></div>
            <div style={{ padding: '2.2vmin 2.5vmin', background: '#fffefa' }}>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                <div><div className="film-caption" style={{ fontSize: '.85vmin' }}>VISITOR AT THE ENTRANCE</div><h2 style={{ font: '600 2.6vmin/.96 var(--font-display)', letterSpacing: '-.05em', color: '#2b3d4a', margin: '.75vmin 0 .55vmin' }}>Neha Iyer</h2><div style={{ color: '#7b8587', fontSize: '1.05vmin' }}>Flat B-704　·　Guest　·　Mehta family</div></div>
                <div className={`pill ${approved ? 'success' : ''}`}>{approved ? 'Approved' : 'Pending'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8vmin', marginTop: '1.8vmin', paddingTop: '1.25vmin', borderTop: '1px solid #e8e6df' }}>
                <span style={{ width: '1.35vmin', height: '1.35vmin', border: '1px solid #bdc3c0', borderRadius: '50%' }} />
                <span style={{ color: '#778386', fontSize: '1vmin' }}>{approved ? 'Resident decision recorded' : 'Waiting for a resident decision'}</span>
              </div>
              <div style={{ display: 'flex', gap: '.65vmin', marginTop: '1.35vmin' }}>
                <div className={`mini-button ${approved ? '' : 'btn-approve'}`} style={{ background: approved ? '#e6efe9' : '#e8eee9', color: '#4d7964', border: '1px solid #d3e1d7', padding: '.7vmin 1.15vmin' }}>{approved ? <Check size="1vmin" /> : null} Approve</div>
                <div className="mini-button" style={{ background: '#fffefa', color: '#a25b4c', border: '1px solid #ead9d4', padding: '.7vmin 1.15vmin' }}>Deny</div>
              </div>
            </div>
          </motion.div>
          <div style={{ position: 'relative', minHeight: '23vmin', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.div style={{ position: 'absolute', left: '1.4vmin', top: '1vmin', bottom: '1vmin', width: '1px', background: 'rgba(221,167,79,.6)', transformOrigin: 'top' }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: .65, duration: .8, ease: EASE }} />
            <div style={{ paddingLeft: '3.1vmin' }}>
              <div className="film-kicker">Separate next step</div>
              <h2 style={{ color: '#f4f0e6', font: '600 2.2vmin/1.05 var(--font-display)', margin: '1vmin 0 .65vmin' }}>Gate attendant</h2>
              <p className="film-copy" style={{ fontSize: '1.25vmin' }}>Verify the visitor at the entrance.</p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: warning ? 1 : 0, y: warning ? 0 : 12 }} transition={{ duration: .45, ease: EASE }} style={{ marginTop: '2.2vmin', paddingTop: '1.2vmin', borderTop: '1px solid rgba(255,255,255,.2)', color: '#d8c38f', font: '500 1.25vmin/1.35 var(--font-body)' }}>
                Approval records a decision.<br />It does not unlock the gate.
              </motion.div>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: .45, duration: .65, ease: EASE }}
          className="accent-line"
          style={{ position: 'absolute', bottom: '3%', width: '100%' }}
        />
        <div className="scene-tag">resident confirmed　/　attendant verification remains</div>
      </div>
    </SceneStage>
  );
}

export function SceneGateDesk() {
  const [atGate, setAtGate] = useState(false);
  const [matched, setMatched] = useState(false);
  const [note, setNote] = useState(false);
  useSceneTimer([
    { time: 1650, callback: () => setAtGate(true) },
    { time: 3750, callback: () => setMatched(true) },
    { time: 5350, callback: () => setNote(true) },
  ]);

  return (
    <SceneStage>
      <div style={{ position: 'absolute', inset: '8% 6%' }}>
        <div className="film-kicker">Attendant view　/　resident preferences</div>
        <h1 className="film-headline" style={{ marginTop: '1vmin', fontSize: '4.6vmin' }}>THE GATE DESK STAYS IN THE LOOP.</h1>
        <div style={{ position: 'absolute', top: '27%', left: 0, right: 0, bottom: '5%', display: 'grid', gridTemplateColumns: '1.1fr .8fr', gap: '2vmin' }}>
          <motion.div className="browser" initial={{ opacity: 0, x: -30, rotateY: 4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} transition={{ duration: .65, ease: EASE }}>
            <div className="browser-bar"><i className="browser-dot" /><i className="browser-dot" /><i className="browser-dot" /><div className="browser-address">/guard · live visit queue</div></div>
            <div style={{ background: '#f7f6f1', height: '100%', padding: '1.7vmin' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div className="film-caption">ATTENDANT ACTIONS</div><h2 style={{ margin: '.55vmin 0 0', color: '#2e414e', font: '600 1.8vmin var(--font-display)' }}>At the desk <span className="pill" style={{ fontSize: '.7vmin', padding: '.3vmin .55vmin' }}>{atGate ? '0 waiting' : '1 waiting'}</span></h2></div><ShieldCheck size="2.4vmin" color="#668778" /></div>
              <div style={{ marginTop: '1.6vmin', padding: '1.5vmin', background: '#fffefa', border: '1px solid #e3e1d9', borderRadius: '.5vmin' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#304451', fontSize: '1.35vmin' }}>Neha Iyer</strong><span className="pill success" style={{ fontSize: '.7vmin', padding: '.35vmin .6vmin' }}>Approved</span></div>
                <div style={{ color: '#778387', marginTop: '.45vmin', fontSize: '.92vmin' }}>Flat B-704　·　Guest　·　Mehta family</div>
                <div className="soft-rule" style={{ margin: '1.15vmin 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#778387', fontSize: '.82vmin' }}><span>Arrived 10:42 AM</span><span className="mono">sg-demo-0482</span></div>
                <motion.div className="mini-button" style={{ marginTop: '1.1vmin', display: 'inline-flex', background: atGate ? '#e4eeef' : '#fff', border: '1px solid #d9dedb', color: '#486d70', padding: '.6vmin .95vmin', fontSize: '.78vmin' }} animate={{ scale: atGate ? [1, 1.025, 1] : 1 }} transition={{ duration: .4 }}>
                  <DoorOpen size="1vmin" />　{atGate ? 'At gate · verify visitor' : 'Mark at gate'}
                </motion.div>
              </div>
              <div style={{ marginTop: '1.1vmin', display: 'flex', gap: '.55vmin', alignItems: 'center', color: '#71827b', fontSize: '.8vmin' }}>
                <CheckCheck size="1vmin" /> {atGate ? 'Resident confirmed · attendant to verify.' : 'Follow the resident’s recorded decision.'}
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: .92, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .45, duration: .65, ease: EASE }} style={{ padding: '1.6vmin 1.2vmin', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.div
              style={{ position: 'absolute', width: '23vmin', height: '23vmin', border: '1px solid rgba(221,167,79,.48)', borderRadius: '50%', right: '2%', top: '5%', display: 'grid', placeItems: 'center' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
            >
              <span style={{ position: 'absolute', top: '-.6vmin', left: '50%', width: '1.1vmin', height: '1.1vmin', borderRadius: '50%', background: '#dda74f' }} />
              <Clock3 size="4vmin" color="#d5bd88" strokeWidth={1} />
            </motion.div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="film-kicker">Familiar visit window</div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: matched ? 1 : 0, y: matched ? 0 : 20 }} transition={{ duration: .55, ease: EASE }} style={{ marginTop: '1.1vmin', padding: '1.6vmin', border: '1px solid rgba(221,167,79,.44)', borderRadius: '.55vmin', background: 'rgba(24,45,62,.86)' }}>
                <span className="pill success"><Check size="1vmin" /> Rule match</span>
                <h2 style={{ color: '#f2efe6', font: '600 1.75vmin/1.15 var(--font-display)', margin: '1vmin 0 .5vmin' }}>Amazon deliveries</h2>
                <div className="film-copy" style={{ fontSize: '1vmin' }}>Flat 1203　·　Delivery　·　Any time</div>
                <div className="soft-rule" style={{ background: 'rgba(255,255,255,.16)', margin: '1.1vmin 0' }} />
                <div style={{ color: '#d5bd88', fontSize: '.92vmin' }}>Approved by pre-approval rule</div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: note ? 1 : 0 }} transition={{ duration: .5 }} style={{ position: 'absolute', bottom: '1%', left: '3%', right: '2%', color: '#aeb8b7', fontSize: '.85vmin', lineHeight: 1.4 }}>
              A rule can recognize a familiar visit. The attendant still verifies who arrived.
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SceneStage>
  );
}

export function SceneRecord() {
  const [focused, setFocused] = useState(false);
  const [finalLine, setFinalLine] = useState(false);
  useSceneTimer([
    { time: 2150, callback: () => setFocused(true) },
    { time: 4650, callback: () => setFinalLine(true) },
  ]);
  const rows = [
    ['Neha Iyer', 'B-704', 'Guest', 'Mehta family', 'Approved', '10:42'],
    ['Amazon delivery', '1203', 'Delivery', 'Amazon', 'Approved', '10:31'],
    ['Aarav Mehta', '605', 'Guest', 'Guest', 'At gate', '10:20'],
    ['Ravi Kumar', '402', 'Delivery', 'Zomato', 'Pending', '10:12'],
  ];

  return (
    <SceneStage paper>
      <div className="timeline-grid" style={{ position: 'absolute', inset: 0, opacity: .42 }} />
      <div style={{ position: 'absolute', inset: '7% 6%' }}>
        <div className="film-kicker" style={{ color: '#8c794f' }}>History / searchable visitor record</div>
        <h1 className="film-headline dark" style={{ marginTop: '1vmin', fontSize: '4.7vmin' }}>EVERY DECISION, IN THE RECORD.</h1>
        <motion.div className="browser" initial={{ opacity: 0, y: 25, rotateX: 3 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: .16, duration: .7, ease: EASE }} style={{ position: 'absolute', left: '2%', right: '2%', top: '26%', height: '54vmin', background: '#f8f7f2' }}>
          <div className="browser-bar"><i className="browser-dot" /><i className="browser-dot" /><i className="browser-dot" /><div className="browser-address">/visitor-record · filterable history</div></div>
          <div style={{ padding: '1.5vmin 1.8vmin' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ color: '#334651', font: '600 1.75vmin var(--font-display)' }}>Visitor record</div><div style={{ color: '#7c8788', fontSize: '.88vmin', marginTop: '.35vmin' }}>Every arrival stays visible after a decision.</div></div>
              <div style={{ display: 'flex', gap: '.5vmin' }}><span className="sim-input" style={{ minWidth: '21vmin', fontSize: '.82vmin' }}>Search name, flat, or event ID</span><span className="sim-input" style={{ fontSize: '.82vmin' }}>All statuses　⌄</span><span className="sim-input" style={{ fontSize: '.82vmin' }}>All visit types　⌄</span></div>
            </div>
            <div style={{ marginTop: '1.25vmin', overflow: 'hidden', borderRadius: '.35vmin', border: '1px solid #e2e0d9' }}>
              <div className="record-row record-header"><span>Visitor</span><span>Flat</span><span>Type</span><span>Provider</span><span>Status</span><span>Arrived</span></div>
              {rows.map((row, i) => (
                <motion.div
                  className="record-row"
                  key={row[0]}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: focused && i > 0 ? .28 : 1, x: 0, scale: focused && i === 0 ? 1.012 : 1 }}
                  transition={{ delay: .28 + i * .11, duration: .4, ease: EASE }}
                  style={{ background: focused && i === 0 ? '#fffaf0' : undefined, transformOrigin: 'left center' }}
                >
                  <strong>{row[0]}</strong><span className="mono">{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><span className={`pill ${i === 2 ? 'teal' : i === 3 ? '' : 'success'}`} style={{ fontSize: '.65vmin', padding: '.33vmin .48vmin' }}>{row[4]}</span><span className="mono">{row[5]}</span>
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {focused && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} transition={{ duration: .5, ease: EASE }} style={{ marginTop: '1vmin', display: 'grid', gridTemplateColumns: '1.2fr .7fr 1fr', gap: '1vmin', alignItems: 'center', padding: '.9vmin 1vmin', background: '#edece5', borderRadius: '.35vmin', color: '#63716f', font: '400 .82vmin var(--font-mono)' }}>
                <span>eventId　sg-demo-0482</span><span>source　Ring simulator</span><span style={{ color: '#4c8067' }}>Decision recorded · resident approval</span>
              </motion.div>}
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: finalLine ? 1 : 0, y: finalLine ? 0 : 14 }} transition={{ duration: .45, ease: EASE }} style={{ position: 'absolute', bottom: '2%', left: '3%', color: '#506273', font: '500 1.55vmin var(--font-display)' }}>
          Clear history. <span style={{ color: '#9a773f' }}>Human decisions.</span>
        </motion.div>
        <motion.div className="accent-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .55, duration: .7 }} style={{ position: 'absolute', bottom: 0, right: 0, width: '27%', background: 'linear-gradient(90deg,#dda74f,#bd9147)' }} />
      </div>
    </SceneStage>
  );
}

export function SceneFinale() {
  const [logo, setLogo] = useState(false);
  const [open, setOpen] = useState(false);
  useSceneTimer([
    { time: 880, callback: () => setLogo(true) },
    { time: 4100, callback: () => setOpen(true) },
  ]);

  return (
    <SceneStage paper>
      <div style={{ position: 'absolute', inset: '8% 8%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div style={{ position: 'absolute', top: '10%', left: '13%', width: '74%', height: '1px', background: '#d6c7a9', transformOrigin: 'center' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .6, ease: EASE }} />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '1.2vmin', alignItems: 'center', marginBottom: '2.2vmin' }}>
          {['RECORD FIRST.', 'DECIDE CLEARLY.', 'VERIFY AT THE GATE.'].map((line, i) => (
            <motion.span key={line} style={{ color: i === 2 ? '#9d7739' : '#314553', font: '600 1.4vmin var(--font-display)', letterSpacing: '-.035em' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + i * .14, duration: .4, ease: EASE }}>{line}</motion.span>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15, scale: .94 }}
          animate={{ opacity: logo ? 1 : 0, y: logo ? 0 : 15, scale: logo ? 1 : .94 }}
          transition={{ duration: .55, ease: EASE }}
          style={{ display: 'flex', alignItems: 'center', gap: '1.4vmin' }}
        >
          <div className="door-mark" style={{ width: '5.5vmin', height: '5.5vmin', color: '#9d7739', borderColor: '#b89960' }}><DoorOpen size="2.8vmin" strokeWidth={1.15} /></div>
          <div style={{ color: '#283b4a', font: '600 4.6vmin/.9 var(--font-display)', letterSpacing: '-.075em' }}>SOCIETY GATE</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: logo ? 1 : 0, y: logo ? 0 : 10 }} transition={{ delay: .14, duration: .5, ease: EASE }} style={{ color: '#586c75', font: '500 1.8vmin var(--font-display)', marginTop: '1.6vmin' }}>
          Every arrival has a clear next step.
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: logo ? 1 : 0 }} transition={{ delay: .3, duration: .5 }} style={{ color: '#8e938e', font: '400 .92vmin var(--font-mono)', marginTop: '1.2vmin', letterSpacing: '.04em' }}>
          SIMULATION DEMO　·　NO PHYSICAL GATE CONTROL
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: logo ? 1 : 0 }} transition={{ delay: .2, duration: .65, ease: EASE }} className="accent-line" style={{ width: '38%', marginTop: '2.2vmin', background: 'linear-gradient(90deg,transparent,#d5ad67,transparent)' }} />
        <motion.div
          initial={{ scale: .35, opacity: 0 }}
          animate={open ? { scale: 38, opacity: [1, 1, 0] } : { scale: .35, opacity: 0 }}
          transition={{ duration: .98, ease: EASE }}
          style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-2.75vmin', marginTop: '-2.75vmin', width: '5.5vmin', height: '5.5vmin', border: '1px solid #20364a', borderRadius: '.55vmin', pointerEvents: 'none' }}
        />
      </div>
    </SceneStage>
  );
}

export const FILM_SCENES = [SceneOverview, SceneSimulator, SceneResident, SceneGateDesk, SceneRecord, SceneFinale];
