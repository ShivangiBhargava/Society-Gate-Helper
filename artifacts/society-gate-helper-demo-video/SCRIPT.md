# Society Gate Helper — a working demo

## Director's treatment

- **Promise:** Every visitor is recorded, routed to a clear decision, and kept visible to the people at the entrance.
- **Identity:** Society Gate's familiar deep navy and warm amber, with pale concrete UI surfaces and restrained teal for system confirmations. Space Grotesk display, DM Sans interface, DM Mono for event data.
- **Hero:** The operating interface itself, treated as a kinetic instrument rather than a static screenshot.
- **Motion:** Camera punches from dashboard to simulator; a signed-event trace travels into the queue; interface panels split and recompose to connect residents, guards, and the visit record.
- **Arc:** Start with a live overview, accelerate through a simulated arrival, pause on the human decision, then widen to show the guard and pre-approval flows before resolving on the audit record.
- **Payoff:** The operational UI folds into a compact, warm end lockup; the opening door-mark becomes the aperture for the loop.
- **Format:** 16:9 landscape.
- **Audience / takeaway:** Society residents and gate attendants; this is a demo of signed simulation, resident decisions, attendant verification, pre-approvals, and durable visitor history—not physical gate control.

## Audio spec

- Runtime: 48 s (SCENE_DURATIONS total).
- Music: warm modern electronic instrumental, 112 BPM, tactile muted percussion, rounded bass pulse, airy marimba/synth plucks; assured and human, steadily building without urgency. No vocals. The existing 48-second instrumental has measured rhythmic accents at 8.55 s, 17.10 s, 25.70 s, 34.25 s, and 42.85 s; the scene cuts stay on the nearest accents. Music generation callback was blocked because paid-mode confirmation is unavailable in this run, so the existing locally synthesized bed is retained.
- Voiceover (requested): one warm, assured female narrator; conversational pace, lightly intimate, no salesy emphasis. Shot 01 at 0.45 s: “At the gate, every arrival starts with a clear record.” Shot 02 at 9.25 s: “A signed test event is recorded, then routed to the right decision queue.” Shot 03 at 17.55 s: “The resident makes the call. Approval records a decision; it never opens the gate.” Shot 04 at 26.00 s: “The attendant verifies who’s at the entrance. Familiar visits can match a schedule.” Shot 05 at 34.65 s: “Every arrival and decision stays in a searchable visitor record.” Shot 06 at 43.00 s: “Society Gate. Record first. Decide clearly. Verify at the gate.”
- SFX: none requested.
- Voice playback: timed browser speech synthesis requests an English voice whose name identifies it as female; it is paused, cancelled on scene changes, and silenced by the audio mute control. TTS generation callback was blocked because paid-mode confirmation is unavailable in this run. The Chromium verification environment exposed no speech voices, so this fallback does not produce audible narration there and is not embedded in the music file/export; a generated female VO still requires the callback to run in paid mode.
- Playback file: `public/audio/bg_music.mp3` (instrumental); female narration is timed in `src/components/video/FemaleNarration.tsx`.

## Timeline

| Shot | Time | Focus | Main action | Handoff |
|---|---:|---|---|---|
| 01 | 0.00–8.55 | Society overview | Door-mark opens; five live metrics and arrival list build out | Crop through simulator card |
| 02 | 8.55–17.10 | Signed doorbell simulator | Visitor form types in, event packet signs, a route line enters the visit queue | Amber event trace becomes a decision divider |
| 03 | 17.10–25.70 | Resident approval | Waiting visitor card resolves with a human approval; gate remains a separate step | Approved status pill enlarges into guard-desk marker |
| 04 | 25.70–34.25 | Attendant + pre-approval | Guard marks arrival at gate; separate rule-match vignette recognizes an Amazon delivery | Rule clock arcs into record timeline |
| 05 | 34.25–42.85 | Visitor record | Filters narrow; event IDs and decisions stack into an auditable timeline | Timeline rule straightens into end-card baseline |
| 06 | 42.85–48.00 | Resolution | UI panels contract into door mark and takeaway; last mark opens into shot 01 | Door-shaped iris loops to opening |

## Shot-by-shot script

### Shot 01 / 0.00–8.55 / 8.55 s — “A CLEAR VIEW OF EVERY ARRIVAL”

**Purpose:** Establish that Society Gate is a real operations interface with a live queue, not a vague access-control promise.

**Exact content and holds:** At 0.00 s, small wordmark “SOCIETY GATE / VISITOR DESK”; 0.35 s, large “EVERY ARRIVAL.”; 0.82 s, “One desk for arrivals, decisions, and resident pre-approvals.” At 1.10 s, interface labels: “Society operations”, “Hello, team.”, “Visits today”, “Awaiting decision”, “Approved today”, “Denied today”, “Active rules”, “Latest arrivals”, “Ravi Kumar”, “Amazon delivery”, “Aarav Mehta”. Keep legible UI until 7.25 s; from 7.25–8.55 s the camera pushes toward the simulator card while the phrase “A signed test event.” appears and travels with the card.

**Composition:** Navy full-bleed field. Door-mark at centre grows to 20vmin and opens into a 16:9 dashboard window occupying 82% width and 77% height, slightly right of centre; title remains upper-left in the frame margin. Interface itself uses pale cool-gray panels, amber accents, thin dividers, tiny but readable data text. Background stays calm and largely untextured.

**Artistic idea:** Five metric tiles begin as five amber/nacre slivers that click into a single dashboard; their rounded edges echo a row of doors.

**Timed choreography:** 0.00–0.30 s mark opens with a stiff scale snap; 0.35–0.80 s “EVERY ARRIVAL.” stamps in over a one-beat amber rule. 0.80–1.60 s dashboard surface unfolds from that rule. 1.60–2.30 s metric values count/settle; 2.30–3.20 s latest arrival rows stage in one by one; 3.20–4.20 s status colors pulse once, never flash. 4.20–7.15 s readable wide hold with subtle 1.03 camera push. 7.15–8.55 s crop and perspective lean toward the simulator area; its amber border expands past frame with the first beat of shot 02 already visible.

**Transition contract:** The amber edge of the simulator card is the same visible edge in shot 02. The push, card-surface split, and 10-degree perspective shift overlap; do not fade to an empty field.

**Assets and technique:** Hand-built CSS/SVG interface artwork based on the supplied Society Gate product UI; no external image required. Use clipped panel reveals, transform/opacity, and precise value counters.

**Sound intent:** Instrumental bed with requested female narration beginning at 0.45 s; cut at 8.55 s on the nearest measured accent.

### Shot 02 / 8.55–17.10 / 8.55 s — “SIGNED. RECORDED. ROUTED.”

**Purpose:** Demonstrate that the simulator sends a signed test arrival through the same decision queue while remaining clearly a demo—not real Ring hardware.

**Exact content and holds:** At 8.55 s oversized “SIGNED.”; 8.93 s “RECORDED.”; 9.31 s “ROUTED.”, each briefly owning the central area. From 9.80 s, a simulator panel shows “Signed doorbell simulator”, “Send a signed Ring-style event through the live gate flow.”, “Apartment / flat”, “Visitor name”, “Visit type”, “Company / provider”; values type in as “B-704”, “Neha Iyer”, “Guest”, “Mehta family”. Button artwork reads “Send a test arrival”. A note reads “This does not open or control a physical gate.” At 13.55 s, a packet panel reads “EVENT VERIFIED”, “HMAC · valid”, “eventId · sg-demo-0482”, “source · Ring simulator”. At 14.90 s, destination says “Resident decision queue” and “Valid signature. Visit sent to the resident for a decision.”

**Composition:** Interface macro is angled, occupying 65% of the frame at left; right side holds a dark packet trace with pale mono lettering. The actual form values remain crisp against pale panel. Small disclaimer is readable inside the panel.

**Artistic idea:** A typed field's amber caret becomes a signed checksum line; the line folds into an event packet, then threads into a queue rail.

**Timed choreography:** 0.00–0.80 s typography punches in with three short shifts; the simulator panel lands from the outgoing card edge. 0.80–1.80 s four values type in with staggered caret blinks. 1.80–2.60 s submit illustration depresses; panel compresses at centre and a signature line traces around its event payload. 2.60–3.55 s HMAC capsule seals with a check mark. 3.55–4.60 s packet flips in slight 3D perspective to reveal event fields. 4.60–5.60 s an amber path travels across into resident queue. 5.60–6.70 s pending visit card resolves at destination. 6.70–8.57 s camera settles, then an oversized “PENDING” status pill pivots edge-on and becomes the next scene's divider.

**Transition contract:** Amber packet line crosses the cut and becomes the underline in shot 03; event panel moves up/right while queue card unfolds from its track.

**Assets and technique:** Product UI built with DOM; SVG path tracing and status geometry. No fabricated official Ring payload or claim of a live device integration.

**Sound intent:** Cut at 17.10 s on the nearest measured rhythmic accent.

### Shot 03 / 17.10–25.70 / 8.60 s — “A HUMAN MAKES THE CALL”

**Purpose:** Show the resident's decision as a deliberate human action and clarify that approval is not gate actuation.

**Exact content and holds:** 17.10 s, “A HUMAN MAKES THE CALL.”; 17.70 s a visit card: “Neha Iyer”, “Flat B-704”, “Guest”, “Mehta family”, “Waiting for a resident decision”, status “Pending”. Two purely visual interface actions read “Approve” and “Deny”. 19.60 s, chosen result becomes “Approved”; decision note: “Flat B-704: guest approved”. At 21.10 s, a separate attendant card arrives: “Gate attendant”, “Verify the visitor at the entrance.” 22.10 s, large clear line: “Approval records a decision. It does not unlock the gate.” Hold through 24.00 s; then status pill becomes a framed portal to next shot.

**Composition:** High-contrast warm ivory center card on a deep navy field; card occupies 75% width, aligned low-left with large headline top-left. The card is the hero; status pill and two action labels form its lower edge, avoiding overlapping headline. Ambient details limited to a fine radial timing arc behind card.

**Artistic idea:** The pending card has two equal decision rails. Selecting “Approve” illuminates only the resident decision rail; a separate, physically offset “attendant verifies” rail remains unlit until the next step.

**Timed choreography:** 0.00–0.65 s status divider resolves into a card spine; headline clips on over the spine. 0.65–1.50 s visitor identity and flat number snap into aligned rows. 1.50–2.30 s two decision labels appear as printed interface controls; approval selection is indicated by a brief amber cursor-ring and solid green status update, not by a literal gate opening. 2.30–3.20 s confirmation line types in. 3.20–4.10 s card splits into resident and attendant lanes. 4.10–5.35 s resident lane retracts, attendant lane remains. 5.35–6.45 s cautionary sentence unrolls as large readable type. 6.45–8.57 s the approved pill scales into a circular aperture and opens toward shot 04, while an attendant ID tag begins entering.

**Transition contract:** The large status pill's circular outline is shared by next scene's guard-desk queue marker. Card split and aperture expansion overlap.

**Assets and technique:** UI typography, radial SVG track, split-panel mask, sparse amber/green status. All controls are visual artwork only, not film interactivity.

**Sound intent:** Cut at 25.70 s on the nearest measured rhythmic accent.

### Shot 04 / 25.70–34.25 / 8.55 s — “THE GATE DESK STAYS IN THE LOOP”

**Purpose:** Show the attendant's at-gate verification and distinguish it from a scheduled pre-approval.

**Exact content and holds:** 25.70 s: “THE ATTENDANT STAYS IN THE LOOP.” 26.25 s interface states “Gate desk”, “At the desk”, “1 waiting”, “Neha Iyer”, “Flat B-704 · Guest · Mehta family”, “Arrived 10:42 AM”, “Approved”, “Mark at gate”. 28.20 s the row updates “At gate” and shows “Resident confirmed · attendant to verify.” 30.00 s a second, contrasting rule vignette arrives with “Pre-approval”, “Flat 1203”, “Amazon deliveries · any time”, “Delivery · Amazon”, “Approved by pre-approval rule”. 32.30 s caption: “A rule can recognize a familiar visit. The attendant still verifies who arrived.”

**Composition:** Wide attendant desk at left occupies 56% of frame; at right, rule detail sits on a pale card suspended over a simple drawn clock arc. Amber bridges both, blue-green distinct for guard state. Horizontal queue becomes vertical time-window circle.

**Artistic idea:** A single arriving line passes through two different gates in the interface: a human attendant check represented by a desk rail, and a time-and-identity match represented by a clock aperture. The two paths converge on the same record, not on a physical lock.

**Timed choreography:** 0.00–0.75 s aperture opens into wide queue view; title slices into the open space. 0.75–1.60 s visitor/flat/type/provider details build. 1.60–2.45 s attendant marker moves from “waiting” to “at gate” with a restrained check. 2.45–3.30 s desk card sweeps inward and camera pulls back. 3.30–4.15 s rule vignette emerges from a 24-hour ring, match label “Amazon” illuminates. 4.15–5.15 s paired status resolves to “approved by pre-approval rule”. 5.15–6.10 s the circular clock compresses into a timeline line and note arrives. 6.10–8.58 s both flows travel into a shared record, narrowing in perspective; no empty exit.

**Transition contract:** Clock's circular marker flattens into the first timestamp on the visitor record. The desk panel rotates away while a ruled log sheet unfolds at the same screen position.

**Assets and technique:** Interface typography, SVG time ring, animated status marker, split-screen and shared-line transition. These are product illustrations, not claims of hardware integration.

**Sound intent:** Cut at 34.25 s on the nearest measured rhythmic accent.

### Shot 05 / 34.25–42.85 / 8.60 s — “EVERY DECISION, IN THE RECORD”

**Purpose:** Close the operational loop with transparent, searchable visitor history.

**Exact content and holds:** At 34.25 s title “EVERY DECISION, IN THE RECORD.”; 34.80 s table heading “Visitor record”, “Search name, flat, or event ID”, “All statuses”, “All visit types”. Rows: “Neha Iyer / B-704 / Guest / Mehta family / Approved / 10:42”; “Amazon delivery / 1203 / Delivery / Amazon / Approved / 10:31”; “Aarav Mehta / 605 / Guest / Guest / At gate / 10:20”; “Ravi Kumar / 402 / Delivery / Zomato / Pending / 10:12”. 37.45 s filtering motif narrows to “B-704” and Neha row; 38.35 s row expands to “eventId · sg-demo-0482”, “source · Ring simulator”, “Decision recorded · resident approval”. 40.30 s one phrase “Clear history. Human decisions.”. Keep table visible and move toward end-card.

**Composition:** Ivory log plane takes 88% width with a top-down perspective of around 4 degrees. Table rows form layered paper strips; headings small, rows large enough to read. A left-side magnified strip shows one event ID in mono, not competing with the table.

**Artistic idea:** The log behaves like a paper ribbon passing under a scanner: filters physically narrow the row stack, making one decision's audit trail emerge in a lens.

**Timed choreography:** 0.00–0.70 s record sheet unfolds from clock line and title reveals; 0.70–1.60 s headers and rows stamp in. 1.60–2.50 s rows slide by in measured rhythm, each status settling differently. 2.50–3.30 s search frame draws around B-704; unrelated rows compress out at once. 3.30–4.20 s focus row lifts in Z with a soft shadow on separate layer; event metadata appears in mono columns. 4.20–5.10 s “Decision recorded · resident approval” resolves in teal. 5.10–6.00 s copy resolves beneath table; 6.00–8.57 s table lines contract into one baseline, logo mark and lockup begin to form, carrying the final line into shot 06.

**Transition contract:** A warm amber rule is continuous between the table's baseline and the end lockup. The camera rises to flat overhead while the log paper divides into four panels that fold toward center.

**Assets and technique:** CSS table/rows; SVG focus-frame and scanning path; masked type. Generated imagery is not necessary for a software demo.

**Sound intent:** Cut at 42.85 s on the nearest measured rhythmic accent.

### Shot 06 / 42.85–48.00 / 5.15 s — “A CALMER FRONT DOOR”

**Purpose:** Resolve the demo on responsible operations: record first, human review, attendant in the loop.

**Exact content and holds:** 42.85 s on a strong warm paper field, “RECORD FIRST.”; 43.15 s “DECIDE CLEARLY.”; 43.45 s “VERIFY AT THE GATE.” Then a 43.75 s lockup “SOCIETY GATE” and below “Every arrival has a clear next step.” Small footer: “Simulation demo · no physical gate control.” Hold final copy fully legible from 44.30 to 46.95 s. At 46.95 s, door-mark aperture opens and carries the frame into the navy opening field.

**Composition:** Pale warm full-field unlike the dark opener. Centered wordmark is built from the four re-folded interface panels; small mark, large brand name, quiet one-line takeaway. A thin amber line holds the composition; ample margin gives the copy air. Closing logo is smaller than the opening dashboard hero, making the ending structurally different.

**Artistic idea:** Four operational panels fold into a door-shaped negative space; the “door” remains a graphic mark rather than a gate-control icon. The absence inside it becomes the navy opening field.

**Timed choreography:** 0.00–0.60 s four panels fold in from previous scene's table, creating full pale field. 0.15–0.90 s phrases fire in three beats, with the last acting as anchor. 0.90–1.35 s panels close into the door-mark and wordmark. 1.35–1.80 s tagline reveals on the amber rule; simulation disclaimer follows. 1.80–4.14 s resolved lockup; only a slow 1.01 scale settle and a minute amber highlight across baseline. 4.14–5.14 s door-mark enlarges with navy aperture, becoming shot 01's opening field and mark.

**Transition contract:** The final mark is the same door-mark and center point as the opener. Aperture grows without changing hue into the first frame; no fade-to-black and no empty tail.

**Assets and technique:** Typography and original geometric door-mark; four-panel fold, radial mask and restrained highlight.

**Sound intent:** Female narration resolves on the lockup; instrumental resolves by 48.00 s and the door-mark aperture hands back to the opening.

## Variety / feasibility review

The six shots alternate a wide dashboard, interface macro with event trace, human-decision card, split attendant/rule composition, overhead log plane, and minimal centered end lockup. Each differs from its neighbor in at least two dimensions (scale, framing, palette balance, and dominant transition mechanic). Product UI is the subject and actively recomposes throughout; the actual form values and statuses are grounded in the Society Gate feature set. No shot implies a physical gate is controlled. Each shot has timed motion through its final 15–20%; the last frame is a transitioning aperture rather than a dead hold. All on-screen interface controls are noninteractive artwork.
