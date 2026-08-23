# Agent Contracts

Binding spec. Every agent in `agents/` implements this. No exceptions, no bypass flags.

---

## 1. Core principles

1. **One agent, one decision.** If the description needs two verbs, split it.
2. **Stateless.** Identical case bundle in → identical claim out. All state lives in the farm graph.
3. **Agents never call agents.** Only the orchestrator sequences. Agents call skills; skills are leaves.
4. **Only the context agent writes to the graph.** Everyone else returns a claim.
5. **Every agent degrades.** A defined, safe behaviour when inputs are missing, budget is exhausted, or a dependency fails.
6. **Every agent is independently evaluable.** No agent ships without a golden set.
7. **Content safety is not an agent's choice.** The gate runs around every agent, on input and output.

---

## 2. Uniform I/O contract

### Request

```
AgentRequest {
  request_id        string          # unique per invocation
  trace_id          string          # spans the whole case, for replay
  agent_version     string          # semver of the agent being called
  case_bundle {
    farmer_ref      id              # never raw PII
    field_ref       id
    crop_id         string
    variety_id      string?
    stage           enum?           # null if unknown — agent must handle
    sowing_date     date?
    history[]       event[]         # prior problems, actions, outcomes
    weather         forecast?       # normalised schema
    media_refs[]    id[]            # images, already domain-gated
    query           text?           # transcribed, already content-gated
    query_lang      bcp47
  }
  locale {
    language        bcp47           # te-IN, hi-IN, ...
    region          string          # district-level; drives glossary + units
  }
  budget {
    max_ms          int
    max_cost_units  int
    model_tier      enum            # small | standard | large
  }
  flags             map             # remote config
}
```

### Response

```
AgentResponse {
  status        enum        # ok | insufficient_input | low_confidence | blocked | error
  claim         object      # agent-specific typed payload, schema in the agent's AGENT.md
  confidence    float       # 0.0-1.0, from skills/confidence — never hand-rolled
  band          enum        # high | medium | low  (thresholds are global, not per-agent)
  provenance[]  {source, pack_id, pack_version, doc_ref, quote_ref}
  needs[]       string      # what would raise confidence, e.g. "clearer leaf underside photo"
  alternatives[] object     # ranked runners-up, where meaningful
  cost          {ms, units, model_used}
  safety        {content_gate: pass|block, agronomic_gate: na|pass|veto, rule_ids[]}
  degraded      bool        # true if the agent ran on partial input
}
```

**`needs[]` is mandatory when status is `insufficient_input` or `low_confidence`.** It is what the clarification agent turns into a question and what the expert console shows first.

---

## 3. Capability manifest

Every agent publishes `manifest.yaml`. The orchestrator selects by declaration — never by hardcoded call.

```yaml
id: diagnosis
version: 1.3.0
owns: "Ranked identification of the problem affecting the crop"
verb: identify
requires_skills: [vision, retrieval, confidence]
requires_packs: [crop, region]
inputs_required: [crop_id]
inputs_optional: [media_refs, query, stage, weather, history]
output_schema: ./schema/claim.json
latency_p95_ms: 4000
cost_estimate_units: 8
model_tier: large
can_veto: false
writes_to_graph: false
degraded_behavior: "Return top hypotheses from symptoms alone, band=low, needs=[photo]"
kill_switch_default: escalate_to_expert
```

---

## 4. What every `AGENT.md` must contain

Same nine sections, same order, every agent. Claude Code should refuse to scaffold an agent without all nine.

| § | Section | Content |
|---|---|---|
| 1 | Purpose | One sentence. One verb. |
| 2 | Owns | The single decision this agent is authoritative for. |
| 3 | Must not | Explicit non-responsibilities, naming the agent that owns each instead. |
| 4 | Inputs | Required vs optional; behaviour when optional fields are absent. |
| 5 | Output schema | Typed claim, with a worked example. |
| 6 | Confidence | What raises it, what lowers it, band thresholds, what `needs[]` can contain. |
| 7 | Failure & degradation | Per failure mode: what it returns, what the user hears. |
| 8 | Escalation | Conditions that force a human. Never optional for safety-relevant agents. |
| 9 | Evaluation | Golden set location, metrics, regression gate, who labels. |

---

## 5. Agent catalog

`P1` = MVP · `P1.5` = fast-follow · `P2` = later

| Agent | Phase | Owns (one verb) | Must not | Escalates when |
|---|---|---|---|---|
| orchestrator | P1 | Sequence agents and enforce budget | Judge any domain question | Budget exhausted mid-case |
| context | P1 | Read/write graph, assemble bundle | Rank, score, or advise | Graph write conflict unresolved |
| triage | P1 | Route the request | Answer the request | Ambiguous safety signal |
| clarification | P1 | Ask the one missing question | Answer, or ask more than one at a time | Two rounds fail to resolve |
| crop-stage | P1 | Infer current stage | Diagnose problems | Stage conflicts with reported symptoms |
| weather | P1 | Convert forecast to operational window | Name a product or dose | Forecast unavailable at spray decision |
| diagnosis | P1 | Rank problem hypotheses | Recommend treatment | Top-2 within confidence margin |
| treatment | P1 | Choose intervention class, dose, timing | Choose a brand | Diagnosis band is low |
| agronomic-safety | P1 | **Veto** unsafe recommendations | Generate advice | Any veto fires |
| nutrition | P1 | Stage-wise nutrient schedule | Treat pests or disease | Soil data absent and crop is sensitive |
| escalation | P1 | Package and route to human | Answer itself | Always — that is its job |
| outcome | P1 | Capture and record result | Re-advise | Outcome is "worse" |
| irrigation | P1.5 | Schedule irrigation | Decide spraying | Water source data missing |
| memory | P1.5 | Maintain farmer preference state | Advise | Never |
| variety | P1.5 | Recommend variety and seed rate | Advise post-sowing | Market-driven choice requested |
| input-match | P1.5 | Map class → SKU → local stock | Alter the recommendation | No stocked SKU satisfies the class |
| demand-forecast | P1.5 | Predict input demand | Contact farmers | Never |
| harvest | P2 | Assess maturity and grading | Advise on selling | Quality dispute |
| aggregation | P2 | Cluster members, pool demand | Diagnose | Cluster crosses outbreak threshold |
| market | P2 | Surface buyer and price signals | Advise agronomy | Price data stale |
| scheme | P2 | Determine scheme eligibility | Submit on behalf of farmer | Eligibility ambiguous |

---

## 6. The diagnosis/treatment split

The most important structural decision in this system, so it is stated explicitly:

- **diagnosis** answers *what is it*, and stops.
- **treatment** answers *what to do about it*, taking a hypothesis as input.
- **agronomic-safety** can veto either.

Reasons: a wrong diagnosis cannot silently produce a confident dose; each is separately measurable against its own golden set; treatment logic can be corrected without retraining diagnosis; and the safety gate has a clean, single object to inspect.

---

## 7. Non-negotiables

- No agent emits a dose that has not passed `agronomic-safety`.
- No agent emits text that has not passed `content-safety`.
- No agent hardcodes a crop, language, region, or brand. Packs supply crop, language, and region only. Brands are never in packs; they come from `input-match`.
- No agent calls a provider SDK directly. All provider access goes through `backend/gateways/`.
- Every agent ships with a kill switch and a defined degraded path.
- Every agent version runs in shadow against the incumbent before promotion.
