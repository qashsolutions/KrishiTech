# 0003 — Confidence thresholds

**Status:** proposed
**Date:** 2026-08-22 · **Revised:** 2026-08-24 (founder: four range-labelled bands)

## Context

Model confidence is not known to be calibrated: a score of 80 is not evidence of being right 80% of the time. Until calibration can be measured against outcomes, a score is a rank ordering, not a probability. The system still needs global confidence bands before the first agent ships — spoken uncertainty phrasing and escalation both key off them — and bands are global, not per-agent (`docs/agent-contracts.md` §2). Numeric boundaries stay unsettled until they can be measured against a golden set; this ADR stays proposed until then.

## Decision

**Invariant — applies at every confidence level.** The app never states a diagnosis as certain. Phrasing is always "most likely", with alternatives visible — including in the highest band. This is not a threshold effect. The only exception would be a deterministic check, which does not exist yet.

**Display.** The farmer sees confidence as a banded range, never a single number. Four bands (founder-set 2026-08-24, Apple-Health style): **10–30%, 30–60%, 60–80%, >80%**. Each band shows its range with a written and spoken label; a range claims a span, never a point — "20% likely" renders as the 10–30% band. The original 2026-08-22 decision was three word-labelled bands ("coarse bands claim no more than is known"); the founder revised to four numeric-range bands for farmer-facing clarity. The calibration caveat stands: until calibration lands, the ranges are provisional labels on a rank ordering, and the false-confident gate is the empirical check.

**Escalation.** Low confidence escalates to a human review; high confidence does not. The numeric cut-off is not settled — it is set once it is measurable, and band boundaries and the escalation cut-off move together.

**Human in the loop, by phase.**

| Phase | Human role |
|---|---|
| P1 | Agronomist review of diagnoses. Every confirmation is a label (ADR 0010). |
| P2 | Agent proposes; humans confirm exceptions only. |
| P3 | Largely autonomous, with escalation. |

| Threshold | Value | Used by |
|---|---|---|
| Confidence bands | Four: 10–30%, 30–60%, 60–80%, >80% (founder-set 2026-08-24; provisional until calibration) | every agent, via `skills/confidence` |
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

- Bare single score or certainty shown to the farmer — rejected: presenting an uncalibrated point score as a probability overclaims; a band's range plus "most likely" phrasing claims a span, not a point. (2026-08-24: numeric *ranges* accepted as band labels; a single number remains rejected.)
- Five bands from the start — rejected: splitting later is additive; merging bands farmers have learned to read is a regression in meaning. (2026-08-24: revised from three to four founder-set bands.)
- Certainty above some high threshold — rejected: no threshold turns an uncalibrated score into certainty; only a deterministic check could, and none exists.
- Per-agent thresholds — rejected: `docs/agent-contracts.md` fixes bands as global so that `band` means the same thing everywhere a farmer hears uncertainty.
- No bands, raw score only — rejected: spoken uncertainty phrasing (`skills/uncertainty`) and escalation rules need discrete tiers.

## Open

- Escalation cut-off: which band(s) count as low — triggering the restricted diagnosis screen (no dose, no act-on-it CTA) and human review. Presumed 10–30%; not yet founder-confirmed.
- Below 10%: unspecified — expected to resolve to `insufficient_input` / the restricted screen rather than a fifth band; confirm.
- Band boundaries are provisional until calibration against a golden set; boundaries and the escalation cut-off move together.
- Low-confidence phrasing as spoken in each language pack, pending the design pass.
