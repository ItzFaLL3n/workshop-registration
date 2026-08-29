# Design — Cloudflare Pages migration + attendance/admin + live page + hardening

**Date:** 2026-08-29
**Branch:** `feat/cloudflare-migration-attendance`
**Source prompt:** `MP.MD` (repo root) — noted as substantially stale; this spec is the reconciled delta.

## Context

The site is live: frontend on Netlify (`vortexneovia.netlify.app`), API + Postgres + Caddy on an
Azure VM (`vortexneovia.centralindia.cloudapp.azure.com`), no custom domain, no Cloudflare. Razorpay
(test mode), cash/walk-in flow, and a shared-password registration-desk role are all already built
(see `HANDOFF.md`, `WHATFIXED.md`). `MP.MD` predates most of that.

This change: buy `bcashc.online`, put it on Cloudflare (free), move the **frontend to Cloudflare
Pages as a static export**, keep the VM as **API only** at `api.bcashc.online`, and add the genuinely
missing pieces (attendance, admin edit/delete, a live-stream page, webhook/reliability hardening,
a go-live runbook).

## Locked decisions

| # | Decision |
|---|---|
| D1 | Frontend → **Cloudflare Pages**, shipped as a **static export** (`next.config.js` `output: 'export'`). No SSR adapter, no Worker runtime. Domain `bcashc.online`. |
| D2 | API host unchanged (Azure VM: Postgres + Express + Caddy). New hostname `api.bcashc.online`, Cloudflare-proxied. `Caddyfile` body unchanged; only the `DOMAIN` env value changes. |
| D3 | Auth stays **two shared passwords** (`ADMIN_PASSWORD`, `REGISTRATION_TEAM_PASSWORD`) via `x-admin-token`. No `User` table, no bcrypt, no sessions. Finer role rules enforced **server-side per endpoint**. |
| D4 | Homepage **drops** the "N registered" counter entirely (user request). No live counter anywhere on the public site. |
| D5 | Scope = (a) hosting migration, (b) attendance + admin edit/delete + team perms, (c) live page, (d) webhook + reliability hardening + runbook. |

## Deviations from `MP.MD` (explicit)

1. Frontend on Cloudflare Pages, **not** the VM → `frontend/Dockerfile` and the PM2-cluster idea (Steps 1, 5) are moot and removed / not done.
2. **Static export**, not `@opennextjs/cloudflare` — the app has exactly one server component (`app/page.tsx`, a single count fetch); removing that fetch (D4) makes the whole app static.
3. **No `User`/bcrypt/session** system (Step 3). Shared-password model kept per `CLAUDE.md`'s documented decision.
4. Enum names kept (`RAZORPAY`/`CASH`, `PENDING/PAID/FAILED/EXPIRED`) — not renamed to `MP.MD`'s `ONLINE`/`UNPAID`. They are already migrated and referenced throughout code + UI.
5. Admin **cannot** flip a `RAZORPAY` row's payment status (Step 3 says "any entry"). The webhook stays the sole source of truth for online payments (matches `CLAUDE.md`). Admin can adjust **CASH**-row status only.
6. No `createdBy`/`updatedBy` columns — there is no per-person identity to record under shared-password auth.
7. Webhook: an unknown `order_id` on `payment.captured` now returns **200** (was 400) so Razorpay stops retrying an event we can never match.

---

## Section A — Frontend: static export + Cloudflare Pages

### Code changes

- **`frontend/next.config.js`**: `output: 'export'`, `images: { unoptimized: true }` (Pages static cannot run the Next image optimizer; `next/image` is used for logos/slideshow).
- **`frontend/app/page.tsx`**:
  - Remove `import { getRegistrationCount } from "@/lib/api"`.
  - Remove `export const revalidate = 60`.
  - Change `export default async function HomePage()` → `export default function HomePage()`.
  - Remove `const count = await getRegistrationCount();`.
  - Delete the `hero-meta-item` block that renders `<strong className="hero-meta-count">{count}</strong> registered` (keep the "Open to All Colleges & Majors" meta item).
- **`frontend/lib/api.ts`**: delete `getRegistrationCount()`. Keep `getApiUrl()` and `registerForWorkshop()`. Remove the `next: { revalidate: 60 }` fetch option (N/A once removed).
- **`frontend/app/success/page.tsx`**: it is `"use client"` and currently reads a `searchParams` **prop** — invalid for static export. Refactor:
  - Move the body into an inner `SuccessContent()` component that reads `useSearchParams()` from `next/navigation` (`sp.get("order_id")`, `sp.get("method")`).
  - Default export renders `<Suspense fallback={<simple centred spinner/text>}><SuccessContent/></Suspense>`.
  - Behaviour identical (`orderId` fallback `"VN27-CONFIRMED"`, `isCash = method === "cash"`).
- **`frontend/app/failure/page.tsx`**: no change (does not read params).
- **Delete `netlify.toml`** (repo root).
- **Delete `frontend/Dockerfile`** (dead once the frontend leaves Docker).
- **New `frontend/.env.example`**: `NEXT_PUBLIC_API_URL=https://api.bcashc.online`. Keep `frontend/.env.local.example` (`http://localhost:4000`) for local dev.

### Not touched

Component internals, Tailwind config, form logic, Razorpay checkout modal (except the copy tweak in Section D), all other pages.

### Manual (human, Cloudflare dashboard)

- Create a Pages project from the GitHub repo: root directory `frontend/`, build command `npx next build`, build output directory `out`.
- Project env var: `NEXT_PUBLIC_API_URL = https://api.bcashc.online`.
- Add custom domain `bcashc.online` (and `www` redirect if wanted).

---

## Section B — API host + DNS + CORS

### Code changes

- **`.env.production.example`**: `DOMAIN=api.bcashc.online`.
- **`backend/.env.example`**: `FRONTEND_URL=https://bcashc.online` (no trailing slash — `WHATFIXED.md` #12).
- **`Caddyfile`**: unchanged (`{$DOMAIN} { reverse_proxy backend:4000 }`).
- **`backend/src/index.ts`**:
  - CORS origin → `https://bcashc.online` (via `env.FRONTEND_URL`, already the mechanism).
  - `/health`: add a cheap DB check — `await prisma.$queryRaw\`SELECT 1\`` in a try/catch; respond `{ ok: true, db: true }` on success, `503 { ok: false, db: false }` on throw. Keep it un-authenticated and dependency-free.

### Manual (human)

- Register `bcashc.online`; add it as a Cloudflare zone; set the registrar's nameservers to Cloudflare's.
- DNS: `bcashc.online` → Pages (Cloudflare wires this automatically with the custom domain). `api` → `A` record to the VM's public IP, **proxied (orange cloud)**.
- SSL/TLS mode **Full (strict)**. Install a **Cloudflare Origin Certificate** on the VM and point Caddy at it (`tls /path/origin.pem /path/origin.key` inside the site block) — simplest path that works behind the proxy. (Alternative: Caddy DNS-01 via the Cloudflare plugin. Documented in the runbook.)
- **WAF**: add a rule that **skips** Bot Fight Mode / managed rules / security checks for `api.bcashc.online/webhook/*` so Razorpay's server-to-server POST is never challenged.
- Azure NSG: 80/443 already open — confirm.

---

## Section C — Data model + attendance + admin edit/delete + role rules

### Schema (`backend/prisma/schema.prisma`)

- `Registration`: add `attended Boolean @default(false)`.
- `Registration`: change `razorpayPaymentId String?` → `razorpayPaymentId String? @unique`.
- No `User` model. No `createdBy`/`updatedBy`.
- New migration directory `backend/prisma/migrations/20260829000000_add_attended_and_payment_id_unique/migration.sql`, generated with
  `npx prisma migrate diff --from-schema-datamodel <prev snapshot> --to-schema-datamodel prisma/schema.prisma --script`
  (no live DB — same technique as `WHATFIXED.md` #9/#13). Verify the SQL by eye: it must be
  `ALTER TABLE "Registration" ADD COLUMN "attended" BOOLEAN NOT NULL DEFAULT false;` plus a
  `CREATE UNIQUE INDEX "Registration_razorpayPaymentId_key" ON "Registration"("razorpayPaymentId");`.

### Endpoints (`backend/src/routes/admin.ts`)

All under `requireStaffAuth` (existing). Add two small inline guards:

- `requireAdminRole(req, res): boolean` — returns `true` if `req.role === "admin"`, else writes `403 { error: "Admin access required." }` and returns `false`.
- `teamMayMutate(row): boolean` — `req.role === "admin" || row.paymentMethod === "CASH"`.

| Method + path | Body | admin | team | Behaviour |
|---|---|---|---|---|
| `PATCH /admin/registrations/:id/attendance` | `{ attended: boolean }` | ✅ any row | ✅ **any row incl. RAZORPAY** | Validates `attended` is boolean (400 otherwise). `update` sets `attended`. Returns `{ registration }`. This is the only mutation a team user may perform on a `RAZORPAY` row. |
| `PATCH /admin/registrations/:id` | subset of `name,email,phone,college,department,year,gender,foodPreference` | ✅ any row | ✅ **CASH rows only** → `403` on `RAZORPAY` | Re-run `validateRegistrationInput` against the merged row (existing values + provided overrides). Never touches `status`, `paymentMethod`, `amount`, `razorpay*`. Returns `{ registration }`. 404 if not found. |
| `PATCH /admin/registrations/:id/status` | `{ status: "PENDING"\|"PAID"\|"FAILED"\|"EXPIRED" }` | ✅ **CASH rows only** | `403` | `requireAdminRole` first. Then 400 if `status` invalid; **400 if `row.paymentMethod === "RAZORPAY"`** ("Razorpay payment status is controlled by the webhook only."). `update` status. Returns `{ registration }`. |
| `DELETE /admin/registrations/:id` | — | ✅ any row | `403` | `requireAdminRole` first. Hard `delete`. `204` on success, `404` if missing. |
| `PATCH /admin/registrations/:id/mark-cash-paid` | — | ✅ | ✅ | **unchanged** (already CASH-only, already rejects RAZORPAY for everyone). |
| `POST /admin/registrations/walk-in` | reg fields | ✅ | ✅ | **unchanged**. |
| `GET /admin/registrations` | — | ✅ | ✅ | add `attended` to each returned row (automatic via `findMany`). Still returns `role`. |
| `GET /admin/registrations.csv` | — | ✅ | `403` (unchanged) | add an `Attended` column (`Yes`/`No`) after `Payment Method`. |

Order the new routes so `/:id/attendance`, `/:id/status`, `/:id/mark-cash-paid` (specific) are declared
before the bare `PATCH /:id` and `DELETE /:id` — Express matches in order, and `:id` would otherwise
swallow `attendance` etc. (Actually `/:id/attendance` has an extra segment so it won't collide with
`/:id`, but keep specific-first for clarity.)

### Frontend (`frontend/app/admin/page.tsx`)

- Add `attended: boolean` to the `Registration` interface.
- **Attendance toggle**: in the Actions cell, for **every** row, a small checkbox / pill button ("Present" / "Absent") that calls `PATCH /:id/attendance` with the flipped value. Optimistic update of local state; on error, revert + show `error`. Available to both roles.
- **Edit**: an "Edit" button per row opens a modal (reuse the walk-in form's grid + styling) pre-filled with the row's editable fields → `PATCH /:id`. Hidden when `data.role === "team" && row.paymentMethod === "RAZORPAY"`.
- **Delete**: a "Delete" button per row, only rendered when `data.role === "admin"`. `window.confirm("Delete <name>'s registration permanently?")` → `DELETE /:id` → reload.
- **Status (admin, CASH only)**: on `CASH` rows, when `data.role === "admin"`, a small `<select>` (PENDING/PAID/FAILED/EXPIRED) → `PATCH /:id/status`. Not shown for RAZORPAY rows or team.
- **Attendance filter**: add an "Attendance" `<select>` (All / Present / Absent) next to the Method filter; client-side filter in the existing `filteredRegistrations` `useMemo`.
- **CSV note**: no frontend change needed — the button already hits the same endpoint.
- Add an "Attended" column to the table between "Status" and "Date" (or fold into Status cell) showing a check / dash.
- Login model unchanged.

---

## Section D — Razorpay + reliability hardening + runbook

### Code changes

- **`backend/src/routes/webhook.ts`**:
  - On `payment.captured`: after looking up by `razorpayOrderId`, if no row is found, `return res.status(200).json({ received: true, ignored: "unknown order" })` and `console.warn` (was 400 → infinite retries).
  - Defence-in-depth idempotency: before the PAID `update`, if `paymentId` is set, check `prisma.registration.findFirst({ where: { razorpayPaymentId: paymentId } })`; if that row exists and is already `PAID`, no-op `return 200`. (The existing `status !== "PAID"` guard on the order-matched row still stands.)
  - Keep the `payment.failed` `updateMany` + `status: { not: "PAID" }` guard as-is.
- **`docker-compose.yml`**: append `?connection_limit=10&pool_timeout=20` to the `DATABASE_URL` override for the `backend` service. Rationale: Prisma's default pool is `physical_cpus * 2 + 1` = 5 on the 2-vCPU VM; 10 is a bounded bump for the registration-window burst, far under Postgres's default `max_connections` 100. Re-confirm the current Prisma formula at implementation time and adjust the number if the recommendation changed.
- **`frontend/components/RegistrationForm.tsx`**: on `razorpay.on("payment.failed")` and on `modal.ondismiss` (when the user closes without paying), set `apiError` to an actionable message: _"Payment didn't complete — your seat is held as PENDING. Click Register & Pay to try again."_ The PENDING row is already reused on retry (existing `/register` behaviour), so no orphan cleanup is needed — the copy just needs to say so. Keep `setLoading(false)` in both paths.

### Live-stream page (Section C item, detailed here)

- **New `frontend/app/live/page.tsx`** (`"use client"`):
  - Reads `process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID` (inlined at build). If unset/placeholder → render a "The live stream hasn't started yet — check back on event day" card.
  - If set → responsive 16:9 `<iframe>` (`https://www.youtube-nocookie.com/embed/<id>`, `allow="accelerometer; autoplay; clownstream; encrypted-media; gyroscope; picture-in-picture; web-share"`, `allowFullScreen`, `title="VORTEX NEOVIA '27 — Live"`, `loading="lazy"`). Wrap in a `position:relative; padding-top:56.25%` container with the iframe absolutely filling it.
  - Page chrome: `<FloatingNavbar currentPath="/live" />`, a heading, the embed, a line linking to `/resources`. Match existing page styling tokens (`var(--surface-1)`, `var(--line)`, etc.). No new deps.
- **`frontend/components/FloatingNavbar.tsx`**: add a "Live" nav link to `/live`. (Inspect the component's link list first; match its existing item shape.)
- **`frontend/.env.example`** and **`frontend/.env.local.example`**: add `NEXT_PUBLIC_YOUTUBE_VIDEO_ID=` (empty).
- Manual: set `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` in the Pages project env + redeploy when the stream URL is known.

### Runbook — new `docs/runbooks/go-live.md`

Consolidates + supersedes `HANDOFF.md`'s "What's Left". Sections:

1. **Cloudflare** — register domain, add zone, nameservers; DNS records (`bcashc.online` → Pages, `api` → proxied A to VM IP); SSL/TLS Full (strict) + Origin Certificate on Caddy (with the DNS-01 alternative); WAF skip rule for `api.bcashc.online/webhook/*`; confirm Bot Fight Mode won't hit the webhook.
2. **Cloudflare Pages** — project settings (root `frontend/`, build `npx next build`, output `out`), env vars (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_YOUTUBE_VIDEO_ID`), custom domain, first deploy.
3. **Backend on the VM** — put `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET`, `REGISTRATION_TEAM_PASSWORD`, `ADMIN_PASSWORD`, `FRONTEND_URL=https://bcashc.online`, `EMAIL_FROM` into `backend/.env`; `git pull && docker compose up -d --build` (runs the new migration); check `curl https://api.bcashc.online/health` returns `db: true`.
4. **Razorpay test-mode E2E** — register the webhook at `https://api.bcashc.online/webhook/razorpay` (events `payment.captured`, `payment.failed`), copy the secret; ₹1 test-card payment → row flips to `PAID`, email arrives, `/admin` shows it.
5. **Cash + walk-in + attendance + edit + delete** test list.
6. **Razorpay test → live** — KYC/Live-mode confirm; swap `rzp_live_` keys; **re-register** the webhook under Live Mode (separate secret); one real low-value transaction; confirm `ADMIN_PASSWORD` is not the placeholder.
7. **Monitoring** — UptimeRobot on `https://api.bcashc.online/health`.
8. **Note** — because `api.` is Cloudflare-proxied, Caddy only ever sees Cloudflare source IPs; Razorpay webhook IP allow-listing (if wanted) must be a Cloudflare WAF rule, not an app-level check. Research current Razorpay webhook IP ranges + Cloudflare rule UI at go-live time.
9. **After the event** — `docker compose down` / deallocate the VM (Azure Portal Stop, not in-OS shutdown).

### Docs to update (after implementation)

- `CLAUDE.md` — hosting section → Cloudflare Pages + `api.bcashc.online`; note the static-export constraint; attendance/edit/delete endpoints + role matrix; `attended` column.
- `HANDOFF.md` — new current architecture; point "What's Left" at `docs/runbooks/go-live.md`.
- `WHATFIXED.md` — add entries: #15 Netlify→Pages static-export migration, #16 attendance + admin edit/delete + finer roles, #17 webhook idempotency/unknown-order + `connection_limit`.

---

## Files touched

**Frontend:** `next.config.js`, `app/page.tsx`, `app/success/page.tsx`, `lib/api.ts`, `components/RegistrationForm.tsx`, `components/FloatingNavbar.tsx`, `app/live/page.tsx` (new), `.env.example` (new), `.env.local.example`; **delete** `netlify.toml`, `frontend/Dockerfile`.

**Backend:** `prisma/schema.prisma`, `prisma/migrations/20260829000000_*/migration.sql` (new), `src/routes/admin.ts`, `src/routes/webhook.ts`, `src/index.ts`, `.env.example`.

**Root / infra:** `docker-compose.yml`, `.env.production.example`.

**Docs:** `docs/runbooks/go-live.md` (new), `docs/superpowers/specs/2026-08-29-cloudflare-migration-design.md` (this file), and after implementation `CLAUDE.md` / `HANDOFF.md` / `WHATFIXED.md`.

## Verification

- `cd backend && npm run build` (tsc) clean.
- `cd frontend && npm run build` clean, produces `out/` (static export), no "useSearchParams should be wrapped in Suspense" error, no server-component/`revalidate` warnings.
- Migration SQL reviewed by eye.
- Manual endpoint reasoning: team `PATCH /:id` on a RAZORPAY row → 403; team `DELETE` → 403; team `PATCH /:id/attendance` on a RAZORPAY row → 200; admin `PATCH /:id/status` on a RAZORPAY row → 400.

## New env vars

| Var | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Cloudflare Pages project (already used) | `https://api.bcashc.online` — API base for the static frontend. |
| `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` | Cloudflare Pages project | YouTube video/stream id for `/live`; empty → "not started" state. |
| `DOMAIN` | VM root `.env` (already used) | now `api.bcashc.online`. |
| `FRONTEND_URL` | `backend/.env` (already used) | now `https://bcashc.online` (CORS origin). |

No new backend secrets. `connection_limit` is a query-string tweak to the existing `DATABASE_URL`, not a new var.
