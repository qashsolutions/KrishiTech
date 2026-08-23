# Architecture Decision Records

One file per architectural decision. Docs describe the current state; ADRs hold the reasoning and the alternatives that were rejected.

## Convention

- **Filename:** `NNNN-kebab-case-title.md` — zero-padded, sequential, never reused.
- **Sections, in this order:** Status (`proposed` | `accepted` | `superseded by NNNN`) · Date · Context · Decision · Consequences · Alternatives considered.
- **Rule:** docs describe the current state; ADRs hold the reasoning and the alternatives that were rejected.
- **Index:** add a row to the table below with every new ADR.

## Template

```markdown
# NNNN — Title

**Status:** proposed | accepted | superseded by NNNN
**Date:** YYYY-MM-DD

## Context

## Decision

## Consequences

## Alternatives considered
```

## Index

| # | Title | Status | Date |
|---|---|---|---|
| 0001 | [Usage context](0001-usage-context.md) | accepted | 2026-08-22 |
| 0002 | [Farmer-facing English toggle](0002-farmer-facing-english-toggle.md) | accepted | 2026-08-22 |
| 0003 | [Confidence thresholds](0003-confidence-thresholds.md) | proposed | 2026-08-22 |
| 0004 | [Backend stack: Python, FastAPI, Cloud Run](0004-backend-stack.md) | accepted | 2026-08-22 |
| 0005 | [Paid slot expiry and entitlement policy records](0005-slot-expiry-and-entitlement-policy.md) | accepted | 2026-08-22 |
| 0006 | [Dormant accounts and recycled phone numbers](0006-dormant-accounts-and-number-recycling.md) | accepted | 2026-08-22 |
| 0007 | [Dealer counter-mode consent at group join](0007-dealer-counter-mode-consent.md) | accepted | 2026-08-22 |
| 0008 | [Multi-role users: one login, primary and secondary](0008-multi-role-users.md) | accepted | 2026-08-22 |
| 0009 | [Cotton and soybean deferred to P2](0009-cotton-soybean-deferred-to-p2.md) | accepted | 2026-08-22 |
| 0010 | [Labelled image corpus from day one](0010-labelled-image-corpus.md) | proposed | 2026-08-22 |
