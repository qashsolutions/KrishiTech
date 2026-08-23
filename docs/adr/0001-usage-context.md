# 0001 — Usage context

**Status:** accepted
**Date:** 2026-08-22

## Context

Founder's field knowledge of the 200-farmer network.

## Decision

Two-location flow — capture at the farm on poor connectivity, consumption at home or a village centre, often with a literate family member. Recorded as a locked decision in `docs/project-structure.md` §1.

## Consequences

- Capture paths bulletproof offline (`docs/offline-matrix.md`).
- Consumption may assume connectivity — a priority statement, not a reduction of any offline capability.
- Informal assistance is expected, not an edge case (`docs/navigation-ia.md`, F-04 note).
- Evening notification bias (`docs/voice-design.md`).
- Bystander visibility must be designed for (`docs/role-permissions.md`; S-42 in `docs/navigation-ia.md`).

## Alternatives considered

- Field-only usage: assume all interaction happens at the farm on poor connectivity, with the farmer alone. Rejected — does not match the founder's field knowledge, and it would have produced an over-terse UI and scoped out the English toggle.
