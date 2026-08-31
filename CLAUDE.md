# CLAUDE.md — Workshop Registration Site

Persistent context for Claude Code sessions on this repo. Read this first.

## What this is

Registration + payment site for **VORTEX NEOVIA'27** (LLM Agents Workshop), Sacred Heart College, Dept. of Computer Applications. Student fills a form → backend creates a Razorpay order → Razorpay checkout (modal) → webhook flips the DB row to `PAID` and emails a confirmation. Admin can view/filter registrations and export CSV.

Scale: **fee is ₹150, ~400 registrations expected at most (could be fewer), not concurrent.** No hard cap is enforced in code — registration stays open-ended; closing it is a manual/operational decision, not an automatic cutoff. Don't add scaling/queueing/caching machinery — it's unneeded complexity for this load (likely well under ~₹60,000 total processed). Event runs over **2-3 days** and the top priority is uptime during that window, not raw scale.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14.2.35 (App Router, TypeScript, Tailwind CSS) |
| Backend | Node.js + Express + Prisma |
| Database | PostgreSQL |
| Payments | Razorpay Orders API + Standard Checkout (Test Mode → Live Mode) |
| Email | Resend |

## File map

```
backend/
  src/
    index.ts            Express app entry — helmet, cors, mounts routers, central error handler
    lib/
      env.ts             Validates required env vars at startup, fails fast if missing
      asyncHandler.ts     Wraps async route handlers so rejections reach the error handler
      prisma.ts           Singleton Prisma client
      razorpay.ts          createRazorpayOrder() + verifyRazorpayWebhook()
      email.ts             sendConfirmationEmail() via Resend
    routes/
      register.ts   POST /register (rate-limited), GET /register/count (public)
      webhook.ts    POST /webhook/razorpay — signature-verified, idempotent on PAID transition
      admin.ts      GET /admin/registrations, /admin/registrations.csv (password + rate-limited)
  prisma/schema.prisma   Registration model
  Dockerfile
frontend/
  app/
    page.tsx            Homepage + registration form
    success/, failure/  Post-payment result pages (success uses useSearchParams + Suspense)
    resources/           Install/resources page
    live/page.tsx         Event live-stream page — embedded unlisted YouTube iframe
    admin/page.tsx        Password-gated dashboard: list, CSV, check-in toggle, edit/delete
  components/RegistrationForm.tsx
  components/FloatingNavbar.tsx   shared nav (has the /live link)
  lib/api.ts              registerForWorkshop(), getApiUrl()
  next.config.js          output: "export"  (static — Cloudflare Pages)
  .env.example
docker-compose.yml   VM stack: postgres, backend, caddy (auto-HTTPS). Frontend is NOT here — it's on Cloudflare Pages.
Caddyfile
.env.production.example   Root env template for the VM deploy
docs/runbooks/go-live.md         Full manual go-live checklist
docs/superpowers/specs/          Design specs
```

## Local dev

```bash
# backend
cd backend
cp .env.example .env   # fill in DATABASE_URL, Razorpay test keys, etc.
npm install
npx prisma migrate dev
npm run dev             # http://localhost:4000

# frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev              # http://localhost:3000
```

Required backend env vars (validated at startup by `src/lib/env.ts` — missing any of these throws immediately instead of failing later with a cryptic error): `DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `FRONTEND_URL`, `ADMIN_PASSWORD`, `REGISTRATION_TEAM_PASSWORD`, `RESEND_API_KEY`. Optional: `EMAIL_FROM`, `WORKSHOP_FEE_RUPEES` (defaults 150), `PORT` (defaults 4000). Unlike Cashfree, Razorpay has no separate sandbox/production URL — Test Mode vs Live Mode is just which key pair (`rzp_test_...` vs `rzp_live_...`) you use, so there's no `RAZORPAY_ENV`-style flag and `BACKEND_URL` is no longer needed (Razorpay's webhook URL is configured once in their dashboard, not per-order).

Frontend: `NEXT_PUBLIC_API_URL` (required, e.g. `https://api.bcashc.online`) and `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` (optional — the `/live` page's stream id; blank shows a "not started" placeholder). Both are set in the **Cloudflare Pages** project and baked in at build time. The Razorpay key id is returned by `POST /register` per-request rather than baked into the frontend build, so there's no `NEXT_PUBLIC_RAZORPAY_*` build-time var to keep in sync.

## Hardening done this session (2026-08-14)

The codebase was already reasonably solid (validation, webhook signature verification, Prisma connection reuse). Fixed:

- **Duplicate confirmation emails**: `webhook.ts` used to email on every successful-payment webhook delivery. Payment gateways retry webhooks, so a slow response caused a resend. Now guarded — only fires on the actual transition into `PAID`.
- **Out-of-order webhook safety**: a delayed `FAILED` webhook can no longer downgrade a registration a later `SUCCESS` already marked `PAID` (`updateMany` with a `status: { not: "PAID" }` guard).
- **Central error handling**: added `asyncHandler` + a final Express error middleware. `admin.ts` had zero error handling before this — an unexpected Prisma error returned unstyled HTML instead of JSON.
- **Status query param validation**: `GET /admin/registrations?status=` used to cast with `as any`; now validated against the real enum, returns 400 on garbage input instead of a Prisma crash.
- **Fail-fast env validation**: `src/lib/env.ts` checks all required vars at boot instead of scattered `!` non-null assertions that would fail cryptically mid-request.
- **Constant-time admin auth**: `requireAdminAuth` now hashes both sides (SHA-256) before `crypto.timingSafeEqual`, avoiding both a timing side-channel and a length leak.
- **Rate limiting**: `express-rate-limit` on `/register` (10/15min) and `/admin/*` (20/15min) to deter spam/brute-forcing.
- **Input length caps**: name/college/department capped at 150 chars.
- **Frontend**: replaced `NEXT_PUBLIC_API_URL!` non-null assertions with a `getApiUrl()` helper that throws a clear error instead of silently producing `undefined` in a URL.
- **Next.js 14.2.18 → 14.2.35**: 14.2.18 had a disclosed **critical** DoS advisory. 14.2.35 is the last patched release on the 14.x line and resolves the critical issue plus most others without the breaking changes a jump to Next 15/16 would carry.
  - **Known accepted risk**: 2 *high*-severity advisories remain (`npm audit` in `frontend/`) that only a Next.js 16 major upgrade fully resolves. Deliberately not doing that migration untested right before a live event — revisit after the workshop.

Both apps build clean (`npm run build` in each) as of this session.

## 2026-08-29 session — Cloudflare migration + attendance + live page

See `WHATFIXED.md` #15–17 and the spec at
`docs/superpowers/specs/2026-08-29-cloudflare-migration-design.md`. Summary:

- **Frontend → Cloudflare Pages, static export.** `output: "export"` + `images.unoptimized`.
  Possible because the app had one server component only (the homepage count fetch),
  which was **removed** — the public site no longer shows a live registration count.
  `success/page.tsx` switched from a `searchParams` prop to `useSearchParams()` +
  `<Suspense>`. `netlify.toml` and `frontend/Dockerfile` deleted. `out/` gitignored.
- **API host** → `api.bcashc.online` (Cloudflare-proxied). `FRONTEND_URL=https://bcashc.online`,
  root `DOMAIN=api.bcashc.online`. `Caddyfile` body unchanged. TLS via a Cloudflare
  Origin Cert (runbook §2); a WAF Skip rule protects `/webhook/*` (runbook §3).
- **`/live` page** — embedded unlisted-YouTube iframe, id from `NEXT_PUBLIC_YOUTUBE_VIDEO_ID`,
  "not started" placeholder when unset. Linked from `FloatingNavbar`.
- **Attendance + admin edit/delete.** New `Registration.attended`;
  `razorpayPaymentId` is now `@unique`. Migration
  `20260829000000_add_attended_and_payment_id_unique`. New admin endpoints, all
  with server-side role gates:
  - `PATCH /admin/registrations/:id/attendance` — both roles, any row (incl. RAZORPAY).
  - `PATCH /admin/registrations/:id` — admin any row; team CASH only.
  - `PATCH /admin/registrations/:id/status` — admin only, CASH only (RAZORPAY status
    stays webhook-driven; a Razorpay row's status can never be set by hand).
  - `DELETE /admin/registrations/:id` — admin only.
  - CSV export gained an `Attended` column.
  Admin dashboard: check-in toggle, attendance filter, edit modal, delete + status controls.
- **Hardening.** Webhook: explicit `200` + log on unknown `order_id`; idempotency
  short-circuit on a already-`PAID` `razorpayPaymentId`. `DATABASE_URL` gains
  `connection_limit=10&pool_timeout=20`. `/health` does a real `SELECT 1` (503 on failure).
  Checkout: modal-dismiss / `payment.failed` now shows a "seat held, retry" message.
- **Auth unchanged** — still two shared passwords (`ADMIN_PASSWORD`,
  `REGISTRATION_TEAM_PASSWORD`) via `x-admin-token`. No `User` table (deliberate).

## Hosting (current): Cloudflare Pages frontend + Azure VM API

> **Updated 2026-08-29.** The frontend is now a **static export** (`next.config.js`
> `output: "export"`) hosted on **Cloudflare Pages** at `bcashc.online`. The Azure
> VM runs **API + Postgres + Caddy only**, reachable at `api.bcashc.online`
> (Cloudflare-proxied). Netlify is gone (`netlify.toml` deleted); `frontend/Dockerfile`
> is deleted. Full go-live steps: **`docs/runbooks/go-live.md`**. Design/rationale:
> `docs/superpowers/specs/2026-08-29-cloudflare-migration-design.md`. The section
> below is retained for the VM/Docker context (Postgres, backend, Caddy) — the
> "frontend service" and "Vercel/Netlify" parts of it are historical.

## Hosting decision (historical): single Azure VM via Docker Compose

**Do not use Vercel Hobby for the frontend** — its Fair Use Guidelines explicitly define "any method of requesting or processing payment from visitors" as commercial use, which requires Pro ($20/mo). This site triggers a Razorpay payment on every registration, so Hobby is a real ToS violation risk (deployment can be paused). Railway also no longer has a meaningful ongoing free tier (one-time $5/30-day trial, then $1/month after — not enough for an always-on Node+Postgres service).

**Decision**: since the actual need is a short, high-reliability window (2-3 event days, plus the registration period before it) rather than indefinite hosting, everything runs on **one Azure VM** funded by the user's **Azure for Students $100 credit** (12-month validity, renewable yearly while a student, no card required). A single always-on VM avoids the cold-start/sleep issues that split serverless free tiers (Render, etc.) have, and sidesteps Vercel's payment-processing ToS restriction entirely.

Architecture — everything in `docker-compose.yml` at repo root:
- **postgres** — official image, data in a named volume
- **backend** — built from `backend/Dockerfile`, runs `prisma migrate deploy` on every boot before starting
- **frontend** — built from `frontend/Dockerfile` using Next's `output: "standalone"`; `NEXT_PUBLIC_*` vars are passed as Docker **build args** (they must be baked in at build time)
- **caddy** — reverse proxy, automatic HTTPS via Let's Encrypt, routes `$DOMAIN` → frontend, `api.$DOMAIN` → backend

This was **built now but is meant to be started later**, close to the event, so it doesn't burn VM uptime/credit sitting idle for weeks.

### Deploy steps (when ready to go live)

1. **Provision the VM**: Azure Portal → create a Linux VM (B2s: 2 vCPU/4GB is a comfortable size) using the student credit. Open ports 80/443 in the network security group.
2. **DNS**: point your domain's A record (and `api.` subdomain) at the VM's public IP. Caddy needs this resolvable *before* it starts, or Let's Encrypt cert issuance fails.
3. **Install Docker** on the VM (`curl -fsSL https://get.docker.com | sh`, then enable the compose plugin).
4. **Clone the repo** onto the VM.
5. Copy `.env.production.example` → `.env` in the repo root, fill in `DOMAIN`, `POSTGRES_*`, `NEXT_PUBLIC_API_URL` (`https://api.yourdomain.com`).
6. Copy `backend/.env.example` → `backend/.env`, fill in Razorpay **Live Mode** keys, `FRONTEND_URL=https://yourdomain.com`, a long random `ADMIN_PASSWORD`, Resend key.
7. `docker compose up -d --build`
8. Add the webhook URL (`https://api.yourdomain.com/webhook/razorpay`) in the Razorpay dashboard (Settings → Webhooks), subscribed to `payment.captured` and `payment.failed`, and copy the webhook secret it gives you into `RAZORPAY_WEBHOOK_SECRET`. Test Mode and Live Mode webhooks are separate — re-add this when switching modes.
9. Run through the go-live checklist below.
10. **After the event**: `docker compose down` (or deallocate the VM in the Azure portal) to stop burning credit. Data stays in the `postgres_data` volume if you bring it back up on the same VM; if you'll need the data long-term, `pg_dump` it out first.

Don't spend the student credit on anything beyond this VM unless a real need comes up — it's meant to comfortably outlast this one event.

## Go-live checklist

- [ ] One ₹1 end-to-end sandbox test — confirm DB row flips to PAID and admin page shows it
- [ ] Swap in Razorpay **Live Mode** keys (`RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`) and re-register the webhook under Live Mode (`RAZORPAY_WEBHOOK_SECRET` changes too — Test and Live webhooks are separate)
- [ ] One real low-value production transaction before opening registration publicly
- [ ] `ADMIN_PASSWORD` set to something long and random (not the placeholder)
- [ ] Resources page has real, final content (slide deck / repo / cheat sheet links)
- [ ] DNS + HTTPS confirmed working on both `yourdomain.com` and `api.yourdomain.com`
- [ ] Set up a free uptime monitor (e.g. UptimeRobot) pinging `/health` so a crash surfaces immediately instead of silently

## Key decisions to remember

| Decision | Detail |
|---|---|
| Registration counter | `GET /register/count` — counts `PAID` rows (any method) plus `CASH` rows still `PENDING` (a cash reservation counts as soon as it's made, not only once collected — see "Pay Cash at Event" below) |
| Pending row reuse | Same email re-registering while `PENDING` reuses that row instead of creating a new one |
| Fee | `WORKSHOP_FEE_RUPEES` env var, stored in paise in the DB |
| Admin auth | Two shared passwords via `x-admin-token` header — `ADMIN_PASSWORD` (full access) and `REGISTRATION_TEAM_PASSWORD` (check-in desk, see below). No per-user accounts — fine at this scale. |
| Attendance | `Registration.attended` (bool). `PATCH /admin/registrations/:id/attendance` — **both roles, any row** (attendance ≠ payment). Admin dashboard has a per-row toggle + an attendance filter; CSV export has an `Attended` column. |
| Admin edit / delete | `PATCH /admin/registrations/:id` edits contact fields — admin any row, **team CASH rows only** (403 on RAZORPAY). `PATCH /admin/registrations/:id/status` — **admin only, CASH rows only** (a RAZORPAY row's status is webhook-driven and can never be set by hand, by anyone). `DELETE /admin/registrations/:id` — **admin only**. All role checks are server-side. |
| Pay Cash at Event | Registrants can pick "Pay Cash at Event" instead of Razorpay at signup — `paymentMethod: CASH` on the row, status stays `PENDING` as a reservation (counted in the public counter immediately) until the registration desk confirms cash was collected at check-in via `PATCH /admin/registrations/:id/mark-cash-paid`. That endpoint — and everyone, admin included — can **never** mark a `RAZORPAY` row `PAID` this way; only the webhook does that. |
| Registration desk role | Logs into the same `/admin` page with `REGISTRATION_TEAM_PASSWORD` instead of `ADMIN_PASSWORD`. Can see every registration and use "Mark Paid" / "Add Walk-in", but the CSV export button is hidden (admin-only). `GET /admin/registrations` returns a `role` field so the frontend knows which UI to show. |
| Walk-in registrations | `POST /admin/registrations/walk-in` (admin or team) — for someone who never registered online; created already `PAID` + `CASH` since the desk collects cash on the spot, no separate confirmation step. |
| Closing registration | Manual switch, not a fixed cutoff. `REGISTRATION_OPEN` env var on the backend (default `true`; only the exact string `false` closes it). Set `REGISTRATION_OPEN=false` in `backend/.env` and restart the backend container — **no frontend rebuild**. `POST /register` then returns `403`; `GET /register/status` → `{ open: false }`, which the homepage form (swaps to a "closed" panel) and the hero countdown both poll on mount. The countdown's `REG_CLOSE` date is now only a display fallback / stated deadline. Admin walk-ins + mark-cash-paid still work after closing. |
| No git repo | This project has no version control initialized (by choice, as of this session) — now superseded, the repo is git-tracked and pushed to GitHub (`ItzFaLL3n/workshop-registration`). |
