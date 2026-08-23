# docs/ — index

Source of truth for design decisions. `CLAUDE.md` routes here; the detail lives here, not there.

**Status:** `stub` = file exists, contents not yet written · `partial` = some decisions recorded, not yet complete. Create all stubs on day one — a router pointing at missing files trains the reader to ignore it.

| File | Must contain | Status |
|---|---|---|
| `overview.md` | One-page summary: problem, users, goal, objectives, solution, moat, scope, success measures. | partial |
| `project-structure.md` | Repo tree, locked decisions, MVP scope, CI gates, open questions. | **written** |
| `design.md` | Master doc. Problem, users, scope, links to everything below. | stub |
| `architecture.md` | Five layers, module map, orchestration flow, scalability levers. | stub |
| `agent-contracts.md` | Uniform `AgentRequest`/`AgentResponse`, manifest spec, nine-section rule, full agent catalog. | **written** |
| `data-model.md` | Farm graph entities, append-only event log, role projections, outcome ledger. | stub |
| `identity.md` | Phone-as-person, number change, shared devices, dormancy. | partial |
| `role-permissions.md` | What farmer/dealer/FPO/expert/admin can read and write. Consent defaults. Cross-role rules. | partial |
| `safety-agronomic.md` | Label claim, dose bounds, PHI, re-entry, max sprays, resistance/refuge, veto conditions. | stub |
| `safety-content.md` | Category taxonomy, action matrix, six enforcement points, multilingual approach, allowlist rationale. | stub |
| `safeguarding-protocol.md` | Self-harm: detect-don't-block, response template, escalation path, helpline copy per language, staff protocol, access restrictions. **Clinical/safeguarding review required.** | partial |
| `privacy-dpdp.md` | Consent model, retention per data class, deletion and export pipelines, audit, media policy. | partial |
| `play-compliance.md` | Data Safety mapping, permissions rationale, billing, deletion URL. | stub |
| `navigation-ia.md` | Screen inventory per role. Every screen: states, backing agent, offline behaviour, voice path. | partial |
| `voice-design.md` | Mic behaviour, hold vs tap, barge-in, readback rules, replay, failure speech, audio nav labels, transcript display, notification timing. | partial |
| `offline-matrix.md` | Per screen, per role: works offline / degraded / online-only. Sync and conflict rules. | **written** |
| `eval-strategy.md` | Golden set standards, labelling workflow, metrics, regression gates, red-team sets. | stub |
| `i18n.md` | Language pack structure, script rendering, glossary governance, localisation QA sign-off. | stub |
| `observability.md` | Tracing, case replay, cost per resolved query, agent health. | stub |
| `device-constraints.md` | Min SDK, RAM, storage, APK budget, image sizing, data and battery budget. | stub |
| `adr/` | One file per architectural decision: context, options, decision, consequences. | — |

## Writing rules

- One doc, one concern. If two docs describe the same rule, one of them is wrong.
- Decisions go in `adr/` with the reasoning. Docs describe the current state, not the debate.
- Every agronomic statement carries a source. No source, no statement.
- When a doc and the code disagree, the doc is a bug — fix both in the same PR.

### Provenance labels

Any claim not traceable to another doc, a pack reference, or a cited source carries one of these, as a blockquote directly under the heading it governs:

| Label | Means | Example |
|---|---|---|
| `> Founder-set.` | A decision, not a finding. Has an owner, not a source. | Goal statements, scope, phasing |
| `> Strategic judgment.` | An interpretation of facts, not a fact. | Moat claims, competitive positioning |
| `> Proposed.` | Not yet agreed. No threshold or owner set. | Draft success measures |
| `> Unverified.` | Asserted, source not yet recorded. Carries a TODO. | Figures pending citation |

Rules:
- Label the section, not every sentence. One blockquote under the heading.
- `> Unverified.` is temporary. It must carry a TODO naming where the source will be recorded, and is removed when the citation lands.
- A doc containing any `> Proposed.` or `> Unverified.` section is `partial` in the index above, never `written`.
- Vendor and API facts always carry a source URL. Prefer official API docs over marketing pages — they disagree, and the API docs win.

## Not yet decided — resolve before the dependent doc is written

| Open question | Blocks |
|---|---|
| ~~Single APK or separate apps?~~ **Decided: single APK, role at login** | resolved |
| ~~First launch languages?~~ **Decided: te, ta, kn, mr, hi + en pre-login** | resolved |
| ~~First states?~~ **Decided: AP/TS, TN, KA, MH, Hindi belt** | resolved |
| ~~Kotlin or Flutter?~~ **Decided: Kotlin + Compose, targetSdk 36** | resolved |
| ~~Field team size?~~ **Decided: 10 staff** | resolved |
| ~~Identity model?~~ **Decided: phone = person** | `identity.md` |
| ~~Seed production module?~~ **Decided: P2, schema must support grower contract** | resolved |
| Paid slot expiry — do 500 purchased slots expire? | `quota` service |
| Dormant account rule before a recycled number is released | `identity.md` |
| Dealer counter-mode consent — per lookup or once at onboarding? | `role-permissions.md` |
| Multi-role users (farmer who is also an FPO office-bearer) — switcher or separate logins? | S-05, `identity.md` |
| Are cotton and soybean genuinely P1.5, or needed at launch? | pack authoring schedule |
