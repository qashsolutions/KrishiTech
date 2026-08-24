# KrishiTech UI Prototype — Complete Screen & Flow Specification

**Date:** 2026-08-23 · **Covers:** every P1 + P1.5 screen in `docs/navigation-ia.md`
(64 screens, 7 chunks, 6 languages). P2 excluded by phase: D-08, P-05…P-07, seed module.

**Purpose.** The single hand-off document for reviewing these screens or recreating the
fully interactive flow end-to-end (e.g. in Claude Design / Cowork). Everything here
describes what is actually implemented in this folder, keyed to the files that implement
it. Where this doc and a source doc disagree, the source doc wins:

| Source of truth | Owns |
|---|---|
| `../../docs/design-system.md` | every visual value, two-layer tokens, role palettes, type, §2.7 S-42 rules |
| `../../docs/navigation-ia.md` | screen inventory, states-per-screen doctrine (§8), nav models (§2), voice rules (§9) |
| `../../docs/offline-matrix.md` | offline behaviour per screen |
| `../../docs/voice-design.md` | mic behaviour semantics (partial) |
| `../../docs/safeguarding-protocol.md` | S-42 — read in full, never improvise |
| `../../docs/adr/` | 0002 English toggle · 0003 confidence bands · 0007 counter consent · 0008 multi-role · 0011 role palettes |
| `../../CLAUDE.md` | non-negotiables (no generated agronomic content, semantic-layer parity, etc.) |
| `../../packs/CLAUDE.md` | string rules: native script, human review, no machine agronomic copy |

---

## 1. File structure ↔ screens

```
design/prototype/
├── index.html                 landing page — links all chunks (github.io entry)
├── SPEC.md                    this document
├── shared/
│   ├── tokens.css             ALL design values; farmer :root + .role-dealer override
│   ├── styles.css             components (screen styles use tokens only)
│   ├── proto.js               framework: chrome, hash router, BOARD/FLOW, helpers (window.KT)
│   └── strings/{en,hi,mr,te,ta,kn}-IN.js   one file per locale; meta.reviewed drives DRAFT ribbon
├── 01-onboarding/             S-01…S-07, F-01…F-05          (farmer palette, pre-role)
├── 02-home-crop/              F-10…F-14                     (farmer chrome debuts)
├── 03-report-problem/         F-20…F-28, F-29, F-30         (diagnosis encodings)
├── 04-ask-history/            F-40…F-43, F-50…F-53
├── 05-settings/               S-20…S-32, S-40…S-42
├── 06-dealer/                 D-01…D-07                     (indigo role palette)
└── 07-fpo/                    P-01…P-04                     (indigo role palette)
```

Each chunk = `index.html` (identical shell) + `screens.js` (screen definitions, actions,
sequence) + `README.md` (state coverage, UNSPECIFIED decisions, DEVIATIONS). A chunk's
`screens.js` calls `KT.boot(chunk)` from `shared/proto.js`.

**URL contract:** `#mode=board|flow&screen=<ID>&state=<state>&lang=<locale>` — every
screen×state×language is a shareable deep link. Cross-chunk jumps carry the language.

---

## 2. Global systems

### 2.1 Roles, palettes, chrome

| | Farmer (chunks 01–05) | Dealer / FPO (06–07) |
|---|---|---|
| Palette | deep leaf `#17643B` seeds (`:root` in tokens.css) | indigo `#2F3E9E` seeds (`.role-dealer`) |
| Semantic tokens | **identical** — severity/confidence/sync never vary by role (design-system §1) | identical |
| Type floor | ≥16sp, body 18/28 | body 14/22, caption 12/18 |
| Radii | 12/20/28dp | 4/8/12dp |
| Touch | 56dp min, 8dp separation | 48dp min |
| Nav | bottom nav Home·Crop·(mic)·History·More, labels in local script | top bar + tabs, mic 48dp top-right |
| Mic | docked centre 72dp from S-06 onward (not pre-login S-01–S-04) | 48dp in app bar |
| App bar | role chip in words ("Farmer" localized) on every post-login screen | role chip "Dealer"/"FPO" |
| Dark | light only (P1) | follows system (prototype renders light) |

Pre-login S-01–S-04: farmer palette, **no** docked mic, no bottom nav (design-system §2.8).
S-42 overrides everything: white, unbranded, no chrome at all (§2.7).

### 2.2 State model

Per nav-ia §8, every screen implements every applicable state; the state chips in the
review chrome flip any screen into any state. Conventions used throughout:

- **loading** — never a bare spinner; always says what is happening; auto-advances on first entry only (revisits render from cache instantly).
- **offline** — ✕ screens block with a neutral cloud-off card + what-to-do; ◐ screens show cached content **with its age stated**; ✅-queued screens show the neutral queued card ("saved on your phone, sends when signal returns" — never amber, §5).
- **error** — plain cause + one-tap retry, error role colour (never `statusUrgent`).
- **degraded** — data age stated ("this forecast is from yesterday evening"), F-13.
- **blocked** — content gate, polite, non-accusatory, redirect (F-22).
- **empty** — explains why + next action (F-21, F-42, D-03, P-03).
- **queued** — capture confirmed + what happens next.
- The chrome's "Simulate offline" toggle makes live interactions route to their offline/queued behaviour.

### 2.3 Voice & language

- Mic states per design-system §5 (idle container / listening fill+pulse / queued outline); listening auto-resolves after ~2s (simulated ASR). TTS is simulated by a "Speaking…" pill; every speaker icon carries a text label in the farmer app.
- Readback-before-commit on numeric/voice input (F-03 crop+date; S-30 spoken delete confirm).
- "Hear it again" persists on every answer (F-23a, F-25, F-41), including offline replay (F-41 ◐).
- **English transcript toggle** (ADR 0002): inline on F-22, F-23a, F-40, F-41; default off; default set in S-21.
- Six locales in `shared/strings/`; the five Indic files are machine drafts (`meta.reviewed:false` → DRAFT ribbon on every non-English screen). Native-speaker review flips the flag.

### 2.4 Placeholder policy (non-negotiable)

Agronomic content is **never** invented: stage names, tasks, what/why/when, dose,
precautions, alternatives, confusion pairs, weather decisions, intervention classes,
answers, clarification-adjacent advice → dashed placeholder blocks with an attribution
tag (`dose-math + agronomic-safety veto`, `from crop pack`, `input-match`, …) and a
localized "comes from the agronomist-approved crop pack" line. UI strings, farmer speech
samples, and place/crop names are real content.

### 2.5 Sample-data inventory (swap freely; layout-only)

phone `98765 43210` · OTP any 6 digits verifies, `000000` demos error · districts
Warangal/Khammam/Nalgonda/Karimnagar · villages Duggondi/Atmakur/Parkal · crops
chilli/tomato/okra (packs/CLAUDE.md crop list) · sowing `12 Aug` · second case `28 Jul`
tomato · fields "Field near the well"/"Atmakur field" · people Ramu/Lakshmi/Suresh/Anita ·
weather 31°/60% etc. · catchment 128/17/9, crop split 62/27/11 · stock "Neem oil 1L" etc.
(generic, never brands) · dealer shops "Sri Agro"/"Krishna Agro" · slots 7/10, ₹100/500 ·
quiet hours 9pm–6am · Tele-MANAS 14416 / 1800-89-14416 (**pending clinical verification**).

---

## 3. Screen-by-screen specification

Format — `ID · name · offline class · backing`: states; then element → interaction → result.

### Chunk 01 — Onboarding (S-01…S-07, F-01…F-05)

**S-01 · Splash / language picker · ✅ · —** — states: default.
Six language rows, each name in its own script (English, हिन्दी, मराठी, తెలుగు, தமிழ், ಕನ್ನಡ) with a per-row Listen affordance in that row's own language.
- tap language name → sets app language → S-02 · tap speaker → speaks it (sim) · long-press-to-hear noted in caption.

**S-02 · Phone entry · ✕ · auth** — default / loading / error / offline.
Title, helper, +91 display field, in-app 56dp number pad, Continue.
- digits → fill (max 10) · Continue → offline sim? offline-state : <10 digits? error("needs 10 digits") : loading("Sending your code…", 1.2s) → S-03 · error retry = Continue.

**S-03 · OTP · ✕ · auth** — default / loading / error / offline.
Six display boxes + number pad + "Send a new code".
- 6th digit → auto-verify: loading("Checking…") → S-04; `000000` → error("didn't match") · resend → clears + toast · offline blocks with retry.

**S-04 · Terms & consent · ✕ · consent** — default / error / offline.
Three plain-language consent cards (yours-to-keep / dealer-only-on-yes / hear-change-delete-anytime), "Hear this in your language", terms+privacy links (→ S-31 stub), "I agree — continue".
- agree → offline? offline-state : S-05.

**S-05 · Role resolution · ✕ · auth** — loading / default / picker / error / offline.
- entry → loading("Setting up your account…", 1.3s) → default ("You're set as a farmer") — or picker when multi-role (ADR 0008): three role cards, any → continue.
- Continue → S-06. Docked 72dp mic appears from here on.

**S-06 · Permission primer · ✅ · —** — default / permission-denied.
Four cards (mic/camera/location/notifications), each: spoken reason + Allow + Not now; state persists (granted ✓ / skipped →) and **feeds later screens** (skipping location makes F-02 GPS land on permission-denied).
- permission-denied state: location skipped + info card "nothing is blocked — pick district by hand" · Continue → S-07.

**S-07 · Biometric · ✅ · auth** — default / unavailable.
- Use fingerprint → toast → F-01 · Not now → F-01 · unavailable: explainer + continue.

**F-01 · Add field · ✅ queued · context** — default / queued.
Name input, area input, unit chips (guntha/cent/acre).
- Save → offline? **queued card** (neutral, "keep going") : → F-02.

**F-02 · Field location · ◐ · context** — default / loading / manual / permission-denied / offline.
Map placeholder + pin, "Use my location", "Pick district by hand" (first-class, not buried).
- GPS → location skipped at S-06? permission-denied : offline? offline : loading("Finding you…",1.4s) → pinned → "This is the place" → F-03.
- manual: district+village selects → confirm (requires district) → F-03. denied/offline both route to manual.

**F-03 · Crop, variety, sowing · ✅ queued · context, crop-stage** — default / listening / readback / queued.
Voice-first: prompt + docked mic; typed fallback (crop chips, variety input).
- mic → listening (1.8s) → **readback** "You said: chilli, sown 12 Aug" + hear-again → "That's right" → offline? queued : F-04; "Say it again" → default.

**F-04 · Assisted-mode banner · ✅ · context** — default.
Formal assisted mode: account belongs to the farmer; helper's role is recorded in the farm graph. Listen + "Understood — continue" → F-05.

**F-05 · Setup complete + first tip · ◐ · crop-stage** — loading / default / offline.
- entry loading("Getting your first tip…",1.4s) → default: tip = **placeholder** (awaiting crop pack) · offline: "tip arrives with signal, everything saved".
- "See my crop" → **chunk 02, F-10** (language carried).

### Chunk 02 — Home & crop (F-10…F-14)

**F-10 · Home · ◐ cached · orchestrator** — default / loading / offline.
App bar (KrishiTech + role chip) · current-field chip (→ F-14) · four tiles: My crop (sub: crop+sown → F-11) · Weather (sub: 31°·60% → F-13) · Report a problem (→ chunk 03 F-20) · Ask KrishiTech (→ chunk 04 F-40). Bottom nav + mic debut.
- entry loading("Getting your farm ready…",1.1s) first time only · offline: cached banner + data age above tiles.

**F-11 · Crop timeline · ✅ · crop-stage** — default.
Crop header card · "Stage now" placeholder · "Next three tasks": 3 dashed rows → F-12.

**F-12 · Task detail · ✅ · crop-stage, nutrition** — default.
Listen · four sections What/Why/When/How — all pack placeholders · back → F-11.

**F-13 · Weather → action · ◐ · weather** — default / loading / degraded / offline / error.
Decision FIRST (placeholder: weather agent + crop pack), forecast second (4 rows, sample data), staleness always stated ("Updated today 6:05" / degraded: "from yesterday evening" / offline: cached + retry) · error: retry.

**F-14 · Field switcher · ✅ · context** — default / single.
Field cards with Selected check; tap other → switches → F-10 (chip updates) · single-field state + explainer · "Add a field" → **chunk 01 F-01**.

### Chunk 03 — Report a problem (F-20…F-30)

**F-20 · Guided capture · ✅ queued · vision** — default / permission-denied.
Immersive (no bottom nav; mic stays). Spoken step prompt (whole plant → affected part → under the leaf) · viewfinder · 3 shot slots · 72dp shutter (labelled) · skip-photo · review.
- shutter fills next slot, advances prompt; 3/3 → F-21 · camera denied: explainer + "describe by voice" → F-22.

**F-21 · Image review · ✅ · vision** — default / empty.
Photo cards with Retake (→ F-20 at that step) and Remove; removing all → **empty** ("take at least one, or describe by voice") · Continue → F-22.

**F-22 · Voice description · ✅ queued · speech** — default / listening / review / blocked.
Optional; mic → listening (2s) → **review**: codemix transcript (Telugu + Latin "spray") + **English toggle** + Continue (→ F-23a) + re-record · skip (Not now) → F-23 directly · **blocked** (content gate): polite, nothing deleted, re-record.

**F-23a · Transcript confirm · ✕ · speech, clarification** — default / loading / offline.
- entry loading("Understanding…",1.3s) → transcript + interpretation chips (crop / where / what's happening) + hear-again · "That's right" → F-23 · re-record → F-22 · offline: recording saved on phone, retry.

**F-23 · Submitted / queued · ✅ · —** — default(sent) / queued.
Sent! + "what happens next" card (looks at photos; may ask one question) · queued variant when offline · Continue → F-24.

**F-24 · Clarification · ✕ · clarification** — default / listening / offline.
Exactly ONE question, spoken (sample observational question) · Yes / No → F-25 · "I'm not sure" → F-25 in **low-confidence** · mic answer supported.

**F-25 · Diagnosis card · ✕, cached after · diagnosis, treatment, agronomic-safety** — loading / default / urgent / healthy / low-confidence / offline.
THE encoding screen (§2.4): severity chip by hue (`statusCaution` "Watch this" / `statusUrgent` "Act now") + separate 3-segment confidence bar (`confidenceFill`, 2/3 or 3/3) with written label. Six sections (what/why/when/dose/precautions/alternatives) — all placeholders; dose tagged `dose-math + agronomic-safety veto`. Hear-again persistent.
- healthy: **no colour** — outline+icon+sentence, 3/3 confidence, back home.
- low-confidence: 1/3 + "we are not sure — a person can look" → Ask an expert (F-27) / retake (F-20).
- CTAs: "Got it — I'll do it" → F-29 · "Where to get it" → F-28 · "Ask an expert" → F-27.

**F-28 · Dealer availability · ✕ · input-match — P1.5** — default / offline.
Reached from F-25 only ("after the recommendation is locked"). Intervention-class placeholder · dealer cards (sample shops, distance, In-stock chip) · privacy caption (dealer sees the case only on the farmer's yes).

**F-26 · Confusion-pair card · ✕ · diagnosis** — default.
"One of these two" — two possibility cards + how-to-tell (all placeholders from declared confusion pairs) · "Take one more photo" → F-20 · Ask expert → F-27.

**F-27 · Expert pending · ◐ · escalation** — default / offline.
A person is looking · ETA ("by this evening") · "we'll ring and speak" · offline: status age noted · Back to home → chunk 02 F-10.

**F-29 · Action confirm · ✅ queued · outcome** — default / queued.
Advised-treatment placeholder + one tap: I did it / I didn't / later → offline? queued : outcome-ledger toast → F-30.

**F-30 · Follow-up · ✅ queued · outcome** — default / done / queued.
One question: Better / The same / Worse (directional icons) → done ("helps everyone") → Back to home.

### Chunk 04 — Ask & history + images (F-40…F-43, F-50…F-53)

**F-40 · Ask agent · ✕ · orchestrator, triage** — default / listening / review / offline.
Open voice question → review: question transcript + English toggle + "Get the answer" (→ F-41) + re-record · offline: saved answers pointer → F-42.

**F-41 · Answer · ◐ replay cached · rendering, speech** — loading / default / offline.
Question card + **placeholder answer** + persistent hear-again + Ask another (→ F-40) + History (→ F-42) · **offline replays the cached answer** with a note; only new questions need signal.

**F-42 · Case history · ✅ · context** — default / empty.
Mixed list: chilli case (In progress) → F-43 · the question row → F-41 · tomato case (Better) → F-43 · empty: "report or ask, it's saved here" + both CTAs. History tab active.

**F-43 · Case detail · ✅ · context** — default.
Crop/date header · 3 thumbnails · advised (placeholder from case record) · what happened (Better) + keep-note (thumbnail survives deletion) · listen.

**F-50 · My images · ✅ · media** — default(7/10) / full(10/10).
3-col thumbnail grid + empty dashed slots · touch-and-hold speaks (sim on tap) · Free up space → F-52 · Buy more → F-53.

**F-51 · Storage full prompt · ◐ · media, entitlements** — default.
Post-diagnosis moment: "new photos are safe; free exactly 3 — or buy" + listen · Choose 3 → F-52 · Buy → F-53 · Not now → F-50.

**F-52 · Delete picker · ✅ · media** — default / confirm.
Grouped by case, **oldest 3 pre-selected**; tap toggles; requires exactly 3 · keep-note · Delete 3 → **confirm**: chosen thumbs + "cannot be undone" + spoken confirm + `statusUrgent` red confirm (the one sanctioned destructive use) / cancel → deleted toast → F-50 (7/10).

**F-53 · Buy image slots · ✕ · payments** — default / offline.
"500 slots — ₹100" · paid via Google Play (sheet is system UI, not faked) · Buy → sim toast → F-50.

### Chunk 05 — Settings & support (S-20…S-32, S-40…S-42)

**S-20 · Settings home · ✅** — rows (icon + label + value) → S-21…S-32, S-40, S-41. More tab active. S-42 deliberately NOT listed here.
**S-21 · Language · ◐ · i18n** — default / offline. Six language rows (live-switch) + pack-download note + **English-transcript default toggle** (off) · offline: new pack can't download, current language keeps working.
**S-22 · Region/district · ✅ · context** — "correct what GPS guessed" + selects → save → S-20.
**S-23 · Theme · ✅** — Day selected; Night/System disabled + reason (farmer light-only P1, §2.5).
**S-24 · Profile · ✅ · context** — name input, phone, field cards.
**S-25 · Security · ✅ · auth** — fingerprint toggle + works-without-signal note.
**S-26 · Notifications & quiet hours · ✅ · notify** — 3 toggles + quiet card (9pm–6am, "no rings or spoken alerts").
**S-27 · Data & privacy · ✅ · consent** — "help improve advice" toggle **off by default**, never tied to paid features · dealer-only-on-yes card · rows → S-29, S-30.
**S-28 · Storage & plan · ◐ · entitlements** — 7/10 + bar → chunk 04 F-50 / F-53.
**S-29 · Get my data · ✕ · privacy** — default / requested / offline. Explains the file → "Prepare my file" → requested ("we'll ring — usually within a day").
**S-30 · Delete my account · ✕ · privacy** — default / confirm / offline. Everything-goes warning → red Delete → **confirm**: say the phrase aloud (spoken confirmation) or tap red confirm → returns to S-01 · `[DELETION URL]` placeholder (Play parity).
**S-31 · Terms & policies · ✅** — three rows → legal/ stubs.
**S-32 · About · ✅** — version + licences.
**S-40 · Feedback · ✅ queued · support** — default / listening / queued. Speak or type · voice chip after recording · auto-attached context shown as chips (screen ID, version, language, device) · Send → queued offline. (Real app: one action from every screen.)
**S-41 · Help · ✅** — three spoken clips + at the very end, one deliberate labelled button: "Feeling overwhelmed? Talk to someone" → S-42.
**S-42 · Support (safeguarding) · ✅ · safeguarding** — default only. Pure white, **zero chrome** (no app bar/nav/mic/brand). Calm two-line copy · Tele-MANAS **14416** + 1800-89-14416 shown large + listen · ONE action: Call. Never auto-opened; never in the settings list; never dealer/FPO-visible. **Numbers and copy pending clinical review before any field session.**

### Chunk 06 — Dealer (D-01…D-07, P1.5, indigo)

Top tabs: Demand(D-01) · Leads(D-03) · Counter(D-05) · More(stub). Mic 48dp in app bar.

**D-01 · Catchment dashboard · ◐** — default/offline. Stat tiles (128 farmers / 17 problems / 9 villages) · crop-split bars · stages+problems placeholder · rows → D-02, D-07.
**D-02 · Demand forecast · ◐** — "next 14 days by intervention class": 4 placeholder class bars.
**D-03 · Leads · ◐** — default/empty. Consented farmers only, each with "Shared with consent" badge + agronomic-reason placeholder → D-04 · empty explains leads appear only on a farmer's yes.
**D-04 · Lead detail · ◐** — farmer + the case + locked-recommendation placeholder + what-to-stock (input-match) placeholder. Never the raw diagnosis.
**D-05 · Counter mode · ◐ 7-day cache** — default / result / offline. Number lookup → result: farmer + current recommendation placeholder + **ADR 0007 consent note** (join-time consent, visible lookup log, one-tap revoke) → Log order · offline: 7-day-cache note + cached result.
**D-06 · Log order · ✅ queued** — product (dealer's own name, typed), quantity, farmer select → save → queued offline.
**D-07 · Stock · ✅ queued** — inventory rows; low item carries `statusCaution` "May run short" chip + "based on the 14-day forecast".

### Chunk 07 — FPO (P-01…P-04, indigo)

Top tabs: Members(P-01) · Alerts(P-03) · Demand(stub, P2) · More(stub).

**P-01 · Member list · ◐ · aggregation** — default/offline. "View only in this version" · member rows (name, village, crop, area) + stage placeholder.
**P-02 · Crop map · ◐** — village bubbles with member counts on map placeholder + crop legend chips.
**P-03 · Cluster alerts · ✕ push** — default / empty / offline. Alert cards with the **same** `statusUrgent`/`statusCaution` chips as the farmer's diagnosis (semantic-layer parity, §1) + spread ("6 members · 3 villages") → P-04 · empty uses the colourless healthy pattern.
**P-04 · Alert detail · ◐** — severity + spread + problem placeholder + affected members + coordinated-response placeholder + Notify members (stub → P-07, P2).

---

## 4. End-to-end scenarios (all implemented and walkable)

1. **First run, happy path**: S-01 pick తెలుగు → S-02 keypad → S-03 OTP → S-04 agree → S-05 farmer → S-06 allow/skip → S-07 skip → F-01 field → F-02 GPS pin → F-03 mic→readback→confirm → F-04 → F-05 → F-10 Home.
2. **Offline onboarding**: same with Simulate offline — S-02/S-03/S-04/S-05 block with neutral guidance; F-01/F-03 queue; F-05 tip deferred.
3. **Location denied**: skip location at S-06 → F-02 GPS lands on permission-denied → manual district (first-class) → onward.
4. **Report → caution diagnosis → outcome**: F-10 Report → F-20 3 shots → F-21 → F-22 voice → toggle English → F-23a confirm → F-23 sent → F-24 Yes → F-25 (Watch this, 2/3) → Got it → F-29 I did it → F-30 Better → done → Home.
5. **Urgent / healthy / low-confidence variants**: F-25 state chips; low-confidence also reached live via F-24 "I'm not sure".
6. **Confusion pair**: F-26 → retake one photo (F-20) or expert (F-27).
7. **Escalation**: F-25 → F-27 (ETA, we'll ring) → Home.
8. **Offline capture**: whole report flow offline → F-23 queued; F-29/F-30 answers queue.
9. **Blocked voice note**: F-22 blocked state → polite re-record, nothing deleted.
10. **Where to buy (P1.5)**: F-25 → F-28 dealers with stock → back.
11. **Ask → answer → offline replay**: F-40 mic → review → F-41 answer + hear-again; offline shows cached answer, new questions blocked.
12. **History**: F-42 (cases + questions, outcome chips) → F-43 detail; empty state for new users.
13. **Storage full**: F-51 → F-52 oldest-3 preselected → adjust selection → red no-undo confirm → 3 freed; or F-53 ₹100 purchase via Play.
14. **Language & transcript default**: S-21 live switch + pack-offline state; English default toggle.
15. **Export / delete**: S-29 request→requested; S-30 spoken confirm → back to S-01.
16. **Feedback**: S-40 voice or text + auto-context chips → queued offline.
17. **Safeguarding**: S-41 deliberate labelled tap → S-42 (white, one action) — never accidental, never auto.
18. **Dealer day**: D-01 stats → D-02 forecast → D-07 gap chip; D-03 consented lead → D-04; D-05 counter lookup (incl. 7-day offline cache) → D-06 order (queues).
19. **FPO day**: P-01 members (read-only) → P-02 map → P-03 alerts (urgent+caution) → P-04 detail → notify (P2 stub).
20. **Cross-role parity check**: compare F-25's severity chips with P-03's — identical tokens on different palettes (the §1 guarantee).

---

## 5. Gates before field sessions

1. Native-speaker review of all five Indic string files (`meta.reviewed` → true removes DRAFT ribbons). Do not validate copy with farmers before this.
2. Clinical verification of S-42's numbers AND human authoring of its copy (safeguarding-protocol TODO).
3. Material Theme Builder export to replace `[derived]` hexes in tokens.css (both palettes).
4. Founder ratification of the UNSPECIFIED decisions in each chunk README.

## 6. Open decisions & known gaps

Per-chunk `README.md` files carry all UNSPECIFIED / DEVIATIONS entries. Doc-level open
questions live in `../../docs/README.md` (canonical) and `navigation-ia.md` §12 — notably:
bystander re-auth surface, number-change flow, console screen inventory (no specs yet),
and the farmer-side lookup-log/revoke surface required by ADR 0007 (candidate: S-27).
