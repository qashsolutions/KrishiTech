# 0003 — Confidence thresholds

**Status:** proposed
**Date:** 2026-08-22

## Context

Model confidence is not known to be calibrated: a score of 80 is not evidence of being right 80% of the time. Until calibration can be measured against outcomes, a score is a rank ordering, not a probability. The system still needs global confidence bands before the first agent ships — spoken uncertainty phrasing and escalation both key off them — and bands are global, not per-agent (`docs/agent-contracts.md` §2). Numeric boundaries stay unsettled until they can be measured against a golden set; this ADR stays proposed until then.

## Decision

**Invariant — applies at every confidence level.** The app never states a diagnosis as certain. Phrasing is always "most likely", with alternatives visible — including in the highest band. This is not a threshold effect. The only exception would be a deterministic check, which does not exist yet.

**Display.** The farmer sees confidence as a banded range, never a bare number. Three bands to start: since the score is treated as a rank ordering, coarse bands claim no more than is known. Three bands can be split later; five bands that have to be merged is worse. Finer banding is the intended end state once calibration data exists.

**Escalation.** Low confidence escalates to a human review; high confidence does not. The numeric cut-off is not settled — it is set once it is measurable, and band boundaries and the escalation cut-off move together.

**Human in the loop, by phase.**

| Phase | Human role |
|---|---|
| P1 | Agronomist review of diagnoses. Every confirmation is a label (ADR 0010). |
| P2 | Agent proposes; humans confirm exceptions only. |
| P3 | Largely autonomous, with escalation. |

| Threshold | Value | Used by |
|---|---|---|
| Confidence bands | Three bands. Boundaries not yet set — see Open. | every agent, via `skills/confidence` |
| Top-2 margin forcing `low` on a declared confusion pair | 0.10 | `diagnosis` §6 |
| Recurrence escalation | ≥ 2 prior diagnoses with outcome `worse` in the same field within 21 days | `diagnosis` §8 |
| Golden-set minimum | 150 labelled cases per crop | `diagnosis` §9, every advisory agent |

`AGENT.md` files point here; they do not restate bands or phrasing rules.

## Consequences

- No numeric threshold ships as settled from this ADR. `docs/eval-strategy.md` owns calibration and the evidence for setting boundaries.
- P1 review produces the labels calibration needs (ADR 0010): the loop that reviews diagnoses is the loop that lets the bands be set.
- Until calibration lands, the false-confident rate gate (hard block on any increase) is the only empirical check on the bands.
- Once accepted, any change to bands, boundaries or the escalation cut-off is a safety-threshold change: stop and ask (root `CLAUDE.md`), then supersede this ADR rather than editing it in place.

## Alternatives considered

- Bare score or numeric certainty shown to the farmer — rejected: presenting an uncalibrated score as a probability overclaims; bands plus "most likely" phrasing claim only rank.
- Five bands from the start — rejected: splitting three later is additive; merging five that farmers have learned to read is a regression in meaning.
- Certainty above some high threshold — rejected: no threshold turns an uncalibrated score into certainty; only a deterministic check could, and none exists.
- Per-agent thresholds — rejected: `docs/agent-contracts.md` fixes bands as global so that `band` means the same thing everywhere a farmer hears uncertainty.
- No bands, raw score only — rejected: spoken uncertainty phrasing (`skills/uncertainty`) and escalation rules need discrete tiers.

## Open

- Numeric band boundaries and escalation cut-off, pending calibration against a golden set.
- Low-confidence phrasing as spoken in each language pack, pending the design pass.
