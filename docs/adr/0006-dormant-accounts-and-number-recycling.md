# 0006 — Dormant accounts and recycled phone numbers

**Status:** accepted
**Date:** 2026-08-22

## Context

Identity is locked as **phone number = person** (`docs/identity.md`). Indian mobile
numbers are disconnected and reissued to new subscribers, so a number that identified
one farmer can later belong to someone else. Without a release rule, a new holder could
inherit another person's farm history; with too aggressive a rule, an active but
seasonal user loses theirs.

This app is seasonal. A chilli grower between seasons may not open it for weeks while
remaining a completely active user. Inactivity is therefore weak evidence of
abandonment.

## Decision

Two clocks, decoupled:

- **45 days of inactivity → re-engagement flag.** Internal only. Triggers outreach. No
  effect on the account.
- **90 days of inactivity → release candidate.** The account is not released on silence
  alone; release additionally requires a **failed re-verification** of the number.
- On release: the identity is detached from the number. **Images and data are retained
  for a further 30 days**, then deleted.
- Both windows are governed by a **policy record** with an effective-from date, in the
  same pattern as ADR 0005. Changing the rule creates a new row.

## Consequences

- 90 days aligns with the actual telecom recycling window rather than preceding it, so
  the release is triggered by roughly the same event it is meant to protect against.
- Requiring a failed re-verification means a dormant-but-real farmer keeps their history
  as long as the number is still theirs. Silence alone never destroys data.
- The 30-day post-release retention gives a recovery path for a farmer who returns just
  after release, and a window for any dispute.
- Two clocks mean two projections in the identity service, and re-engagement messaging
  must respect quiet hours (S-26).
- Retention periods here must be reflected in the `privacy-dpdp.md` retention table and
  in the Play Data Safety declaration. They must match exactly.

## Alternatives considered

- **45-day release.** Rejected. Ahead of the telco recycling window, and plausibly
  shorter than a genuine off-season gap for a seasonal user.
- **Release on inactivity alone, no re-verification.** Rejected. Makes silence
  destructive.
- **Never release.** Rejected. A reissued number would eventually let a stranger into
  another person's farm record.

## Open

The telecom recycling window and the DPDP retention position were both asserted from
general knowledge, not verified at the time of writing. Confirm the current position on
each before implementation; if either differs materially, revise the 90/30 figures via a
new policy record rather than editing this ADR.
