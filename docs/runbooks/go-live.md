# Go-Live Runbook

Everything outside the codebase needed to take the site live:

- **Frontend** -> Cloudflare Pages, on the free `*.pages.dev` subdomain
  (no custom domain required).
- **API** -> the Azure VM, reachable at its free Azure DNS name
  `vortexneovia.centralindia.cloudapp.azure.com`. TLS is a normal Let's Encrypt
  cert obtained by Caddy.

No Cloudflare zone, no nameserver change, no Origin Certificate, no WAF rule --
Cloudflare only ever serves the static frontend. If you later buy a real domain,
see section 11.

Do these roughly in order. Nothing here is done by the coding agent -- it's all
dashboard / DNS / VM work.

---

## 1. Azure -- VM hostname & firewall

1. Azure Portal -> the VM -> **Overview** -> confirm **DNS name** is
   `vortexneovia.centralindia.cloudapp.azure.com`. (If it's ever blank: open the
   Public IP resource -> Configuration -> set the **DNS name label** to
   `vortexneovia`.)
2. Public IP -> Configuration -> **Assignment: Static**, so the IP can't change
   under you right before the event.
3. VM -> **Networking** -> Inbound port rules -> allow **80** and **443** from
   Any. Port 80 is mandatory -- Let's Encrypt's HTTP-01 challenge uses it.
4. From your laptop: `nslookup vortexneovia.centralindia.cloudapp.azure.com`
   must return the VM's public IP.

## 2. VM -- get the code

```bash
ssh <user>@vortexneovia.centralindia.cloudapp.azure.com

# first time only:
git clone https://github.com/ItzFaLL3n/workshop-registration.git
cd workshop-registration

# every time:
git fetch origin
git checkout feat/cloudflare-migration-attendance   # or master, once merged
git pull
```

On the VM, if `ufw` is active: `sudo ufw allow 80 && sudo ufw allow 443`.

## 3. VM -- root `.env`

Copy `.env.production.example` -> `.env` and fill in:

```env
DOMAIN=vortexneovia.centralindia.cloudapp.azure.com
POSTGRES_USER=workshop
POSTGRES_PASSWORD=<long, letters+digits only -- no symbols, see WHATFIXED.md #7>
POSTGRES_DB=workshop_registration
```

## 4. Cloudflare Pages -- the frontend

1. dash.cloudflare.com -> **Workers & Pages** -> **Create** -> **Pages** ->
   **Connect to Git** -> authorise GitHub -> select `workshop-registration`.
2. Build settings:
   - Production branch: `feat/cloudflare-migration-attendance` (switch to
     `master` after you merge)
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npx next build`
   - Build output directory: `out`
   - Root directory (under Advanced): `frontend`
3. Environment variables -- add to **Production and Preview both**:
   - `NEXT_PUBLIC_API_URL = https://vortexneovia.centralindia.cloudapp.azure.com`
   - `NEXT_PUBLIC_YOUTUBE_VIDEO_ID =` (leave empty until the stream exists)
4. **Save and Deploy**. ~3 min -> you get `https://<project>.pages.dev`. That is
   the final public URL on the free path -- note it for section 5.
5. `NEXT_PUBLIC_*` values are baked in at build time. To change one later: edit
   the Pages env var, then **Retry deployment** (or push a commit). Editing the
   var alone does nothing.

## 5. VM -- `backend/.env`

Copy `backend/.env.example` -> `backend/.env`. All of these must be set:

```env
DATABASE_URL=postgresql://placeholder     # overridden by compose; the var just has to exist
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=                   # from section 7 -- fill, then rebuild
FRONTEND_URL=https://<project>.pages.dev   # from section 4, EXACT, no trailing slash
ADMIN_PASSWORD=<long random>
REGISTRATION_TEAM_PASSWORD=<different long random>
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=VORTEX NEOVIA <onboarding@resend.dev>
WORKSHOP_FEE_RUPEES=150
```

## 6. VM -- bring the stack up

```bash
docker compose up -d --build
docker compose logs -f caddy      # wait for it to obtain the Let's Encrypt cert
docker compose logs backend       # `prisma migrate deploy` applies 20260829000000_...
curl -s https://vortexneovia.centralindia.cloudapp.azure.com/health
# -> {"ok":true,"db":true}
```

If Caddy can't get a cert: port 80 is blocked (NSG or ufw) or DNS isn't
resolving yet. Those are the only two causes.

## 7. Razorpay -- Test Mode end-to-end

1. Razorpay Dashboard -> **Test Mode** -> Account & Settings -> **Webhooks** ->
   Add:
   - URL: `https://vortexneovia.centralindia.cloudapp.azure.com/webhook/razorpay`
   - Active events: `payment.captured`, `payment.failed`
   - Secret: type any random string -> put that exact value in `backend/.env`
     as `RAZORPAY_WEBHOOK_SECRET`, then `docker compose up -d --build` again.
   (No Cloudflare WAF rule needed -- Cloudflare isn't in front of the API here.)
2. On `https://<project>.pages.dev`: register -> Razorpay modal opens in-page ->
   pay with test card `4111 1111 1111 1111`, any future expiry, any CVV ->
   choose **Success** on the simulated bank page.
3. Confirm: redirect to `/success`; `/admin` (with `ADMIN_PASSWORD`) shows the
   row as `PAID`; the confirmation email arrives.

## 8. Feature test list

- **Cash flow**: register choosing "Pay Cash at Event" -> reservation email ->
  `/success` shows cash copy -> `/admin` shows `CASH` / `PENDING`, counts toward
  `/register/count`.
- **Team login**: log into `/admin` with `REGISTRATION_TEAM_PASSWORD` -> CSV
  button hidden; "Mark Paid" works on a cash+pending row; "Add Walk-in" creates
  a `PAID` row.
- **Attendance**: toggle "Present/Absent" on any row (both roles, any method).
  Reload -- it sticks.
- **Edit**: admin edits any row; team's Edit button is hidden on Razorpay rows
  and 403s if forced.
- **Status**: admin sees a status dropdown on cash rows only; changing a
  Razorpay row's status is refused.
- **Delete**: admin only; team gets no button and a direct `DELETE` returns 403.
- **CSV**: has an `Attended` column.
- **/live**: with `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` unset shows the "hasn't
  started" card; set it + redeploy -> the embed plays.
- **Payment retry**: close the Razorpay modal without paying -> the form shows
  the "seat held as pending, press Register & Pay to try again" message;
  retrying reuses the same row.

## 9. Going to production (real money)

1. Confirm Razorpay **Live Mode** is unlocked (KYC approved).
2. Swap `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in `backend/.env` for the
   `rzp_live_...` pair; `docker compose up -d --build`.
3. **Re-register the webhook under Live Mode** -- Test and Live webhooks (and
   their secrets) are separate. Update `RAZORPAY_WEBHOOK_SECRET`, rebuild.
4. One real low-value transaction end-to-end before opening registration
   publicly.
5. Re-confirm `ADMIN_PASSWORD` is not the placeholder.

## 10. Monitoring & after the event

- UptimeRobot (or similar) -> HTTP(s) monitor on
  `https://vortexneovia.centralindia.cloudapp.azure.com/health`, 1-5 min
  interval, alert on non-200.
- After the event: `docker compose down` on the VM, or **Stop (deallocate)** the
  VM from the Azure Portal (an in-OS `shutdown` does **not** stop billing).
- Data stays in the `postgres_data` volume. If you need it long-term, `pg_dump`
  it out first.

## 11. Later -- moving to a real domain

If you buy e.g. `bcashc.online`:

1. Add it to Cloudflare (Free plan), switch the nameservers at the registrar,
   wait for the zone to show **Active**, set SSL/TLS mode to **Full (strict)**.
2. Cloudflare Pages -> your project -> **Custom domains** -> add `bcashc.online`
   (and `www` -> redirect to apex if you want). The `pages.dev` URL keeps
   working alongside it.
3. To move the API onto `api.bcashc.online` too:
   - Cloudflare DNS: add a **DNS only** (grey cloud) `A` record `api` -> the VM's
     public IP.
   - VM root `.env`: `DOMAIN=api.bcashc.online`.
   - `backend/.env`: `FRONTEND_URL=https://bcashc.online`.
   - Cloudflare Pages env: `NEXT_PUBLIC_API_URL=https://api.bcashc.online`, then
     Retry deployment.
   - Re-register the Razorpay webhook at the new URL.
   - `docker compose up -d --build`.
   Grey-clouded means Caddy keeps doing Let's Encrypt directly -- still no Origin
   Cert, still no WAF rule. Going orange-cloud (proxied) additionally requires a
   Cloudflare Origin Certificate on Caddy and a `/webhook/*` WAF **Skip** rule
   (or the Razorpay webhook gets bot-challenged and payments silently never
   confirm) -- only worth it if you specifically want Cloudflare's edge/WAF in
   front of the API.
