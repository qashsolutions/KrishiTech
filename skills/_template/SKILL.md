---
name: skill-name
description: What this skill does and when to use it. Be explicit about trigger conditions — the agent reads this to decide whether the skill is relevant. Max 1024 chars.
---

# Skill: <skill-name>

<!--
COPY THIS FOLDER to create a new skill.
FIRST: confirm it is a capability, not a decision. Decisions are agents. See skills/README.md §6.
SECOND: confirm no existing skill already covers it.
All nine sections mandatory. This file must be sufficient for correct use in the common case —
if callers routinely need reference.md, this file is inadequate.
-->

## 1. Purpose

<!-- One sentence. What work does it do? -->

## 2. When to invoke / when not to

**Invoke when:**
**Do not invoke when:** <!-- name the skill or agent that handles that case instead -->

## 3. Inputs

| Param | Type | Required | Default | Notes |
|---|---|---|---|---|
| | | | | |

<!-- No hardcoded crop, language, region, or brand. Crop, language, and region arrive as parameters from packs. Brands are never in packs; they come from `input-match`. -->

## 4. Output

```json
{
  "result": null,
  "confidence": 0.0,
  "provenance": [],
  "cost_ms": 0,
  "cost_units": 0
}
```

## 5. Failure modes

| Failure | Returns | User experiences |
|---|---|---|
| | | |

<!-- Fail loud, never silent. A skill that cannot do its job returns an error — never a plausible fabrication. -->

## 6. Side effects

<!-- Write "None." or enumerate them explicitly. Stateless by default. -->

## 7. Cost and latency

Typical: · p95: · Model tier:

## 8. Dependencies

**Gateways:** <!-- backend/gateways/... — never a direct provider SDK call -->
**Packs:**

## 9. Evaluation

- **Set:** `evals/golden/skills/<skill-name>/`
- **Metrics:**
- **Safety-critical?** <!-- If yes: red-team set required, two-person review on change, kill switch -->

---

## Folder contents

```
reference.md    full spec: parameters, edge cases, provider quirks, tuning
examples.md     worked input→output pairs, including failures
prompts/        versioned templates (model-backed skills only)
src/            implementation
tests/          unit + contract tests
```

## Before you merge

- [ ] Verified this is a capability, not a decision
- [ ] Verified no existing skill covers it
- [ ] Row added to the index in `skills/README.md` §2 with phase + safety flag
- [ ] Gateway dependency registered
- [ ] Eval set exists
