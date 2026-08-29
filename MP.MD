# Prompt for Claude Code — paste this whole file as your instruction

## Context

This is a workshop registration website currently deployed on Netlify
(frontend, Next.js) with a separate backend on an Azure VM (Node/Prisma +
PostgreSQL). We are migrating off Netlify entirely and self-hosting the
frontend on the same Azure VM, behind Caddy (already running there) and
Cloudflare (DNS-proxied, free plan) in front of it. Razorpay handles online
payments (currently test mode). The site also needs to support walk-in /
cash registrations tracked by a registration team, separate from
Razorpay-paid registrants. Expected load: ~500 concurrent viewers, multi-page
site, one live event with an embedded YouTube iframe (unlisted stream, not
self-hosted — no video load on this infra).

## Step 0 — Orient yourself in the actual codebase first

Before writing or changing anything:

1. Read every `README.md`, `CONTRIBUTING.md`, and any other `*.md` file in
   the repo root and in each top-level folder (frontend, backend, infra/deploy
   if present). Summarize what they say the current architecture, deploy
   process, and env vars are.
2. Read `package.json` (both frontend and backend if separate) to confirm
   the actual Next.js version, whether it's App Router or Pages Router, and
   whether `output: 'standalone'` is already set in `next.config.js`.
3. Read the Prisma schema (`schema.prisma`) fully and report the current
   models — especially anything related to registrations, users, payments,
   and roles/auth, if they exist yet.
4. Find the current Razorpay integration code (checkout trigger, order
   creation endpoint, and webhook handler if one exists) and report exactly
   what it does today.
5. Find the current form submission flow for registration (what fields it
   collects, what endpoint it posts to, what validation exists).
6. Check for any existing auth/session system (NextAuth, custom JWT,
   Clerk, etc.) — report what's there, if anything.
7. Report all of the above back as a short architecture summary BEFORE
   proceeding to implementation, so assumptions can be corrected early.

## Step 1 — Deployment target changes (Netlify → self-hosted on Azure VM)

- Remove Netlify-specific config (`netlify.toml`, any `@netlify/*`
  dependencies or Netlify Functions if used for the API layer — replace
  those with plain Express/Next API routes that run under Node on the VM).
- Set `output: 'standalone'` in `next.config.js` if not already set.
- Add a `Dockerfile` (or PM2 ecosystem file if we're not containerizing —
  ask which one the existing backend uses and match it, don't introduce a
  second deployment pattern) to build and run the Next.js app as a
  standalone Node process on a fixed internal port (e.g. 3000), separate
  from the backend API port.
- Do NOT touch the Caddy config — that's managed manually on the VM outside
  this repo. Just make sure the app runs cleanly on a fixed local port that
  Caddy can reverse-proxy to.
- Add a `.env.example` covering every env var the app actually reads
  (grep for `process.env` across the codebase to get the full real list,
  don't guess) — DATABASE_URL, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET, admin auth secret, etc.
- Add a `/api/health` endpoint (simple 200 OK + DB ping) if one doesn't
  exist — needed for uptime monitoring post-migration.

## Step 2 — Data model: online-paid vs cash/walk-in registrations

Extend (or design, if it doesn't exist) the Prisma schema so a single
`Registration` model cleanly represents both paths instead of two separate
tables, e.g.:

```prisma
enum PaymentMethod {
  ONLINE
  CASH
}

enum PaymentStatus {
  PENDING
  PAID
  UNPAID
  FAILED
}

model Registration {
  id              String        @id @default(cuid())
  name            String
  email           String
  phone           String
  // ...whatever other form fields already exist — read them from the
  // current form/schema in Step 0, don't invent new ones
  paymentMethod   PaymentMethod
  paymentStatus   PaymentStatus @default(PENDING)
  razorpayOrderId String?
  razorpayPaymentId String?
  attended        Boolean       @default(false)
  createdBy       String?       // admin/team user id, for cash entries
  updatedBy       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

Adjust field names/types to match whatever the existing form and schema
actually use — this is a shape to reconcile against reality, not to
overwrite blindly.

## Step 3 — Auth & roles for the admin panel

Two roles only:

- **Admin**: full access. Can view all registrations (online + cash), edit
  or delete any entry, update payment status on any entry, mark attendance.
- **Registration team**: can add new walk-in/cash registrations, and can
  edit/update payment status (paid/unpaid) ONLY on entries where
  `paymentMethod = CASH`. Cannot edit, delete, or change payment status on
  `ONLINE` entries. CAN toggle the `attended` flag on `ONLINE` entries (that's
  the one action allowed on paid-online rows) — but cannot touch payment
  status or delete them.

Implementation:
- Simple credentials-based auth is fine (this is an internal tool, not
  public-facing) — a `User` model with `role` enum (`ADMIN`,
  `REGISTRATION_TEAM`), hashed passwords (bcrypt), and a session cookie
  (NextAuth Credentials provider, or a minimal custom JWT-in-httpOnly-cookie
  setup — pick whichever adds less new dependency surface given what
  Step 0 found already in the repo).
- Enforce role checks on the SERVER side (API routes / route handlers), not
  just hidden UI buttons — a registration-team user must get a 403 from the
  API itself if they try to hit the delete-online-entry or
  edit-online-payment-status endpoints directly, regardless of what the
  frontend shows.
- Admin panel pages behind this auth, listing all registrations in a table:
  filterable by payment method (online/cash) and payment status, with the
  attendance toggle, edit, and (admin-only) delete actions inline.

## Step 4 — Razorpay: test → live, and making it not fail

- Locate the current webhook handler. Confirm it verifies the Razorpay
  webhook signature using `RAZORPAY_WEBHOOK_SECRET` and the raw request
  body (not the parsed JSON — Razorpay signature verification requires the
  raw payload; if the current code parses JSON before verifying, that's a
  bug, fix it).
- Confirm the webhook handler is idempotent — if Razorpay retries the same
  webhook (which it does on any non-2xx response), processing it twice
  must not double-count or corrupt the registration record. Use the
  `razorpayPaymentId` as a uniqueness guard before applying updates.
- Confirm order creation happens server-side (never trust a client-supplied
  amount) — the amount charged must be derived from server-side pricing
  logic, not passed in from the frontend.
- Add basic retry/backoff or at least clear error surfacing on the
  checkout flow so a failed payment attempt shows the user an actionable
  error instead of a silent failure, and does not leave an orphaned
  `PENDING` registration with no way to retry.
- Do the actual research (web search) at implementation time on: current
  Razorpay webhook IP ranges / signature verification best practices, and
  the current recommended way to whitelist or bypass Cloudflare
  WAF/Bot Fight Mode for a specific webhook path via a Configuration Rule
  (Cloudflare's dashboard UI and available rule conditions may have
  changed — verify against Cloudflare's current docs rather than assuming).
- Test-mode → live-mode checklist to implement as a runbook doc (not code):
  KYC completion in Razorpay dashboard, swapping test keys for live keys in
  the VM's env (never commit these), re-registering the webhook URL against
  the production domain, and running one real low-value transaction
  end-to-end before the event.

## Step 5 — Reliability, so it doesn't go down under load

- Confirm the Prisma client is instantiated as a singleton (not a new
  `PrismaClient()` per request) — a common cause of connection pool
  exhaustion under concurrent load.
- If Postgres isn't already behind PgBouncer or Prisma's connection pooling
  and the VM is a single small instance, add a bounded `connection_limit`
  in the Prisma `DATABASE_URL` appropriate to the VM's actual core count
  (research the current Prisma-recommended formula rather than guessing a
  number).
- Run the Next.js app under PM2 in cluster mode (or equivalent process
  manager already used by the backend, per Step 0) so a single unhandled
  exception doesn't take the whole site down — auto-restart on crash.
- Add basic rate limiting on the public registration POST endpoint and the
  admin login endpoint (simple in-memory or Redis-backed, whichever fits
  what's already in the stack) to prevent form-spam or brute-force login
  attempts from degrading the DB under the 500-concurrent-viewer load.
- Confirm Caddy's config (report what you find, don't rewrite it) is set to
  proxy correctly to the app's fixed port and ask before changing anything
  there, since it's managed manually.

## Step 6 — Report back

After implementation, produce a short written summary of:
1. Every file changed/added and why.
2. Every new env var required, with a one-line description each.
3. Any assumption made where the codebase didn't match what this prompt
   expected (e.g. different field names, existing auth system reused
   instead of replaced) — flag these explicitly rather than silently
   deviating.
4. What manual steps remain outside the codebase (Cloudflare Configuration
   Rule setup, Razorpay dashboard live-mode switch, DNS) — these are NOT
   to be done by the agent, just listed as a checklist for the human.