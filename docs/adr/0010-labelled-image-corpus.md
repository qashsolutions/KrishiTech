# 0010 — Labelled image corpus from day one

**Status:** proposed
**Date:** 2026-08-22

> This ADR was not requested. It is raised because ADR 0004 records an intent that
> nothing in P1 currently delivers. Accept, reject, or amend.

## Context

ADR 0004 states the long-term intent to shift image analysis away from model calls and
toward deterministic computer vision. That transition is not a code change. It requires
a labelled corpus: farmer photographs paired with the confirmed problem, in sufficient
volume, with the look-alikes represented.

Nothing in the current P1 scope produces that corpus. Images are captured and diagnoses
are produced, but the two are not necessarily persisted as a linked, labelled pair with
a confirmed outcome.

## Decision (proposed)

From P1, every farmer image is stored with:

- The **Problem ID** eventually confirmed for that case, drawn from the crop pack.
- Who confirmed it and how — agent, expert console review, or farmer-reported outcome —
  and the confidence attached.
- Capture conditions available at no extra cost: crop, variety, growth stage, district,
  date.
- An explicit **unconfirmed** state, which is a valid and expected label.

Confusion pairs declared in the crop pack are treated as **hard-negative classes** and
tracked as such, not merged into the general pool.

## Consequences

- The expert console becomes the labelling surface as well as the escalation surface.
  Its review flow must capture a Problem ID, not free text.
- Consent and retention for training use must be explicit and separable from
  operational retention. A farmer who deletes their account must be able to have their
  images excluded from the corpus, which means the corpus cannot be an unlinked dump.
  This interacts directly with ADR 0006 and with the Play Data Safety declaration.
- Storage cost rises earlier than it otherwise would.
- Without this, P2 begins with a year of unlabelled photographs and no path to
  deterministic CV — the corpus cannot be reconstructed after the fact, because the
  confirmed outcome is only knowable at the time.

## Alternatives considered

- **Start labelling at P2.** Rejected as the thing this ADR exists to prevent: the
  label is only available at the moment of confirmation and cannot be recovered later.
- **Label a sample rather than everything.** Possible, and cheaper. Rejected as the
  default because the confusion pairs — the cases that matter most — are by definition
  the rare and ambiguous ones a sample would under-represent.
