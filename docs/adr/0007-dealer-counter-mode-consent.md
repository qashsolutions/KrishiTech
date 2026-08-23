# 0007 — Dealer counter-mode consent at group join

**Status:** accepted
**Date:** 2026-08-22

## Context

Counter mode (D-05) is the screen a dealer opens while a farmer is physically at the
counter, to see that farmer's record and advise or sell against it. The open question
was the grain of consent: does the farmer approve each lookup, or once?

Per-lookup approval is the stronger privacy posture in the abstract. Field experience
argues otherwise: the moment of use is exactly the moment approval is least likely to
work — the farmer's phone may be flat, lent out, or simply not in hand, and the
interaction stalls in front of a queue. The same field experience is that dealers are
mostly tracking money owed, kept on paper, and are not seeking agronomic history.

## Decision

- Consent is granted **once, when the dealer first adds the farmer to their group**. The
  farmer approves that request explicitly. There is no per-lookup prompt.
- **Default scope is minimum.** The dealer sees only what the relationship requires, not
  full diagnosis history. Scope widens only if field use demonstrates the need.
- **Every lookup is logged append-only and is visible to the farmer.**
- The farmer can **revoke the dealer relationship in one tap**, which ends access
  immediately.

## Consequences

- Counter mode works at the counter, which is the only place it is used.
- Consent attaches to a relationship the farmer understands — "this dealer is in my
  list" — rather than to an abstract per-event permission.
- Blanket consent to a commercial party with a selling incentive is a real exposure. The
  three mitigations above are what make it defensible: narrow default scope, visible
  log, one-tap revoke. They are not optional extras to this decision.
- Starting narrow is deliberate. Widening scope later is easy; narrowing it after
  dealers have built habits around richer data is not.
- The lookup log is a strong DPDP answer and should be referenced from
  `docs/privacy-dpdp.md`.
- `docs/role-permissions.md` must carry the scope table explicitly. A dealer's access to
  a farmer must be enforced at the query layer, not implied by a join.

## Alternatives considered

- **Per-lookup approval with a short-lived token on the farmer's phone.** This was the
  initial recommendation and was rejected on field evidence: it fails precisely when
  needed, and it degrades to the dealer asking the farmer to hand over their phone —
  worse than the thing it was protecting against.
- **No consent at all, dealer sees any farmer.** Rejected outright.
- **Consent per session rather than per lookup.** Rejected as a halfway position with
  the failure mode of per-lookup and the exposure of blanket.
