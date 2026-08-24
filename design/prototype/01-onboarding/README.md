# Onboarding prototype — S-01…S-07 · F-01…F-05

Interactive HTML prototype of `docs/navigation-ia.md` §3, styled entirely from
`docs/design-system.md` via `../shared/tokens.css`. No build step: **open
`index.html` in any modern browser.** No Kotlin, nothing here ships in the APK.

Structure: `../shared/` holds everything common to all prototype chunks —
`tokens.css` (every design-system value, greppable), `styles.css`, `proto.js`
(the review chrome and rendering framework) and `strings/<locale>.js` (one file
per locale, shared across chunks). Each chunk folder holds only its
`index.html` and `screens.js`. F-05's final button continues into
`../02-home-crop/`, language preserved.

## Using it

- **BOARD** — every screen × state as 412×915 tiles, labelled `ID · state`,
  with arrows on the main path. Click a tile to open it in FLOW at that state.
- **FLOW** — one interactive phone. Real controls navigate: pick a language on
  S-01, type on the keypad, allow/skip permissions, tap the mic on F-03.
  The state chips above the phone flip the current screen into any of its
  states (loading, error, offline, …) for review.
- Top bar: language switch (all six locales), font scale (100/150/200% —
  design-system §3.5), offline simulation, board zoom, restart.
- Mode, screen, state and language persist in the URL hash — a hash URL is a
  shareable pointer to an exact screen+state.
- OTP `000000` demonstrates the wrong-code error; any other 6 digits verify.

## Strings & the language review workflow

- `../shared/strings/<locale>.js` — one file per locale, UI strings only, native
  script (packs/CLAUDE.md). `en-IN` is the key reference.
- The five Indic files are **machine-drafted and unreviewed**; every non-English
  screen carries a "DRAFT — not reviewed" ribbon. **Do not run farmer/FPO
  verification on the Indic copy until a native speaker has corrected the
  file** — otherwise the session validates the draft translation, not the
  screens. After review, set `meta.reviewed = true`; the ribbon disappears.
  Reviewed files are the seed content for real `packs/languages/` packs.
- **No agronomic copy anywhere.** F-05's tip is a marked placeholder block —
  agronomic content comes only from an approved crop pack (root CLAUDE.md #5,
  packs/CLAUDE.md).
- Sample data (phone number, district/village names, crop names from
  packs/CLAUDE.md's crop list, the sowing date) is layout-only sample content.

## State coverage

| Screen | States rendered | Why |
|---|---|---|
| S-01 | default | ✅ offline; its real content is the 6 language names in their own scripts |
| S-02 | default · loading · error · offline | auth-backed, ✕ offline |
| S-03 | default · loading · error · offline | auth-backed, ✕ offline |
| S-04 | default · error · offline | consent-backed, ✕ offline |
| S-05 | loading · default · picker · error · offline | auth-backed, ✕; picker = multi-role (ADR 0008) |
| S-06 | default · permission-denied | ✅ offline; denied shows the manual-district next action |
| S-07 | default · unavailable | ✅ offline; no biometric hardware path |
| F-01 | default · queued | ✅ queued |
| F-02 | default · loading · manual · permission-denied · offline | ◐; manual district is first-class |
| F-03 | default · listening · readback · queued | ✅ queued; readback-before-commit (nav-ia §9) |
| F-04 | default | ✅ offline banner screen |
| F-05 | loading · default · offline | ◐; tip needs signal, completion doesn't |

## UNSPECIFIED — decisions neither doc states (ratify or correct)

1. **Farmer palette on pre-role S-01–S-04** (per brief; write into the docs).
2. **Mic placement pre-login:** no docked mic on S-01–S-04; the 72dp docked
   mic appears from S-06 onward, before bottom nav exists (bottom nav starts
   at F-10). nav-ia §2's mic spec belongs to the farmer nav model, which
   doesn't exist pre-role.
3. **Generic-error colour:** design-system §2.3 forbids `statusUrgent` for
   generic errors but defines no error role. Used the M3 baseline `error`
   role (`#B3261E` — hex coincides with statusUrgent; token kept separate
   per §1's layer rule).
4. **Button corner radius:** §4 lists chip/field 12, card 20, sheet 28 —
   buttons unlisted. Used 12dp.
5. **In-app number pad** on S-02/S-03 (56dp keys) instead of the system IME —
   a literacy/consistency call, not documented anywhere.
6. **Empty state:** no screen in this chunk has a genuine empty state; none
   rendered.
7. **S-05 single-role** auto-resolves to farmer; multi-role picker is a
   separate reviewable state.
8. **F-02 manual district picker** rendered as a state of F-02, not a
   separate screen.
9. **F-03 voice states** (`listening`, `readback`) added beyond the brief's
   six state types — required by nav-ia §9 readback-before-commit.
10. **S-01 "Listen" label** on each language row is rendered in that row's own
    language.

## DEVIATIONS — where design-system.md could not be honoured exactly

1. **Brand tonal roles are hand-derived**, not a Material Theme Builder
   export (§2.1 says don't hand-write ramps). Every derived hex is marked
   `[derived]` in `tokens.css`; replace with the MTB export, keep the names.
2. **Icons are inline-SVG stand-ins** for Material Symbols Outlined (§7) so
   the prototype works fully offline. Sizes match (28dp); swap at build time.
3. **Fonts load from Google Fonts** — offline sessions fall back to system
   fonts, so Indic metrics can differ from the bundled-Noto reality (§3.2).
   Judge line-height/truncation with network on.
4. **Spoken output is simulated** (a "Speaking…" pill) — no real TTS; Sarvam
   integration is a later phase. Haptic/audio channels of the §5 mic states
   can't be shown in HTML; the visual channel is faithful.
5. **1dp = 1px, 1sp = 1px × font-scale** at the 412×915 frame; physical-device
   rendering will differ slightly.
