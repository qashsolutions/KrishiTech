# Agent: diagnosis

> Worked exemplar. Every other `AGENT.md` copies this shape — same nine sections, same order.
> Location in repo: `agents/diagnosis/AGENT.md`
> Example content (thrips vs mite, symptom lists, IDs) is pending the chilli pack; the pack is authoritative once written.

---

## 1. Purpose

Identify what is affecting the crop, as a ranked set of hypotheses with confidence.

## 2. Owns

The authoritative answer to **"what is the problem?"** — pest, disease, deficiency, abiotic stress, or none. Nothing else in the system may assert a diagnosis.

## 3. Must not

| Does not do | Owned by |
|---|---|
| Recommend any treatment, product, or dose | `treatment` |
| Judge whether a spray is safe or legal | `agronomic-safety` |
| Decide whether to ask the farmer for more info | `clarification` |
| Decide whether a human is needed | `escalation` |
| Write anything to the farm graph | `context` |
| Infer the crop stage | `crop-stage` |

If diagnosis finds itself reasoning about *what to spray*, that is a bug.

## 4. Inputs

**Required:** `crop_id`

**Optional, each with defined degradation:**

| Input | Absent → |
|---|---|
| `media_refs` | Symptom-text-only path; confidence capped at `medium`; `needs=["photo of affected leaf, upper and lower surface"]` |
| `query` (symptom description) | Image-only path; confidence capped at `medium` |
| `stage` | Drop stage-conditional hypotheses from the prior; note in provenance |
| `weather` | Skip weather-favourability weighting; confidence penalty applied |
| `history` | Skip recurrence weighting; no penalty |

**Both `media_refs` and `query` absent →** `status: insufficient_input`. Never guess from crop alone.

## 5. Output schema

```json
{
  "hypotheses": [
    {
      "problem_id": "chilli.thrips.scirtothrips_dorsalis",
      "label_key": "pest.thrips",
      "category": "pest",
      "score": 0.71,
      "matched_symptoms": ["leaf_curl_upward", "silvering", "bud_distortion"],
      "conflicting_symptoms": [],
      "look_alikes": ["chilli.mite.polyphagotarsonemus_latus"],
      "stage_consistent": true,
      "weather_favourable": true
    }
  ],
  "none_detected": false,
  "image_quality": {"usable": true, "issues": []}
}
```

`hypotheses` is ranked, max 3. `look_alikes` is mandatory where the crop pack declares a confusion pair — thrips vs mite in chilli being the classic one, and the one most likely to cause a wrong spray.

## 6. Confidence

Produced by `skills/confidence` only. Never computed inline.

**Raises:** multiple independent symptoms matching; clear diagnostic image; stage consistency; weather favourability; recurrence in this field; a confusion pair actively ruled out.

**Lowers:** single generic symptom; poor image; symptom set spanning two categories; declared look-alike not excludable; problem out of season for the region.

**Bands:** global thresholds, set in `docs/adr/0003-confidence-thresholds.md` — this agent does not set its own.

**Forced `low`, regardless of score:** top-2 scores within the margin set in ADR 0003 **and** they are a declared confusion pair. Correct behaviour here is to say "it is one of these two, and here is how to tell them apart" — not to pick.

**Valid `needs[]` values:** photo of leaf underside · photo of whole plant · close-up of the affected part · time since symptoms appeared · spread pattern across the field · recent spray history.

## 7. Failure and degradation

| Failure | Returns | Farmer hears |
|---|---|---|
| Image unusable (blur, dark, too far) | `insufficient_input`, `needs=[retake]` | Specific retake instruction — never "try again" |
| Image not agricultural | `blocked` by domain gate | Polite redirect; logged, not stored |
| No crop pack for `crop_id` | `error` | "Not supported yet"; offer expert |
| Vision skill down | Degraded text-only, `degraded: true` | Normal answer, band capped at medium |
| Budget exceeded | Best partial, `degraded: true` | Normal answer plus follow-up offer |
| Kill switch on | `blocked` | Straight to expert queue, no gap in service |

Never invents a diagnosis to avoid an empty answer. `none_detected: true` is a valid, useful result.

## 8. Escalation

Forces a human when any of:
- Band is `low`
- Top-2 within margin on a declared confusion pair
- Symptoms match a quarantine or notifiable pest in the region pack
- Repeat prior diagnoses with outcome `worse` in this field within the recurrence window set in ADR 0003
- Farmer explicitly asks for a person

Escalation is a hand-off, not a dead end: the farmer is told a person is looking, and gets an ETA.

## 9. Evaluation

- **Golden set:** `evals/golden/diagnosis/<crop_id>/` — minimum size per crop set in ADR 0003, sourced from real field photos, labelled by a named agronomist, with inter-rater checks on the confusion pairs.
- **Metrics:** top-1 accuracy · top-3 accuracy · confusion-pair separation rate · calibration (does 0.7 mean 70%?) · false-confident rate (**the metric that matters most**).
- **Regression gate:** no drop in top-3 accuracy; **zero increase in false-confident rate** — a hard block on merge.
- **Slices:** per crop, per language of symptom text, per image quality tier, per region.
- **Labelling workflow:** agronomist labels in the authoring console; disagreements go to a second reviewer; every promoted case enters the golden set with provenance.

---

## Repo layout for this agent

```
agents/diagnosis/
├── AGENT.md            # this file
├── manifest.yaml       # capability declaration read by the orchestrator
├── schema/claim.json   # output contract
├── prompts/            # versioned prompt templates, one per model tier
├── src/                # implementation
├── tests/              # unit + contract tests
├── eval/               # runner config, pointer to golden set
└── CHANGELOG.md        # every version, with eval delta recorded
```
