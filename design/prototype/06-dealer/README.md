# Chunk 06 — Dealer prototype (D-01…D-07, P1.5)

`docs/navigation-ia.md` §5. D-08 (forecast accuracy) is P2 and excluded.
**Open `index.html` in any modern browser.** Standalone role surface —
reached from the landing page, not from the farmer app.

Role differentiation on display (design-system §1/§8):

- **Indigo/slate palette** via `.role-dealer` in `../shared/tokens.css` —
  brand layer only; semantic tokens untouched (the stock gap chip is the same
  `statusCaution` a farmer sees).
- **Dealer chrome**: top bar + tabs (Demand · Leads · Counter · More), mic
  48dp top-right (nav-ia §2), role chip "Dealer" in words.
- **Denser everything**: 14sp body, 4/8/12dp radii, 48dp targets, 24dp icons
  (§3.3/§4 dealer columns).
- **Privacy stance**: aggregates plus consented leads only; every lead carries
  a "shared with consent" badge; the counter result explains the consent;
  the empty-leads state says how leads appear (nav-ia §5).
- Counter mode carries its ◐ 7-day-cache note; D-06 orders queue offline.

Placeholders: stages/problems, intervention classes, agronomic reasons, and
locked recommendations are pack/agent-derived. Product names in stock/orders
are the dealer's own entries — brands never hardcoded (root CLAUDE.md #9);
samples are generic ("Neem oil 1L", "NPK 19-19-19").

States: D-01/D-02/D-04 default+offline(cached) · D-03 default+empty ·
D-05 default+result+offline · D-06 default+queued · D-07 default.

## UNSPECIFIED (chunk 06)

1. **D-05 mic**: design-system §11 leaves "does counter mode need a mic?"
   open — the 48dp top-right mic is present on all dealer screens including
   D-05 (farmer-present interaction). Ratify.
2. **D-05 consent wording follows ADR 0007** (accepted): consent once at
   group join, minimum scope, every lookup logged and visible to the farmer,
   one-tap revoke. The counter note states join-time consent + visible log +
   revocability. The farmer-side surface for the lookup log and revoke
   (ADR 0007's mitigations) has no screen ID yet — candidate: S-27.
3. **Tab→screen mapping**: Demand tab lands on D-01 (dashboard) with D-02
   and D-07 as rows inside it; nav-ia names the tabs but not the mapping.
4. **Catchment numbers** (128/17/9, crop split 62/27/11) are sample data.
5. Dealer dark theme follows system (§2.5) — prototype renders light only
   (existing DEVIATIONS; dealer bodyLarge 16/24 interpolated, no doc row).
