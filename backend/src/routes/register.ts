import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { validateRegistrationInput } from "../lib/validation.js";
import { sendCashReservationEmail } from "../lib/email.js";
import { env } from "../lib/env.js";

export const registerRouter = Router();

const WORKSHOP_FEE_RUPEES = env.WORKSHOP_FEE_RUPEES;

// Each registration creates a Razorpay order, so cap the rate to blunt a
// scripted flood. Set high enough that a whole college lab, a phone hotspot,
// or a shared mobile-carrier / CGNAT IP registering in one rush isn't blocked
// — dozens of unrelated real users routinely share one public IP. A genuine
// abuser still blows past this quickly.
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

// /register/count is public and unauthenticated, and the API isn't behind
// Cloudflare's proxy — cap it so a scripted flood of count() queries can't
// starve the DB connection pool. Generous: real usage is a handful/minute.
const countLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// ──────────────────────────────────────────────
//  GET /register/count  — public, no auth
//  Returns the number of confirmed-or-reserved registrations: PAID
//  (any method) plus cash reservations still awaiting check-in. Those
//  count immediately because the seat is considered held as soon as
//  someone commits to "pay at event" — see WHATFIXED.md #14.
// ──────────────────────────────────────────────
registerRouter.get("/register/count", countLimiter, async (_req, res) => {
  try {
    const count = await prisma.registration.count({
      where: {
        OR: [{ status: "PAID" }, { status: "PENDING", paymentMethod: "CASH" }],
      },
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ count: 0 });
  }
});

// ──────────────────────────────────────────────
//  POST /register
// ──────────────────────────────────────────────
registerRouter.post("/register", registerLimiter, async (req, res) => {
  try {
    const validated = validateRegistrationInput(req.body);
    if ("error" in validated) {
      return res.status(400).json({ error: validated.error });
    }
    const { name, email, phone, college, department, year, gender, foodPreference } =
      validated.data;

    // Online payment is disabled — Razorpay Live onboarding was declined for an
    // individual running event registration (see HANDOFF.md 2026-08-30). Every
    // registration is a cash reservation collected at the desk on event day.
    // Hard-coded server-side (not from req.body) so a crafted request can't
    // re-open a Razorpay/test-mode order path.
    const paymentMethod = "CASH" as const;

    // ── Duplicate guard ──
    // Serialize concurrent /register calls for the SAME email with a Postgres
    // advisory lock, so a double-click or two devices can't both pass the
    // "no existing row" check and each create a row.
    //
    // Re-uses a pending row (user submitted twice, hit back, etc.) instead of
    // creating a new one.
    const outcome = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${email}))`;

      const existing = await tx.registration.findFirst({
        where: { email, status: { in: ["PENDING", "PAID"] } },
      });

      if (existing?.status === "PAID") {
        return { alreadyPaid: true as const };
      }

      if (!existing) {
        const row = await tx.registration.create({
          data: {
            name,
            email,
            phone,
            college,
            department,
            year,
            gender,
            foodPreference,
            paymentMethod,
            amount: WORKSHOP_FEE_RUPEES * 100, // stored in paise
          },
        });
        return { alreadyPaid: false as const, row };
      }

      if (existing.paymentMethod === paymentMethod) {
        return { alreadyPaid: false as const, row: existing };
      }

      const row = await tx.registration.update({
        where: { id: existing.id },
        data: { paymentMethod },
      });
      return { alreadyPaid: false as const, row };
    });

    if (outcome.alreadyPaid) {
      return res
        .status(409)
        .json({ error: "This email has already registered and paid. Check your inbox for the confirmation." });
    }

    const registration = outcome.row;

    // Reserve the seat — no payment gateway involved. Cash is collected at the
    // registration desk on event day and confirmed there via the admin dashboard.
    await sendCashReservationEmail(
      email,
      name,
      WORKSHOP_FEE_RUPEES,
      `wr_${registration.id}`
    ).catch((e) => console.error("Cash reservation email failed:", e));

    return res.json({ registrationId: registration.id, paymentMethod: "CASH" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
