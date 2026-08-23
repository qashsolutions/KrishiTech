# Consistency checks

Manual review checks, run by name. Not regex-enforced — judgment checks produce false positives under a pattern and train people to ignore them (`docs/README.md`, provenance rules). Record each run's findings in the PR that triggered it.

| Check | Name | Rule |
|---|---|---|
| CHECK 5 | Restated rules | Any rule stated in root `CLAUDE.md` that is ALSO stated in `agents/`, `skills/`, `packs/`, `backend/`, `android/` or `consoles/` `CLAUDE.md`. **Each rule lives in exactly one `CLAUDE.md`.** |
| CHECK 6 | Contradictions | Any two `CLAUDE.md` files that disagree, including strength mismatches (one says "never", the other "ask"). |

## How to run

1. Read every `CLAUDE.md`: root, `agents/`, `skills/`, `packs/`, `backend/`, `android/`, `consoles/`.
2. CHECK 5 — for each rule in root, search the folder files for the same rule in other words. Folder files may *reference* a root rule ("see root #4"); they may not restate it.
3. CHECK 6 — for each pair of files, look for the same subject with a different instruction or a different strength (never / must / should / ask).
4. Report hits as `file:line — rule — other file:line`. Fix by deleting the restatement or reconciling the strength, never by softening root.

## Run log

| Date | Run by | CHECK 5 | CHECK 6 |
|---|---|---|---|
| 2026-08-22 | Claude (session) | see PR / session report | see PR / session report |
