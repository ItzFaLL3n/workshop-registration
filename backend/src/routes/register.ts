import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { createRazorpayOrder } from "../lib/razorpay.js";
import { env } from "../lib/env.js";

export const registerRouter = Router();

const WORKSHOP_FEE_RUPEES = env.WORKSHOP_FEE_RUPEES;
const MAX_FIELD_LENGTH = 150;

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
//  Returns the number of PAID registrations.
//  Used by the frontend hero and form counters.
// ──────────────────────────────────────────────
registerRouter.get("/register/count", async (_req, res) => {
  try {
    const count = await prisma.registration.count({ where: { status: "PAID" } });
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
    const {
      name,
      email,
      phone,
      college,
      department,
      year,
      gender,
      foodPreference,
    } = req.body;

    // ── Basic validation ──
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ error: "Name, email, and phone are required." });
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const phoneNorm = String(phone).replace(/\s+/g, "");
    if (!/^[6-9]\d{9}$/.test(phoneNorm)) {
      return res.status(400).json({ error: "Please provide a valid 10-digit Indian mobile number." });
    }

    const tooLong = [name, college, department].some(
      (v) => typeof v === "string" && v.length > MAX_FIELD_LENGTH
    );
    if (tooLong) {
      return res.status(400).json({ error: `Name, college, and department must be under ${MAX_FIELD_LENGTH} characters.` });
    }

    // ── Duplicate guard ──
    const existing = await prisma.registration.findFirst({
      where: { email, status: { in: ["PENDING", "PAID"] } },
    });

    if (existing?.status === "PAID") {
      return res
        .status(409)
        .json({ error: "This email has already registered and paid. Check your inbox for the confirmation." });
    }

    // Re-use a pending row (e.g. user hit back after a failed payment)
    const registration = existing
      ? existing
      : await prisma.registration.create({
          data: {
            name,
            email,
            phone: phoneNorm,
            college,
            department,
            year,
            gender,
            foodPreference,
            amount: WORKSHOP_FEE_RUPEES * 100, // stored in paise
          },
        });

    // ── Create Razorpay order ──
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
      razorpayOrderId: order.id,
      razorpayKeyId: env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name,
      email,
      phone: phoneNorm,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
