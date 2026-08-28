# What Fixed — Deployment Session Error Log

**Date:** 2026-08-14/15 (entries 1-12), 2026-08-28 (entries 13-14)
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

## 13. Payment provider swapped: Cashfree → Razorpay

**Why:** Not a bug — the user got KYC-verified on Razorpay and asked to migrate off Cashfree entirely, so this is a full provider replacement rather than a fix.

**What changed:**
- `backend/src/lib/cashfree.ts` deleted, replaced by `backend/src/lib/razorpay.ts` — same shape (a `createXOrder()` + a `verifyXWebhook()`), different API:
  - Order creation: `POST https://api.razorpay.com/v1/orders`, HTTP Basic Auth (`key_id:key_secret` base64), body is `{ amount (paise), currency, receipt, notes }` — no `return_url`/`notify_url` in the request at all, since Razorpay's webhook is configured once in their dashboard rather than per-order. This alone eliminates the entire class of bug that #11 was (a malformed per-order notify URL).
  - Webhook signature: `hex(HMAC_SHA256(rawBody, webhook_secret))` compared against the `x-razorpay-signature` header — simpler than Cashfree's (no timestamp concatenation, hex not base64). The webhook secret is a **third** credential distinct from the key id/secret pair, generated when you add the webhook URL in the dashboard.
- `backend/src/routes/register.ts`: creates a Razorpay order with `receipt: wr_<registrationId>`, stores the returned `order.id` (e.g. `order_xxx`) as `razorpayOrderId`, and returns `razorpayOrderId` + `razorpayKeyId` + `amount` + `currency` to the frontend (instead of Cashfree's `paymentSessionId`). Returning the key id per-request means the frontend needs **zero** payment-related env vars — one less thing to keep in sync across a Netlify rebuild.
- `backend/src/routes/webhook.ts` + `index.ts`: route moved from `/webhook/cashfree` to `/webhook/razorpay`. Payload shape is `{ event: "payment.captured" | "payment.failed" | ..., payload: { payment: { entity: { id, order_id, ... } } } }` — registration is looked up by `razorpayOrderId` (a DB column) rather than by decoding an id embedded in a Cashfree-style `order_id` string. Same idempotency/out-of-order guarantees preserved (only acts on the transition into `PAID`; a `payment.failed` can't downgrade an already-`PAID` row).
- `backend/prisma/schema.prisma` + a new migration (`20260828000000_switch_to_razorpay`): renamed columns `cfOrderId`/`cfPaymentId` → `razorpayOrderId`/`razorpayPaymentId`. Generated via `prisma migrate diff --from-schema-datamodel <old-schema-snapshot> --to-schema-datamodel prisma/schema.prisma --script` (no live DB needed — same technique as fix #9), which produced a DROP+ADD rather than a true `RENAME COLUMN`. That's fine here since no real payment data exists yet (still Test Mode); it would need hand-editing to a `RENAME COLUMN` if this ever needs to run against a DB with real Cashfree-era rows worth preserving.
- `backend/src/lib/env.ts`: `CASHFREE_CLIENT_ID`/`CASHFREE_CLIENT_SECRET`/`CASHFREE_ENV` → `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`RAZORPAY_WEBHOOK_SECRET`. `BACKEND_URL` removed entirely — it existed only to build Cashfree's per-order `notify_url`.
- `frontend/components/RegistrationForm.tsx`: dropped the `@cashfreepayments/cashfree-js` npm SDK and the full-page redirect (`cashfree.checkout({ redirectTarget: "_self" })`); now dynamically injects `https://checkout.razorpay.com/v1/checkout.js` and opens Razorpay's **Standard Checkout** as an in-page modal (`new window.Razorpay({...}).open()`). On success the `handler` callback client-side-redirects to `/success?order_id=...` for immediate UX — same as before, **the webhook remains the sole source of truth** for flipping the DB row to `PAID`, the client redirect is cosmetic only.
- Removed `@cashfreepayments/cashfree-js` from `frontend/package.json`, deleted `frontend/types/cashfree.d.ts`, removed `NEXT_PUBLIC_CASHFREE_ENV` from `frontend/.env.local.example` and the `ARG`/`ENV` in `frontend/Dockerfile` (that Dockerfile is currently unused since frontend is on Netlify, but kept consistent per the same reasoning as fix #2).
- Updated user-facing legal copy that named Cashfree by name: `frontend/app/terms/page.tsx`, `privacy/page.tsx`, `refund-policy/page.tsx`, `page.tsx` (homepage checklist).

**Not a Cashfree-specific bug, but worth knowing:** Razorpay has no sandbox-vs-production **URL** split — Test Mode and Live Mode use the same `api.razorpay.com` host, and which mode you're in is purely determined by which key pair (`rzp_test_...` vs `rzp_live_...`) you authenticate with. That removes the entire "forgot to flip an env flag" failure mode that Cashfree's `CASHFREE_ENV` had.

**Still pending as of this write-up:** the actual Razorpay Test Mode webhook has not been registered in their dashboard yet, and `backend/.env` on the VM still needs real `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`RAZORPAY_WEBHOOK_SECRET` values before any of this can be tested end-to-end. See `HANDOFF.md` → "What's Left" for the exact next steps.

---

## 14. Feature: "Pay Cash at Event" + registration-desk role

**Why:** Not a bug either — the user wanted a fallback for people who can't/won't pay online, plus a way for on-site check-in staff to handle that without giving them the full admin password.

**What was added:**
- `Registration.paymentMethod` enum column (`RAZORPAY` | `CASH`, default `RAZORPAY`), migration `20260828010000_add_cash_payment_method`.
- `POST /register` accepts `paymentMethod: "CASH"` in the body. When set, it **skips Razorpay entirely** — no order is created — and the row is saved with `status: PENDING`, `paymentMethod: CASH` (that combination *is* the "reserved, will pay at the door" state). A cash-specific reservation email goes out (`sendCashReservationEmail` in `email.ts`) instead of the paid-confirmation one.
- `GET /register/count` now counts `PAID` (any method) **plus** `PENDING`+`CASH` rows — a cash reservation counts toward the public number the moment it's made, not only once collected. This was a deliberate choice (asked the user, they picked "count immediately") — the tradeoff is a no-show inflates the number slightly until cleaned up post-event.
- New shared password `REGISTRATION_TEAM_PASSWORD` for the check-in desk, alongside the existing `ADMIN_PASSWORD`. `backend/src/routes/admin.ts`'s auth was split into `requireStaffAuth` (accepts either password, tags the request with `req.role`) and `requireAdminAuth` (admin password only, used solely for the CSV export route — full-data dumps stay admin-only). `GET /admin/registrations` now returns `role` in its JSON so the frontend knows which UI to render.
- `PATCH /admin/registrations/:id/mark-cash-paid` — flips a `CASH` row's status to `PAID` at check-in. **Rejects the request outright if the row's `paymentMethod` isn't `CASH`** — this applies to admin too, on purpose. A Razorpay row can only ever become `PAID` via the webhook; nobody gets a manual override button for those, which is exactly what keeps "who can touch a Razorpay payment" unambiguous.
- `POST /admin/registrations/walk-in` — adds someone who never registered online. Created already `PAID` + `CASH` (cash is collected on the spot when the desk adds the row, so there's nothing left to confirm). Duplicate-email guard reuses the same rule as public registration.
- Extracted registration-field validation (name/email/phone rules, length caps) out of `register.ts` into a shared `backend/src/lib/validation.ts` — `register.ts` and the new walk-in route both call it, so the rules can't drift apart between the two entry points.
- Frontend: `RegistrationForm.tsx` gained a "Pay Online Now" / "Pay Cash at Event" radio choice; picking cash skips the Razorpay checkout modal and redirects straight to `/success?method=cash&order_id=wr_<id>`. `/success/page.tsx` shows different copy for that case (reservation language, "bring ₹150 cash" instead of "payment confirmed"). `/admin/page.tsx` gained a Method filter, a Payment Method column, a "Mark Paid" button (visible only on cash+pending rows), an "Add Walk-in" inline form, and a "Cash — Awaiting Check-in" KPI card; the CSV export button is hidden entirely when logged in as `team` rather than `admin`.

**Not done / worth knowing:** the registration-team login has no per-person identity (it's one shared password, same tradeoff as `ADMIN_PASSWORD` already documented) — there's no record of *which* desk staff member marked a given row paid, only that someone with the team (or admin) password did, at whatever time `updatedAt` shows.

---

## Diagnostic pattern that worked well throughout

For every "it's broken" report with no detail, the fastest path was:
1. `curl -i` the exact endpoint from outside (with the right `Origin` header for CORS-sensitive routes) to get the *real* HTTP status/body, instead of trusting the browser's vague "Failed to fetch."
2. `docker compose logs backend --tail=N` on the VM for the actual stack trace.
3. Cross-reference the error against the relevant source file (`env.ts`, `cashfree.ts`, `index.ts`) rather than guessing.

Nearly every issue above was a **config/env value problem**, not a code logic bug — worth checking env files first before assuming something's broken at the code level.
