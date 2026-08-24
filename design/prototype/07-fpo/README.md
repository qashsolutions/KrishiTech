# Chunk 07 — FPO prototype (P-01…P-04)

`docs/navigation-ia.md` §6: P-01 (P1, read-only), P-02 (P1.5), P-03 (P1),
P-04 (P1.5). P-05…P-07 are P2 and excluded. **Open `index.html` in any
modern browser.** Standalone role surface.

- Same indigo palette and dense chrome as the dealer (`.role-dealer` —
  design-system gives dealer/FPO one seed set); role chip reads "FPO".
- Tabs: Members · Alerts · Demand (stub → P-05, P2) · More.
- **The §1 two-layer proof**: cluster-alert severity uses the identical
  `statusUrgent`/`statusCaution` chips the farmer's diagnosis card uses —
  the event log's visual encoding is shared across roles by construction.
- P-01 is read-only and says so; member stage is a pack placeholder.
- P-02 crop map: village bubbles with member counts on the map placeholder.
- P-03 is ✕ (arrives by push): offline state says so; the empty state uses
  the colourless healthy pattern ("no alerts — good news").
- P-04: affected members, coordinated-response placeholder, and a
  Notify-members button stubbed to P-07 (P2).

States: P-01/P-02/P-04 default+offline(cached) · P-03 default+empty+offline.

## UNSPECIFIED (chunk 07)

1. **Member visibility**: P-01 shows member name, village, crop, area —
   `role-permissions.md` should ratify exactly what an FPO officer sees.
2. **Alert counts/spreads** (6·3, 3·1) and villages are sample data.
3. Tab→screen mapping chosen (Members→P-01 with P-02 inside that tab's
   reach; Alerts→P-03) — nav-ia names tabs only.

DEVIATIONS as chunk 06 (derived indigo tones, light-only rendering).
