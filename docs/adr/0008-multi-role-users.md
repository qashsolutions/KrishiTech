# 0008 — Multi-role users: one login, primary and secondary roles

**Status:** accepted
**Date:** 2026-08-22

## Context

One person can hold more than one role. A farmer may also be an FPO office-bearer
(S-05). A dealer may own land and farm it. The open question was whether such a person
holds one account or several.

Identity is already locked as **phone number = person**. Separate logins would require
separate phone numbers for the same human, which contradicts that model directly.

## Decision

- **One login per person.** Always.
- A person has one **primary role** and zero or more **secondary roles**.
- The primary role determines the **default home surface** at login.
- Secondary roles **add permission scopes**; they do not change identity.
- Typical shapes:
  - Farmer primary · FPO office-bearer secondary.
  - Dealer primary · farmer secondary, for their own land.
- **A farmer is a farmer first.** FPO membership is a secondary role on a farmer
  account, never the primary.
- **A dealer is not a farmer first.** A dealer who farms holds dealer primary with
  farmer secondary.
- **Constraint, enforced explicitly:** a dealer's farmer-secondary role grants access to
  **their own farm records only**. It must not reach other farmers' data through the
  farmer surface, and their own farm record carries **no dealer privileges**.

## Consequences

- Consistent with `phone = person`. No second number, no account linking, no merge flow.
- Role switching is a UI affordance over one identity, not an authentication event.
- The dealer/farmer constraint is the sharp edge of this decision. It is the kind of
  rule an ORM join gets quietly wrong, so it must appear as an explicit permission rule
  in `docs/role-permissions.md` and carry its own test in the golden set — not be left
  implied by the data model.
- Event projections stay per-role. A new role view is a new projection, consistent with
  the append-only event model in `docs/project-structure.md` §5.

## Alternatives considered

- **Two logins.** Rejected. Requires two phone numbers, contradicting the locked
  identity model, and splits one person's history across two records.
- **Flat role list with no primary.** Rejected. Leaves the default home surface
  undefined, which is the practical question at login.
- **Role inferred from context rather than declared.** Rejected. Inference across a
  permission boundary is the wrong place to be clever.
