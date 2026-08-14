# Product

## Register

brand

## Users

Undergrad/postgrad students at Sacred Heart College and neighboring colleges deciding whether to attend an inter-collegiate LLM Agents workshop, then registering and paying ₹150 through a mobile-first form, often on a shared campus wifi connection on their phone between classes. Secondary audience: the department admin checking registration status on a laptop.

## Product Purpose

VORTEX NEOVIA'27's registration site for the "LLM Agents: Concept, Tools and Applications" workshop. It exists to explain the workshop, build enough confidence to pay a real fee via Cashfree, and capture accurate registrant data (name, contact, college, dietary need) for a 2-3 day in-person event. Success = a student can read the page, trust it's legitimate, fill the form without friction, and complete payment on the first try — on a phone.

## Brand Personality

Precise, credible, quietly technical — an academic department publishing something built with real engineering care, not a flashy hackathon poster. Confidence without hype.

## Anti-references

Not a generic SaaS marketing template (hero-metric stat rows, identical icon-card grids, tiny uppercase eyebrows on every section). Not a college-fest poster (loud gradients, clashing colors, cluttered flyer typography). Not corporate-cold either — this is students inviting other students.

## Design Principles

- Preserve the existing green/ink/Fraunces-Inter-Plex-Mono identity already established in `frontend/app/globals.css` — this is a refinement pass, not a rebrand.
- Institutional trust markers (college + department branding) must read clearly and immediately at the top of every page — that's what makes a stranger trust a payment form.
- The registration form is the conversion point: every choice there is judged on clarity and speed-to-complete on a small screen, not decoration.
- Minimal means removing friction and visual noise, not removing content — copy and information architecture stay intact.
- Every interactive surface (nav, form, buttons) must work cleanly from ~360px phone width up through desktop.

## Accessibility & Inclusion

Keep existing `prefers-reduced-motion` handling. Body text and placeholder text must hit ≥4.5:1 contrast. Form fields need visible focus states and associated error text (already wired via `aria-live`/error spans — preserve and extend that pattern to any new fields).
