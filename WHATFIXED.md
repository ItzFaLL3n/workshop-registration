# What Fixed — Deployment Session Error Log

**Date:** 2026-08-14/15
**Context:** First live deployment of the site — Netlify (frontend) + Azure VM via Docker Compose (backend). This log exists so a future agent hitting a similar error doesn't have to re-diagnose from scratch. See `HANDOFF.md` for current architecture/status.

---

## 1. Netlify build failed — `NEXT_PUBLIC_API_URL` not set

**Symptom:** Build failed, error pointed at the env var check in `frontend/lib/api.ts`'s `getApiUrl()`.

**Cause:** Netlify had no env vars configured, and Next.js needs `NEXT_PUBLIC_*` vars baked in at **build time** — an unset var throws immediately per `getApiUrl()`'s fail-fast design.

**Fix:**
- Added `netlify.toml` at repo root declaring `base = "frontend"`, `command = "npm run build"`, `publish = ".next"`, and the `@netlify/plugin-nextjs` plugin (handles `output: "standalone"` fine — no config changes needed there).
- Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_CASHFREE_ENV` in Netlify's Site configuration → Environment variables.
- **Gotcha:** these are build-time vars — changing them requires **Trigger deploy → Clear cache and deploy site**, not just a restart.

---

## 2. Architecture split: frontend moved to Netlify, not the Azure VM

**Why:** Cashfree signup required a live "business website" URL before KYC would proceed, so the frontend had to go live *before* the Azure VM existed. Netlify's free subdomain solved this immediately; the VM was provisioned afterward for the backend only.

**Fix (code changes):**
- Removed the `frontend` service entirely from `docker-compose.yml`.
- Simplified `Caddyfile` to a single block: `{$DOMAIN} { reverse_proxy backend:4000 }` (previously routed `{$DOMAIN}` → frontend and `api.{$DOMAIN}` → backend; now there's no frontend container and no `api.` prefix, since Azure's free DNS label is one hostname).
- Rewrote `.env.production.example` to match (single `DOMAIN` var pointing at the backend's hostname, dropped the frontend build-arg vars).

**Implication for any future agent:** the VM now runs **postgres + backend + caddy only**. The frontend's env vars (`NEXT_PUBLIC_*`) live in Netlify's dashboard, not in this repo's `.env` files.

---

## 3. No custom domain — used two free hostnames instead

**Why:** College couldn't provide a domain, and buying one was avoided since free options cover both halves adequately for a short-lived event.

**Solution:**
- **Frontend:** Netlify's free `*.netlify.app` subdomain → `https://vortexneovia.netlify.app`
- **Backend:** Azure's free DNS name label on the VM's Public IP resource (Configuration → DNS name label) → `https://vortexneovia.<region>.cloudapp.azure.com`. This is a real, publicly resolvable hostname, so Caddy's Let's Encrypt HTTP-01 challenge works exactly like it would on a paid domain.

Cashfree's webhook/return URLs and KYC website field both accept these free subdomains without issue.

---

## 4. Azure region policy blocked deployment in South India

**Symptom:** `RequestDisallowedByAzure` — "This policy maintains a set of best available regions where your subscription can deploy resources."

**Cause:** Azure for Students subscriptions have a region allow-list; **South India** wasn't on it (even though the size-availability page happily showed prices for that region — availability shown ≠ deployment allowed).

**Fix:** Switched region to **Central India**, which was allowed. If a future region also gets disallowed, try East US or Southeast Asia next (commonly allowed for student subscriptions).

---

## 5. B-series (burstable) VM sizes showed "Unavailable" in some regions

**Cause:** Per-region quota restriction on the student subscription, not a real unavailability of the SKU.

**Fix:** Switched regions until B-series appeared (Central India worked). Also corrected a mistaken assumption mid-session: **B2ats_v2 is 2 vCPU / 1GB RAM**, not 4GB — the right size for comfortably running postgres+backend+caddy together turned out to be **B2als_v2** (2 vCPU / 4GB RAM).

---

## 6. SSH "Bad permissions" on the downloaded `.pem` key (Windows)

**Symptom:** `Bad permissions... Load key ...pem: bad permissions` / `Permission denied (publickey)`.

**Cause:** Windows ACLs on the downloaded key file allowed more than just the current user to read it; OpenSSH refuses to use such a key.

**Fix:**
```powershell
icacls <path-to-key.pem> /inheritance:r
icacls <path-to-key.pem> /grant:r "$($env:USERNAME):(R)"
```
This strips inherited ACL entries and grants read-only access to just the current user.

---

## 7. Backend crash-looping — Prisma `P1013: invalid port number in database URL`

**Cause:** `POSTGRES_PASSWORD` in the root `.env` contained a special character (`:`, `@`, `/`, etc.) that broke URL parsing when interpolated into `DATABASE_URL=postgresql://user:password@postgres:5432/db` in `docker-compose.yml`.

**Fix:** Regenerated the password using **alphanumeric characters only** — sidesteps URL-encoding entirely rather than trying to percent-encode the password correctly.

---

## 8. Backend crash-looping (again) — Prisma `P1000: Authentication failed`

**Cause:** After fixing #7 and changing `POSTGRES_PASSWORD`, `docker compose down` + `up` wasn't enough — Postgres's data volume already existed from the *first* boot with the *old* password, and `down` alone doesn't delete named volumes. The backend was now sending the new password against a database still expecting the old one.

**Fix:** `docker compose down -v` (removes volumes too) then `docker compose up -d --build`, safe here only because there was no real data yet. **Do not do this once real registrations exist** — use `ALTER USER ... PASSWORD ...` inside Postgres instead if this ever recurs post-launch.

---

## 9. `/register` returned 500 — Prisma `P2021: table public.Registration does not exist`

**Cause:** The repo never had a `backend/prisma/migrations/` directory. The Dockerfile's boot command (`npx prisma migrate deploy && node dist/index.js`) was a **silent no-op** with nothing to apply — it exits successfully whether or not there are migrations, so this failure mode produced no build/boot error, only a runtime error on first real query.

**Fix:** Generated the missing initial migration **without needing a live database connection**:
```bash
cd backend
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql
```
Then placed it at `backend/prisma/migrations/00000000000000_init/migration.sql` with a `migration_lock.toml` (`provider = "postgresql"`) alongside it, and committed both. `prisma migrate deploy` now has something to apply on every future `down -v` / redeploy / fresh clone.

**Takeaway for future agents:** always check `backend/prisma/migrations/` actually has content before trusting a clean `docker compose up` — an empty/missing migrations folder fails silently, not loudly.

---

## 10. Rate limiter validation error — `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`

**Cause:** Caddy (reverse proxy) sets `X-Forwarded-For`, but Express's default `trust proxy` setting is `false`, so `express-rate-limit` refused to trust the header — logged as a `ValidationError` on every request.

**Fix:** Added `app.set("trust proxy", 1)` in `backend/src/index.ts` right after `const app = express()` — trusts exactly one hop (Caddy), which is correct for this single-reverse-proxy topology. Don't set this to `true` (trusts *any* hop, spoofable) — `1` is intentional here.

---

## 11. Cashfree order creation failed — `order_meta.notify_url_invalid`

**Symptom:** `400 {"code":"order_meta.notify_url_invalid", ... "Value received: vortexneovia.centralindia.cloudapp.azure.com/webhook/cashfree"}`

**Cause:** `BACKEND_URL` in `backend/.env` was set without the `https://` scheme, so the webhook URL built from it (`${env.BACKEND_URL}/webhook/cashfree` in `backend/src/lib/cashfree.ts`) was a bare hostname+path, which Cashfree's API rejects.

**Fix:** Set `BACKEND_URL=https://vortexneovia.centralindia.cloudapp.azure.com` (full scheme included) in `backend/.env`, rebuild.

---

## 12. CORS blocked — trailing slash mismatch

**Symptom:** Browser console: `Access-Control-Allow-Origin' header has a value 'https://vortexneovia.netlify.app/' that is not equal to the supplied origin`.

**Cause:** `FRONTEND_URL` in `backend/.env` had a trailing slash (`https://vortexneovia.netlify.app/`). The backend's `cors({ origin: env.FRONTEND_URL })` (in `index.ts`) does an exact string match against the browser's `Origin` header, which **never** includes a trailing slash. One extra character = CORS failure on every request, no partial-match leniency.

**Fix:** Removed the trailing slash from `FRONTEND_URL` in `backend/.env`, rebuild. **General rule:** never put a trailing slash on `FRONTEND_URL`/origin-style env vars in this codebase.

---

## Diagnostic pattern that worked well throughout

For every "it's broken" report with no detail, the fastest path was:
1. `curl -i` the exact endpoint from outside (with the right `Origin` header for CORS-sensitive routes) to get the *real* HTTP status/body, instead of trusting the browser's vague "Failed to fetch."
2. `docker compose logs backend --tail=N` on the VM for the actual stack trace.
3. Cross-reference the error against the relevant source file (`env.ts`, `cashfree.ts`, `index.ts`) rather than guessing.

Nearly every issue above was a **config/env value problem**, not a code logic bug — worth checking env files first before assuming something's broken at the code level.
