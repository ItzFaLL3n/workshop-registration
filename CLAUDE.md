# CLAUDE.md — Workshop Registration Site

Persistent context for Claude Code sessions on this repo. Read this first.

## What this is

Registration + payment site for **VORTEX NEOVIA'27** (LLM Agents Workshop), Sacred Heart College, Dept. of Computer Applications. Student fills a form → backend creates a Cashfree order → Cashfree checkout → webhook flips the DB row to `PAID` and emails a confirmation. Admin can view/filter registrations and export CSV.

Scale: **fee is ₹150, ~400 registrations expected at most (could be fewer), not concurrent.** No hard cap is enforced in code — registration stays open-ended; closing it is a manual/operational decision, not an automatic cutoff. Don't add scaling/queueing/caching machinery — it's unneeded complexity for this load (likely well under ~₹60,000 total processed). Event runs over **2-3 days** and the top priority is uptime during that window, not raw scale.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14.2.35 (App Router, TypeScript, Tailwind CSS) |
| Backend | Node.js + Express + Prisma |
| Database | PostgreSQL |
| Payments | Cashfree Orders API (sandbox → production) |
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
      cashfree.ts          createCashfreeOrder() + verifyCashfreeWebhook()
      email.ts             sendConfirmationEmail() via Resend
    routes/
      register.ts   POST /register (rate-limited), GET /register/count (public)
      webhook.ts    POST /webhook/cashfree — signature-verified, idempotent on PAID transition
      admin.ts      GET /admin/registrations, /admin/registrations.csv (password + rate-limited)
  prisma/schema.prisma   Registration model
  Dockerfile
frontend/
  app/
    page.tsx            Homepage + registration form
    success/, failure/  Post-payment result pages
    resources/           Install/resources page
    admin/page.tsx        Password-gated dashboard + CSV export
  components/RegistrationForm.tsx
  lib/api.ts              registerForWorkshop(), getRegistrationCount(), getApiUrl()
  next.config.js          output: "standalone" (for Docker)
  Dockerfile
docker-compose.yml   Full stack: postgres, backend, frontend, caddy (auto-HTTPS)
Caddyfile
.env.production.example   Root env template for the VM deploy
```

## Local dev

```bash
# backend
cd backend
cp .env.example .env   # fill in DATABASE_URL, Cashfree sandbox keys, etc.
npm install
npx prisma migrate dev
npm run dev             # http://localhost:4000

# frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev              # http://localhost:3000
```

Required backend env vars (validated at startup by `src/lib/env.ts` — missing any of these throws immediately instead of failing later with a cryptic error): `DATABASE_URL`, `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`, `FRONTEND_URL`, `BACKEND_URL`, `ADMIN_PASSWORD`, `RESEND_API_KEY`. Optional: `CASHFREE_ENV` (defaults sandbox), `EMAIL_FROM`, `WORKSHOP_FEE_RUPEES` (defaults 150), `PORT` (defaults 4000).

Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CASHFREE_ENV` — these are **build-time** vars (inlined into the client bundle), so changing them requires a rebuild, not just a restart.

## Hardening done this session (2026-08-14)

The codebase was already reasonably solid (validation, webhook signature verification, Prisma connection reuse). Fixed:

- **Duplicate confirmation emails**: `webhook.ts` used to email on every `SUCCESS` webhook delivery. Cashfree retries webhooks, so a slow response caused a resend. Now guarded — only fires on the actual transition into `PAID`.
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

## Hosting decision: single Azure VM via Docker Compose

**Do not use Vercel Hobby for the frontend** — its Fair Use Guidelines explicitly define "any method of requesting or processing payment from visitors" as commercial use, which requires Pro ($20/mo). This site triggers a Cashfree payment on every registration, so Hobby is a real ToS violation risk (deployment can be paused). Railway also no longer has a meaningful ongoing free tier (one-time $5/30-day trial, then $1/month after — not enough for an always-on Node+Postgres service).

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
5. Copy `.env.production.example` → `.env` in the repo root, fill in `DOMAIN`, `POSTGRES_*`, `NEXT_PUBLIC_API_URL` (`https://api.yourdomain.com`), `NEXT_PUBLIC_CASHFREE_ENV`.
6. Copy `backend/.env.example` → `backend/.env`, fill in Cashfree production keys, `FRONTEND_URL=https://yourdomain.com`, `BACKEND_URL=https://api.yourdomain.com`, a long random `ADMIN_PASSWORD`, Resend key.
7. `docker compose up -d --build`
8. Add the Cashfree webhook URL (`https://api.yourdomain.com/webhook/cashfree`) in the Cashfree dashboard, subscribed to payment events.
9. Run through the go-live checklist below.
10. **After the event**: `docker compose down` (or deallocate the VM in the Azure portal) to stop burning credit. Data stays in the `postgres_data` volume if you bring it back up on the same VM; if you'll need the data long-term, `pg_dump` it out first.

Don't spend the student credit on anything beyond this VM unless a real need comes up — it's meant to comfortably outlast this one event.

## Go-live checklist

- [ ] One ₹1 end-to-end sandbox test — confirm DB row flips to PAID and admin page shows it
- [ ] Switch `CASHFREE_ENV=production` (backend) and `NEXT_PUBLIC_CASHFREE_ENV=production` (frontend build arg), swap in production Cashfree keys
- [ ] One real low-value production transaction before opening registration publicly
- [ ] `ADMIN_PASSWORD` set to something long and random (not the placeholder)
- [ ] Resources page has real, final content (slide deck / repo / cheat sheet links)
- [ ] DNS + HTTPS confirmed working on both `yourdomain.com` and `api.yourdomain.com`
- [ ] Set up a free uptime monitor (e.g. UptimeRobot) pinging `/health` so a crash surfaces immediately instead of silently

## Key decisions to remember

| Decision | Detail |
|---|---|
| Registration counter | `GET /register/count` — counts `PAID` rows only |
| Pending row reuse | Same email re-registering while `PENDING` reuses that row instead of creating a new one |
| Fee | `WORKSHOP_FEE_RUPEES` env var, stored in paise in the DB |
| Admin auth | Single shared password via `x-admin-token` header — fine at this scale, not a full auth system |
| No git repo | This project has no version control initialized (by choice, as of this session) |
