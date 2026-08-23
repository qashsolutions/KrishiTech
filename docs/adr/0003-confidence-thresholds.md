# 0003 — Confidence thresholds

**Status:** proposed
**Date:** 2026-08-22

## Context

Initial values with no field data behind them. The system needs global confidence bands and a few derived thresholds before the first agent can ship; the numbers below are starting points, not calibrated results. Bands are global, not per-agent (`docs/agent-contracts.md` §2).

## Decision

| Threshold | Value | Used by |
|---|---|---|
| Confidence bands | `high ≥ 0.75` · `medium 0.45–0.74` · `low < 0.45` | every agent, via `skills/confidence` |
| Top-2 margin forcing `low` on a declared confusion pair | 0.10 | `diagnosis` §6 |
| Recurrence escalation | ≥ 2 prior diagnoses with outcome `worse` in the same field within 21 days | `diagnosis` §8 |
| Golden-set minimum | 150 labelled cases per crop | `diagnosis` §9, every advisory agent |

`AGENT.md` files point here; they do not restate the numbers.

## Consequences

- To be recalibrated after the first field cohort. `docs/eval-strategy.md` owns recalibration and the evidence for it.
- Any change to these values is a safety-threshold change: stop and ask (root `CLAUDE.md`), then supersede this ADR rather than editing it in place.
- Until recalibrated, the false-confident rate gate (hard block on any increase) is the only empirical check on whether the bands are right.

## Alternatives considered

- Per-agent thresholds — rejected: `docs/agent-contracts.md` fixes bands as global so that `band` means the same thing everywhere a farmer hears uncertainty.
- No bands, raw score only — rejected: spoken uncertainty phrasing (`skills/uncertainty`) and escalation rules need discrete tiers.
