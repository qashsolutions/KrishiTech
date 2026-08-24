# Navigation & Screen Inventory

Single Android APK. Role resolved at login. Kotlin + Jetpack Compose. `targetSdk 36`.
Languages: te-IN, ta-IN, kn-IN, mr-IN, hi-IN. English: pre-login UI default; post-login available as the transcript translate-mode toggle for all roles.

`P1` = MVP · `P1.5` = fast-follow · `P2` = later.

---

## 1. Principles

1. **Voice is a channel, not a screen.** The mic works from everywhere. No screen is voice-only, none is voice-inaccessible.
2. **Four destinations maximum.** Bottom nav, always visible, never a hamburger for primary navigation.
3. **Every screen can be spoken.** Long-press any nav item or heading speaks it. Assumes no literacy.
4. **Every screen can be complained about.** Feedback is reachable in one action from every screen, voice-enabled, context attached.
5. **No dead ends.** Every error, empty, and blocked state offers a next action, spoken.
6. **Answer before ask.** The app's own answer is always free — never gated behind a prompt, a paywall, or a permission. A human expert or a nearby dealer is an optional extra on top of the free answer, offered in plain words; the expert is paid, and the price is said before the farmer commits. *(Reworded 2026-08-24 with the paid expert.)*

---

## 2. Navigation model

> Founder-set. Interaction assumptions in this section (hold-vs-tap split, dealers prefer typing) are field knowledge of the founder's 200-farmer network.

### Farmer — bottom nav with docked mic

```
┌──────────────────────────────────────────────┐
│                                              │
│                  content                     │
│                                              │
├────────┬────────┬──────────┬────────┬────────┤
│  Home  │  Crop  │   ( ● )  │History │  More  │
└────────┴────────┴──────────┴────────┴────────┘
                     mic 72dp
```

- Mic is docked centre, 72dp, identical position on every screen.
- **Hold-to-talk** for short input, **tap-to-start / tap-to-stop** for long. Both supported — rural users split on which they expect.
- Barge-in permitted: speaking interrupts playback.
- Icons + labels in local script; long-press speaks the label.

### Dealer

```
│ Demand │ Leads │ Counter │ More │      mic 48dp, top-right
```
Literate, data-dense users. Voice available but not primary; typing is faster for them.

### FPO

```
│ Members │ Alerts │ Demand │ More │      mic 48dp, top-right
```

---

## 3. Shared — pre-login & onboarding

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| S-01 | Splash / language picker (English default, 5 languages shown in own script + spoken) | — | ✅ | P1 |
| S-02 | Phone number entry | auth | ✕ | P1 |
| S-03 | OTP verification | auth | ✕ | P1 |
| S-04 | Terms, privacy & consent (spoken summary, not a wall of text) | consent | ✕ | P1 |
| S-05 | Role resolution (farmer / dealer / FPO; picker only if multi-role) | auth | ✕ | P1 |
| S-06 | Permission primer — mic, camera, location, notifications, each with a spoken reason and a skip path | — | ✅ | P1 |
| S-07 | Biometric setup (optional, skippable) | auth | ✅ | P1 |

**Location is optional.** Manual district picker is a first-class alternative, not a fallback buried in settings.

### Farmer onboarding

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| F-01 | Add field — name, area (local units: guntha, cent, acre) | context | ✅ queued | P1 |
| F-02 | Field location — GPS pin or manual district/village | context | ◐ | P1 |
| F-03 | Crop, variety, sowing date (voice-first; spoken dates normalised) | context, crop-stage | ✅ queued | P1 |
| F-04 | Assisted-mode banner — **formal** assisted mode: a field officer or dealer is registering on the farmer's behalf, attributed in the graph | context | ✅ | P1 |
| F-05 | Setup complete + first stage-appropriate tip | crop-stage | ◐ | P1 |

**Assisted mode has two forms.** *Formal* — a field officer or dealer acts on the farmer's behalf; shown by the F-04 banner and attributed in the farm graph. *Informal* — a literate family member reads the screen for the farmer, the common case at home or a village centre (usage context, `docs/project-structure.md` §1); requires no login and no attribution.

---

## 4. Farmer screens

### Home & crop

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| F-10 | Home — four tiles: my crop, weather→action, report issue, ask agent | orchestrator | ◐ cached | P1 |
| F-11 | Crop timeline — stage now, next three tasks | crop-stage | ✅ | P1 |
| F-12 | Task detail — what, why, when, how | crop-stage, nutrition | ✅ | P1 |
| F-13 | Weather → action — decision first, forecast second, staleness stated | weather | ◐ | P1 |
| F-14 | Field switcher — for multi-field farmers | context | ✅ | P1 |

### Report a problem

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| F-20 | Guided capture — up to 3 images: whole plant → affected part → leaf underside, each prompted aloud | vision | ✅ queued | P1 |
| F-21 | Image review — retake or drop before submit | vision | ✅ | P1 |
| F-22 | Voice description — optional, added to the same case. Transcript renders in codemix mode; re-record is the primary correction; inline English transcript toggle | speech | ✅ queued | P1 |
| F-23 | Submitted / queued — "saved, will send when signal returns" | — | ✅ | P1 |
| F-23a | Transcript confirm — shows the codemix transcript, offers re-record, speaks the interpretation back for confirmation; inline English transcript toggle | speech, clarification | ✕ | P1 |
| F-24 | Clarification — exactly one question at a time, spoken | clarification | ✕ | P1 |
| F-25 | Diagnosis card — what, why, when, dose, precautions, alternatives; spoken and shown | diagnosis, treatment, agronomic-safety | ✕ (cached after) | P1 |
| F-26 | Confusion-pair card — "it is one of these two, here is how to tell" | diagnosis | ✕ | P1 |
| F-27 | Expert pending — a person is looking, with ETA | escalation | ◐ | P1 |
| F-28 | Dealer availability — full stock view after the recommendation is locked; from a low-confidence diagnosis, a nearby-dealer connect without stock or recommendation (2026-08-24) | input-match | ✕ | P1.5 |
| F-29 | Action confirm — did it / skipped / later, one tap | outcome | ✅ queued | P1 |
| F-30 | Follow-up — better / same / worse, one question | outcome | ✅ queued | P1 |

F-25 is consumed at home or a village centre, not at a field glance (usage context, `docs/project-structure.md` §1) — it may carry fuller content than a field-glance UI would allow: full why, alternatives and precautions.

### Ask & history

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| F-40 | Ask agent — open voice question, transcript shown; inline English transcript toggle | orchestrator, triage | ✕ | P1 |
| F-41 | Answer — spoken, replayable, with "hear again" always present; inline English transcript toggle | rendering, speech | ◐ replay cached | P1 |
| F-42 | Case history — past problems and outcomes | context | ✅ | P1 |
| F-43 | Case detail — full thread, thumbnails, what was advised, what happened | context | ✅ | P1 |

### Images & storage

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| F-50 | My images — grid of 10, labelled date + crop + diagnosis, spoken on long-press | media | ✅ | P1 |
| F-51 | Storage full prompt — appears **after** the diagnosis; states exactly how many to free | media, entitlements | ◐ | P1 |
| F-52 | Delete picker — oldest pre-selected; grouped by case; explicit confirm, spoken, no undo | media | ✅ | P1 |
| F-53 | Buy image slots — ₹100 / 500, Google Play Billing | payments | ✕ | P1 |

Full-resolution images are deleted; thumbnail plus extracted features are retained permanently so case history never breaks.

---

## 5. Dealer screens

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| D-01 | Catchment dashboard — crop stages, active problems, aggregated | demand-forecast | ◐ | P1.5 |
| D-02 | Demand forecast — next 14 days by intervention class | demand-forecast | ◐ | P1.5 |
| D-03 | Leads — consented farmers, each with the agronomic reason | input-match | ◐ | P1.5 |
| D-04 | Lead detail — the case, the recommendation, what to stock | input-match | ◐ | P1.5 |
| D-05 | **Counter mode** — walk-in farmer lookup; shows the current recommendation at the counter | context, input-match | ◐ 7-day cache | P1.5 |
| D-06 | Log order — product, quantity, farmer | context | ✅ queued | P1.5 |
| D-07 | Stock — inventory and gap alerts | input-match | ✅ queued | P1.5 |
| D-08 | Forecast accuracy — how good last cycle's prediction was | demand-forecast | ◐ | P2 |

Dealers see aggregate demand plus consented leads only. Never another farmer's raw diagnosis.

---

## 6. FPO screens

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| P-01 | Member list — crop, area, stage | aggregation | ◐ | P1 (read-only) |
| P-02 | Crop map — village-level distribution | aggregation | ◐ | P1.5 |
| P-03 | Cluster alerts — spreading problem detected across members | aggregation | ✕ push | P1 |
| P-04 | Alert detail — affected members, recommended coordinated response | aggregation | ◐ | P1.5 |
| P-05 | Pooled input demand — by week, for group buying | aggregation | ◐ | P2 |
| P-06 | Harvest window — expected volume and dates | harvest | ◐ | P2 |
| P-07 | Notify members — voice message in their language | notify | ✕ | P2 |

---

## 7. Settings, support & safeguarding

| ID | Screen | Backing | Offline | Phase |
|---|---|---|---|---|
| S-20 | Settings home | — | ✅ | P1 |
| S-21 | Language — change any time; re-downloads pack if needed. Default state of the English transcript toggle (per user, default off) | i18n | ◐ | P1 |
| S-22 | Region / district — correct what GPS guessed | context | ✅ | P1 |
| S-23 | Theme — dealer/FPO: day / night / system. Farmer: day only in P1 (`design-system.md` §2.5) | — | ✅ | P1 |
| S-24 | Profile — name, phone, fields | context | ✅ | P1 |
| S-25 | Security — biometric unlock toggle | auth | ✅ | P1 |
| S-26 | Notifications & quiet hours | notify | ✅ | P1 |
| S-27 | Data & privacy — consent toggles, incl. **"help improve advice for other farmers"** (separate from any paid feature) | consent | ✅ | P1 |
| S-28 | Storage & plan — slots used, buy more, manage | entitlements, payments | ◐ | P1 |
| S-29 | Export my data | privacy | ✕ | P1 |
| S-30 | Delete my account — irreversible, spoken confirmation, matches the Play-required deletion URL | privacy | ✕ | P1 |
| S-31 | Terms, privacy policy, content policy | — | ✅ | P1 |
| S-32 | About — version, licences | — | ✅ | P1 |
| S-33 | Delete my data — Play-required partial deletion: cases, photos and answers erased; account, phone, fields and crops kept. Spoken or tapped confirmation; done state returns to S-27. Entry rows on S-20 and S-27 | privacy | ✕ | P1 |
| S-40 | **Feedback sheet** — reachable from every screen; voice or text; auto-attaches screen, case ID, app version, device, language | support | ✅ queued | P1 |
| S-41 | Help — how to use, short spoken clips | — | ✅ | P1 |
| S-42 | **Support screen** — the safeguarding surface. Helpline, surface rules and constraints are owned by `docs/safeguarding-protocol.md` (S-42 section). Never visible to dealer or FPO. | safeguarding | ✅ | P1 |

S-42 is specified in `docs/safeguarding-protocol.md` and must not be designed by engineering alone.

---

## 8. States every screen implements

No screen is done without all applicable states.

| State | Requirement |
|---|---|
| Loading | Never a bare spinner. Say what is happening. |
| Empty | Explain why it is empty and what to do next. |
| Error | Plain-language cause + one-tap retry. Never a code. |
| Offline | Per `docs/offline-matrix.md`. Say when it will send. |
| Degraded | Show data age explicitly. "This forecast is from yesterday evening." |
| Blocked | Content gate fired. Polite, non-accusatory, redirect. |
| Low confidence | Never hidden. Say we are unsure and what would make us sure; offer more photos, the paid expert, and a dealer nearby. |
| Queued | Confirm capture succeeded, state what happens next. |

Every state has a spoken form. English-only failure text is a bug.

---

## 9. Voice rules

- Mic available on every screen, same position, same size.
- **Readback before commit** on anything numeric — dose, area, date, quantity. Spoken back, confirmed, then written.
- "Hear it again" persists on every answer.
- Uncertainty is spoken in approved per-language phrasing from `skills/uncertainty`, never machine-translated.
- Barge-in always allowed.
- Quiet hours respected for all proactive voice and notifications.
- Long-press any nav item, heading, or image tile to hear it.
- **English transcript toggle** — inline on every transcript view (F-22, F-23a, F-40, F-41); default state set in S-21, persisted per user, default off. Display-only — behaviour and scope in `docs/voice-design.md`, reasoning in `docs/adr/0002-farmer-facing-english-toggle.md`.

---

## 10. Accessibility & device

> Unverified. The `minSdk 26` floor. TODO: confirm against India Android version distribution before locking the floor; owner `docs/device-constraints.md`.

- Minimum touch target 56dp for primary actions, 72dp for the mic.
- Must render correctly at the largest system font scale.
- Full contrast compliance in both day and night mode.
- No colour-only signalling — pair with icon or text.
- Screen-reader labels on everything, in the active language.
- `minSdk 26` recommended; validate every screen on the device floor in `docs/device-constraints.md`, not on a flagship.

---

## 11. Counts

| Role | P1 | P1.5 | P2 | Total |
|---|---|---|---|---|
| Shared / onboarding | 12 | 0 | 0 | 12 |
| Farmer | 24 | 1 | 0 | 25 |
| Dealer | 0 | 7 | 1 | 8 |
| FPO | 2 | 2 | 3 | 7 |
| Settings / support | 17 | 0 | 0 | 17 |
| **Total** | **55** | **10** | **4** | **69** |

Seed production module (P2) is not counted — it is a separate surface, specified later. The farm graph schema must be able to represent a grower contract so it is not blocked.

---

## 12. Open

Full list: `docs/README.md`.

| Question | Blocks |
|---|---|
| ~~Multi-role users — switcher or separate logins?~~ **Resolved: one login, primary + secondary roles — ADR 0008** | resolved |
| ~~Dealer counter-mode consent — per-lookup or once?~~ **Resolved: once at group join, minimum scope, visible log, one-tap revoke — ADR 0007** | resolved |
| Bystander re-auth surface — cited by `design-system.md` §0 (FIX W) but has no screen ID in this inventory | `role-permissions.md`, S-25 |
| Number-change flow — `identity.md` requires re-verify + carried history; no screens inventoried | `identity.md`, S-24 |
| Console screen inventory — expert, authoring and admin consoles are P1 with no screen spec | `consoles/` |
