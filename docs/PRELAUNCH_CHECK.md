# Pre-Launch Check — Workshop Registration Site

**Date:** 2026-08-30 · **Event:** Sun 7 Sept 2026 · **Mode:** cash-only (no payment gateway)

Last review pass before going live. Scope: admin table usability, resource-person
content, `/install` → `/resources` link, placeholder/broken-link sweep, backend
DB / concurrency review for the check-in desk.

---

## Status — updated 2026-08-30

All code from this pass is **committed + pushed** (`feat/cloudflare-migration-attendance`,
HEAD `28bec43`) and both builds are clean.

| Area | State |
|---|---|
| Frontend (homepage, Resource Persons, `/install` link, theme, nav, footer, link sweep) | **verified — OK** |
| Backend (health, webhook 404, payments-POST guard, concurrent delete, walk-in dup, Mark/Undo Paid) | **verified — OK** |
| **`/admin` page — manual UI walk-through** | **NOT YET DONE — planned for 2026-08-31** |

Nothing outstanding blocks the code. The one remaining task is the hands-on
`/admin` check (item 3 + 8–10 below), which the owner will do on 2026-08-31
before opening registration.

---

## 1. Plan

| # | Area | Action |
|---|---|---|
| A | Admin table | Kill the left/right scroll — replace the 10-column table with a responsive **card grid** (1-up mobile, 2-up on large screens). No `overflow-x`. |
| B | Resource Persons | Real photos (`/prabha.jpeg`, `/dhaya.jpeg`) as avatars; LinkedIn button for Prabhakaran. |
| C | `/install` | Add a visible link to `/resources` (+ back-to-registration). |
| D | Link sweep | Grep every `href` in `app/` + `components/` for placeholders, bare `#`, dead routes, `http://`. |
| E | Backend | Review every mutating admin endpoint for the "two desk staff act on the same row at once" race; fix anything that returns a 500 instead of a clean result. |
| F | Build | `tsc` (backend) + `next build` (frontend) must be clean. |

---

## 2. What was done

### A. Admin dashboard — card layout (no horizontal scroll)
`frontend/app/admin/page.tsx` — the `<table class="min-w-[960px]"> … overflow-x-auto`
is gone. Each registration is now a card in a `grid grid-cols-1 lg:grid-cols-2`:
- header: name + short ID, method + status badges
- body: email, phone, college·dept, year·gender, food, "Registered <date>" in a 2-col grid
- footer: attendance toggle · Mark Paid / Undo Paid · status `<select>` (admin) · Edit · Delete (admin)

Nothing scrolls sideways at any width; twice the records fit per row on a laptop.

### B. Resource Persons
`frontend/app/page.tsx` — avatars are the real photos
(`frontend/public/prabha.jpeg`, `frontend/public/dhaya.jpeg`, copied from `assets/`).
Prabhakaran Dasarathan's card has a **View LinkedIn** button →
`https://www.linkedin.com/in/prabhakaran-dasarathan-05860293/` (opens in a new tab,
`rel="noopener noreferrer"`). Dayanithi Manimaran — no link supplied, no button.
`Linkedin` isn't in this pinned `lucide-react`, so the icon is an inline SVG.

### C. `/install` → `/resources`
`frontend/components/ui/dev-tool-landing-page.tsx` — after the "Need help?" box in
the commands section: a **Workshop Resources** button (`/resources`) + a
**Back to Registration** link (`/#registration`).

### D. Link / placeholder sweep — CLEAN
- Every internal `href` (`/`, `/admin`, `/install`, `/live`, `/privacy`,
  `/refund-policy`, `/resources`, `/terms`) resolves to a real route (13 static
  routes in the build).
- Every hash link (`#home #overview #mission-vision #speaker #registration
  #guidelines`) targets a real section on the homepage. Resource Persons section
  keeps `id="speaker"`, so the footer link still works.
- External links are all legit (python.org, code.visualstudio.com, ollama.com,
  pypi.org, colab.research.google.com, Google Fonts, Font Awesome CDN, the one
  `mailto:bca@shctpt.edu`).
- No bare `href="#"` that navigates. The `/resources` "materials" cards
  (slide deck / starter repo / cheat sheet) render a **disabled
  "Unlocks on Event Day"** button — their `link: "#"` is never used as an href,
  so it's not a broken link. **You still need to fill in the real deck / repo /
  cheat-sheet URLs and flip `ready: true` when they exist** (`app/resources/page.tsx`,
  `const materials`).
- No `yourdomain` / `example.com` / `lorem` / `TODO` / `FIXME` anywhere in the app.

### E. Backend — DB & concurrency review

Reviewed every mutating endpoint in `backend/src/routes/admin.ts` and
`register.ts` for the multi-staff-at-once case:

| Endpoint | Concurrent-access behaviour | Verdict |
|---|---|---|
| `POST /register` | `pg_advisory_xact_lock(hashtext(email))` in a `$transaction` around find-or-create — two submits for one email can't both create a row | safe |
| `POST /admin/registrations/walk-in` | same advisory lock; returns 409 on an existing PENDING/PAID email | safe |
| `PATCH …/mark-cash-paid` | `findUnique` → `update` to PAID. Two clicks → second is a harmless re-write to PAID | safe (idempotent) |
| `PATCH …/unmark-cash-paid` | `findUnique` → early-return if not PAID → `update` to PENDING. Two clicks → second no-ops | safe (idempotent) |
| `PATCH …/attendance` | `findUnique` → `update`. Two clicks → last write wins (attendance, low stakes). Frontend is optimistic and does **not** re-fetch, so two staff toggling the *same* person can briefly disagree until the next "Load Dashboard" | acceptable — noted, not fixed |
| `PATCH …/:id/status` (admin) | `findUnique` → `update`. Last write wins | acceptable |
| `PATCH …/:id` (edit) | `findUnique` → merge → validate → `update`. Last write wins, no crash | acceptable |
| `DELETE …/:id` (admin) | `findUnique` (404 if gone) → `delete`. **Two admins deleting the same row: the second `delete` threw Prisma `P2025` → central handler returned a 500** | **FIXED** |

**Fix applied:**
- `backend/src/index.ts` — the central error handler now maps Prisma `P2025`
  ("record required but not found") → **404** with a clear message
  ("… may have just been changed or deleted by someone else"), and `P2002`
  (unique constraint) → **409**. So any lost race on delete/edit/status is a
  clean result, never a 500.
- `frontend/app/admin/page.tsx` — `deleteRow` now treats **404 the same as 204**
  (row's gone either way) and just refreshes, instead of showing a red error.

Other DB notes (no change needed at this scale):
- `DATABASE_URL` carries `connection_limit=10&pool_timeout=20`. A 2–3-person
  check-in desk is nowhere near 10 concurrent queries; the registration-window
  load is short DB transactions (~3–5 ms) with no external API call in the path
  now that payments are cash-only.
- `/health` does a real `SELECT 1` and 503s on a dead DB — keep the UptimeRobot
  monitor on it.
- Email (`year`/`gender`/`foodPreference` etc.) is validated + length-capped and
  trimmed server-side; no `@unique` on `email` is deliberate (pending-row reuse).

### F. Builds
- `backend`: `tsc` — clean.
- `frontend`: `next build` — clean, 13 static routes.

---

## 3. Verification checklist (after the Cloudflare Pages build goes green)

### Frontend
- [x] **Homepage → Resource Persons**: both photos load and aren't stretched;
  Prabhakaran's **View LinkedIn** opens the correct profile in a new tab.
- [x] **`/install`**: bottom of the commands section → **Workshop Resources**
  button goes to `/resources`; **Back to Registration** goes to the homepage form.
- [ ] **`/admin`** on a **laptop and a phone**: the registration list shows as
  cards, **no horizontal scrollbar** at any width; every action (Present/Absent,
  Mark Paid, Undo Paid, status dropdown, Edit, Delete) is reachable without
  scrolling sideways.  ← **pending, 2026-08-31**
- [x] **Theme toggle** on the homepage form → snaps cleanly, no flicker on reload.
  *(Also re-check on `/admin` during the 2026-08-31 pass.)*
- [x] Nav from `/live`: **Overview** and **Registration** links land you on the
  homepage sections.
- [x] Footer links on `/`, `/success`, `/resources` → Terms / Privacy / Refund all
  open; `#speaker` → Resource Persons.

### Backend (after `git pull && docker compose up -d --build` on the VM)
- [x] `curl -s https://api.shcbca.online/health` → `{"ok":true,"db":true}`.
- [ ] **Concurrent delete**: open `/admin` in two browser windows (admin
  password), load the dashboard in both, click **Delete** on the *same* row in
  both within a second. Expected: one deletes, the other just refreshes — **no
  red error, no 500**.  ← **pending, 2026-08-31 (part of the /admin pass)**
- [ ] **Mark Paid / Undo Paid** round-trips a cash row and the count cards
  update.  ← **pending, 2026-08-31**
- [ ] **Walk-in** with an email that already has a row → 409 "already
  registered" (not a duplicate row).  ← **pending, 2026-08-31**
- [x] `curl -i https://api.shcbca.online/webhook/razorpay` → `404` (payments
  sealed off).
- [x] Payments POST guard:
  `curl -s -X POST https://api.shcbca.online/register -H 'content-type: application/json' -d '{"name":"z z","email":"del@x.com","phone":"9000000000","college":"c","department":"d","year":"1st Year","gender":"Male","foodPreference":"Vegetarian","paymentMethod":"RAZORPAY"}'`
  → response has `"paymentMethod":"CASH"`, no `razorpayOrderId`. (Delete that row after.)

### Still on you before opening registration (unchanged from HANDOFF.md)
- [ ] `ADMIN_PASSWORD` / `REGISTRATION_TEAM_PASSWORD` are long & random on the VM.
- [ ] `/resources` "materials": real slide-deck / repo / cheat-sheet URLs +
  `ready: true` (`app/resources/page.tsx`, `const materials`).
- [ ] Clear all test rows:
  `docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "TRUNCATE \"Registration\";"'`
- [ ] `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` in Cloudflare Pages env on event day for `/live`.
- [ ] Cloudflare Pages → Build watch paths = `frontend/*`.
