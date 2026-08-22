# Skills — Master Index

> Location in repo: `skills/README.md`
> Read this first. Load an individual skill's `SKILL.md` only when you need it, and its `reference.md` only when the summary is insufficient.

Skills are **shared, stateless capabilities**. Agents make decisions; skills do work. A skill is a leaf: it never calls an agent and never calls another skill.

---

## 1. Invariants

Binding on every skill. A skill violating any of these is broken, regardless of output quality.

1. **Stateless and side-effect free**, unless the skill's `SKILL.md` declares otherwise in a `Side effects` section.
2. **Uniform return:** `{result, confidence, provenance, cost_ms, cost_units}`.
3. **Leaves only.** No skill invokes an agent. No skill invokes another skill — if two skills need each other, the agent composes them.
4. **No hardcoded crop, language, region, or brand.** Those arrive from packs, always as parameters.
5. **No direct provider SDK calls.** Everything goes through `backend/gateways/`. Swapping Sarvam or Gemini must touch one folder.
6. **Content safety is unconditional.** Every text entering or leaving the system passes `content-safety`. There is no bypass parameter, no trusted-caller exemption, no admin override.
7. **Fail loud, not silent.** A skill that cannot do its job returns an error status. It never returns a plausible fabrication.
8. **Deterministic where possible.** Prefer lookup and computation over model calls. `dose-math` must never be a model call.

---

## 2. Skill index

| Skill | Phase | Does | Safety-critical | Model? |
|---|---|---|---|---|
| `speech` | P1 | STT and TTS via Sarvam; code-mix tolerant | — | Yes |
| `translate` | P1 | Normalise to canonical language; render back to locale | — | Yes |
| `vision` | P1 | Crop/pest image analysis, quality check, domain gate | Yes | Yes |
| `retrieval` | P1 | RAG over packs, POP, label data, with citation | Yes | Hybrid |
| `dose-math` | P1 | Area, volume, unit conversion, tank mixing | **Yes** | **No** |
| `confidence` | P1 | The single confidence scorer for the whole system | Yes | No |
| `readback` | P1 | Spoken confirmation of numbers before commit | **Yes** | No |
| `uncertainty` | P1 | Express "not sure" correctly per language | Yes | No |
| `content-safety` | P1 | Classify and act on unsafe content, all modalities | **Yes** | Hybrid |
| `rendering` | P1 | Recommendation card → text, voice, print | — | No |
| `datetime-nlu` | P1 | Spoken dates and quantities → structured values | Yes | Hybrid |
| `geo-weather` | P1 | Provider-agnostic forecast normalisation | — | No |
| `pii-redaction` | P1.5 | Strip identifiers from voice/text before storage | Yes | Hybrid |
| `market-data` | P2 | Mandi price normalisation | — | No |

**Safety-critical** skills require: a red-team eval set, two-person review on change, and a kill switch. `dose-math` and `readback` are deterministic by mandate — a hallucinated dose is the worst failure this system can produce.

---

## 3. Folder convention

```
skills/<name>/
├── SKILL.md        # What, when to invoke, I/O contract, failure modes, side effects
├── reference.md    # Full spec: parameters, edge cases, provider quirks, tuning
├── examples.md     # Worked input→output pairs, including failures
├── prompts/        # Versioned templates (model-backed skills only)
├── src/            # Implementation
└── tests/          # Unit + contract tests
```

Progressive disclosure: `SKILL.md` must be sufficient for correct use in the common case. `reference.md` exists for the hard cases. If callers routinely need `reference.md`, the `SKILL.md` is inadequate.

### Required sections in every skill's `SKILL.md`

1. Purpose — one sentence
2. When to invoke / when not to
3. Inputs — required and optional, with defaults
4. Output — typed, with an example
5. Failure modes — what it returns, and what the user experiences
6. Side effects — or explicitly "none"
7. Cost and latency — typical and p95
8. Dependencies — gateways and packs used
9. Eval — set location and metrics

---

## 4. Skills with extra sub-files

Most skills need only the standard set. These need more:

### `content-safety/`
| File | Purpose |
|---|---|
| `SKILL.md` | Category taxonomy, action matrix, six enforcement points |
| `reference.md` | Thresholds, lexicon→classifier layering, false-positive tuning |
| `safeguarding.md` | Self-harm: detect-don't-block, response template, escalation, helpline copy |
| `lexicons/<lang>.md` | Per-language terms, incl. romanized and code-mixed forms |
| `allowlist.md` | Agricultural terms that must never fire (poultry, plant anatomy, herbicide names) |
| `examples.md` | Multilingual pass/block cases with rationale |

### `speech/`
| File | Purpose |
|---|---|
| `reference.md` | Sarvam model choice per use case, streaming vs batch, audio formats |
| `voices.md` | Chosen Bulbul speaker and pace per language, with rationale |
| `code-mixing.md` | Expected mixed-input patterns per language and how they are handled |

### `retrieval/`
| File | Purpose |
|---|---|
| `reference.md` | Chunking, ranking, citation format |
| `sources.md` | Authorised corpora and their trust tier |
| `citation-rules.md` | What must be cited, and what is never asserted without a source |

### `dose-math/`
| File | Purpose |
|---|---|
| `reference.md` | Formulae, rounding rules, precision policy |
| `units.md` | Local units per region: guntha, cent, bigha, and their conversions |
| `bounds.md` | Hard min/max per intervention class — a second line of defence behind `agronomic-safety` |

### `uncertainty/`
| File | Purpose |
|---|---|
| `phrasing/<lang>.md` | Approved phrasings for low confidence, human-reviewed per language |

Machine-translating uncertainty phrasing is prohibited. "I am not sure" rendered badly reads as either false confidence or total incompetence, and both cost trust.

---

## 5. Adding a new skill

1. Confirm it is a capability, not a decision. Decisions are agents.
2. Confirm no existing skill covers it. Two skills doing similar work is the failure mode this index exists to prevent.
3. Copy `skills/_template/`.
4. Write `SKILL.md` first — all nine sections — before any implementation.
5. Add the row to §2 of this file, including phase and safety-critical flag.
6. Register any new gateway dependency in `backend/gateways/`.
7. Ship with an eval set. No golden set, no merge.

---

## 6. Skill vs agent — the test

| Ask | Skill | Agent |
|---|---|---|
| Does it make a judgement the system is accountable for? | No | Yes |
| Could two different agents reuse it unchanged? | Yes | No |
| Does it need the farm graph? | No | Sometimes |
| Does it have an opinion? | No | Yes |

`vision` extracting "upward leaf curl, silvering" is a skill. Concluding "this is thrips" is an agent.
