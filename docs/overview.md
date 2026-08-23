# Overview

One page. Problem, users, goal, objectives, solution, moat, scope, success measures. Detail lives in the linked docs, not here.

---

## 1. Problem

> Unverified. The holdings figures and the dealer-training claim below come from the founders' research; sources are not yet recorded in-repo. TODO: cite in `docs/design.md`. The extension-worker ratio is cited inline.

India has ~146M operational holdings, ~86% of them small or marginal, and an extension-worker ratio below 1:5000 against a national guideline of 1:1100 in irrigated, 1:750 in rainfed and 1:400 in hilly areas ([ICRISAT](https://pressroom.icrisat.org/strengthening-agri-extension-for-a-strong-farm-sector); alternative framing noted in `docs/design.md`). Smallholder farmers lose crop and money to problems that are diagnosable and treatable — pests, disease, nutrient gaps, mistimed sprays — because the advice they can reach is slow, generic, rarely in their language, and comes from dealers whose own top-ranked constraint is lack of training. The moment of need is at the farm, on a poor connection, with no one to ask. The moment of decision is later, at home, often with a family member reading the screen (`docs/adr/0001-usage-context.md`).

Existing tools assume literacy, connectivity, English, and a single user alone at the field. None of those hold.

## 2. Users

| Role | Who | How they use it |
|---|---|---|
| **Farmer** | Smallholder; te, ta, kn, mr, hi speakers; assumes no literacy | Voice-first, docked mic on every screen. Captures at the farm, consumes at home. Informal helpers are normal, not an edge case. |
| **Dealer** | Input retailer serving those farmers | Literate, data-dense, typing. Demand, leads, counter mode. P1.5 in full. |
| **FPO** | Farmer producer organisation office-bearer | Member list and cluster alerts. Density before depth. |
| **Expert** | 10-person field team | Web console: escalation queue, case bundle, approve/edit, SLA, outcome follow-ups. |
| **Admin / author** | Internal | Agent health, evals, cost, kill switches; crop and language pack CMS. |

First states: AP/TS, TN, KA, MH, Hindi belt. Screen inventory per role: `docs/navigation-ia.md`.

## 3. Goal

> Founder-set. Not derived from the design docs.

Give every farmer in the network a correct, safe, language-native answer to "what is wrong with my crop and what do I do" — at the moment they can act on it — and record whether it worked.

## 4. Objectives

1. **Correct before confident.** Diagnosis and treatment are separate agents, separately evaluated, with a veto gate between recommendation and user (`docs/agent-contracts.md` §6).
2. **Never fabricate.** `insufficient_input` with `needs[]` beats a guess. One clarifying question at a time.
3. **Safe by construction.** Every dose passes `agronomic-safety`; every string passes `content-safety`; self-harm signals are detected, never blocked or deleted (`docs/safeguarding-protocol.md`).
4. **Works where the farmer is.** Capture is bulletproof offline; nothing captured is ever lost or silently dropped (`docs/offline-matrix.md`).
5. **Close the loop.** T+48h outcome capture on every recommendation, written to the outcome ledger.
6. **Expand by data, not code.** Crop #7, language #7, district #N — zero code changes (`packs/`).
7. **Lawful and honest.** DPDP consent, export, deletion; Play Data Safety matches the pipeline exactly.

## 5. Solution

Single Android APK (Kotlin + Compose, `targetSdk 36`), role resolved at login, plus backend agents and three web consoles.

**Farmer flow (P1):** guided 3-image capture + optional voice note at the field → queued offline → on sync: triage → clarification (if needed) → diagnosis → treatment → agronomic-safety veto → diagnosis card (what / why / when / dose / precautions / alternatives), spoken and shown → action confirm → T+48h outcome. Low confidence or any veto routes to the expert console.

**Architecture in one line:** one agent, one decision; agents are stateless and never call each other; the orchestrator sequences; only `context` writes to the farm graph; skills are deterministic where safety demands it (`dose-math`, `readback`); crops, languages, regions come from packs; providers sit behind gateways. Full catalog: `docs/agent-contracts.md` §5. Tree and locked decisions: `docs/project-structure.md`.

## 6. Moat (strategic judgment — not a design-doc claim)

> Strategic judgment. Each bullet traces to a locked decision; calling them a moat is a business judgment made by the founders.

What compounds, and is hard to copy:

- **Per-farmer farm graph with an outcome ledger.** Every case records what was recommended, whether the farmer did it, and what happened. Advice improves on evidence from this network, not on generic training data.
- **Eval-gated agronomy.** Per-agent golden sets, labelled by named people, with a hard block on any rise in false-confident rate. Correctness is a CI gate, not a promise.
- **Voice-native in five Indic languages, code-mix tolerant, human-authored uncertainty and safety phrasing** — built for the farmer who cannot read, not retrofitted.
- **Field presence.** Founder's 200-farmer network and a 10-person expert team give labelled cases, outcome follow-ups, and the usage-context knowledge competitors design around wrongly.
- **Recommendation locked before commerce.** Brands never appear in packs or agents; dealer availability surfaces only after the recommendation is fixed. Trust is the product.
- **Distribution.** The cofounder's hybrid-seed network across five states, giving day-one access to farmers, dealers and FPOs.

## 7. Scope

| In MVP (P1) | Fast-follow (P1.5) | Later (P2) | Out |
|---|---|---|---|
| Farmer end-to-end: onboarding, home, capture → diagnosis card, crop timeline, weather→action, outcome, image library + slots | Dealer in full; counter mode may pull forward | Harvest, aggregation, market, schemes | Lending, iOS |
| FPO member list + cluster alerts | Irrigation, memory, variety, input-match, demand-forecast agents | Full FPO dashboard | Commercial recommendation layer |
| Chilli, tomato, okra · te, ta, kn, mr, hi (+ en pre-login / transcript toggle) | Cotton, soybean packs | Seed production module (schema must support grower contract now) | |
| Expert, authoring, admin consoles · per-agent eval harness in CI · safeguarding surface · DPDP consent/export/delete · Play Billing for image slots | Observability, PII redaction | Market-data skill | |

Canonical scope and still-open questions: `docs/project-structure.md` §3, §6.

## 8. Success measures

> Proposed. Only false-confident rate (CI hard block) and cost per resolved query (`observability.md`) exist in the repo today. The other five are proposals with no agreed thresholds. Thresholds to be set from the first field cohort. Canonical home: `docs/eval-strategy.md` once written.

| Measure | Why it matters |
|---|---|
| **Resolved-query rate** (proposed) — cases that reach an accepted recommendation without expert escalation | Is the agent stack good enough to carry load |
| **Outcome "better" rate at T+48h** (proposed), per crop, per agent version | Did the advice actually work |
| **False-confident rate** — high-band recommendations later marked wrong | The one metric that is a hard CI block; must never rise |
| **Capture-to-answer time** (proposed), including offline queue | Does the answer arrive while it is still actionable |
| **Voice completion rate** (proposed) — cases completed without typing or a helper | Is voice-first real for non-literate farmers |
| **Cost per resolved query** | Sustainable at smallholder economics |
| **Zero safety incidents** (proposed) — no unvetoed unsafe dose, no blocked safeguarding signal | Non-negotiable, not a target |

---

Figures cited in `docs/design.md`. Sections marked founder-set or proposed are judgments, not findings.
