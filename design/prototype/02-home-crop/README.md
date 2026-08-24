# Chunk 02 — Home & crop prototype (F-10…F-14)

Interactive HTML prototype of `docs/navigation-ia.md` §4 "Home & crop", continuing
chunk 01 (F-05 → F-10). **Open `index.html` in any modern browser.** Shared
tokens, styles, strings and framework live in `../shared/`.

This chunk introduces the post-login farmer chrome:

- **Bottom nav** (nav-ia §2): Home · Crop · docked 72dp mic · History · More —
  icons with labels in the active script; History/More point at later chunks.
- **App bar with role chip** (design-system §8): role stated in words in the
  active language, on every post-login screen.
- **◐-cached / degraded states**: F-10 offline shows cached content with its
  age; F-13 degraded states "this forecast is from yesterday evening" (nav-ia §8).

**Placeholder-heavy by design.** Stage names, task names/timing, task detail
(what/why/when/how) and the weather *decision* are agronomic content that only
an approved crop pack (and the weather agent) can supply — they render as
dashed, tagged placeholder blocks with a localized explainer. Weather *data*
(temperatures, rain chance) is sample layout data.

## State coverage

| Screen | States | Why |
|---|---|---|
| F-10 | default · loading · offline | ◐ cached; offline = cached tiles + data age |
| F-11 | default | ✅ offline; content pending crop pack |
| F-12 | default | ✅ offline; four pack-pending sections |
| F-13 | default · loading · degraded · offline · error | ◐; staleness stated explicitly |
| F-14 | default · single | ✅; single = one-field farmer |

## UNSPECIFIED — decisions neither doc states (chunk 02 additions)

1. **Bottom-nav glyphs**: nav-ia gives labels only — chose leaf (Home),
   calendar (Crop), clock-arrow (History), overflow dots (More).
2. **F-10 tile sub-lines**: crop name + sown date on My crop; temp + rain on
   Weather; report/ask tiles kept bare. The doc names the four tiles only.
3. **Field switcher entry**: a field chip at the top of Home opens F-14 —
   no doc states how F-14 is reached (it is not a nav destination).
4. **App bar anatomy**: 56dp bar, labelled back arrow, role chip on the right —
   §8 names the role chip, nothing specifies the bar.
5. **F-13 forecast shape**: 4-day list (today, tomorrow, two weekdays), decision
   card above the forecast per "decision first, forecast second".
6. **F-10/F-13 loading** runs on first entry per session; revisits render from
   cache instantly.
7. **F-14 `single` state** added for one-field farmers (nav-ia scopes the
   switcher to multi-field farmers).
8. **Degraded** rendered as its own reviewable state on F-13, distinct from
   offline, per nav-ia §8's state list.

DEVIATIONS are unchanged from chunk 01 (see `../01-onboarding/README.md`):
derived palette pending the Material Theme Builder export, inline-SVG icon
stand-ins, Google-Fonts loading, simulated voice.
