# Role Permissions

What farmer/dealer/FPO/expert/admin can read and write. Consent defaults. Cross-role rules.

> Status: partial — bystander visibility recorded below; all other sections not yet written

---

## Bystander visibility

Informal assistance (`docs/navigation-ia.md`, F-04 note; `docs/adr/0001-usage-context.md`) makes a bystander reading the screen normal.

**Require re-authentication (biometric or PIN) before opening, even in an active session:**
- S-27 Data & privacy (consent toggles)
- S-29 Export my data
- S-30 Delete my account
- F-53 Buy image slots

**Never surfaced to a bystander at all:** S-42 safeguarding surface — see `docs/navigation-ia.md` S-42 and `docs/safeguarding-protocol.md`.

**Explicitly not sensitive, no re-auth** — sharing these with a helper is the point:
- F-43 Case detail
- F-11 Crop timeline
- F-25 Diagnosis card
- S-24 Profile
