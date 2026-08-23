# pipeline/

This is where model-backed image analysis will be progressively replaced by deterministic
computer vision, per `docs/adr/0004-backend-stack.md`: the algorithm should carry more of the
load over time, not less, and that migration is a change of implementation inside this
package — not a change of stack or service.

Intended shape: one stage per concern (ingest, normalise, segment, measure, score), each
stage swappable between a model-backed and a deterministic implementation behind the same
interface, so the swap is per stage and measurable against the golden sets.

Do not install OpenCV, scikit-image or any ML dependency yet. This package is intentionally
empty — structure only.
