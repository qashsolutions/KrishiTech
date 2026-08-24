# Chunk 04 — Ask & history + Images & storage (F-40…F-43, F-50…F-53)

Interactive HTML prototype of `docs/navigation-ia.md` §4 "Ask & history" and
"Images & storage". **Open `index.html` in any modern browser.** Shared
tokens/styles/strings/framework in `../shared/`.

With this chunk the bottom nav is fully live across chunks: Home/Crop jump to
chunk 02, History lands on F-42 here, and chunk 02's "Ask KrishiTech" tile
lands on F-40. Only "More" still points at chunk 05.

Key behaviours carried:

- **"Hear it again" is always present** on the answer (nav-ia §9), including
  offline — F-41 is ◐ *replay cached*: the saved answer replays without
  signal; only new questions need it.
- **English transcript toggle** on the question (ADR 0002), default off.
- **Delete is deliberate** (F-52): oldest pre-selected, grouped by case,
  an explicit spoken confirm step, "cannot be undone", and the confirm
  button uses `statusUrgent` — its one sanctioned use outside severity
  (design-system §2.3 "destructive confirm"). The keep-note explains that
  a thumbnail stays so case history never breaks.
- **Play Billing** (F-53): ₹100 / 500 slots, Western digits, pay-through-
  Google-Play framing; the Play sheet itself is system UI and not faked.

## State coverage

| Screen | States |
|---|---|
| F-40 | default · listening · review · offline |
| F-41 | loading · default · offline (cached replay) |
| F-42 | default · empty |
| F-43 | default |
| F-50 | default (7/10) · full (10/10) |
| F-51 | default |
| F-52 | default · confirm |
| F-53 | default · offline |

## UNSPECIFIED — decisions neither doc states (chunk 04 additions)

1. **Answer content is a placeholder** (weather agent + crop pack); the
   sample question is farmer speech, like the chunk 03 transcript.
2. **F-42 rows mix cases and questions** in one list — nav-ia says "past
   problems and outcomes"; questions are included so answers are findable
   offline (F-41's cached replay needs a route back).
3. **F-51 is rendered as a screen**, not a dialog — it is a moment in the
   post-diagnosis flow; "3 to free" is a sample count (the real number
   comes from `entitlements`).
4. **F-52 enforces exactly 3 selections** for this scenario; the real rule
   ("exactly how many to free") comes from `media`/`entitlements`.
5. **Long-press-to-speak is simulated as tap** on gallery thumbnails.
6. **Entry to F-50** is via More/Settings in the real app (chunk 05); here
   it sits in the review sequence.

DEVIATIONS unchanged from chunk 01 (see `../01-onboarding/README.md`).
