# Chunk 03 — Report a problem prototype (F-20…F-30)

Interactive HTML prototype of `docs/navigation-ia.md` §4 "Report a problem",
including F-28 (dealer availability, P1.5) — reached from the diagnosis card
only, honouring "appears only after the recommendation is locked". **Open `index.html` in any
modern browser.** Shared tokens/styles/strings/framework in `../shared/`.
Entered from chunk 02's "Report a problem" tile; F-27/F-30 return to F-10.

This chunk carries the encoding rules that matter most:

- **Severity is hue, confidence is fill — never both hue** (design-system
  §2.4): the diagnosis card shows a severity chip (`statusUrgent` /
  `statusCaution` containers) and a separate 3-segment confidence bar in
  `confidenceFill` with a written label. Red/amber/green confidence is
  deliberately absent.
- **Healthy has no colour** (§2.3): outline card + icon + sentence.
- **Low confidence is never hidden** (nav-ia §8): its own state says "we are
  not sure" and offers the expert.
- **Blocked state** (nav-ia §8): the voice note's content-gate refusal is
  polite, non-accusatory, and redirects — nothing silently deleted.
- **English transcript toggle** inline on F-22/F-23a (ADR 0002), default off.

**Placeholders**: diagnosis names, what/why/when, dose (tagged `dose-math +
agronomic-safety veto`), precautions (tagged `safety block from crop pack`),
alternatives, and the confusion-pair content are all dashed placeholder blocks.

## State coverage

| Screen | States |
|---|---|
| F-20 | default · permission-denied |
| F-21 | default · empty |
| F-22 | default · listening · review · blocked |
| F-23a | default · loading · offline |
| F-23 | default (sent) · queued |
| F-24 | default · listening · offline |
| F-25 | loading · default · urgent · healthy · low-confidence · offline |
| F-28 | default · offline (P1.5) |
| F-26 | default |
| F-27 | default · offline |
| F-29 | default · queued |
| F-30 | default · done · queued |

## UNSPECIFIED — decisions neither doc states (chunk 03 additions)

1. **F-20 is immersive**: no bottom nav during capture; the docked mic stays
   (nav-ia's "mic on every screen"). Other screens in the flow drop the
   bottom nav too — a case is a modal journey, not a nav destination.
2. **Sample case content**: the codemix transcript, the interpretation chips,
   and F-24's one observational question are farmer-speech/case samples for
   layout, not pack copy — reviewers should treat them like the district
   names, and the real clarification agent authors questions at runtime.
3. **Severity labels** ("Act now"/"Watch this") and **confidence labels**
   ("Very/Fairly/Not sure") drafted as UI vocabulary; the confidence bands
   and their spoken phrasing belong to `skills/confidence` + ADR 0003 and
   `skills/uncertainty` — replace when those exist.
4. **F-21 empty state** (all photos removed) — the first genuine empty state
   in the prototype; offers re-capture or voice-only.
5. **Flow compression**: F-29/F-30 are T+48h events in reality; the prototype
   chains them straight after F-25 so the journey can be walked in one
   sitting. F-26/F-27 are alternate outcomes, reachable from F-25's states
   and from the board.
6. **Voice-skip path**: skipping the voice note goes straight to F-23
   (nothing to confirm on F-23a).
7. **F-28 dealer shop names and distances are sample data**; the intervention
   class is an input-match placeholder, and the privacy caption restates that
   the dealer sees the case only on the farmer's yes.

DEVIATIONS unchanged from chunk 01 (see `../01-onboarding/README.md`).
