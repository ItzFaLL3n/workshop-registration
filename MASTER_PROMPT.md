# Master Prompt — Workshop Registration Site

Paste everything below into Claude Code (or a similar coding agent) inside this
project folder to finish the build. A working scaffold already exists —
your job is to wire in the real design and take it to deployment.

---

## Context

This is a registration + payment site for a college workshop.

- **Expected load:** ~400 total registrations, not concurrent — no need for
  queues, caching, or horizontal scaling. Optimize for shipping fast and
  correctly, not for scale.
- **Frontend:** Next.js 14 (App Router, TypeScript, Tailwind) → deployed on **Vercel**
- **Backend:** Node/Express + Prisma → deployed on **Railway**, with Railway's
  managed Postgres as the database
- **Payments:** Cashfree Orders API (sandbox → production), 0% fee under
  their current new-merchant promo
- **Email:** Resend, for post-payment confirmation

## What's already built

```
workshop-registration/
├── MASTER_PROMPT.md          ← this file
├── backend/
│   ├── prisma/schema.prisma  ← Registration model
│   ├── src/
│   │   ├── index.ts          ← Express app entry
│   │   ├── lib/
│   │   │   ├── cashfree.ts   ← order creation + webhook signature verification
│   │   │   ├── email.ts      ← Resend confirmation email
│   │   │   └── prisma.ts
│   │   └── routes/
│   │       ├── register.ts   ← POST /register
│   │       ├── webhook.ts    ← POST /webhook/cashfree
│   │       └── admin.ts      ← GET /admin/registrations, /admin/registrations.csv
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── page.tsx           ← registration form (UNSTYLED — see Task 1)
    │   ├── success/page.tsx
    │   ├── failure/page.tsx
    │   ├── resources/page.tsx ← Installation & Resources page (see Task 2)
    │   └── admin/page.tsx     ← password-gated registration list + CSV export
    ├── components/RegistrationForm.tsx
    ├── lib/api.ts
    └── .env.local.example
```

The registration flow, Cashfree checkout redirect, webhook signature
verification, DB writes, and admin auth are all functional. What's
**not** done is the visual design and the real content for the
Resources page.

## Task 1 — Apply the design file

I have a separate HTML design file for this site: `[ATTACH: design.html]`

1. Read it fully — markup, inline/linked CSS, fonts, colors, spacing, any JS
   behavior.
2. Extract a design token set from it (colors, font families, type scale,
   spacing/radius conventions) and put those in `tailwind.config.ts` —
   don't invent new ones, don't fall back to Tailwind/shadcn defaults.
3. Rebuild `app/page.tsx` and `components/RegistrationForm.tsx` to match the
   design file's structure and styling **exactly**, while keeping the
   existing form logic (state, validation, submit handler, Cashfree
   checkout redirect) untouched — only the markup/classes change, not the
   behavior.
4. Reuse the same token set on `success/`, `failure/`, and `resources/` pages
   so the whole site feels like one product, even though only the home page
   had an explicit design.
5. Follow through on responsiveness, focus states, and reduced-motion —
   don't skip these just because the reference file might not show them.

## Task 2 — Build out the Installation & Resources page

`app/resources/page.tsx` currently has placeholder content. Replace the
`installSteps` and `resources` arrays with the real ones for this workshop:

- **installSteps:** every tool/account a participant needs before arriving
  (e.g. "Install Node.js 20+", "Create a free [service] account"), each with
  a one-line reason and a direct link
- **resources:** slide deck, starter repo/code, cheat sheet, or whatever
  materials this workshop actually hands out — link placeholders are fine
  for anything not ready yet, but structure the array for the real list

Ask me for the actual workshop topic/tools if it's not obvious from context,
rather than inventing generic placeholders.

## Task 3 — Environment & local run

1. Copy `.env.example` → `.env` in `backend/`, and `.env.local.example` →
   `.env.local` in `frontend/`
2. I'll supply: Cashfree sandbox client ID/secret, a Railway Postgres URL
   (or run Postgres locally via Docker for dev), a Resend API key
3. Run `npx prisma migrate dev` in `backend/` to create the schema
4. Get both `npm run dev` processes running locally and confirm:
   - Form submission creates a `PENDING` registration row
   - Cashfree sandbox checkout opens with the right amount
   - A sandbox test payment flips the row to `PAID` via webhook
   - Confirmation email fires
   - `/resources` and `/admin` render correctly

## Task 4 — Deploy

**Railway (backend):**
- New project → deploy from this repo's `backend/` folder
- Add a Postgres plugin, copy `DATABASE_URL` into the service's variables
- Set all other `.env.example` vars as Railway environment variables
- Run `npx prisma migrate deploy` against production once live
- Note the public Railway URL — this becomes `BACKEND_URL` and the frontend's
  `NEXT_PUBLIC_API_URL`

**Vercel (frontend):**
- Import this repo's `frontend/` folder as the project root
- Set `NEXT_PUBLIC_API_URL` to the Railway backend URL
- Set `NEXT_PUBLIC_CASHFREE_ENV=sandbox` for now

**Cashfree dashboard:**
- Add the Railway webhook URL (`https://<railway-url>/webhook/cashfree`)
  under Developers → Webhooks, subscribed to payment events

## Task 5 — Go live checklist

- [ ] One real ₹1 end-to-end transaction in sandbox, confirmed in the DB and
      admin page
- [ ] Switch `CASHFREE_ENV=production` on Railway and
      `NEXT_PUBLIC_CASHFREE_ENV=production` on Vercel, swap in prod
      Cashfree keys
- [ ] One real low-value transaction in production before opening
      registration publicly
- [ ] `ADMIN_PASSWORD` changed from the placeholder to something long and
      random
- [ ] Confirm the Resources page has real, final content (not placeholders)

---

Work through the tasks in order. Ask before making structural decisions I
haven't specified (e.g. exact copy for error states) rather than guessing —
but proceed autonomously through anything covered above.
