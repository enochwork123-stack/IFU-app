# QA Bug Log — Admin Dashboard & Backend Sweep (2026-07-19)

Branch: `bug-fix`. All fixes verified live in the browser against the authenticated
dev session. Test data written to Supabase during backend testing was fully
reverted (`admin_whitelist`, `user_progress`, and local wishlist all restored to
their pre-test state).

## Fixed in this sweep

### 1. Admin lesson preview showed card titles twice
- **Where:** `src/components/AdminPreview.tsx` (`LessonPreview`)
- **Symptom:** Cards of kind `scripture-reveal` and `interactive-visual` (e.g. 神的創造 lesson) rendered their title twice in the live preview.
- **Root cause:** The title was rendered once by the generic card header and a second time inside each kind-specific block.
- **Fix:** Removed the duplicate inner `<h3>` blocks.
- **Commit:** `31f19c0`

### 2. Lessons tab unusable when the split preview is open
- **Where:** `src/screens/AdminDashboardScreen.tsx` (lessons tab)
- **Symptom:** On windows narrower than ~1300px the editing column collapsed to ~100px: headings rendered one character per line, inputs were cut off, add-card buttons collapsed into circles.
- **Root cause:** Fixed-width lesson selector (`w-64`) plus the 50% preview split left no room for the editor; grids and header rows had no wrap/min-width handling.
- **Fix:** Lesson selector auto-collapses when the preview opens (still manually expandable); editing pane gets `min-w-0`; field grids became `grid-cols-1 xl:grid-cols-*`; header rows and button groups wrap; add-card buttons are `whitespace-nowrap`.
- **Commit:** `b41020e`

### 3. Home-cards headers wrapped vertically
- **Where:** `src/screens/AdminDashboardScreen.tsx` (home-cards tab)
- **Symptom:** "入口卡片 #N" and the card id badge wrapped one character per line in the split view.
- **Fix:** `whitespace-nowrap` on the label, `truncate` on the id badge, `flex-wrap` on the row.
- **Commit:** `b41020e`

### 4. Silent data-loss trap: 14 of 16 lessons never sync to users
- **Where:** admin lessons tab vs. user lesson screens
- **Symptom:** Editing any lesson other than 得救的確據 / 靈修 updated the preview and localStorage, but the real user page ignored it (verified live on `/journey/prayer-assurance`). Admins could lose work without realizing.
- **Root cause:** Only `SalvationAssuranceScreen` and `QuietTimeScreen` render their modules from `ContentContext.lessonRoutes`; the other lesson screens are fully hard-coded.
- **Fix (mitigation):** Amber warning banner on static lessons in the editor plus a `sync_disabled` badge in the lesson selector. The full fix — converting the 14 static screens to context-driven rendering — is flagged below as future work.
- **Commit:** `b41020e`

### 5. Admin preview was a hand-built replica that could drift
- **Where:** `src/components/AdminPreview.tsx` / `src/screens/AdminDashboardScreen.tsx`
- **Symptom:** The preview components were parallel re-implementations of the user screens; bug #1 above was exactly this class of drift.
- **Fix:** The quiet-time preview and the two synced lesson previews now mount the **real** `LibraryScreen` / `SalvationAssuranceScreen` / `QuietTimeScreen` inside the preview frame — same components, same context, so drift is structurally impossible and unsaved-state questions do not arise (every edit commits to context immediately). A capture-phase click guard swallows link navigation; `translateZ(0)` on the wrapper re-roots `position:fixed` overlays (the 附件A gospel modal) so they open inside the phone frame. The 400-line `QuietTimeLibraryPreview` replica was deleted.
- **Commit:** `13a64a4`

## Backend findings (Supabase)

### 6. Wishlist → GitHub sync is broken: missing `GITHUB_TOKEN` secret
- **Where:** Supabase Edge Function `submit-wishlist`
- **Symptom:** Submitting a wish shows "已儲存於本地！但無法同步至 GitHub Issues：Edge Function returned a non-2xx status code".
- **Root cause (confirmed by reading the 500 response body):** `{"error":"Server misconfiguration: Missing GITHUB_TOKEN secret"}` — the function code is fine; the secret is not set in the Supabase project.
- **Fix required (manual, not doable from code):** create a GitHub PAT with `repo`/issues scope and set it via `supabase secrets set GITHUB_TOKEN=<token>` (or Dashboard → Edge Functions → Secrets), then redeploy/retry.
- The client-side graceful fallback (save locally + warning) works as designed.

### Verified working (no bugs)
- `admin_whitelist` add + remove via the members tab (RLS policies correct; pending-registration list renders and clears correctly). Test row removed afterwards.
- Default-dev / self-protection on 取消管理員 buttons (correctly disabled).
- `user_progress` quiet-time completion toggle from `/library` (insert + delete round-trip, optimistic UI). Restored to baseline afterwards.
- Auth/profile loading and admin gating on `/admin` (`ProtectedRoute requireAdmin`).

## Verified working in the UI sweep (no bugs found)
Home-card add/edit/reorder/delete, journey-step edit/reorder/status, quiet-time
card add/inline-edit/reorder/delete, lesson card add/edit/delete, scripture
sub-editor add/edit/remove, JSON import (including bad-JSON error path),
sidebar collapse, preview show/hide, mobile/desktop preview viewports, wishlist
form open/cancel. End-to-end admin→user sync verified for general texts, home
cards, journey steps, quiet-time entries, and both context-driven lessons
(plain text and structured scripture content), including across full reloads.

## Known issues flagged (not fixed here)
- **Static lessons (see #4):** converting the 14 hard-coded lesson screens to render from `lessonRoutes` is the real fix but is a large, risky refactor of richly hand-crafted screens.
- **Pre-existing TypeScript errors** (~25 lines in `JourneyScreen.tsx`, `LibraryScreen.tsx`, `ProfileScreen.tsx`, `AdminDashboardScreen.tsx`): `tsc --noEmit` fails, though Vite builds don't typecheck so production is unaffected.
- **Profiles promote/demote path** of `handleAddAdmin` (registered users) was not exercised — it would mutate real accounts; only the whitelist path was tested.
- **JSON import replaces the whole content state** — importing a partial config silently resets un-included sections to defaults. Matches the modal's "完全覆蓋" wording, but worth a confirmation UX later.
