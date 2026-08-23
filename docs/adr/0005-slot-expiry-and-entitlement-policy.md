# 0005 — Paid slot expiry and entitlement policy records

**Status:** accepted
**Date:** 2026-08-22

## Context

Image slots are sold in bundles through Google Play Billing as consumables. Play Billing
verifies and grants the purchase; it does not manage expiry, forfeiture, or grace. That
logic is ours. `docs/project-structure.md` §6 listed the expiry rule as open, blocking
the `quota` service.

## Decision

- Purchased slot bundles **expire one year from the date of purchase**.
- Unused slots are **forfeited at expiry**.
- A **30-day grace extension** is available, controlled server-side.
- Expiry and grace are governed by an **entitlement policy record**, not a global
  configuration flag:
  - Each policy row carries an effective-from date, a validity period, a grace period,
    and a forfeiture rule.
  - Every purchase is stamped with the **policy ID in force at the moment of sale**.
  - Changing policy creates a new row. It never mutates an existing one.
- The **client never computes expiry.** The server returns the slot balance, the expiry
  date, and whether grace applies. The app renders what it is told.

## Consequences

- Toggling grace affects new purchases only. Extending grace retroactively becomes a
  deliberate, auditable action against named purchases rather than a side effect of
  editing a config value.
- The question "what were the terms when this farmer bought?" is always answerable. With
  a single mutable flag it would not be.
- Because expiry is server-computed, changing the rule requires no Play release —
  consistent with the locked requirement that policy changes ship without shipping the
  app.
- The app must display the expiry date and warn before it is reached. An expiry the
  farmer cannot see in advance is a support problem and a Play review risk.
- The `quota` service now has two clocks per farmer: slot balance and slot expiry. Both
  belong in the same projection.

## Alternatives considered

- **No expiry.** Rejected. An unbounded liability on the balance sheet and no
  forcing function for re-purchase.
- **A single mutable `grace_days` value.** Rejected — see Consequences. This was the
  obvious implementation and is the reason this ADR exists.
- **Client-side expiry computation.** Rejected. Puts the rule behind a Play release and
  makes device clock skew an entitlement bug.
