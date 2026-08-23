# Identity

Phone-as-person, number change, shared devices, dormancy.

> Status: partial — re-authentication mechanism recorded below; all other sections not yet written

---

## Re-authentication

Sensitive screens (`docs/role-permissions.md`, Bystander visibility) re-authenticate with Android `BiometricPrompt` using `DEVICE_CREDENTIAL` fallback — this covers users who skipped biometric setup (S-07) without inventing a custom PIN. No new S-25 setting.
