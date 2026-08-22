# Voice Design

Mic behaviour, hold vs tap, barge-in, readback rules, replay, failure speech, audio nav labels.

> Status: partial — transcript display and notification timing recorded below; all other sections not yet written

---

## Transcript display

- **Default farmer-facing transcript:** `mode="codemix"` — Indic in native script, English words in Latin script. Matches how farmers speak.
- **English toggle — available to all roles, including farmers.** Uses `mode="translate"`. Persist the choice per user; default off. Placement: `docs/navigation-ia.md` §9.
- **Display-only.** All speech stays in the farmer's chosen language, always. A deliberate design choice, not a technical limitation — reasoning in `docs/adr/0002-farmer-facing-english-toggle.md`.
- **Scope of translate mode.** `mode="translate"` applies to the farmer's transcript only. All system-authored text shown in English — uncertainty phrasing, safety phrasing, UI strings — comes from the `en-IN` pack, human-authored, never machine-translated and never a string literal.
- **Primary correction path is re-record** ("say it again"). Text editing is secondary — editing Indic text on a phone keyboard is slow.
- **Also read back the interpretation for confirmation, not just the transcript:** "You said the chilli leaves are curling upward. Correct?" This is interpretation confirmation — distinct from the deterministic numeric `readback` skill (root `CLAUDE.md` #4).
- Both modes come from the same audio; no second recording is needed.

## Notification timing

Favour evening delivery, when the farmer is likely at home (usage context, `docs/project-structure.md` §1). Confirm with field data before hardcoding. Evening delivery must respect the farmer's configured quiet hours (S-26). Quiet hours always win.
