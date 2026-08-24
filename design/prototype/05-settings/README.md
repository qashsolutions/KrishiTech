# Chunk 05 — Settings, support & safeguarding (S-20…S-32, S-40…S-42)

Interactive HTML prototype of `docs/navigation-ia.md` §7. **Open `index.html`
in any modern browser.** Shared tokens/styles/strings/framework in
`../shared/`. Reached from the bottom nav's "More" on any post-login screen.

## S-42 — read this before any user session

Built strictly from `docs/safeguarding-protocol.md`:

- Tele-MANAS **14416** / **1800-89-14416**, 24/7, free — **the protocol's TODO
  stands: these numbers must be verified by the clinical reviewer before any
  build (including this prototype in a field session) shows them to users.**
- Surface per design-system §2.7: white, no brand colour, no urgent red, no
  logo, no app bar, no bottom nav, no mic FAB. One action (call). Numbers
  shown and spoken.
- Never auto-opened; entry is one deliberate, fully-labelled button at the
  end of Help (S-41) — not in the settings list, not adjacent to common taps.
- The S-42 copy is safeguarding phrasing — the class packs/CLAUDE.md requires
  to be **human-authored**. The draft here is layout scaffolding only and
  needs clinical + native-speaker review more than any other string in the
  prototype.
- Never visible to dealer/FPO (single-role farmer prototype; enforce at role
  routing in the app).

## Other spec-critical behaviours

- **S-27**: "help improve advice for other farmers" is **off by default**,
  its note states it is never tied to a paid feature (project-structure §1);
  dealer visibility is restated; export/delete live here.
- **S-30**: irreversible-delete framing, **spoken confirmation** step (say
  the phrase aloud, or tap), statusUrgent destructive confirm, and the
  Play-required deletion URL as a bracketed placeholder `[DELETION URL]`.
- **S-23**: farmer P1 is light-only (design-system §2.5) — night/system rows
  are disabled with a plain-language reason.
- **S-21**: language change works offline for installed packs; the offline
  state explains a new pack can't download without signal (◐).
- **S-40**: voice-or-text feedback with the auto-attached context shown as
  chips (screen ID, version, language, device); ✅ queued offline.

## State coverage

S-20/S-22…S-28/S-31/S-32/S-41/S-42: default · S-21: default+offline ·
S-29: default+requested+offline · S-30: default+confirm+offline ·
S-40: default+listening+queued. 22 board tiles.

## UNSPECIFIED — decisions neither doc states (chunk 05 additions)

1. **S-42 entry point**: the protocol forbids accidental reach but names no
   entry; used one deliberate labelled button at the end of Help. Ratify.
2. **S-42 draft copy** ("Talking helps…") — layout scaffolding pending
   human authoring + clinical review (see above).
3. **S-23 farmer theme conflict**: nav-ia lists day/night/system; design-
   system §2.5 makes farmers light-only in P1 — rendered with night/system
   disabled + reason. One of the two docs should be amended.
4. **S-40 attached-context chips** (screen ID, version, language, device)
   shown to the user before sending — nav-ia says auto-attached but not
   whether it is visible. Shown deliberately (transparency).
5. **Feedback everywhere**: the real app reaches S-40 in one action from
   every screen (principle 4); the prototype reaches it via Settings — a
   global affordance is app-chrome work for the real build.
6. **Delete-account end state**: prototype returns to S-01 after confirm.
7. Sample profile name "Ramu"; quiet hours "9 pm–6 am" are sample values.

DEVIATIONS unchanged from chunk 01 (see `../01-onboarding/README.md`).
