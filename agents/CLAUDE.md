# agents/ — local rules

Root `CLAUDE.md` holds the non-negotiables. This file adds only what is local to `agents/`.

**Before creating an agent:** read `docs/agent-contracts.md`. Copy `agents/_template/`.
**Before editing an agent:** read its `AGENT.md`, especially §3 "Must not".

## Local rules

- `AGENT.md` is written **before** any implementation. Nine sections, no placeholders left.
- Every agent returns the uniform `AgentResponse`. No custom shapes.
- Degraded behaviour is implemented and tested, not merely documented.
- `manifest.yaml` must validate, and the catalog table in `docs/agent-contracts.md` must be updated in the same PR.

## Reference implementation

`agents/diagnosis/` is the worked exemplar. Match its structure and level of detail.

## Never

- Collapse diagnosis into treatment. They are separate for a reason — a wrong diagnosis must not silently produce a confident dose.
