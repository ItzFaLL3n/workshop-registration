# Workshop Registration Site

Registration + Razorpay payment site for a college workshop (~400 expected
registrations, not concurrent, event runs 2-3 days).

- `frontend/` — Next.js 14, **static export** (`output: "export"`) → deployed on **Cloudflare Pages** (`bcashc.online`)
- `backend/` — Express + Prisma
- `docker-compose.yml` — the **VM stack**: Postgres + backend + Caddy (auto-HTTPS),
  reachable at `api.bcashc.online`. The frontend is **not** in this stack.

See **CLAUDE.md** for full project context and architecture (kept current each
session). **`docs/runbooks/go-live.md`** is the manual go-live checklist.
**HANDOFF.md** is the point-in-time handoff log. **`docs/superpowers/specs/`**
holds design specs. **MASTER_PROMPT.md** / **MP.MD** are historical build prompts.

## Quick start (local dev)

```bash
# backend
cd backend
cp .env.example .env   # fill in Razorpay test keys + DB URL
npm install
npx prisma migrate dev
npm run dev             # http://localhost:4000

# frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev              # http://localhost:3000
```
