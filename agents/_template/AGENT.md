# Agent: <agent-id>

<!--
COPY THIS FOLDER to create a new agent. Fill every section before writing code.
All nine sections are mandatory. CI fails if any heading is missing or left as a placeholder.
Worked reference: agents/diagnosis/AGENT.md
-->

## 1. Purpose

<!-- One sentence. ONE verb. If you need "and", this is two agents. -->

## 2. Owns

<!-- The single decision this agent is authoritative for. Nothing else in the system may assert it. -->

## 3. Must not

<!-- Every excluded responsibility MUST name the agent that owns it instead. This section prevents scope creep. -->

| Does not do | Owned by |
|---|---|
| | |

## 4. Inputs

**Required:** `<field>`

**Optional — state the degradation for each:**

| Input | Absent → |
|---|---|
| | |

**All optional inputs absent →** <!-- return insufficient_input, or a defined safe default. Never guess. -->

## 5. Output schema

<!-- Typed claim + a worked example. Full schema in ./schema/claim.json -->

```json
{
}
```

## 6. Confidence

<!-- Scored by skills/confidence ONLY. Never compute inline. Bands are global, set in docs/adr/0003-confidence-thresholds.md — point there, never restate the numbers -->

**Raises:**
**Lowers:**
**Forced low regardless of score:**
**Valid `needs[]` values:**

## 7. Failure and degradation

| Failure | Returns | User experiences |
|---|---|---|
| Dependency unavailable | | |
| Budget exceeded | | |
| Kill switch on | | |

## 8. Escalation

<!-- Conditions that force a human. Mandatory for any safety-relevant agent. Escalation is a hand-off, never a dead end — say what the user is told. -->

## 9. Evaluation

- **Golden set:** `evals/golden/<agent-id>/` — minimum size, source, named labeller
- **Metrics:**
- **Regression gate:** <!-- what blocks merge. false-confident rate is a hard block for any advisory agent -->
- **Slices:** <!-- per crop / language / region / input quality -->

---

## Folder contents

```
manifest.yaml       capability declaration read by the orchestrator
schema/claim.json   output contract
prompts/            versioned templates, one per model tier
src/                implementation
tests/              unit + contract tests
eval/               runner config, pointer to golden set
CHANGELOG.md        every version, with its eval delta
```
