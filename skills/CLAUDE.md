# skills/ — local rules

Shared, stateless capabilities. Agents decide; skills do work.
Root `CLAUDE.md` holds the non-negotiables. This file adds only what is local to `skills/`.

**Before creating a skill:** read `skills/README.md`. Copy `skills/_template/`.

## The test before you add anything here

| Ask | Skill | Agent |
|---|---|---|
| Does it make a judgement the system is accountable for? | No | Yes |
| Could two different agents reuse it unchanged? | Yes | No |
| Does it have an opinion? | No | Yes |

Extracting "upward leaf curl, silvering" is a skill. Concluding "this is thrips" is an agent.

## Local rules

- Skills are leaves. No skill calls an agent. No skill calls another skill — the agent composes them.
- Stateless and side-effect free unless `SKILL.md` §6 declares otherwise.
- Uniform return: `{result, confidence, provenance, cost_ms, cost_units}`.
- No provider SDK calls. Everything goes through `backend/gateways/`.
- Prefer computation over model calls. A deterministic skill is a better skill.
- Add the row to `skills/README.md` §2 in the same PR, with phase and safety flag.

## Safety-critical skills

`content-safety`, `dose-math`, `readback`, `vision` (domain gate), `retrieval`, `uncertainty`.
Changes require a red-team eval set, two-person review, and a kill switch.

## Never

- Machine-translate uncertainty or safety phrasing. Human-authored per language, always.
- Return a plausible fabrication instead of an error.
