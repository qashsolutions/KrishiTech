# speech — reference

> THE source of truth for provider specifics: model IDs, versions, modes, limits, audio formats. Interaction consequences live in `docs/voice-design.md`; common use will live in `SKILL.md` (to be written from `skills/_template/`).
> Every vendor fact here carries a source URL. Official API docs win over marketing pages.

## Provider

Sarvam, via `backend/gateways/`. Model ID strings appear only in this file and `backend/gateways/` (CI gate, `docs/project-structure.md` §4).

## Sources

- TTS — Bulbul: https://docs.sarvam.ai/api/getting-started/models/bulbul
- STT — Saaras: https://docs.sarvam.ai/api/getting-started/models/saaras

Facts below were verified against these pages on 2026-08-22 (moved here from `docs/voice-design.md`). Re-verify on any provider version change.

## Model IDs and endpoints

Every row below **must be confirmed in the Sarvam playground before the first API call** — recorded from the founder's notes, not yet exercised.

| Direction | Model ID | Endpoint | Status |
|---|---|---|---|
| TTS | `bulbul:v3` | `/text-to-speech` | confirm in playground |
| STT — default | `saaras:v3` | `/speech-to-text` | confirm in playground |
| STT — latest | `saaras:v4` | `/speech-to-text` | confirm in playground |
| **Legacy — do not use** | `saaras:v2.5` | `/speech-to-text-translate` | do not use |

- **Base URL:** TODO — confirm in the Sarvam dashboard. Do not guess.
- Sources: see Sources above; model IDs appear only here and in `backend/gateways/` (CI gate).

## TTS — Bulbul

| Fact | Value | Source |
|---|---|---|
| Language coverage | All six of our languages (te, ta, kn, mr, hi, en) | [bulbul](https://docs.sarvam.ai/api/getting-started/models/bulbul) |
| SSML | Not supported. Pacing via `pace` (0.5–2.0) and by splitting text at natural pause points | [bulbul](https://docs.sarvam.ai/api/getting-started/models/bulbul) |
| Input script | Romanised Indic input significantly degrades output. Indic in native script; code-switched English in Latin | [bulbul](https://docs.sarvam.ai/api/getting-started/models/bulbul) |
| Streaming sample rate | HTTP and WebSocket streaming capped at 24 kHz; 32 / 44.1 / 48 kHz are REST-only | [bulbul](https://docs.sarvam.ai/api/getting-started/models/bulbul) |
| Request size | Max 2,500 characters per REST request | [bulbul](https://docs.sarvam.ai/api/getting-started/models/bulbul) |

## STT — Saaras

| Fact | Value | Source |
|---|---|---|
| Language coverage | All six of our languages | [saaras](https://docs.sarvam.ai/api/getting-started/models/saaras) |
| Output modes (`mode`) | `transcribe` · `translate` · `verbatim` · `translit` · `codemix`. `translate` always outputs English regardless of input language | [saaras](https://docs.sarvam.ai/api/getting-started/models/saaras) |
| Audio length | REST caps audio at 30 s; longer audio goes to the batch path (up to 2 hr per file) | [saaras](https://docs.sarvam.ai/api/getting-started/models/saaras) |
| Raw PCM input | 16 kHz only, codec declared | [saaras](https://docs.sarvam.ai/api/getting-started/models/saaras) |
| Language detection | Response carries `language_code` + `language_probability`. Low probability → confirm the language, never proceed on a guess | [saaras](https://docs.sarvam.ai/api/getting-started/models/saaras) |
| Timestamps | Chunk-level only; word-level unsupported | [saaras](https://docs.sarvam.ai/api/getting-started/models/saaras) |

## Still to record

- `SKILL.md` from `skills/_template/` (nine sections).
- `voices.md` — chosen speaker and pace per language (`skills/README.md` §4).
- `code-mixing.md` — expected mixed-input patterns per language.
