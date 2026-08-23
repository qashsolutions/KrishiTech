# 0009 — Cotton and soybean deferred to P2

**Status:** accepted
**Date:** 2026-08-22

## Context

`packs/CLAUDE.md` defines two crop families. Family A — chilli, tomato, okra — are short
cycle, transplanted, multi-pick vegetables where PHI and re-entry dominate. Family B —
cotton and soybean — are long cycle, direct-sown field crops that activate the weed
module, with cotton additionally activating resistance management and Bt refuge rules.

Family A has a named agronomist author and approver (Naren Solanki, interim single
signature per `packs/CLAUDE.md`). **Family B has nobody named.** Every crop pack requires
a named author and a recorded approver, and CI fails a pack without one.

## Decision

Cotton and soybean are **P2**. They are not authored, evaluated, or shipped in P1 or
P1.5.

## Consequences

- No second agronomist is needed on the P1 critical path. This was the binding
  constraint: pack authoring is gated on human availability, not on engineering.
- The pack schema must still be designed to accommodate Family B from the start. The
  `family` field selects which optional modules activate; the schema is never forked per
  crop. Deferring the packs does not defer the schema shape.
- The weed, resistance-management and Bt-refuge modules remain unexercised until P2.
  They should be declared in the schema and left unpopulated rather than omitted.
- Naren's scope stays chilli, tomato and okra. Family B authorship is an open staffing
  question with a long lead time, and should be started well before P2 rather than at
  it.

## Alternatives considered

- **Cotton and soybean at launch.** Rejected. Would require identifying and onboarding a
  second agronomist immediately, on the same critical path as the first three packs, for
  crops outside the initial launch geography's priority set.
- **Cotton only, deferring soybean.** Rejected. Cotton is the more complex of the two —
  it alone activates resistance management and Bt refuge rules — so it is the wrong one
  to pull forward.
