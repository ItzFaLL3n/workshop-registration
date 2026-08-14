# Design

Captured from the existing implementation (`frontend/app/globals.css` + page components). This is the system to preserve while refining navbar, logos, and forms.

## Theme

Light, restrained-green identity. White/near-white surfaces, deep forest ink for text and dark panels, one saturated green accent used deliberately (buttons, active states, icons) rather than washed across the page.

## Color

| Role | Value |
|---|---|
| Body background | `#ffffff` |
| Section alt background | `#f5faf7` |
| Body text | `#0c2a1d` |
| Dark ink (headings) | `#08211a` |
| Soft ink (secondary text) | `#3f5c4d` |
| Muted ink (meta/labels) | `#7c9488` |
| Primary green | `#1a8a54` → `#0d3626` (gradient, buttons/icons) |
| Accent green | `#1fa863` |
| Deep green (link/active text) | `#146c43` |
| Pale green fill | `#eaf7ef` |
| Pale green border | `#d9f0e2` |
| Neutral border | `#dcece2` |
| Dark panel bg (footer, side cards) | `#08211a` |
| Dark panel text | `#d9f0e2` / `#8fdcb2` |
| Error red | `#c0392b` on `#fdf2f2`, border `#d9534f` |

Contrast is already sound (dark ink on white/pale-green, white on dark-green gradients). Preserve this — do not introduce light-gray body text.

## Typography

| Role | Font | Notes |
|---|---|---|
| Display (h1–h3, card titles) | Fraunces (serif), weight 560–650 | Warm, editorial counterpoint to the sans body |
| Body / UI | Inter | 400–700 |
| Mono (eyebrows, labels, meta, badges) | IBM Plex Mono | Small, tracked-out, uppercase for eyebrows/badges |

Base body: 16px / 1.6 line-height. Section titles: `clamp(2rem, 4vw, 2.9rem)`. Hero title: `clamp(3rem, 7vw, 5.6rem)` — within the impeccable 6rem ceiling.

## Layout & Spacing

- Content max-width 1180–1280px, centered, 32px side padding (22px on mobile).
- Section vertical rhythm: 100px desktop / 72px mobile (`.section-inner`).
- Radii: sm 10px (inputs), md 18px (cards, icons), lg 28px (panels, hero cards).
- Shadow scale: soft `0 2px 10px rgba(13,54,38,.06)` for resting cards, `0 12px 32px rgba(13,54,38,.10)` for elevated panels, `0 24px 60px rgba(13,54,38,.14)` on hover/emphasis.
- Pill shape (`border-radius: 100px`) used consistently for buttons, badges, nav links, radio options — a recognizable system motif, keep it.

## Components already established

- **Header** (`.site-header`): sticky, translucent+blur, becomes opaque with shadow on scroll. Brand block = two logo boxes (currently 46×46, `.logo-box`) + college name/department stacked text. No event branding text in the header — institutional identity only.
- **Nav**: pill-shaped links, active state = filled pale-green + underline bar. Collapses to hamburger + slide-down mobile panel under 980px.
- **Buttons**: `.btn-primary` (green gradient, white text, lift+shadow on hover) and `.btn-ghost` (white/bordered) — both pill-shaped.
- **Forms** (`.reg-form` + `.form-row`): stacked label-above-input, `#f5faf7` field fill that whitens on focus, green focus border, pill radio groups (`.radio-pill`) with `:has(:checked)` styling, inline error text shown only when `.invalid`.
- **Footer** (`.site-footer`): dark ink panel. Event name "VORTEX NEOVIA'27" lives here (`.footer-event`) alongside workshop name and org identity — this is intentionally the only place the event brand name appears; the header stays institutional-only.
- **Motion**: `.reveal` fade/rise on scroll via IntersectionObserver, full `prefers-reduced-motion` kill-switch already wired globally. Keep both.

## What's in scope to change

Navbar (logo sizing/proportions, spacing, responsive behavior) and the registration + admin-login form styling/layout. Everything else (hero visual, mission cards, instructions/tutorial grids, footer) keeps its current structure and copy — token-level consistency only.
