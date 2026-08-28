import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { createRazorpayOrder } from "../lib/razorpay.js";
import { validateRegistrationInput } from "../lib/validation.js";
import { sendCashReservationEmail } from "../lib/email.js";
import { env } from "../lib/env.js";

export const registerRouter = Router();

const WORKSHOP_FEE_RUPEES = env.WORKSHOP_FEE_RUPEES;

// Registration triggers a Razorpay order call per request, so cap submission
// rate to deter spam/abuse rather than just accidental double-clicks.
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
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
registerRouter.get("/register/count", async (_req, res) => {
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

    const paymentMethod = req.body.paymentMethod === "CASH" ? "CASH" : "RAZORPAY";

    // ── Duplicate guard ──
    const existing = await prisma.registration.findFirst({
      where: { email, status: { in: ["PENDING", "PAID"] } },
    });

    if (existing?.status === "PAID") {
      return res
        .status(409)
        .json({ error: "This email has already registered and paid. Check your inbox for the confirmation." });
    }

    // Re-use a pending row (e.g. user hit back after a failed payment, or
    // is switching between "pay online" and "pay cash" before completing
    // either one) instead of creating a new one. Only paymentMethod needs
    // updating on reuse — the rest of the row is left as originally
    // submitted, same as before this feature existed.
    const registration = existing
      ? existing.paymentMethod === paymentMethod
        ? existing
        : await prisma.registration.update({
            where: { id: existing.id },
            data: { paymentMethod },
          })
      : await prisma.registration.create({
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

    // ── Pay cash at event: reserve the seat, no Razorpay order at all ──
    if (paymentMethod === "CASH") {
      await sendCashReservationEmail(email, name, WORKSHOP_FEE_RUPEES).catch((e) =>
        console.error("Cash reservation email failed:", e)
      );
      return res.json({ registrationId: registration.id, paymentMethod: "CASH" });
    }

    // ── Pay online: create Razorpay order ──
    // Note: unlike Cashfree, Razorpay orders don't take a return/notify URL —
    // the webhook endpoint is configured once in the Razorpay dashboard, not
    // per order, so there's no BACKEND_URL/scheme footgun here.
    const order = await createRazorpayOrder({
      receipt: `wr_${registration.id}`,
      amountRupees: WORKSHOP_FEE_RUPEES,
      notes: { registrationId: registration.id, email, name },
    });

    await prisma.registration.update({
      where: { id: registration.id },
      data: { razorpayOrderId: order.id },
    });

    res.json({
      registrationId: registration.id,
      paymentMethod: "RAZORPAY",
      razorpayOrderId: order.id,
      razorpayKeyId: env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name,
      email,
      phone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
