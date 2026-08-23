# CLAUDE.md

Agentic agriculture platform for India. Android app (farmer, dealer, FPO) + backend agents + web consoles.
Voice-first, offline-tolerant, multilingual.

This file is a router, not a spec. Read the linked doc before doing the work.

---

## Commands

<!-- PLACEHOLDER — replace with the real commands before first use. A wrong command here is worse than none. -->

```
<setup>             install deps, seed local env
<test>              unit + contract tests
<eval AGENT=x>      run golden set for one agent
<eval-all>          full eval suite (required before any agent merge)
<lint>              schema + policy checks
<android>           build debug APK
```

---

## Read before you build

Working in `agents/`, `skills/`, or `packs/`? Read that folder's `CLAUDE.md` first — nested files load only on access and are not restored after compaction.

| Task touches | Read first |
|---|---|
| An agent | `docs/agent-contracts.md`, then that agent's `AGENT.md` |
| A skill | `skills/README.md`, then that skill's `SKILL.md` |
| Crop, pest, dose, or stage | `docs/safety-agronomic.md` + the crop pack |
| Anything a user reads, hears, or types | `docs/safety-content.md` |
| Distress or self-harm signals | `docs/safeguarding-protocol.md` — read fully, do not improvise |
| A screen or navigation | `docs/navigation-ia.md`, `docs/voice-design.md` |
| Storing, sharing, or deleting user data | `docs/privacy-dpdp.md`, `docs/role-permissions.md` |
| A new language or region | `packs/languages/`, `packs/regions/` |

No doc covers it? Write an ADR in `docs/adr/` before writing code.

---

## Non-negotiable

1. No dose reaches a user without passing `agronomic-safety`.
2. No text enters or leaves the system without passing `content-safety`. No bypass flag, no trusted caller, no admin override.
3. Self-harm signals are never silently blocked or deleted. Follow `docs/safeguarding-protocol.md`.
4. `dose-math` and `readback` are deterministic. Never a model call.
5. Never fabricate to fill a gap. Return `insufficient_input` with `needs[]`.
6. One agent, one decision. Agents never call agents; only the orchestrator sequences.
7. Only `context` writes to the farm graph.
8. Confidence comes from `skills/confidence`, never computed inline.
9. No crop, language, or region is hardcoded — it comes from a pack. Brands are never hardcoded and never in packs; they come from `input-match`.
10. Never edit a golden set to make a test pass.
11. Never present your own synthesis as established fact. Any claim in a doc that is not traceable to another doc, a pack reference, or a cited source must carry a provenance label — see the writing rules in `docs/README.md`.

---

## Stop and ask

- Any change to a safety rule, threshold, or veto condition
- Any new field that is or derives from personal data
- Any change to what one role can see about another
- Any agronomic claim not backed by a pack reference
- A new dependency, provider, or third-party service
- Any change to the safeguarding protocol
- Merging two agents, or giving one agent a second responsibility (collapsing diagnosis into treatment is never permitted — see `agents/CLAUDE.md`)
