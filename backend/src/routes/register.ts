import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { createCashfreeOrder } from "../lib/cashfree.js";
import { env } from "../lib/env.js";

export const registerRouter = Router();

const WORKSHOP_FEE_RUPEES = env.WORKSHOP_FEE_RUPEES;
const MAX_FIELD_LENGTH = 150;

// Registration triggers a Cashfree order call per request, so cap submission
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

    // ── Create Cashfree order ──
    const order = await createCashfreeOrder({
      orderId: `wr_${registration.id}`,
      amountRupees: WORKSHOP_FEE_RUPEES,
      customerId: registration.id,
      customerName: name,
      customerEmail: email,
      customerPhone: phoneNorm,
      returnUrl: `${env.FRONTEND_URL}/success?order_id={order_id}`,
      notifyUrl: `${env.BACKEND_URL}/webhook/cashfree`,
    });

    await prisma.registration.update({
      where: { id: registration.id },
      data: { cfOrderId: order.cf_order_id },
    });

    res.json({
      registrationId: registration.id,
      paymentSessionId: order.payment_session_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
