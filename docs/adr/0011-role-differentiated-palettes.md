# 0011 — Role-differentiated palettes with a shared semantic layer

**Status:** proposed
**Date:** 2026-08-23

## Context

A single Android APK serves three roles with role resolved at login
(`project-structure.md` §1). Multi-role accounts exist — one person may be both a farmer
and an FPO office-bearer (ADR 0008) — so a user can switch between modes within one
install, and needs to know at a glance which mode they are in.

Two visual requirements pull against each other:

1. **Roles must be instantly distinguishable.** A dealer at a counter and a farmer in a
   field are different products wearing one icon.
2. **Clinical meaning must not vary.** A diagnosis is created by a farmer, reviewed by an
   expert, and in P1.5 referenced by a dealer. All three read the same event log. If
   severity or confidence renders differently per role, the roles disagree about how
   serious a case is — and the disagreement is invisible, because no one sees two roles
   at once.

A second, narrower conflict: the diagnosis card displays two orthogonal scales
simultaneously — problem severity and agent confidence (ADR 0003). The conventional
green/amber/red ramp cannot carry both, and green additionally collides with the obvious
agricultural brand colour.

## Decision

**Split colour into two layers.**

- **Brand / chrome varies by role.** Farmer seeds on deep leaf green `#17643B`;
  dealer/FPO on deep indigo `#2F3E9E`. Role also changes corner radius, type scale,
  minimum touch target and navigation model — colour is never the sole differentiator.
- **Semantic colour is identical in every role.** Severity, confidence, sync state,
  safeguarding and error tokens are defined once, outside `ColorScheme`, and are not
  overridable per role.

**Encode the two scales differently.** Severity uses hue. Confidence uses filled
segments in a single neutral hue plus a written and spoken label. Neither borrows the
other's channel.

**Healthy has no colour.** There is no green all-clear state. A healthy result is an
outline, an icon and a sentence. This resolves the brand collision and prevents the
interface signalling alarm when nothing is wrong.

**Material You dynamic colour is removed, not disabled.** No parameter, no toggle.

Full token values in `docs/design-system.md`.

## Consequences

- Two `ColorScheme` objects and one shared semantic token set. Theme selection happens
  once, at the role boundary, not per screen.
- Semantic tokens cannot be reached through `MaterialTheme.colorScheme`, so a developer
  cannot accidentally recolour severity by switching themes. They are exposed through a
  separate `CompositionLocal`.
- Every screen must be reviewed in both palettes. Chunk E builds a component catalog
  rendering both roles side by side for exactly this reason.
- Dropping dynamic colour forfeits Material You personalisation. On a device where the
  system palette is unusual, the app will look like itself rather than like the system.
  Accepted.
- A CI gate (`gate-token-parity`) is required, or `design-system.md` stops describing the
  code within two sprints.

## Alternatives considered

**One palette for all roles, role shown by a header label only.** Cheapest, and safest
for semantic consistency. Rejected because multi-role switching (ADR 0008) and the
dealer counter interaction both involve a user or an onlooker orienting in under a
second, and a text label does not carry that far.

**Role differentiation by hue alone, keeping shape and type identical.** Rejected: fails
for red–green colour vision deficiency, fails across a room, and fails in direct
sunlight on a low-end LCD, which is the primary farmer context.

**Green / amber / red severity ramp, the conventional choice.** Rejected on two counts.
It collides with the agricultural green brand, and it consumes the hue channel that
confidence would then have to share. Removing green from the ramp — healthy shows no
colour — resolves both without inventing a new convention.

**Keeping `dynamicColor` as a parameter defaulting to false.** Rejected. A parameter is
an invitation. There is no supported configuration of this app in which dynamic colour
is correct, so the branch should not exist.

## Open

- Farmer dark theme is deferred, not rejected. ADR 0001 places evening consumption at
  home, which is when dark mode helps; §2.5 of `design-system.md` records the
  counter-argument. Revisit after field testing.
- Whether dealer counter mode (D-05) needs a mic is unresolved, and it affects whether
  the dealer navigation model can stay FAB-free.
