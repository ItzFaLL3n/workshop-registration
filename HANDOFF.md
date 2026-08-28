# Agent Handoff — Workshop Registration Site

**Project:** VORTEX NEOVIA'27 — LLM Agents Workshop Registration
**College:** Sacred Heart College, Dept. of Computer Applications
**Last updated:** 2026-08-28
**See also:** `CLAUDE.md` — canonical, kept-current context file (architecture description there is now slightly stale re: hosting split, see below). `WHATFIXED.md` — detailed error/fix log from this deployment session; read it before debugging anything that looks like a repeat of a past issue.

---

## Status: LIVE, pending one redeploy + one round of testing

Both halves of the stack are deployed and were confirmed talking to each other successfully as of 2026-08-15, back when the payment provider was still Cashfree:

- **Frontend:** `https://vortexneovia.netlify.app` — Netlify, deployed from `origin/master`, `frontend/` as base dir
- **Backend:** `https://vortexneovia.centralindia.cloudapp.azure.com` — Azure VM (B2als_v2, Central India), Docker Compose
- **Database:** Postgres running in the VM's Docker Compose stack, `Registration` table created via migrations

**Since then, on 2026-08-28, two rounds of changes shipped that the VM has not been redeployed for yet:**

1. **Payment provider switched from Cashfree to Razorpay** (user got KYC-verified there and asked to migrate off Cashfree entirely — full rundown in `WHATFIXED.md` #13). `backend/src/lib/cashfree.ts` → `razorpay.ts`, webhook moved from `/webhook/cashfree` to `/webhook/razorpay`, DB columns `cfOrderId`/`cfPaymentId` renamed to `razorpayOrderId`/`razorpayPaymentId`, `BACKEND_URL` and `NEXT_PUBLIC_CASHFREE_ENV` env vars gone entirely. Frontend now opens Razorpay's **Standard Checkout** as an in-page modal instead of redirecting to a Cashfree-hosted page.
2. **"Pay Cash at Event" + a registration-desk role** (`WHATFIXED.md` #14). Registrants can pick cash instead of Razorpay at signup (reserves the seat, no online payment); a second shared password `REGISTRATION_TEAM_PASSWORD` logs into the same `/admin` page with a restricted view — sees everyone, can mark a cash row paid at check-in and add walk-ins, but can never touch a Razorpay-paid row (only the webhook can).

**Not yet done, and needed before any of this actually works on the live site:**
- Register the Razorpay webhook + get the webhook secret from their dashboard (Test Mode for now)
- Put `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` / `REGISTRATION_TEAM_PASSWORD` into `backend/.env` on the VM — all four are required now, **the backend will not boot without them**
- `git pull && docker compose up -d --build` on the VM (applies two pending migrations)
- Run through the full test list in "What's Left" below — none of this has been tested end-to-end on the live deployment yet

See "What's Left" below for the exact steps.

---

## Architecture — DIVERGED FROM `CLAUDE.md`'s original plan

`CLAUDE.md` describes a single-VM plan where the VM runs frontend + backend + postgres + Caddy together. **That changed mid-deployment** — the frontend now runs on **Netlify** instead, because Cashfree's merchant signup required a live website URL before the VM existed. Splitting them let the frontend go live immediately on a free Netlify subdomain while the VM was still being provisioned.

Current real architecture:

| Layer | Where | Notes |
|---|---|---|
| Frontend | **Netlify** | Free `*.netlify.app` subdomain. `netlify.toml` at repo root (`base = "frontend"`, `@netlify/plugin-nextjs` plugin). `NEXT_PUBLIC_API_URL` is the only frontend env var (Site configuration → Environment variables), **not** in any repo file — changing it requires a redeploy since it's a build-time var. The Razorpay key id is returned by `POST /register` per-request instead, so there's no payment-related frontend env var at all. |
| Backend + Postgres + Caddy | **Azure VM** (Docker Compose) | `docker-compose.yml` now only has `postgres`, `backend`, `caddy` services — the `frontend` service was removed. `Caddyfile` proxies `{$DOMAIN}` straight to `backend:4000` (no more `api.` subdomain split, since there's no frontend to also route). |
| Domain | **No custom domain purchased** | Both hostnames above are free: Netlify's subdomain, and Azure's free DNS name label on the VM's Public IP (Configuration → DNS name label). Caddy's Let's Encrypt cert issuance works fine against the Azure hostname — confirmed working in this session. |

If you're continuing this project and see references in `CLAUDE.md` to `api.yourdomain.com` or a `frontend` Docker service — those are stale for the *current* deployment; trust this file and `WHATFIXED.md` #2 for what's actually running.

---

## Stack (unchanged)

| Layer | Tech |
|---|---|
| Frontend | Next.js 14.2.35 (App Router, TypeScript, Tailwind CSS) |
| Backend | Node.js + Express + Prisma |
| Database | PostgreSQL 16 |
| Payments | Razorpay Orders API + Standard Checkout (currently Test Mode) |
| Email | Resend |

---

## What's Left

### Before opening registration for real
1. **Register the Razorpay webhook** — Razorpay Dashboard (Test Mode) → Account & Settings → Webhooks → Add New Webhook → URL `https://vortexneovia.centralindia.cloudapp.azure.com/webhook/razorpay`, subscribe to `payment.captured` and `payment.failed`. Razorpay generates a **webhook secret** at this point — copy it into `RAZORPAY_WEBHOOK_SECRET` in `backend/.env` (this is separate from the API key/secret pair). Without this, payments succeed on Razorpay's side but the DB row never flips from `PENDING` to `PAID`.
2. Put real `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` (Test Mode, from Razorpay Dashboard → Settings → API Keys) **and** a `REGISTRATION_TEAM_PASSWORD` (pick a long random string, different from `ADMIN_PASSWORD`) into `backend/.env`, then `git pull && docker compose up -d --build` on the VM — `REGISTRATION_TEAM_PASSWORD` is a required env var now, the backend won't boot without it.
3. **Full Test Mode payment test**: register on the live Netlify site → the Razorpay checkout modal should open in-page (not a full-page redirect like Cashfree did) → pay with a Razorpay test card (e.g. `4111 1111 1111 1111`, any future expiry, any CVV) → confirm it redirects to `/success` → confirm admin dashboard (`/admin`, password = whatever `ADMIN_PASSWORD` is set to in `backend/.env`) shows the row as `PAID` → confirm confirmation email arrives.
4. **Cash flow test**: register once picking "Pay Cash at Event" → confirm the reservation email arrives and `/success` shows the cash-specific copy → confirm it shows up on `/admin` as `CASH`/`PENDING` and counts toward `GET /register/count` → log into `/admin` with `REGISTRATION_TEAM_PASSWORD` (not `ADMIN_PASSWORD`) → confirm the CSV export button is hidden, "Mark Paid" flips that row to `PAID`, and "Add Walk-in" creates a new row already `PAID`.
5. **Verify `EMAIL_FROM`** in `backend/.env` is a valid sendable address for Resend's current setup (e.g. their shared testing domain if no custom domain is verified) — this was flagged but not confirmed fixed as of last update.
6. **Real content for the Resources page** — still likely has placeholder links (slide deck / repo / cheat sheet).

### Going to production (real money)
1. Confirm Razorpay KYC/account activation is fully approved (user reported KYC verified as of 2026-08-28 — confirm Live Mode is actually unlocked in the dashboard before relying on it).
2. Swap in Razorpay **Live Mode** keys (`RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`) in `backend/.env` — no separate `*_ENV`/build-arg flag to flip, unlike Cashfree; which mode you're in is purely which key pair you use.
3. One real low-value production transaction before opening registration publicly.
4. **Re-register the webhook under Live Mode** — Test Mode and Live Mode webhooks (and their secrets) are separate in Razorpay's dashboard, same as they were in Cashfree's.
5. Confirm `ADMIN_PASSWORD` is long/random, not a placeholder.
6. Set up a free uptime monitor (e.g. UptimeRobot) against `https://vortexneovia.centralindia.cloudapp.azure.com/health`.
7. **Remember to `docker compose down` (deallocate the VM) after the event** to stop burning the Azure for Students credit — see cost notes below.

---

## Operational Notes for Whoever Picks This Up

- **VM management commands** (run on the VM via SSH):
  - `docker compose ps` — check container status
  - `docker compose logs backend --tail=50` — backend logs (check here first for any 500 errors)
  - `docker compose logs caddy --tail=50` — check here for HTTPS cert issues
  - `docker compose up -d --build` — rebuild + restart after any `.env` or code change
  - `git pull` then rebuild — to pick up new commits
- **Stopping the VM to save cost**: use the Azure **Portal's "Stop" button** (or `az vm deallocate`) — this actually releases compute billing. An in-OS `shutdown` does **not** stop billing, it just powers off while Azure still holds/bills the allocation. See `WHATFIXED.md` if this trips anyone up again.
- **If Postgres auth breaks after changing `POSTGRES_PASSWORD`**: you need `docker compose down -v` (not just `down`) to wipe the volume and let Postgres reinitialize with the new password — but **only do this pre-launch**, before real registrations exist. Post-launch, use `ALTER USER` inside Postgres instead, or you'll lose registrant data.
- **Migrations**: `backend/prisma/migrations/` has the initial migration (`00000000000000_init`, see `WHATFIXED.md` #9), `20260828000000_switch_to_razorpay` (renames `cfOrderId`/`cfPaymentId` → `razorpayOrderId`/`razorpayPaymentId`, see `WHATFIXED.md` #13), and `20260828010000_add_cash_payment_method` (adds the `paymentMethod` enum column, see `WHATFIXED.md` #14). All three were generated via `prisma migrate diff --to-schema-datamodel ... --script` without a live DB connection, since this session has no local Postgres running — a proper `prisma migrate dev --name <description>` against a real dev DB is still preferable when one's available; verify the diff SQL by eye before trusting it either way.

---

## Key Design Decisions

| Decision | Detail |
|----------|--------|
| Hosting split | Frontend: Netlify (free). Backend+DB: single Azure VM via Docker Compose (Azure for Students credit). Reason: Vercel Hobby's ToS prohibits payment processing; Railway lacks a real free tier. See `CLAUDE.md` "Hosting decision" section (note: that section still describes the *original* all-on-one-VM plan — superseded by the Netlify split, see Architecture section above). |
| No custom domain | College couldn't provide one; buying one was skipped in favor of two free hostnames (Netlify subdomain + Azure DNS label) — sufficient for a short 2-3 day event. |
| Payment provider | Razorpay (switched from Cashfree 2026-08-28, user's account is KYC-verified there) — Orders API + Standard Checkout modal, webhook-driven status updates, no per-order notify URL or sandbox/prod URL split. |
| Pay Cash at Event | Added 2026-08-28 (`WHATFIXED.md` #14). Registrants can pick cash instead of Razorpay; reserves the seat (`PENDING`+`CASH`, counted in the public counter immediately) until the registration desk confirms at check-in. A Razorpay row can never be manually flipped to `PAID` by anyone — only the webhook does that. |
| Registration desk role | Second shared password `REGISTRATION_TEAM_PASSWORD`, same `/admin` page. Sees everything, can "Mark Paid" cash rows and "Add Walk-in" registrations, CSV export hidden. No per-person accounts — same tradeoff as the existing admin auth. |
| VORTEX branding | Footer only — header shows college name only |
| Form fields | Name, Email, Phone (required by Razorpay), College, Department, Year, Gender, Food Preference, Payment Method |
| Registration counter | `GET /register/count` public endpoint — counts `PAID` rows (any method) plus `PENDING`+`CASH` reservations |
| Pending row reuse | If same email re-registers with PENDING status, reuse that row instead of creating a new one |
| Reduced motion | CSS `@media (prefers-reduced-motion)` kills all animations globally |
| Fee | Controlled via `WORKSHOP_FEE_RUPEES` env var (backend) — confirm current value in `backend/.env` on the VM |
| Express trust proxy | `app.set("trust proxy", 1)` — required because Caddy sits in front as a single reverse-proxy hop; without it `express-rate-limit` throws on every request (see `WHATFIXED.md` #10) |

---

## Design System Tokens

| Token | Value |
|-------|-------|
| Primary green | `#1a8a54` → `#0d3626` gradient |
| Accent green | `#1fa863` |
| Dark ink | `#08211a` |
| Body ink | `#0c2a1d` |
| Soft ink | `#3f5c4d` |
| Display font | Fraunces (serif) |
| Body font | Inter |
| Mono font | IBM Plex Mono |
| Border radius lg | 28px |
| Shadow md | `0 12px 32px rgba(13,54,38,0.10)` |

---

## Credentials / Access Needed by Whoever Continues This

1. **Razorpay dashboard access** — Test Mode keys need to be put into `backend/.env` on the VM (not done as of this write-up — see "What's Left" above); Live Mode keys need KYC/account activation confirmed first (see "Going to production" above)
2. **Resend dashboard access** — confirm `EMAIL_FROM` is valid, confirm the API key in `backend/.env` is current
3. **Netlify dashboard access** — for env var changes / redeploys
4. **Azure Portal access** (the Azure for Students account) — for VM start/stop, DNS label management, monitoring the $100 credit balance
5. **SSH private key** for the VM (`.pem` file — confirm current holder knows where it is; Windows ACL permissions need fixing via `icacls` if re-downloaded, see `WHATFIXED.md` #6)
6. **GitHub repo access** — `github.com/ItzFaLL3n/workshop-registration`, `master` branch, deploys are manual (`git pull` + `docker compose up -d --build` on the VM; Netlify auto-deploys on push)
