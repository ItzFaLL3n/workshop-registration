# Agent Handoff — Workshop Registration Site

**Project:** VORTEX NEOVIA'27 — LLM Agents Workshop Registration
**College:** Sacred Heart College, Dept. of Computer Applications
**Last updated:** 2026-08-15
**See also:** `CLAUDE.md` — canonical, kept-current context file (architecture description there is now slightly stale re: hosting split, see below). `WHATFIXED.md` — detailed error/fix log from this deployment session; read it before debugging anything that looks like a repeat of a past issue.

---

## Status: LIVE (sandbox mode)

Both halves of the stack are deployed and confirmed talking to each other successfully as of 2026-08-15:

- **Frontend:** `https://vortexneovia.netlify.app` — Netlify, deployed from `origin/master`, `frontend/` as base dir
- **Backend:** `https://vortexneovia.centralindia.cloudapp.azure.com` — Azure VM (B2als_v2, Central India), Docker Compose, confirmed serving `/register` successfully (verified with a direct `curl` POST — got back a real `registrationId` + `paymentSessionId`)
- **Cashfree:** Sandbox/Test Mode account created and registered as an **individual/proprietor** (avoided needing UGC/AICTE institutional docs), sandbox API keys wired into `backend/.env`
- **Database:** Postgres running in the VM's Docker Compose stack, `Registration` table created via the (newly-added) initial migration

**Not yet done:** Cashfree webhook URL registration in their dashboard, a full end-to-end sandbox payment test (register → pay → confirm DB flips to `PAID` → confirm email arrives), and the production go-live checklist. See "What's Left" below.

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
| Payments | Cashfree Orders API (currently sandbox/test mode) |
| Email | Resend |

---

## What's Left

### Before opening registration for real
1. **Register the Cashfree webhook** — Test Mode dashboard → Developers → Webhooks → `https://vortexneovia.centralindia.cloudapp.azure.com/webhook/cashfree`, subscribed to payment events. Without this, payments succeed on Cashfree's side but the DB row never flips from `PENDING` to `PAID`.
2. **Full sandbox test**: register on the live Netlify site → pay with a Cashfree sandbox test card → confirm redirect to `/success` → confirm admin dashboard (`/admin`, password = whatever `ADMIN_PASSWORD` is set to in `backend/.env`) shows the row as `PAID` → confirm confirmation email arrives.
3. **Verify `EMAIL_FROM`** in `backend/.env` is a valid sendable address for Resend's current setup (e.g. their shared testing domain if no custom domain is verified) — this was flagged but not confirmed fixed as of last update.
4. **Real content for the Resources page** — still likely has placeholder links (slide deck / repo / cheat sheet).

### Going to production (real money)
1. Cashfree KYC/business verification completion (savings account settlement confirmed acceptable for individual/proprietor registration — see `WHATFIXED.md` context, though the actual approval status wasn't confirmed as of last update — check the dashboard).
2. Switch `CASHFREE_ENV=production` (`backend/.env`) and `NEXT_PUBLIC_CASHFREE_ENV=production` (Netlify env var, needs redeploy), swap in production Cashfree keys.
3. One real low-value production transaction before opening registration publicly.
4. Re-register the Cashfree webhook under Live Mode (Test Mode and Live Mode webhooks are separate in Cashfree's dashboard).
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
- **Migrations**: `backend/prisma/migrations/` now has an initial migration (`00000000000000_init`) — this was missing entirely before this session (see `WHATFIXED.md` #9) and had to be generated after the fact. Any future schema change needs a real `prisma migrate dev --name <description>` run locally against a dev database, with the resulting migration folder committed — don't repeat the "figure it out after the table is missing" cycle.

---

## Key Design Decisions

| Decision | Detail |
|----------|--------|
| Hosting split | Frontend: Netlify (free). Backend+DB: single Azure VM via Docker Compose (Azure for Students credit). Reason: Vercel Hobby's ToS prohibits payment processing; Railway lacks a real free tier. See `CLAUDE.md` "Hosting decision" section (note: that section still describes the *original* all-on-one-VM plan — superseded by the Netlify split, see Architecture section above). |
| No custom domain | College couldn't provide one; buying one was skipped in favor of two free hostnames (Netlify subdomain + Azure DNS label) — sufficient for a short 2-3 day event. |
| Cashfree entity type | Individual/proprietor (not registered business/educational institution) — avoided needing UGC/AICTE certificates, uses a personal savings account for settlement. |
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

1. **Cashfree dashboard access** — sandbox keys are already in `backend/.env` on the VM; production keys need the KYC flow finished first (see "Going to production" above)
2. **Resend dashboard access** — confirm `EMAIL_FROM` is valid, confirm the API key in `backend/.env` is current
3. **Netlify dashboard access** — for env var changes / redeploys
4. **Azure Portal access** (the Azure for Students account) — for VM start/stop, DNS label management, monitoring the $100 credit balance
5. **SSH private key** for the VM (`.pem` file — confirm current holder knows where it is; Windows ACL permissions need fixing via `icacls` if re-downloaded, see `WHATFIXED.md` #6)
6. **GitHub repo access** — `github.com/ItzFaLL3n/workshop-registration`, `master` branch, deploys are manual (`git pull` + `docker compose up -d --build` on the VM; Netlify auto-deploys on push)
