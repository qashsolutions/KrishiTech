# packs/ — local rules

Data, never code. Adding crop #7 or language #7 must touch nothing outside this folder.
Root `CLAUDE.md` holds the non-negotiables. This file adds only what is local to `packs/`.

```
packs/schema/      JSON schema + validator for every pack type
packs/crops/       chilli, tomato, okra (Family A) · cotton, soybean (Family B)
packs/languages/   te-IN, hi-IN, kn-IN, ta-IN, mr-IN, en-IN
packs/regions/     district-level term variants, local units, seasonal calendars
```

## Two crop families

> Unverified. Family characterisations are pending agronomist confirmation per crop (Family A: Naren Solanki — see *Named roles* below; Family B: not yet assigned). TODO: confirm establishment method, cycle length and harvest pattern for each crop in its pack; the pack is authoritative once written.

- **Family A — vegetables** (chilli, tomato, okra): short cycle, high spray frequency, multi-pick harvest. Chilli and tomato are usually transplanted; okra is usually direct-sown. PHI and re-entry dominate, because harvest repeats weekly.
- **Family B — field crops** (cotton, soybean): long cycle, direct-sown, largely rainfed, single harvest. Activates the weed module; cotton additionally activates resistance management and Bt refuge rules.

One schema. The `family` field decides which optional modules activate. Never fork the schema per crop.

## Never merge these three concerns

> Founder-set. The Telugu example below is field knowledge of the founder's network.

- **Crop pack** — agronomy: stages, pests, interventions, safety rules.
- **Language pack** — words: UI strings, agro glossary, profanity lexicon, uncertainty phrasing.
- **Region pack** — place: local pest names, local units, district calendars.

The same Telugu word differs between Telangana and coastal Andhra. That is a region concern, not a language one.

## Every crop pack requires

- Named agronomist **author** and a separate named **approver**
- `references[]` on every agronomic claim — no source, no claim
- Declared confusion pairs for look-alikes (thrips vs mite in chilli is the canonical one)
- Complete safety block: PHI, re-entry, max sprays per season, restricted molecules
- Interventions are classes, not products

## Named roles — crop packs

> Founder-set. Names are recorded here so pack `author` / `approver` / breeder fields resolve to a real person. Add names here before using them in a pack.

| Person | Roles | Crops | Contact |
|---|---|---|---|
| Naren Solanki | Agronomist **and** breeder · pack **author** **and** pack **approver** | chilli, tomato, okra (Family A) | narensolanki2004@gmail.com |

- Naren Solanki developed all the hybrids for these three crops and therefore holds both the agronomist and breeder roles for them.
- For the chilli, tomato and okra packs, record the same name and email — Naren Solanki, narensolanki2004@gmail.com — in both the `author` and `approver` fields. The requirement that every pack carry a named author and a named approver is unchanged; this is the interim assignment until additional names are added.
- Additional names will be added in due course. Cotton and soybean (Family B) have no named agronomist, breeder, author or approver yet.

## Every language pack requires

- Agro glossary reviewed by a native speaker with agricultural familiarity
- Profanity lexicon including romanized and code-mixed forms
- Uncertainty and safety phrasing, human-authored
- All Indic strings in native script. Romanised/transliterated Indic degrades TTS quality and is prohibited. Code-switched English words remain in Latin.

## On any pack change

Re-run evals for every agent listing that pack type in `requires_packs`. CI will enforce this via `make gate-evals` — not yet built. Until it is, re-running dependent evals after a pack change is a manual step and must be stated in the PR description.

## Never

- Add a pack field to work around an agent limitation. Fix the agent.
- Ship a pack without an approver recorded.
