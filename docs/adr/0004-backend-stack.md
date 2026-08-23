# 0004 — Backend stack: Python, FastAPI, Cloud Run

**Status:** accepted
**Date:** 2026-08-22

## Context

The Android side was locked earlier (Kotlin + Compose, `targetSdk 36`, single APK, no
iOS). The backend was never decided, which left the root `CLAUDE.md` commands block a
placeholder and blocked every mechanical CI gate in `docs/project-structure.md` §4.

Two things constrain the choice. First, the long-term intent is to shift image analysis
away from model calls and toward deterministic computer vision — the algorithm should
carry more of the load over time, not less. Second, traffic is seasonal and spiky:
agronomic questions cluster around pest outbreaks and spray windows, not evenly across
the year.

## Decision

- **Language:** Python 3.12.
- **Framework:** FastAPI.
- **Hosting:** Google Cloud Run, region `asia-south1` (Mumbai).
- **Datastore:** Cloud SQL for PostgreSQL. Cloud Storage for images.
- **Android-side services:** Firebase — Auth, FCM, Crashlytics, Remote Config.
- **Toolchain:** `uv` for dependencies and virtualenvs · `ruff` for lint and format ·
  `pytest` · `mypy` in strict mode on agent contracts.
- **Task runner:** `make` at the repo root.
- **CI:** GitHub Actions.
- **Two Cloud Run services, not one:**
  - `api` — orchestration, quota, identity, packs. Small, fast, low memory.
  - `inference` — image analysis. Own scaling profile, own resource ceiling.

## Consequences

- Python puts OpenCV, scikit-image and the training toolchain in the same language as
  the service that will eventually run them. The P2 migration from model calls to
  deterministic CV becomes a change of implementation inside one service rather than a
  change of stack.
- Cloud Run scales to zero, which suits seasonal traffic. Containers let the heavy CV
  dependencies install cleanly.
- Firebase Remote Config satisfies the locked requirement that a prompt or pack change
  ships without a Play release.
- Splitting `inference` from `api` now costs one directory. Splitting it later, once
  inference is CPU-bound and slow, is a refactor. A long inference request can no
  longer hold a connection on the service that also serves login and quota checks.
- Python 3.12 rather than 3.13: the CV and ML wheel ecosystem lags a release, and a
  missing wheel is a bad thing to discover in CI.
- `make` needs no install, behaves identically locally and in Actions, and is readable
  by Claude Code — which is the actual purpose of the root commands block. Three
  languages in the repo mean no language-native runner can own the root.

## Alternatives considered

- **Flutter for Android.** Rejected. With no iOS target, Flutter's cross-platform
  advantage does not apply, and it is paid for at exactly the wrong boundary: LiteRT,
  CameraX and the NNAPI/GPU delegates are native-first, and a plugin wrapper around the
  inference pipeline is the last place to want indirection.
- **Node/TypeScript backend.** Rejected. Would force either a second language for CV
  work or a permanent service boundary between the API and every image operation.
- **Django.** Rejected. The ORM and admin are not the value here, and the async story
  is weaker for an I/O profile dominated by speech and model provider calls.
- **GKE.** Rejected. A cluster to operate, for no benefit at this scale.
- **App Engine standard.** Rejected. The runtime fights heavy native dependencies;
  OpenCV is exactly that.
- **A single Cloud Run service.** Rejected — see Consequences.
- **`just` instead of `make`.** Better ergonomics, but adds a dependency for marginal
  gain over a tool already present everywhere.

## Open

DPDP data-residency requirements were not verified when this ADR was written. The
`asia-south1` choice is consistent with residency but is not evidence of compliance.
Confirm the current position before the retention design in ADR 0006 is implemented.
