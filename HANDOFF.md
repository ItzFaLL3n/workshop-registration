# Agent Handoff — Workshop Registration Site

**Project:** VORTEX NEOVIA'27 — LLM Agents Workshop Registration
**College:** Sacred Heart College, Dept. of Computer Applications
**Last updated:** 2026-08-14
**See also:** `CLAUDE.md` — the canonical, kept-current context file for Claude Code sessions. This file is a point-in-time handoff log; if the two ever disagree, trust `CLAUDE.md`.

---

## What This Site Does

A full registration + payment site for a college inter-collegiate workshop.
- Students fill a form → backend creates a Cashfree order → Cashfree checkout opens → on payment success, webhook flips DB row to PAID and sends confirmation email
- Admin can view all registrations and export CSV
- ~400 total registrations expected (not concurrent — no scaling needed), event runs 2-3 days

---

## Stack

| Layer | Tech | Deploy Target |
|-------|------|---------------|
| Frontend | Next.js 14.2.35 (App Router, TypeScript, Tailwind CSS) | Single Azure VM (Docker Compose) |
| Backend | Node.js + Express + Prisma | Same VM |
| Database | PostgreSQL | Same VM (Docker volume) |
| Payments | Cashfree Orders API (sandbox → production) | — |
| Email | Resend | — |

**Deploy target changed from the original Vercel/Railway plan** — see "Hosting decision" in `CLAUDE.md` for why (Vercel Hobby's ToS prohibits payment processing; Railway no longer has a real free tier). Everything now runs on one Azure VM via `docker-compose.yml`, funded by an Azure for Students credit, built but not yet started — meant to be spun up close to the event so it doesn't sit idle burning credit.

---

## Status: feature-complete + hardened, not yet deployed

### Frontend (`frontend/`) — complete

All pages/components built and styled per the approved design: homepage with registration form, success/failure pages, resources page, password-gated admin dashboard with CSV export. `lib/api.ts` handles registration + live count.

### Backend (`backend/`) — complete, hardened this session

All routes functional: registration with validation + duplicate/pending-row handling, Cashfree order creation, webhook signature verification + idempotent status updates, password-gated admin endpoints with CSV export (gender + food preference columns already included).

**This session's hardening** (full detail in `CLAUDE.md`): fixed a duplicate-confirmation-email bug on webhook retries, added out-of-order webhook protection, added central error handling (`admin.ts` previously had none), validated the admin status query param, added fail-fast env var validation at startup, switched admin auth to constant-time comparison, added rate limiting on `/register` and `/admin/*`, capped free-text field lengths, fixed non-null-assertion crashes on missing `NEXT_PUBLIC_API_URL`, and patched Next.js 14.2.18 → 14.2.35 (was carrying a disclosed critical DoS advisory).

Both apps build clean as of this session.

### Deployment scaffolding — built, not yet run

Added this session, ready to deploy whenever you are:
- `backend/Dockerfile`, `frontend/Dockerfile` (standalone build)
- `docker-compose.yml` (postgres + backend + frontend + Caddy reverse proxy with automatic HTTPS)
- `Caddyfile`
- `.env.production.example` (root-level template for the VM)

Not yet done: the VM itself hasn't been provisioned, and the stack hasn't been started anywhere. Full step-by-step deploy instructions are in `CLAUDE.md` under "Deploy steps."

---

## What Still Needs to Be Done

### Before deploying
1. Fill in real env files: `backend/.env` (from `.env.example`) and root `.env` (from `.env.production.example`) — needs Cashfree keys, a Resend API key + verified sender domain, a long random `ADMIN_PASSWORD`, and the workshop fee amount.
2. Decide/confirm the domain name the site will live at (Caddy needs DNS pointed at the VM before it can issue HTTPS certs).
3. Real content for the Resources page (slide deck / starter repo / cheat sheet links) — still has placeholders.

### Deploy (when close to the event)
Provision the Azure VM → point DNS → install Docker → clone repo → fill env files → `docker compose up -d --build` → add the Cashfree webhook URL in their dashboard. Full steps in `CLAUDE.md`.

### Go-Live Checklist
- [ ] One ₹1 end-to-end sandbox test, confirm DB + admin page
- [ ] Switch to `CASHFREE_ENV=production` / `NEXT_PUBLIC_CASHFREE_ENV=production`, swap in production Cashfree keys
- [ ] One real low-value production transaction before opening registration publicly
- [ ] `ADMIN_PASSWORD` changed from any placeholder to something long and random
- [ ] Resources page has real, final content
- [ ] DNS + HTTPS confirmed on both the main domain and `api.` subdomain
- [ ] Free uptime monitor (e.g. UptimeRobot) set up against `/health`

---

## Key Design Decisions

| Decision | Detail |
|----------|--------|
| VORTEX branding | Footer only — header shows college name only |
| Form fields | Name, Email, Phone (required by Cashfree), College, Department, Year, Gender, Food Preference |
| Registration counter | `GET /register/count` public endpoint — counts PAID rows only |
| Pending row reuse | If same email re-registers with PENDING status, reuse that row instead of creating a new one |
| Reduced motion | CSS `@media (prefers-reduced-motion)` kills all animations globally |
| Fee | Controlled via `WORKSHOP_FEE_RUPEES` env var — owner to confirm value |
| Resources content | LLM-Agents appropriate placeholders — needs real links before going live |
| Admin auth | Single shared password via header, no per-user accounts — acceptable at this scale |
| No git repo | This project has no version control initialized (by choice) |

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

## Credentials Needed from Owner

1. **Cashfree Client ID + Secret** (sandbox first, then production)
2. **Resend API Key** + verified sender email domain
3. **Workshop Fee in ₹** (currently defaulting to ₹499)
4. **Real links** for slide deck, starter repo, cheat sheet (resources page)
5. **ADMIN_PASSWORD** — long, random, not the placeholder
6. **Domain name** for the site (needed before deploying — Caddy needs DNS to issue HTTPS certs)
7. Access to the **Azure for Students** account that will host the VM
