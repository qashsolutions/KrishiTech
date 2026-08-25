# Device Constraints

Min SDK, RAM, storage, APK budget, image sizing, data and battery budget.

> Status: stub — not yet written

---

## TODO — recorded ahead of writing

- Confirm the `minSdk 26` floor against India Android version distribution before locking it. Stated (unverified) in `docs/project-structure.md` §1 and `docs/navigation-ia.md` §10; this doc owns the decision once written.
- Own the Indic layout validation. Every screen must hold its longest supported string at full scale on the device floor, at the largest system font scale, Tamil and Kannada first — no auto-shrunk frames, no clipped buttons or tabs, no card overflowing the frame, no mic colliding with the nav. Assigned here by `design/prototype/SPEC.md` §5 gate 5; the numbers being reconciled (type scale, 56dp touch floor, 72dp mic) are owned by `docs/design-system.md` §3.4 and §11. The failures on record are in the mockups only (`SPEC.md` §7.2 item 1) — this doc owns the check that keeps them out of the Kotlin build. **Blocked:** the target handset is still unknown (`design-system.md` §11), so there is no device floor to validate against yet.
