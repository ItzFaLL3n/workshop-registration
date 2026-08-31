# Workshop Registration Site

Registration site for **VORTEX NEOVIA'27** — LLM Agents Workshop, Sacred Heart
College, Dept. of Computer Applications. Event: **Wednesday, 9 September 2026,
08:30 AM – 04:30 PM IST**, Kamarajar Arangam. Fee **₹200**, ~400 registrations
expected (not concurrent).

**Payment is cash-only** — collected at the registration desk on event day.
Razorpay Live onboarding was declined, so there is no online payment gateway,
no webhook, and no card/UPI data handled. A student fills the form → the backend
creates a `PENDING` cash reservation and emails a Reference ID → the desk marks
it `PAID` at check-in (or adds walk-ins directly).

- `frontend/` — Next.js 14, **static export** (`output: "export"`) → **Cloudflare Pages** (`shcbca.online`)
- `backend/` — Express + Prisma + PostgreSQL
- `docker-compose.yml` — the **VM stack**: Postgres + backend + Caddy (auto-HTTPS),
  reachable at `api.shcbca.online`. The frontend is **not** in this stack.

See **CLAUDE.md** for full project context and architecture (kept current each
session). **`docs/runbooks/go-live.md`** is the manual go-live checklist.
**HANDOFF.md** is the point-in-time handoff log. **WHATFIXED.md** is the
error/fix log. **`docs/superpowers/specs/`** holds design specs.

## Quick start (local dev)

```bash
# backend
cd backend
cp .env.example .env   # fill in DATABASE_URL, ADMIN_PASSWORD,
                       # REGISTRATION_TEAM_PASSWORD, RESEND_API_KEY
npm install
npx prisma migrate dev
npm run dev             # http://localhost:4000

# frontend (new terminal)
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev              # http://localhost:3000
```

## Configuration

### Backend env vars (`backend/.env`)

| Var | Required | Default | Purpose |
|---|---|---|---|
| `DATABASE_URL` | yes | — | Postgres connection string (overridden to the `postgres` service by docker-compose) |
| `FRONTEND_URL` | yes | — | CORS origin — the site's public URL, **no trailing slash** |
| `ADMIN_PASSWORD` | yes | — | Full-access `/admin` password (`x-admin-token`) |
| `REGISTRATION_TEAM_PASSWORD` | yes | — | Check-in desk password — view all, mark cash paid, walk-ins; no CSV, no delete |
| `RESEND_API_KEY` | yes | — | Resend key for confirmation / reservation emails |
| `EMAIL_FROM` | no | `workshop@yourdomain.com` | From-address on emails |
| `WORKSHOP_FEE_RUPEES` | no | `200` | Fee in whole rupees (stored in paise on the row) |
| `REGISTRATION_OPEN` | no | `true` | **Master switch for public online registration** — see below |
| `PORT` | no | `4000` | HTTP port |
| `RAZORPAY_KEY_ID` / `_SECRET` / `_WEBHOOK_SECRET` | no | `""` | Unused — only read if online payment is re-enabled |

### Closing / reopening registration

`REGISTRATION_OPEN` is a **manual switch, not a timed cutoff**. Default open;
only the exact string `false` closes it.

```bash
# on the VM — close registration
sed -i 's/^REGISTRATION_OPEN=.*/REGISTRATION_OPEN=false/' backend/.env
docker compose restart backend        # no frontend rebuild needed
```

When closed: `POST /register` returns `403`, `GET /register/status` returns
`{ "open": false }`, and the public form + hero countdown both switch to a
"closed" state (they poll `/register/status` on load; the check fails **open**
if the backend is unreachable). Set it back to `true` and restart to reopen.
The admin desk can still add walk-ins and confirm cash after it closes.

### Frontend env vars (Cloudflare Pages, baked in at build time)

| Var | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | Backend base URL, e.g. `https://api.shcbca.online` |
| `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` | no | `/live` page stream id — blank shows a "not started" placeholder |

## API endpoints

### Public (no auth)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness probe with a real `SELECT 1` — `503` if the DB is down |
| `GET` | `/register/status` | `{ open: boolean }` — is online registration open (`REGISTRATION_OPEN`) |
| `GET` | `/register/count` | Count of held seats: `PAID` (any method) + `PENDING` `CASH` reservations |
| `POST` | `/register` | Create a cash reservation + email a Reference ID. `403` if registration is closed; `409` if that email already paid. Rate-limited 120 / 15 min / IP |

### Staff (`x-admin-token` = admin **or** team password)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/admin/registrations` | List every registration; response includes `role` (`admin` / `team`) |
| `PATCH` | `/admin/registrations/:id/mark-cash-paid` | CASH `PENDING` → `PAID` at check-in (idempotent; never a RAZORPAY row) |
| `PATCH` | `/admin/registrations/:id/unmark-cash-paid` | Undo a mistaken mark — CASH `PAID` → `PENDING` (idempotent) |
| `POST` | `/admin/registrations/walk-in` | Add an on-the-spot registrant — created `PAID` + `CASH` |
| `PATCH` | `/admin/registrations/:id/attendance` | `{ attended: boolean }` — any row, both roles (attendance ≠ payment) |
| `PATCH` | `/admin/registrations/:id` | Edit contact fields — admin any row; team **CASH rows only** |

### Admin only (`x-admin-token` = admin password)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/admin/registrations.csv` | Full CSV export (`?status=PAID` etc. to filter); formula-injection-safe |
| `PATCH` | `/admin/registrations/:id/status` | `{ status }` — correct a **CASH** row's status; a RAZORPAY row's status is webhook-only |
| `DELETE` | `/admin/registrations/:id` | Hard delete — clears spam / test rows |

### Not mounted

`POST /webhook/razorpay` — the Razorpay webhook handler. **Unmounted** (online
payment disabled); the file is kept for re-enabling later — see
"Re-enabling online payment" in `HANDOFF.md`.

## Frontend API helpers (`frontend/lib/api.ts`)

| Function | Calls | Notes |
|---|---|---|
| `getApiUrl()` | — | Resolves `NEXT_PUBLIC_API_URL`, falling back to `http://localhost:5000` |
| `getRegistrationStatus()` | `GET /register/status` | Returns `{ open: boolean }`; **fails open** on any network/parse error |
| `registerForWorkshop(payload)` | `POST /register` | Throws `Error(message)` on a non-2xx response |
