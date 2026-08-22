# Agri Agentic Platform — Structure, Decisions & MVP Scope

**Phases:** `P1` = MVP · `P1.5` = fast-follow · `P2` = later.

---

## 1. Locked decisions

| Area | Decision |
|---|---|
| Platform | Single Android APK. No iOS. Role resolved at login. |
| Stack | Kotlin + Jetpack Compose |
| SDK | `targetSdk 36` (Android 16) — mandatory for Play submission from 31 Aug 2026. `minSdk 26` recommended for reach |
| Play compliance | Absolute. Data Safety declaration must match the pipeline exactly. Account-deletion URL required |
| Payments | **Google Play Billing** (Billing Library v8+). UPI available as a payment method inside it. No direct UPI collection in-app |
| Identity | Phone number = person. Number-change flow re-verifies and carries history. Dormant-account expiry rule needed |
| Languages | te-IN, ta-IN, kn-IN, mr-IN, hi-IN — all P1. English: pre-login UI default; post-login available as the transcript translate-mode toggle for all roles. |
| First states | Andhra/Telangana, Tamil Nadu, Karnataka, Maharashtra, Hindi belt |
| Crops | Family A (vegetables): chilli, tomato, okra. Family B (field): cotton, soybean |
| Localisation | GPS → **district only**, coordinates discarded. Manual district picker is first-class. Language is always explicit user choice, editable in Settings |
| Usage context | Two-location flow. Capture (photo, voice note) happens at the farm on poor connectivity. Consumption (reading the answer, deciding, acting) happens at home or a village centre, often with a literate family member present. |
| Images | Max 3 per case, guided capture. Screened before storage. 10 free slots per farmer. ₹100 / 500 slots via Play Billing. Rolling delete with user confirmation; full-res deleted, thumbnail + features retained |
| Training data | Separate opt-in consent: "help improve advice for other farmers". Never bundled with a paid feature |
| Support | Feedback reachable from every screen, voice-enabled, context auto-attached |
| Safeguarding | Self-harm signals detected, never blocked or deleted. Dedicated calm support surface. P1 |
| Field team | 10 staff for expert console and outcome follow-ups |
| Seed production module | **P2.** Farm graph schema must be able to represent a grower contract so it is not blocked later |

---

## 2. Repository tree

```
agri-os/
├── CLAUDE.md                          # P1  Router: commands, read-before-you-build, non-negotiables, ask-don't-decide
├── README.md                          # P1  Setup, run, test, deploy
├── .env.example                       # P1  Required env vars, no secrets
│
├── docs/
│   ├── README.md                      # P1  Doc index: what belongs in each file, and open questions
│   ├── project-structure.md           # P1  ✅ written — Repo tree, locked decisions, MVP scope, CI gates, open questions.
│   ├── design.md                      # P1  Master doc; links everything below
│   ├── architecture.md                # P1  Five layers, module map, scalability levers
│   ├── agent-contracts.md             # P1  ✅ written — uniform I/O, manifest, nine-section rule, agent catalog
│   ├── navigation-ia.md               # P1  ✅ written — 67 screens across three roles, states, backing agents
│   ├── offline-matrix.md              # P1  ✅ written — capability matrix, outbox, conflicts, media queue
│   ├── data-model.md                  # P1  Farm graph entities, event log, role projections, outcome ledger
│   ├── identity.md                    # P1  Phone-as-person, number change, shared devices, dormancy
│   ├── role-permissions.md            # P1  Who reads/writes what; consent defaults; cross-role rules
│   ├── safety-agronomic.md            # P1  Label claim, dose bounds, PHI, re-entry, resistance, veto conditions
│   ├── safety-content.md              # P1  Category taxonomy, action matrix, six enforcement points
│   ├── safeguarding-protocol.md       # P1  Self-harm path. Clinical/safeguarding review required
│   ├── privacy-dpdp.md                # P1  Consent, retention, deletion, export, audit, media policy
│   ├── play-compliance.md             # P1  Data Safety mapping, permissions rationale, billing, deletion URL
│   ├── voice-design.md                # P1  Mic behaviour, readback, barge-in, replay, failure speech
│   ├── device-constraints.md          # P1  minSdk, RAM, storage, APK budget, image sizing, data/battery budget
│   ├── i18n.md                        # P1  Pack structure, script rendering, glossary governance, QA sign-off
│   ├── eval-strategy.md               # P1  Golden sets, labelling workflow, metrics, regression gates
│   ├── observability.md               # P1.5 Tracing, case replay, cost per resolved query
│   └── adr/                           # P1  One file per architectural decision
│
├── skills/                            # Shared capabilities. Agent Skills format: SKILL.md needs YAML frontmatter
│   ├── README.md                      # P1  Master index + invariants (renamed from SKILL.md — not a valid skill itself)
│   ├── CLAUDE.md                      # P1  Local rules for this folder
│   ├── _template/                     # P1  Scaffold: frontmatter, nine sections, references/, src/, tests/
│   ├── speech/                        # P1  Sarvam STT (Saaras) + TTS (Bulbul), code-mix tolerant
│   ├── translate/                     # P1  Canonical-language normalisation and render-back
│   ├── vision/                        # P1  Crop/pest analysis, quality check, domain gate
│   ├── retrieval/                     # P1  RAG over packs, POP, label data, with citation
│   ├── dose-math/                     # P1  Area, volume, unit conversion, tank mixing — DETERMINISTIC
│   ├── confidence/                    # P1  The single confidence scorer for the whole system
│   ├── readback/                      # P1  Spoken numeric confirmation before commit — DETERMINISTIC
│   ├── uncertainty/                   # P1  Per-language "not sure" phrasing, human-authored
│   ├── content-safety/                # P1  Classification + action, all modalities, incl. safeguarding path
│   ├── rendering/                     # P1  Recommendation card → text, voice, dealer-print
│   ├── datetime-nlu/                  # P1  Spoken dates and quantities → structured values
│   ├── geo-weather/                   # P1  Provider-agnostic forecast normalisation
│   ├── pii-redaction/                 # P1.5 Strip identifiers before storage
│   └── market-data/                   # P2  Mandi price normalisation
│
├── agents/                            # One owned decision each. Stateless. Independently evaluable
│   ├── CLAUDE.md                      # P1  Local rules
│   ├── _template/                     # P1  AGENT.md nine-section scaffold + manifest.yaml
│   ├── orchestrator/                  # P1  Sequences agents, enforces budget
│   ├── context/                       # P1  Reads/writes farm graph, assembles case bundle
│   ├── triage/                        # P1  Routes: cached / simple / full / escalate
│   ├── clarification/                 # P1  Owns the one-missing-question turn
│   ├── crop-stage/                    # P1  Infers stage, emits stage-due tasks
│   ├── weather/                       # P1  Forecast → operational window
│   ├── diagnosis/                     # P1  Ranked hypotheses + confidence. Reference exemplar
│   ├── treatment/                     # P1  Intervention class, dose, timing, method
│   ├── agronomic-safety/              # P1  VETO gate
│   ├── nutrition/                     # P1  Stage-wise nutrient schedule
│   ├── escalation/                    # P1  Packages case, routes to expert, tracks SLA
│   ├── outcome/                       # P1  Follow-up scheduling, result capture, ledger write
│   ├── irrigation/                    # P1.5 Irrigation scheduling
│   ├── memory/                        # P1.5 Farmer preference and trust state
│   ├── variety/                       # P1.5 Pre-sowing variety and seed rate
│   ├── input-match/                   # P1.5 Intervention class → SKU → local stock
│   ├── demand-forecast/               # P1.5 Predicted input demand
│   ├── harvest/                       # P2  Maturity, pick interval, grading
│   ├── aggregation/                   # P2  FPO clustering, pooled demand, harvest windows
│   ├── market/                        # P2  Buyer and price signals
│   └── scheme/                        # P2  Government scheme eligibility
│
├── packs/                             # Data, never code
│   ├── CLAUDE.md                      # P1  Local rules
│   ├── schema/                        # P1  JSON schema + validator per pack type
│   ├── crops/
│   │   ├── chilli/                    # P1  Family A
│   │   ├── tomato/                    # P1  Family A
│   │   ├── okra/                      # P1  Family A
│   │   ├── cotton/                    # P1.5 Family B — resistance + Bt refuge module
│   │   └── soybean/                   # P1.5 Family B — weed module
│   ├── languages/
│   │   ├── te-IN/  ta-IN/  kn-IN/     # P1  UI strings, agro glossary, profanity lexicon, TTS voice
│   │   ├── mr-IN/  hi-IN/             # P1
│   │   └── en-IN/                     # P1  Pre-login UI default; post-login transcript translate-mode target. UI strings + agro glossary for translate-mode rendering; TTS coverage open
│   └── regions/                       # P1  District variants, local units, seasonal calendars — 5 states
│
├── backend/
│   ├── CLAUDE.md                      # P1  Local rules
│   ├── api/                           # P1  Role-scoped public API
│   ├── graph/                         # P1  Entities, append-only event log, projections, outcome ledger
│   ├── orchestration/                 # P1  Agent registry, planner, budget/timeout
│   ├── gateways/                      # P1  Provider adapters: sarvam, gemini, weather — swappable
│   ├── services/
│   │   ├── auth/                      # P1  OTP, session, biometric binding, number-change flow
│   │   ├── sync/                      # P1  Outbox intake, idempotency, conflict resolution
│   │   ├── media/                     # P1  Screening, storage, quota, rolling delete, thumbnail retention
│   │   ├── quota/                     # P1  Slot accounting, overflow prompts, entitlement checks
│   │   ├── notify/                    # P1  Channel abstraction: push, SMS, IVR, WhatsApp; quiet hours
│   │   ├── scheduler/                 # P1  Follow-ups, stage triggers, digests
│   │   ├── consent/                   # P1  Per-farmer, per-field, per-role consent state
│   │   ├── play-billing/              # P1  Purchase verification, entitlements, RTDN webhooks
│   │   ├── support/                   # P1  Feedback intake with attached context
│   │   ├── cost-governor/             # P1  Per-user rate limits and model spend caps
│   │   ├── flags/                     # P1  Remote config and feature flags
│   │   ├── privacy/                   # P1  Export and deletion pipelines
│   │   └── audit/                     # P1  Immutable log for safety and privacy events
│   └── workers/                       # P1  Async: diagnosis, digests, follow-ups, evals
│
├── android/                           # Kotlin + Compose, single APK
│   ├── CLAUDE.md                      # P1  Local rules
│   ├── app/                           # P1  Application module, DI, role routing, nav host
│   ├── core/
│   │   ├── network/                   # P1  API client, retry, offline-aware
│   │   ├── database/                  # P1  Room + outbox pattern
│   │   ├── sync/                      # P1  WorkManager jobs, backoff, triggers
│   │   ├── voice/                     # P1  Mic capture, VAD, playback, barge-in, audio focus
│   │   ├── media/                     # P1  CameraX, compression, EXIF strip, local queue
│   │   ├── i18n/                      # P1  Language switching, script rendering, audio labels
│   │   ├── billing/                   # P1  Play Billing v8 client
│   │   └── analytics/                 # P1  Telemetry, opt-out aware
│   ├── design-system/                 # P1  Tokens, typography, day/night, 56dp+ targets, mic dock
│   ├── feature-onboarding/            # P1  Language, OTP, consent, permissions, field registration
│   ├── feature-farmer/                # P1  Home, crop timeline, report, diagnosis, ask, history
│   ├── feature-images/                # P1  Guided capture, library, picker, quota prompts
│   ├── feature-support/               # P1  Global feedback sheet, help, safeguarding surface
│   ├── feature-settings/              # P1  Language, region, theme, privacy, storage, export, delete
│   ├── feature-billing/               # P1  Plans and purchase flow
│   ├── feature-dealer/                # P1.5 Demand, leads, counter mode, orders, stock
│   └── feature-fpo/                   # P1  Member list + cluster alerts (read-only); full dashboard P1.5+
│
├── consoles/                          # Web
│   ├── expert/                        # P1  Escalation queue, case bundle, approve/edit, SLA — 10 staff
│   ├── authoring/                     # P1  Crop and language pack CMS with review and versioning
│   └── admin/                         # P1  Agent health, evals, cost, quarantine queue, kill switches
│
├── evals/
│   ├── golden/                        # P1  Per-agent labelled sets, versioned, named labeller
│   ├── harness/                       # P1  Runner, scoring, regression gates
│   ├── safety/                        # P1  Red-team: content, agronomic, multilingual abuse
│   └── reports/                       # P1  Output history per agent version
│
├── ops/
│   ├── infra/                         # P1  IaC, environments
│   ├── ci/                            # P1  Build, test, eval gate, policy lint (see §4)
│   └── runbooks/                      # P1  Incident, rollback, safety escalation
│
└── legal/                             # P1  Terms, privacy, content policy, consent copy × 6 languages
```

---

## 3. Core MVP (P1)

**Cross-cutting** — voice-first in 5 languages · offline capture with idempotent sync · content safety on every input and output · safeguarding path · consent, export, deletion · day/night, biometric, large targets, audio nav labels · global feedback · Play Data Safety accuracy.

**Farmer** — onboarding and field registration · four-tile home · guided 3-image capture → diagnosis card (what/why/when/dose/precautions/alternatives) · crop timeline with next three tasks · weather as a decision · T+48h outcome capture · image library, quota prompt, delete picker, slot purchase · assisted mode.

**Dealer** — P1.5 in full. Counter mode (D-05) is the candidate to pull forward.

**FPO** — member list and cluster alerts only. Density before depth.

**Back of house** — expert console · authoring console · admin console · per-agent eval harness in CI.

**Out of MVP** — market linkage · harvest planning · schemes · lending · full FPO dashboard · cotton and soybean packs · commercial recommendation layer · seed production module.

---

## 4. CI gates

Prose does not enforce; these do.

- `manifest.yaml` validates, or fail
- `AGENT.md` missing any of nine sections, or containing placeholders → fail
- Agent with no golden set → fail
- `SKILL.md` without valid YAML frontmatter (`name`, `description`, allowed keys only) → fail
- Direct provider SDK import outside `gateways/` → fail
- User-facing string outside a language pack → fail
- Pack edit without a recorded approver → fail
- Pack change without re-running dependent agent evals → fail
- Any increase in false-confident rate → **hard block**
- `targetSdk` below 36 → fail

---

## 5. Modularity checkpoints

| Lever | Passing test |
|---|---|
| One agent, one decision | Description contains one verb |
| Uniform contract | Any agent swappable without orchestrator changes |
| Stateless agents | Two workers, identical bundle, identical result |
| Packs as data | Crop #7 requires zero code changes |
| Provider adapters | Swapping Sarvam touches one folder |
| Append-only events | New role view = new projection, no migration |
| Per-agent evals | A regression localises to one agent |
| Feature flags | Prompt or pack change ships without a Play release |
| Versioned agents | v2 shadows v1 on live traffic |
| Kill switches | Any agent disabled independently, degraded path defined |

---

## 6. Still open

| Question | Blocks |
|---|---|
| English TTS — Bulbul covers 11 Indian languages, English not among them. Screen-only, or fallback voice? | S-01, `i18n.md` |
| Multi-role users (farmer who is also an FPO office-bearer) — switcher or separate logins? | S-05, `identity.md` |
| Dealer counter-mode consent — per lookup, or once at onboarding? | D-05, `role-permissions.md` |
| Paid slot expiry — do purchased 500 slots expire? | `quota` service |
| Dormant account rule — how long before a recycled number is released? | `identity.md` |
| Are cotton and soybean genuinely P1.5, or needed at launch? | pack authoring schedule |
