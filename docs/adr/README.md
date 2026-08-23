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
