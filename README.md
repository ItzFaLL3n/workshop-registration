# Workshop Registration Site

Registration + Cashfree payment site for a college workshop (~400 expected
registrations, not concurrent, event runs 2-3 days).

- `frontend/` — Next.js 14
- `backend/` — Express + Prisma
- `docker-compose.yml` — full stack (Postgres + backend + frontend + Caddy),
  deployed as a single Docker Compose stack on one VM. See **CLAUDE.md**
  for why (Vercel Hobby's ToS prohibits payment processing; Railway has no
  meaningful free tier) and the full deploy steps.

See **CLAUDE.md** for full project context, architecture, and the current
state of the codebase — it's kept up to date each session. **HANDOFF.md**
has the point-in-time handoff log. **MASTER_PROMPT.md** is the original
build spec (historical reference).

## Quick start (local dev)

```bash
# backend
cd backend
cp .env.example .env   # fill in Cashfree sandbox keys + DB URL
npm install
npx prisma migrate dev
npm run dev             # http://localhost:4000

# frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev              # http://localhost:3000
```
