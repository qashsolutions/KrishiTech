# 0002 — Farmer-facing English toggle

**Status:** accepted
**Date:** 2026-08-22

## Context

Many farmers read basic English. Usage is largely at home, where a literate family member may read the screen (`0001-usage-context.md`). `mode="translate"` is one parameter on the same audio, so the cost is near zero.

## Decision

The English transcript toggle is available to all roles, including farmers. It is display-only: all speech stays in the farmer's chosen language, always — the toggle exists so a literate person can read the screen; the audio is for the farmer. Mixed-language audio would confuse both. This is a deliberate design choice, not a technical limitation.

## Consequences

- Display-only; speech stays in the farmer's language (`docs/voice-design.md`).
- `en-IN` pack scope grows: agro-glossary terms for translate-mode rendering (`docs/project-structure.md` §2).
- New persisted user preference: transcript language preference (`docs/privacy-dpdp.md`).
- Toggle lives inline on every transcript view and as a default in S-21 (`docs/navigation-ia.md` §9).

## Alternatives considered

- Scoping the toggle to assisted mode and the expert console only — rejected because it assumed a field-alone usage pattern that does not match reality (`0001-usage-context.md`).
