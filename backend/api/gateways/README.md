# gateways/

All external provider SDK calls live here and nowhere else.

One module per provider, behind an interface the rest of the service depends on, so a
provider can be swapped without touching orchestration. The CI gate `make gate-gateways`
(not yet built) will fail any provider SDK import outside this package.

No provider SDKs are installed yet. This package is intentionally empty.
