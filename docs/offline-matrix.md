# Offline Matrix

What works without a network, what degrades, and what fails. Binding on every screen.

**Network reality:** farmers are on intermittent 4G/LTE in fields, not Wi-Fi. Assume slow, lossy, and frequently interrupted — not absent. Design for *unreliable*, not *offline*.

> Founder-set. Network assumptions here and under Sync triggers (intermittent 4G/LTE in fields, prepaid data) are field knowledge of the founder's 200-farmer network.

---

## Principles

1. **Capture always works.** Recording a problem, a photo, or a voice note must never require a network.
2. **Never lose farmer input.** Anything captured is queued durably before the UI acknowledges it.
3. **Never silently drop.** If something cannot sync, the farmer is told, in their language, with what happens next.
4. **Read what we already know.** Cached crop timeline, last recommendation, and stage tasks stay available.
5. **Never fake an answer.** Diagnosis requires the server. Offline shows "queued", never a guessed result.
6. **Idempotent by default.** Every queued action carries a client-generated ID. Retries must not duplicate.

**Usage context** (locked decision, `docs/project-structure.md` §1): capture happens at the farm on poor connectivity; consumption happens at home or a village centre. Capture paths **must** be bulletproof offline. Consumption paths may assume connectivity. This is a priority statement, not a reduction — it does not weaken any capability in the matrix below.

---

## Capability matrix

`✅ full` · `◐ degraded (cached/queued)` · `✕ online only`

### Farmer

| Screen / action | Offline | Notes |
|---|---|---|
| App launch, login session | ✅ | Session cached; biometric unlock works offline |
| First-time OTP login | ✕ | Requires network |
| Home, four tiles | ◐ | Renders from cache; staleness shown |
| Crop timeline, stage tasks | ✅ | Crop pack + stage cached at login and on pack update |
| Weather → action | ◐ | Last fetched forecast, with age stated aloud and on screen |
| Capture photo (up to 3) | ✅ | Compressed and queued locally |
| Record voice note | ✅ | Audio queued; STT runs on sync |
| Transcript confirm (F-23a) | ✕ | STT runs on sync; transcript not available offline |
| Submit problem report | ◐ | Queued; farmer told "will be sent when signal returns" |
| Receive diagnosis | ✕ | Server-side; delivered on sync via notification |
| View past recommendations | ✅ | Cached, including thumbnails |
| Replay last answer (TTS) | ◐ | Cached audio replays; new synthesis needs network |
| Mark action taken | ✅ | Queued |
| Answer follow-up (better/same/worse) | ✅ | Queued |
| Feedback / support comment | ✅ | Queued with full context |
| Language change | ✅ | If pack already downloaded; otherwise queued |
| Settings, theme, profile view | ✅ | |
| Buy image slots | ✕ | Play Billing requires network |
| Data export / account deletion | ✕ | Must be server-confirmed |

### Dealer

| Screen / action | Offline | Notes |
|---|---|---|
| Catchment demand view | ◐ | Last synced snapshot, age shown |
| Lead list | ◐ | Cached |
| Counter mode lookup | ◐ | Cached for farmers seen in last 7 days; otherwise online only |
| Log an order | ✅ | Queued |
| Stock update | ✅ | Queued |

### FPO

| Screen / action | Offline | Notes |
|---|---|---|
| Member list, crop map | ◐ | Cached |
| Cluster alerts | ✕ | Computed server-side; push only |
| Pooled demand | ◐ | Cached snapshot |
| Notify members | ✕ | Requires network |

---

## Outbox

All writes go through a durable local outbox.

```
outbox_item {
  client_id        uuid        # generated on device; the idempotency key
  type             enum        # problem_report | action_taken | outcome | order | feedback | ...
  payload          blob
  media_refs[]     local_uri[]
  created_at       timestamp   # device clock
  attempts         int
  last_error       string?
  state            enum        # queued | uploading | synced | failed | needs_user
}
```

- **Idempotency:** the server dedupes on `client_id`. A retried upload never creates a second case.
- **Ordering:** items for the same field sync in creation order. Cross-field order does not matter.
- **Retry:** exponential backoff, capped. After the cap, state becomes `failed` and the farmer is told.
- **Clock skew:** device timestamps are untrusted. Server records receipt time; device time is kept as `reported_at` for ordering only.
- **Durability:** the outbox survives app kill, reboot, and update. Never held in memory only.

---

## Media queue

- **Batch limit: 3 images per case.** Guided capture — whole plant, affected part, underside of leaf. Guidance is spoken, not just shown.
- All 3 images belong to **one case, one diagnosis** — never three separate diagnoses.
- Compressed on device before queueing. EXIF stripped except the coarse location we are permitted to keep.
- **Per-image screening:** each is gated independently. If 1 of 3 is blocked or unusable, the case proceeds with the remaining images and `needs[]` reflects what is missing. Never fail the whole case.
- Blocked or unusable images **never consume a quota slot**.
- Upload on unmetered or good connection first; allow user-initiated "send now" on mobile data.

### Quota interaction while offline

- Quota is evaluated **at sync**, not at capture. Capture is never blocked.
- Partial overflow is stated precisely: 8 stored + 3 new → prompt says "free up 1", not "storage full".
- If the farmer abandons the prompt: the **diagnosis is still delivered**; unstored images are held for 7 days, then dropped with a warning first.
- Multiple queued cases produce **one consolidated prompt** at sync, never one per image.

---

## Conflict resolution

Conflicts are rare because farmer writes are append-only events, not mutations.

| Case | Rule |
|---|---|
| Same event queued twice | Deduped by `client_id` |
| Outcome recorded twice for one case | Latest wins; both retained in the event log |
| Field edited on two devices | Last-write-wins on the field record; both writes retained in the log |
| Dealer stock updated concurrently | Server value wins; device refetches and shows a notice |
| Pack updated while items queued | Queued items process against the pack version current **at sync**, recorded in provenance |

The append-only event log means nothing is overwritten — only the projection resolves. Any conflict can be audited after the fact.

---

## Sync triggers

- App foreground
- Connectivity regained (network callback)
- Periodic background job (WorkManager), respecting battery and Doze
- Explicit user action: "send now"
- After a successful Play Billing purchase (entitlement refresh)

Never sync on a metered connection for anything non-essential. Farmers are on prepaid data.

---

## What the farmer experiences

Every offline state has a spoken message, not just an icon.

| State | Spoken |
|---|---|
| Captured while offline | "Saved. It will be sent when your phone has signal." |
| Syncing | "Sending now." |
| Answer ready after sync | Push notification, then the answer spoken on open |
| Sync failed after retries | "Could not send. Try again, or ask for help." + one-tap retry |
| Stale weather | "This forecast is from yesterday evening." |
| Diagnosis unavailable offline | "I need signal to look at this photo. It is saved." |

Never show a bare spinner, a raw error code, or an English-only failure.

---

## Device budget

- Outbox + cached packs + thumbnails must stay within a defined cap (set in `docs/device-constraints.md`).
- Cache eviction order: oldest cached weather → oldest non-quota thumbnails → cached TTS audio. **Never evict outbox items.**
- Warn the farmer before the app is unable to queue new captures.

---

## Testing requirements

Every release must pass:
- Airplane mode capture → restore → sync, with no data loss
- Kill app mid-upload → relaunch → resumes without duplication
- Same case submitted twice → one case server-side
- 3-image case with 1 image blocked → case proceeds
- Quota overflow while offline → single consolidated prompt at sync
- Sync on 2G-speed throttled connection
- Device date changed manually → ordering still correct
- Low storage → graceful warning, outbox preserved
