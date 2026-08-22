# packs/ — local rules

Data, never code. Adding crop #7 or language #6 must touch nothing outside this folder.
Root `CLAUDE.md` holds the non-negotiables. This file adds only what is local to `packs/`.

```
packs/schema/      JSON schema + validator for every pack type
packs/crops/       chilli, tomato, okra (Family A) · cotton, soybean (Family B)
packs/languages/   te-IN, hi-IN, kn-IN, ta-IN, mr-IN
packs/regions/     district-level term variants, local units, seasonal calendars
```

## Two crop families

- **Family A — vegetables** (chilli, tomato, okra): short cycle, transplanted, high spray frequency, multi-pick harvest. PHI and re-entry dominate, because harvest repeats weekly.
- **Family B — field crops** (cotton, soybean): long cycle, direct-sown, largely rainfed, single harvest. Activates the weed module; cotton additionally activates resistance management and Bt refuge rules.

One schema. The `family` field decides which optional modules activate. Never fork the schema per crop.

## Never merge these three concerns

- **Crop pack** — agronomy: stages, pests, interventions, safety rules.
- **Language pack** — words: UI strings, agro glossary, profanity lexicon, uncertainty phrasing.
- **Region pack** — place: local pest names, local units, district calendars.

The same Telugu word differs between Telangana and coastal Andhra. That is a region concern, not a language one.

## Every crop pack requires

- Named agronomist **author** and a separate named **approver**
- `references[]` on every agronomic claim — no source, no claim
- Declared confusion pairs for look-alikes (thrips vs mite in chilli is the canonical one)
- Complete safety block: PHI, re-entry, max sprays per season, restricted molecules

## Every language pack requires

- Agro glossary reviewed by a native speaker with agricultural familiarity
- Profanity lexicon including romanized and code-mixed forms
- Uncertainty and safety phrasing, human-authored

## On any pack change

Re-run evals for every agent listing that pack type in `requires_packs`. CI enforces this.

## Never

- Put a brand name in a crop pack. Interventions are classes; brands live in `input-match`.
- Add a pack field to work around an agent limitation. Fix the agent.
- Ship a pack without an approver recorded.
