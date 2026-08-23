# Voice Design

Mic behaviour, hold vs tap, barge-in, readback rules, replay, failure speech, audio nav labels.

> Status: partial — transcript display, notification timing and verified speech constraints recorded below; all other sections not yet written

---

## Mic behaviour

> Scope: mic behaviour — hold vs tap, barge-in semantics, readback rules, replay,
> failure speech — is owned here (section not yet written). Visual, haptic and
> audio-cue tokens for each mic state are owned by `docs/design-system.md` §5.
> If the two disagree about behaviour, this file wins. If they disagree about a
> colour, duration or size, design-system.md wins.

## Transcript display

> Founder-set. Usage assumptions here (Indic keyboard editing is slow; re-record is the natural correction) are field knowledge of the founder's 200-farmer network.

- **Default farmer-facing transcript:** `mode="codemix"` — Indic in native script, English words in Latin script. Matches how farmers speak.
- **English toggle — available to all roles, including farmers.** Uses `mode="translate"`. Placement and default state: `docs/navigation-ia.md` §9.
- **Display-only.** All speech stays in the farmer's chosen language, always. A deliberate design choice, not a technical limitation — reasoning in `docs/adr/0002-farmer-facing-english-toggle.md`.
- **Scope of translate mode.** `mode="translate"` applies to the farmer's transcript only. All system-authored text shown in English — uncertainty phrasing, safety phrasing, UI strings — comes from the `en-IN` pack, human-authored, never machine-translated and never a string literal.
- **Primary correction path is re-record** ("say it again"). Text editing is secondary — editing Indic text on a phone keyboard is slow.
- **Also read back the interpretation for confirmation, not just the transcript:** "You said the chilli leaves are curling upward. Correct?" This is interpretation confirmation — distinct from the deterministic numeric `readback` skill (root `CLAUDE.md` #4).
- Both modes come from the same audio; no second recording is needed.

## Notification timing

Favour evening delivery, when the farmer is likely at home (usage context, `docs/project-structure.md` §1). Confirm with field data before hardcoding. Evening delivery must respect the farmer's configured quiet hours (S-26). Quiet hours always win.

## Speech constraints — interaction consequences

Vendor facts (languages, limits, modes, sample rates, model IDs) live in `skills/speech/reference.md` with source URLs — never here. This section records only what those facts force on the interaction. They survive a provider swap. STT and TTS are opposite directions — the speech skill needs both.

- **No SSML.** Pacing is controlled by a numeric pace setting and by splitting text at natural pause points. Never emit SSML tags.
- **Native script only.** Romanised Indic degrades TTS quality, so every Indic string **must** be in native script before reaching TTS; code-switched English words stay in Latin. Binds the `rendering` skill and every language pack (`packs/CLAUDE.md`).
- **Long answers are chunked.** TTS has a per-request character cap; `rendering` splits at pause points so nothing is truncated mid-sentence.
- **Long voice notes take the batch path.** Real-time STT caps short audio; longer farmer voice notes **must** be chunked or routed to batch — the transcript may arrive after the capture acknowledgement, and never blocks capture (`docs/offline-matrix.md`).
- **Low language probability is a trigger.** STT reports a detected language with a probability; when it is low, confirm the language rather than proceeding on a guess.
- **No word-level highlighting.** Timestamps are chunk-level only; the transcript view does not highlight word by word.
