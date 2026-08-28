# Agent Handoff — Workshop Registration Site

**Project:** VORTEX NEOVIA'27 — LLM Agents Workshop Registration
**College:** Sacred Heart College, Dept. of Computer Applications
**Last updated:** 2026-08-28
**See also:** `CLAUDE.md` — canonical, kept-current context file (architecture description there is now slightly stale re: hosting split, see below). `WHATFIXED.md` — detailed error/fix log from this deployment session; read it before debugging anything that looks like a repeat of a past issue.

---

## Status: LIVE (Razorpay Test Mode)

**Payment provider switched from Cashfree to Razorpay on 2026-08-28** — the user got KYC-verified on Razorpay and asked to migrate off Cashfree entirely. See `WHATFIXED.md` #13 for the full rundown of what changed. In short:

- `backend/src/lib/cashfree.ts` → `backend/src/lib/razorpay.ts` (Orders API create + webhook signature verify)
- `POST /register` now creates a Razorpay order and returns `razorpayOrderId`/`razorpayKeyId`/`amount`/`currency` instead of a Cashfree `paymentSessionId`
- Frontend opens Razorpay's **Standard Checkout** (an in-page modal loaded via `checkout.js`) instead of redirecting the whole page to a Cashfree-hosted page
- Webhook moved from `/webhook/cashfree` to `/webhook/razorpay`; DB columns `cfOrderId`/`cfPaymentId` renamed to `razorpayOrderId`/`razorpayPaymentId` (migration `20260828000000_switch_to_razorpay`)
- `BACKEND_URL` and `NEXT_PUBLIC_CASHFREE_ENV` env vars are gone entirely — Razorpay doesn't need a per-order notify URL (webhook is configured once in their dashboard) or a sandbox/production URL split (Test vs Live Mode is just which key pair you use)
- **Not yet done, and needed before this is usable at all**: register the actual webhook URL + get the webhook secret from the Razorpay dashboard, put real `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`RAZORPAY_WEBHOOK_SECRET` into `backend/.env` on the VM, redeploy (`git pull && docker compose up -d --build`), then run the full end-to-end test below with a Razorpay test card.

Both halves of the stack are deployed and were confirmed talking to each other successfully as of 2026-08-15 (pre-Razorpay-switch):

- **Frontend:** `https://vortexneovia.netlify.app` — Netlify, deployed from `origin/master`, `frontend/` as base dir
- **Backend:** `https://vortexneovia.centralindia.cloudapp.azure.com` — Azure VM (B2als_v2, Central India), Docker Compose, confirmed serving `/register` successfully (verified with a direct `curl` POST — got back a real `registrationId` + a payment session, back when this was still Cashfree)
- **Database:** Postgres running in the VM's Docker Compose stack, `Registration` table created via migrations

**Not yet done:** Razorpay webhook URL registration in their dashboard (see above), a full end-to-end Test Mode payment test (register → pay → confirm DB flips to `PAID` → confirm email arrives), and the production go-live checklist. See "What's Left" below.

---

## Architecture — DIVERGED FROM `CLAUDE.md`'s original plan

`CLAUDE.md` describes a single-VM plan where the VM runs frontend + backend + postgres + Caddy together. **That changed mid-deployment** — the frontend now runs on **Netlify** instead, because Cashfree's merchant signup required a live website URL before the VM existed. Splitting them let the frontend go live immediately on a free Netlify subdomain while the VM was still being provisioned.

Current real architecture:

| Layer | Where | Notes |
|---|---|---|
| Frontend | **Netlify** | Free `*.netlify.app` subdomain. `netlify.toml` at repo root (`base = "frontend"`, `@netlify/plugin-nextjs` plugin). `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_CASHFREE_ENV` are Netlify env vars (Site configuration → Environment variables), **not** in any repo file — changing them requires a redeploy since they're build-time vars. |
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
2. Put real `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` (Test Mode, from Razorpay Dashboard → Settings → API Keys) into `backend/.env`, then `git pull && docker compose up -d --build` on the VM.
3. **Full Test Mode payment test**: register on the live Netlify site → the Razorpay checkout modal should open in-page (not a full-page redirect like Cashfree did) → pay with a Razorpay test card (e.g. `4111 1111 1111 1111`, any future expiry, any CVV) → confirm it redirects to `/success` → confirm admin dashboard (`/admin`, password = whatever `ADMIN_PASSWORD` is set to in `backend/.env`) shows the row as `PAID` → confirm confirmation email arrives.
4. **Verify `EMAIL_FROM`** in `backend/.env` is a valid sendable address for Resend's current setup (e.g. their shared testing domain if no custom domain is verified) — this was flagged but not confirmed fixed as of last update.
5. **Real content for the Resources page** — still likely has placeholder links (slide deck / repo / cheat sheet).

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
- **Migrations**: `backend/prisma/migrations/` has the initial migration (`00000000000000_init`, see `WHATFIXED.md` #9) plus `20260828000000_switch_to_razorpay` (renames `cfOrderId`/`cfPaymentId` → `razorpayOrderId`/`razorpayPaymentId`, see `WHATFIXED.md` #13). Both were generated via `prisma migrate diff --to-schema-datamodel ... --script` without a live DB connection, since this session has no local Postgres running — a proper `prisma migrate dev --name <description>` against a real dev DB is still preferable when one's available; verify the diff SQL by eye before trusting it either way.

---

## Key Design Decisions

| Decision | Detail |
|----------|--------|
| Hosting split | Frontend: Netlify (free). Backend+DB: single Azure VM via Docker Compose (Azure for Students credit). Reason: Vercel Hobby's ToS prohibits payment processing; Railway lacks a real free tier. See `CLAUDE.md` "Hosting decision" section (note: that section still describes the *original* all-on-one-VM plan — superseded by the Netlify split, see Architecture section above). |
| No custom domain | College couldn't provide one; buying one was skipped in favor of two free hostnames (Netlify subdomain + Azure DNS label) — sufficient for a short 2-3 day event. |
| Payment provider | Razorpay (switched from Cashfree 2026-08-28, user's account is KYC-verified there) — Orders API + Standard Checkout modal, webhook-driven status updates, no per-order notify URL or sandbox/prod URL split. |
| VORTEX branding | Footer only — header shows college name only |
| Form fields | Name, Email, Phone (required by Cashfree), College, Department, Year, Gender, Food Preference |
| Registration counter | `GET /register/count` public endpoint — counts PAID rows only |
| Pending row reuse | If same email re-registers with PENDING status, reuse that row instead of creating a new one |
| Reduced motion | CSS `@media (prefers-reduced-motion)` kills all animations globally |
| Fee | Controlled via `WORKSHOP_FEE_RUPEES` env var (backend) — confirm current value in `backend/.env` on the VM |
| Admin auth | Single shared password via header, no per-user accounts — acceptable at this scale |
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
