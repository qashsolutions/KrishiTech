# CLAUDE.md

Agentic agriculture platform for India. Android app (farmer, dealer, FPO) + backend agents + web consoles.
Voice-first, offline-tolerant, multilingual.

This file is a router, not a spec. Read the linked doc before doing the work.

---

## Commands

All commands run from the repo root. `make` is the single entry point — if a task is
not a make target, it is not a standard task.

Targets marked `[not yet built]` do not exist yet. They are named so the gap is
visible. Remove the marker as each lands; do not remove the target.

### Setup

    make setup              Install all toolchains: uv sync, gradle wrapper, hooks
    make doctor             Verify local environment matches CI [not yet built]

### Backend (Python 3.12, FastAPI — ADR 0004)

    make api                Run the api service locally on :8080
    make inference          Run the inference service locally on :8081
    make api-test           pytest, api service only
    make inference-test     pytest, inference service only

### Android (Kotlin + Compose, targetSdk 36)

    make android-build      Assemble debug APK
    make android-test       Unit tests
    make android-lint       Android lint + ktlint

### Quality — run before every commit

    make fmt                ruff format + ktlint format
    make lint               ruff check + mypy strict + ktlint
    make test               Every test suite
    make check              fmt + lint + test. Run before every commit.

### Packs

    make pack-validate      Validate every pack against packs/schema/ [not yet built]
    make pack-approver      Fail any pack without a recorded approver [not yet built]
    make pack-diff          Show which agents a pack change affects [not yet built]

### Agents and evals

    make agent-validate     manifest.yaml schema + AGENT.md nine sections [not yet built]
    make eval               Run every agent's golden set [not yet built]
    make eval-agent AGENT=diagnosis
                            Run one agent's golden set [not yet built]

### CI gates — docs/project-structure.md section 4

    make gate-manifest      manifest.yaml validates [not yet built]
    make gate-sections      No AGENT.md missing a section or holding a placeholder [not yet built]
    make gate-goldenset     No agent without a golden set [not yet built]
    make gate-frontmatter   No SKILL.md without valid YAML frontmatter [not yet built]
    make gate-gateways      No provider SDK import outside gateways/ [not yet built]
    make gate-strings       No user-facing string outside a language pack [not yet built]
    make gate-approver      No pack edit without a recorded approver [not yet built]
    make gate-evals         No pack change without dependent evals re-run [not yet built]
    make gate-confidence    Hard block on any rise in false-confident rate [not yet built]
    make gate-sdk           Fail if targetSdk < 36 [not yet built]

    make gates              Every gate above.
    CI runs `make check` then `make gates` on every PR. Both must pass.

### Deploy

    make deploy-api         Cloud Run, asia-south1 [not yet built]
    make deploy-inference   Cloud Run, asia-south1 [not yet built]

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
