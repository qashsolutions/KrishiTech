# KrishiTech — Design System

**Status:** authoritative for P1 · **Date:** 2026-08-23
**Scope:** Android app (farmer, dealer, FPO) — single APK, role resolved at login.

> **This file is the source of truth for every visual value in the app.**
> Chunks B–E transcribe from it; they do not invent. If `Color.kt`, `Type.kt`,
> `Shape.kt` or `Dimens.kt` disagrees with this file, this file wins until it is
> amended by PR. Amend here first, then change code.

---

## 0. Inputs this rests on

| Input | Source |
|---|---|
| Kotlin + Jetpack Compose, `targetSdk 36`, `minSdk 26` | `project-structure.md` §1 |
| Single APK, role resolved at login | `project-structure.md` §1 |
| Voice-first; text is backup, not the primary channel | ADR 0002 · `voice-design.md` |
| Languages: te-IN, ta-IN, kn-IN, mr-IN, hi-IN + en-IN display-only | `project-structure.md` §1 · FIX L/U |
| Capture at the farm on poor connectivity, consume at home | ADR 0001 |
| Confidence thresholds on every recommendation | ADR 0003 |
| Bystander visibility / re-auth screens | `role-permissions.md`, FIX W |
| Safeguarding screen S-42 has its own visual rules | FIX S |

---

## 1. Two-layer token model

Every colour in the app belongs to exactly one of two layers.

| Layer | Varies by role? | Contents |
|---|---|---|
| **Brand / chrome** | **Yes** | `primary`, `secondary`, `tertiary`, their containers, nav bar, app bar, FAB, selection, focus ring |
| **Semantic** | **No — identical in all roles** | severity, confidence, sync state, safeguarding, error |

**Why the semantic layer cannot vary.** A diagnosis marked urgent is reviewed by an
FPO officer and, in P1.5, referenced by a dealer. If severity rendering shifts with
the palette, the farmer app and the expert console disagree about how bad a case is.
The event log is shared; its visual encoding must be too.

**Enforcement:** semantic tokens live in a separate file from brand tokens and are not
members of `ColorScheme`. See §10.

---

## 2. Colour

### 2.1 Seeds

Do not hand-write tonal ramps. Feed these seeds to Material Theme Builder, export the
Compose theme, and paste the export. Hand-authored M3 role sets are where contrast
regressions get in.

| | Farmer | Dealer / FPO |
|---|---|---|
| Primary seed | `#17643B` deep leaf | `#2F3E9E` deep indigo |
| Secondary seed | `#7A5B12` earth ochre | `#4A5568` slate |
| Tertiary seed | `#0E5C63` deep teal | `#6B4E71` muted plum |
| Neutral seed | `#5C5F58` | `#5A5C63` |

Green and indigo are the safest available pair for red–green colour vision deficiency:
green shifts under deuteranopia, indigo does not. But hue is never the only signal —
see §2.6 and §8.

### 2.2 Material You is off

Dynamic colour replaces the entire scheme from the user's wallpaper on Android 12+,
which destroys role differentiation — the whole purpose of two palettes.

**Delete the dynamic branch entirely. Do not leave `dynamicColor` as a parameter.**
A parameter is a thing someone flips later. There is no supported configuration of this
app in which dynamic colour is correct.

### 2.3 Semantic tokens — shared, role-independent

Light surface assumed `#FCFCF9`. Contrast figures are against that surface.

| Token | Light | Dark | Used for | Never used for |
|---|---|---|---|---|
| `statusUrgent` | `#B3261E` | `#F2B8B5` | Act-now severity; destructive confirm | Generic errors, offline |
| `statusUrgentContainer` | `#F9DEDC` | `#601410` | Urgent chip fill | — |
| `statusCaution` | `#8A5000` | `#FFB86B` | Watch-this severity | Sync pending, low confidence |
| `statusCautionContainer` | `#FFDDB0` | `#2B1700` | Caution chip fill | — |
| `statusInfo` | `#0B5C8A` | `#82CFFF` | Neutral advisory, tips | Success |
| `statusInfoContainer` | `#CDE7F8` | `#00344F` | Info chip fill | — |
| `outlineQuiet` | `#6F7A6B` | `#8A938A` | Healthy state outline, dividers | Any alert |
| `confidenceFill` | `#3D4A5C` | `#AEBBD0` | Filled confidence segments | Severity |
| `confidenceTrack` | `#C7CBD1` | `#404652` | Unfilled confidence segments | — |

**Healthy has no colour.** There is no green "all clear" chip. A healthy result is an
outline, an icon and a sentence. The absence of a coloured chip *is* the signal. This
is deliberate: it removes the collision with the farmer brand green, and it stops the
screen shouting when nothing is wrong.

### 2.4 Two independent scales must not both be hue

The diagnosis card shows **severity** of the problem and **confidence** of the agent at
the same time. These are orthogonal — a high-confidence "nothing wrong" and a
low-confidence "possibly urgent" are both common and mean very different things.

| Scale | Encoding | Never |
|---|---|---|
| Severity | Hue — urgent / caution / none | Tone, size |
| Confidence | Three segments, filled 1–3, single hue `confidenceFill`, plus a spoken and written label | Red / amber / green |

Confidence bands come from ADR 0003. When that ADR moves from `proposed` to `accepted`,
check the band count still matches three segments; if it doesn't, amend here first.

### 2.5 Dark theme

| Role | P1 stance |
|---|---|
| Farmer | **Light only.** No dark scheme built, no system following. |
| Dealer / FPO | Follows system. |

**Reasoning.** Farmers use the app outdoors in direct sun on low-end LCD panels. Dark
themes reduce effective contrast in high ambient light, and LCD gains no battery benefit
from dark pixels the way OLED does. Building a farmer dark theme in P1 doubles the
surfaces to test in exchange for a mode that is worse in the primary usage context.

**Counter-argument, recorded not accepted:** ADR 0001 says consumption often happens at
home in the evening, which is exactly when dark mode helps. If field testing shows heavy
evening reading, revisit. This is a P1 scope decision, not a permanent one.

### 2.6 Colour is never the only channel

Every state carries **at least two** of: colour · icon or shape · text or speech.
A state readable only by hue is a defect, not a style choice. This is not primarily an
accessibility checkbox — it is a sunlight and cheap-panel requirement.

### 2.7 Safeguarding screen S-42

Overrides everything above. No brand colour of any kind, no role palette, no urgent red,
no logo. Surface `#FFFFFF`, text `#1C1B1F`, one action. Calm, unbranded, no upsell.
Not reachable from a bystander-visible surface — see `role-permissions.md`.

### 2.8 Pre-login screens (S-01–S-04)

> Founder-set.

Role is resolved only at S-05, so S-01–S-04 carry no role. Pre-login screens render in
the **farmer** palette. The first-run audience is overwhelmingly farmers, and a third
neutral palette would double the pre-login surfaces to test for no benefit. Revisit only
if a dealer-first distribution channel appears.

---

## 3. Typography

### 3.1 Font per locale

Noto is the only family with consistent design and matching vertical metrics across all
four scripts. All are Apache 2.0 or OFL.

| Locale | Script | Family |
|---|---|---|
| hi-IN, mr-IN | Devanagari | Noto Sans Devanagari |
| te-IN | Telugu | Noto Sans Telugu |
| ta-IN | Tamil | Noto Sans Tamil |
| kn-IN | Kannada | Noto Sans Kannada |
| en-IN | Latin | Noto Sans |

Weights: **400 and 600 only.** Do not ship 300 — thin weights lose the Devanagari
shirorekha and Telugu matras at body size on a low-DPI panel. Do not ship 700 where 600
will do; each weight is a per-script file.

Prefer the **UI** variants (Noto Sans Devanagari UI, Telugu UI, Tamil UI) where
available — they are vertically compacted for interface use. Availability through
Compose's `GoogleFont` provider is **unverified** — see §11.

### 3.2 Bundle, do not download

Downloadable fonts require Play Services and a network round trip on first render. The
farmer is on poor connectivity at the farm (ADR 0001). A screen that falls back to a
system font on first launch, in a language the system may not have, is a broken screen.

**Bundle the TTFs. Use Play language-based delivery** so a device installs one script,
not four. Latin ships in the base module because en-IN is the pre-login language.

### 3.3 Type scale

Two scales. sp everywhere — never dp for text.

**Farmer** — larger, fewer steps, no step below 16sp anywhere in the app.

| Role | Size | Line height | Weight |
|---|---|---|---|
| `answer` (diagnosis headline) | 32sp | 48sp | 600 |
| `title` | 24sp | 36sp | 600 |
| `bodyLarge` (recommendation text) | 20sp | 31sp | 400 |
| `body` | 18sp | 28sp | 400 |
| `label` (buttons, chips) | 18sp | 24sp | 600 |
| `caption` (timestamps, meta) | 16sp | 24sp | 400 |

**Dealer / FPO** — denser, literate desk and counter use.

| Role | Size | Line height | Weight |
|---|---|---|---|
| `display` | 28sp | 38sp | 600 |
| `title` | 20sp | 28sp | 600 |
| `body` | 14sp | 22sp | 400 |
| `label` | 14sp | 20sp | 600 |
| `caption` | 12sp | 18sp | 400 |

### 3.4 Indic typesetting rules

- **Line height ≈ 1.55×**, above Material's Latin-tuned default. Devanagari's shirorekha
  and Telugu/Kannada matras clip at 1.4×. Values in §3.3 already reflect this.
- **No ALL CAPS, ever.** Indic scripts have no case; an uppercase Latin button next to a
  Telugu one breaks visual parity and signals the UI was designed in English first.
- **No letter-spacing on Indic text.** It breaks conjunct clusters.
- **No italic.** Noto Indic has no true italic; the system synthesises a slant that
  distorts glyphs. Use weight or colour for emphasis.
- The same sp yields different apparent size across these scripts. A per-script optical
  correction factor may be needed — **measure, do not guess** (§11).

### 3.5 Font scaling

Android font scale reaches 200%. Every layout must survive it without clipping or
truncating a diagnosis.

- sp for all text, dp for icons and strokes only.
- No fixed-height containers around text. No `maxLines` on any diagnosis,
  recommendation, safety warning or error message.
- Buttons grow vertically, never truncate their label.

### 3.6 Numerals

**Western Arabic digits (0–9) everywhere** — quantities, prices, dates, phone numbers,
case IDs — in all six locales.

Rationale: mixed digit systems inside one screen are a known error source for prices and
dosages, and dosage errors here have physical consequences. **Confidence: Medium.** This
is a judgement call, not a verified user-research finding; it should be checked with the
field team before it hardens.

---

## 4. Shape, spacing, elevation

| | Farmer | Dealer / FPO |
|---|---|---|
| Corner — small (chip, text field) | 12dp | 4dp |
| Corner — medium (card) | 20dp | 8dp |
| Corner — large (sheet, dialog) | 28dp | 12dp |
| Min touch target | **56dp** | 48dp |
| Screen edge margin | 20dp | 16dp |
| Card internal padding | 20dp | 12dp |

**Spacing scale, shared:** 4 · 8 · 12 · 16 · 24 · 32 · 48 dp. Nothing else. Any other
value in the codebase is a bug.

**Elevation.** Tonal, not shadow. Drop shadows are invisible in direct sunlight and cost
GPU on low-end devices. Farmer cards use a 1dp `outlineQuiet` border plus tonal surface;
dealer/FPO may use M3 tonal elevation as-is.

---

## 5. Voice-first tokens

> Scope: visual, haptic and audio-cue tokens for each mic state only.
> Mic behaviour — hold vs tap, barge-in semantics, readback rules, replay,
> failure speech — is owned by `docs/voice-design.md`. If the two disagree
> about behaviour, voice-design.md wins. If they disagree about a colour,
> duration or size, this file wins.

Voice is the primary input. The mic is the largest interactive element on any farmer
screen where capture is possible.

**Mic size: 72dp** target, bottom-centre, thumb-reachable one-handed. It is a FAB in the
farmer app only.

| State | Colour | Shape / motion | Haptic | Audio |
|---|---|---|---|---|
| Idle | `primaryContainer` fill | Static mic glyph | — | — |
| Listening | `primary` fill | Amplitude ring, live | Single tap on start | Short start tone |
| Processing | `primary` fill | Indeterminate ring | — | — |
| Speaking (TTS) | `primary` fill | Waveform glyph | — | The speech itself |
| Error | `statusUrgent` outline | Static, with text | Double tap | Spoken failure message |
| Queued offline | `outlineQuiet` outline | Static cloud-off glyph | — | Spoken confirmation |

**Rules.**
- Mic state is never communicated by colour alone — every row above has at least two
  channels. A screenshot must be readable without motion.
- Barge-in: touching the mic during TTS stops speech immediately and starts capture. The
  visual transition must be instant, under one frame budget, or users talk over the tail.
- Queued-offline is **not** a warning. Neutral outline, never amber. Capture succeeding
  offline is the designed happy path, not a degraded one.

---

## 6. Motion

- Standard transition 200ms, emphasised 350ms. Nothing above 400ms.
- Reserved for three things: mic amplitude, sync/upload progress, screen transition.
- **No decorative motion in the farmer app.** No parallax, no staggered list entry, no
  ambient animation. Frame budget on the target device is the constraint, and every
  animated pixel is battery in a place where charging is not casual.
- `Settings > Remove animations` respected everywhere. Mic amplitude degrades to a
  static "Listening" label plus the existing haptic and audio cues.

---

## 7. Iconography

- Material Symbols, Outlined, weight 400, 28dp in farmer / 24dp in dealer.
- **Every icon in the farmer app carries a text label.** Icon-only navigation assumes a
  learned vocabulary the audience may not have. No exceptions, including bottom nav.
- Icons are never the sole carrier of severity, confidence, or sync state.

---

## 8. What differs by role, and what must not

| Differs | Identical |
|---|---|
| Primary / secondary / tertiary hues | Severity encoding |
| Corner radius | Confidence encoding |
| Type scale and minimum size | Sync and offline states |
| Touch target minimum | Safeguarding screen |
| Nav model — bottom nav + mic FAB vs top bar + tabs | Error copy voice |
| Dark theme availability | Spacing scale |

Role is also stated in words: a persistent role chip in the app bar reading the role
name in the active language. A palette alone does not tell a user with a multi-role
account which mode they are in — and multi-role accounts exist (ADR 0008).

---

## 9. Accessibility floor

Not aspirational. Chunk E does not pass without these.

- Body text ≥ 4.5:1 against its surface. Large text and UI components ≥ 3:1.
- Touch targets per §4, with 8dp minimum separation.
- TalkBack labels authored **in the active language**, from the language pack — never
  English strings, never auto-generated from an icon name.
- Visible focus indicator on every interactive element, 2dp, `primary`.
- No state distinguishable by colour alone (§2.6).
- Survives 200% font scale (§3.5).

---

## 10. What CI enforces

Add to `ops/ci/consistency-check.md`. These are greps, not judgement calls.

| Check | Rule |
|---|---|
| `gate-no-raw-color` | No `Color(0x` outside `ui/theme/Color.kt` and `ui/theme/Semantic.kt` |
| `gate-no-raw-dp` | No numeric `.dp` outside `ui/theme/Dimens.kt` |
| `gate-no-dynamic-color` | Zero occurrences of `dynamicLightColorScheme` / `dynamicDarkColorScheme` |
| `gate-no-uppercase` | No `.uppercase(` on any user-facing string |
| `gate-no-hardcoded-strings` | No string literal in a Composable outside preview code |
| `gate-token-parity` | Every token in this file exists in code; every token in code exists here |

`gate-token-parity` is the one that keeps this document honest. Without it the file
drifts and stops being the source of truth within two sprints.

---

## 11. Open

| Question | Blocks | Status |
|---|---|---|
| Are Noto **UI** variants reachable via Compose's `GoogleFont` provider, or TTF-only? | Chunk C font declaration | Unverified — check the provider's font list before writing `Type.kt` |
| Per-script optical size correction — do Telugu and Kannada need a different sp than Devanagari at the same role? | Chunk C type scale | Needs measurement on a real device, not calculation |
| Target device — what handset are the 200 farmers actually on? | Sunlight contrast validation, frame budget, APK size ceiling | Unknown. Ask the field team; every performance claim in §6 is inference until this is answered |
| Western Arabic vs native digits (§3.6) | Number formatting, TTS number readback | Decided provisionally, Medium confidence, needs field-team confirmation |
| Does the dealer counter-mode screen need a mic? | Dealer nav model (§8 says no FAB) | Open — D-05 is a farmer-present interaction, so it may |
| Farmer dark theme | Nothing in P1 | Deferred, revisit after field testing (§2.5) |
