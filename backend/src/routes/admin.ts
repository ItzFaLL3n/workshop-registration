import crypto from "node:crypto";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { env } from "../lib/env.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validateRegistrationInput } from "../lib/validation.js";
import { sendConfirmationEmail } from "../lib/email.js";

export const adminRouter = Router();

const VALID_STATUSES = ["PENDING", "PAID", "FAILED", "EXPIRED"] as const;
type RegistrationStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(value: unknown): value is RegistrationStatus {
  return typeof value === "string" && (VALID_STATUSES as readonly string[]).includes(value);
}

// Hash both sides before comparing so timingSafeEqual always receives two
// equal-length buffers — a raw string compare would leak the password's
// length via how far !== gets before returning false.
function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest();
}

function matches(token: string, secret: string) {
  return crypto.timingSafeEqual(sha256(token), sha256(secret));
}

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

type Role = "admin" | "team";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      role?: Role;
    }
  }
}

// Accepts either the full admin password or the registration-team password
// and tags the request with which one matched. Both can view everything;
// route handlers below are responsible for restricting what "team" may
// change (cash registrations only — Razorpay-paid rows are never editable
// by anyone here, on purpose, since the webhook is the sole source of
// truth for those).
function requireStaffAuth(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"];
  if (typeof token !== "string") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (matches(token, env.ADMIN_PASSWORD)) {
    req.role = "admin";
    return next();
  }
  if (matches(token, env.REGISTRATION_TEAM_PASSWORD)) {
    req.role = "team";
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

// Full admin only — CSV export dumps every field for every registrant, so
// it's kept out of the registration team's reach unlike the plain list view.
function requireAdminAuth(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"];
  if (typeof token !== "string" || !matches(token, env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.role = "admin";
  next();
}

adminRouter.get(
  "/admin/registrations",
  adminLoginLimiter,
  requireStaffAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    if (status !== undefined && !isValidStatus(status)) {
      return res.status(400).json({ error: "Invalid status filter." });
    }

    const registrations = await prisma.registration.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const counts = await prisma.registration.groupBy({
      by: ["status"],
      _count: true,
    });

    res.json({ registrations, counts, role: req.role });
  })
);

adminRouter.get(
  "/admin/registrations.csv",
  adminLoginLimiter,
  requireAdminAuth,
  asyncHandler(async (req, res) => {
    const registrations = await prisma.registration.findMany({
      where: { status: "PAID" },
      orderBy: { createdAt: "asc" },
    });

    const header = "Name,Email,Phone,College,Department,Year,Gender,Food Preference,Payment Method,PaidAt\n";
    const rows = registrations
      .map((r) =>
        [
          r.name,
          r.email,
          r.phone,
          r.college ?? "",
          r.department ?? "",
          r.year ?? "",
          r.gender ?? "",
          r.foodPreference ?? "",
          r.paymentMethod,
          r.updatedAt.toISOString(),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=registrations.csv");
    res.send(header + rows);
  })
);

// ──────────────────────────────────────────────
//  PATCH /admin/registrations/:id/mark-cash-paid
//  Registration desk confirms a "pay at event" reservation was actually
//  paid in cash at check-in. Only ever touches CASH-method rows — a
//  Razorpay row can only ever become PAID via the webhook, never through
//  this endpoint, admin included.
// ──────────────────────────────────────────────
adminRouter.patch(
  "/admin/registrations/:id/mark-cash-paid",
  adminLoginLimiter,
  requireStaffAuth,
  asyncHandler(async (req, res) => {
    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration) {
      return res.status(404).json({ error: "Registration not found." });
    }
    if (registration.paymentMethod !== "CASH") {
      return res.status(400).json({
        error: "Only cash registrations can be marked paid here — Razorpay payments confirm automatically via webhook.",
      });
    }
    if (registration.status === "PAID") {
      return res.json({ registration }); // already done, idempotent
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: { status: "PAID" },
    });

    res.json({ registration: updated });
  })
);

// ──────────────────────────────────────────────
//  POST /admin/registrations/walk-in
//  Registration desk adds someone who never registered online. Cash is
//  collected on the spot, so this is created already PAID — there's
//  nothing left to confirm afterward.
// ──────────────────────────────────────────────
adminRouter.post(
  "/admin/registrations/walk-in",
  adminLoginLimiter,
  requireStaffAuth,
  asyncHandler(async (req, res) => {
    const validated = validateRegistrationInput(req.body);
    if ("error" in validated) {
      return res.status(400).json({ error: validated.error });
    }
    const { name, email, phone, college, department, year, gender, foodPreference } =
      validated.data;

    const existing = await prisma.registration.findFirst({
      where: { email, status: { in: ["PENDING", "PAID"] } },
    });
    if (existing) {
      return res.status(409).json({
        error:
          existing.status === "PAID"
            ? "This email is already registered and paid."
            : "This email already has a pending registration — use \"Mark Paid\" on that row instead of adding a new one.",
      });
    }

    const registration = await prisma.registration.create({
      data: {
        name,
        email,
        phone,
        college,
        department,
        year,
        gender,
        foodPreference,
        paymentMethod: "CASH",
        status: "PAID",
        amount: env.WORKSHOP_FEE_RUPEES * 100,
      },
    });

    await sendConfirmationEmail(email, name).catch((e) =>
      console.error("Walk-in confirmation email failed:", e)
    );

    res.status(201).json({ registration });
  })
);
