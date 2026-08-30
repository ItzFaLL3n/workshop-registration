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

// Brute-force guard for the shared passwords. `skipSuccessfulRequests` means
// only FAILED auths (401 and other >=400s) count toward the limit — so a
// valid staff session can do unlimited bulk work (toggling attendance on
// hundreds of rows at check-in, clearing test rows, CSV pulls) without ever
// tripping it, while a wrong password is still capped at 30 tries / 15 min / IP.
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  skipSuccessfulRequests: true,
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

// Inline gate for actions only the full admin may perform (delete, editing a
// Razorpay row, changing payment status). Call inside a requireStaffAuth
// handler; returns false and writes the 403 if the caller isn't admin.
function requireAdminRole(req: any, res: any): boolean {
  if (req.role === "admin") return true;
  res.status(403).json({ error: "Admin access required for this action." });
  return false;
}

// Editable registrant fields (never status / paymentMethod / amount / razorpay*).
const EDITABLE_FIELDS = [
  "name",
  "email",
  "phone",
  "college",
  "department",
  "year",
  "gender",
  "foodPreference",
] as const;

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
    const { status } = req.query;
    if (status !== undefined && !isValidStatus(status)) {
      return res.status(400).json({ error: "Invalid status filter." });
    }

    // Every registration by default (not just PAID) so the export doubles as
    // the check-in / reconciliation sheet — pass ?status=PAID to narrow it.
    const registrations = await prisma.registration.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "asc" },
    });

    // "30 Aug 2026, 02:15 pm" in IST — readable + sorts sanely in a spreadsheet,
    // unlike a raw ISO timestamp with milliseconds and a Z.
    const istDateTime = (d: Date) =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(d);

    const cell = (value: unknown) => {
      let s = value == null ? "" : String(value);
      // Neutralise spreadsheet formula injection (=, +, -, @, tab, CR leading).
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return `"${s.replace(/"/g, '""')}"`;
    };

    const columns: [string, (r: (typeof registrations)[number]) => unknown][] = [
      ["Name", (r) => r.name],
      ["Email", (r) => r.email],
      ["Phone", (r) => r.phone],
      ["College", (r) => r.college ?? ""],
      ["Department", (r) => r.department ?? ""],
      ["Year", (r) => r.year ?? ""],
      ["Gender", (r) => r.gender ?? ""],
      ["Food Preference", (r) => r.foodPreference ?? ""],
      ["Payment Method", (r) => r.paymentMethod],
      ["Payment Status", (r) => r.status],
      ["Attendance", (r) => (r.attended ? "Present" : "Absent")],
      ["Amount (INR)", (r) => (r.amount / 100).toFixed(2)],
      ["Registered On (IST)", (r) => istDateTime(r.createdAt)],
      ["Last Updated (IST)", (r) => istDateTime(r.updatedAt)],
    ];

    const lines = [
      columns.map(([label]) => cell(label)).join(","),
      ...registrations.map((r) => columns.map(([, get]) => cell(get(r))).join(",")),
    ];
    // Leading BOM so Excel reads it as UTF-8 (names with accents etc.).
    const csv = "﻿" + lines.join("\r\n") + "\r\n";

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="registrations-${stamp}.csv"`
    );
    res.send(csv);
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
//  PATCH /admin/registrations/:id/unmark-cash-paid
//  Reverse a mistaken "Mark Paid" at the desk — flips a CASH row back
//  PAID → PENDING. Both roles (same as mark-cash-paid): a wrong click at
//  the check-in desk shouldn't need the admin to undo it. Still CASH-only
//  and PAID-only — it can't set FAILED/EXPIRED (that's the admin-only
//  status endpoint) and never touches a RAZORPAY row.
// ──────────────────────────────────────────────
adminRouter.patch(
  "/admin/registrations/:id/unmark-cash-paid",
  adminLoginLimiter,
  requireStaffAuth,
  asyncHandler(async (req, res) => {
    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration) {
      return res.status(404).json({ error: "Registration not found." });
    }
    if (registration.paymentMethod !== "CASH") {
      return res.status(400).json({
        error: "Only cash registrations can be changed here — Razorpay payments are webhook-driven.",
      });
    }
    if (registration.status !== "PAID") {
      return res.json({ registration }); // nothing to undo, idempotent
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: { status: "PENDING" },
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

    // Advisory lock on the email so two desk operators adding the same
    // walk-in at once can't both create a row.
    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${email}))`;
      const existing = await tx.registration.findFirst({
        where: { email, status: { in: ["PENDING", "PAID"] } },
      });
      if (existing) {
        return { conflictStatus: existing.status };
      }
      return {
        registration: await tx.registration.create({
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
        }),
      };
    });

    if ("conflictStatus" in result) {
      return res.status(409).json({
        error:
          result.conflictStatus === "PAID"
            ? "This email is already registered and paid."
            : "This email already has a pending registration — use \"Mark Paid\" on that row instead of adding a new one.",
      });
    }

    const { registration } = result;

    await sendConfirmationEmail(email, name, `wr_${registration.id}`).catch((e) =>
      console.error("Walk-in confirmation email failed:", e)
    );

    res.status(201).json({ registration });
  })
);

// ──────────────────────────────────────────────
//  PATCH /admin/registrations/:id/attendance   { attended: boolean }
//  Check-in desk marks someone present/absent on event day. This is the
//  ONLY mutation the registration team may perform on a RAZORPAY row —
//  attendance has nothing to do with payment, so both roles can toggle it
//  on any registration.
// ──────────────────────────────────────────────
adminRouter.patch(
  "/admin/registrations/:id/attendance",
  adminLoginLimiter,
  requireStaffAuth,
  asyncHandler(async (req, res) => {
    const { attended } = req.body ?? {};
    if (typeof attended !== "boolean") {
      return res.status(400).json({ error: "`attended` must be true or false." });
    }
    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration) {
      return res.status(404).json({ error: "Registration not found." });
    }
    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: { attended },
    });
    res.json({ registration: updated });
  })
);

// ──────────────────────────────────────────────
//  PATCH /admin/registrations/:id/status   { status }
//  Admin-only correction of a CASH row's status (e.g. undo a mistaken
//  "Mark Paid", or mark a no-show EXPIRED). A RAZORPAY row's status is
//  driven solely by the webhook and can never be set here, by anyone.
// ──────────────────────────────────────────────
adminRouter.patch(
  "/admin/registrations/:id/status",
  adminLoginLimiter,
  requireStaffAuth,
  asyncHandler(async (req, res) => {
    if (!requireAdminRole(req, res)) return;

    const { status } = req.body ?? {};
    if (!isValidStatus(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }
    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration) {
      return res.status(404).json({ error: "Registration not found." });
    }
    if (registration.paymentMethod === "RAZORPAY") {
      return res.status(400).json({
        error: "Razorpay payment status is controlled by the webhook only and can't be set manually.",
      });
    }
    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: { status },
    });
    res.json({ registration: updated });
  })
);

// ──────────────────────────────────────────────
//  PATCH /admin/registrations/:id   { <editable fields> }
//  Fix a typo in someone's details. Admin may edit any row; the
//  registration team may edit CASH rows only (RAZORPAY rows are off-limits
//  to them entirely, same principle as "Mark Paid"). Never touches
//  status / paymentMethod / amount / razorpay ids.
// ──────────────────────────────────────────────
adminRouter.patch(
  "/admin/registrations/:id",
  adminLoginLimiter,
  requireStaffAuth,
  asyncHandler(async (req, res) => {
    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration) {
      return res.status(404).json({ error: "Registration not found." });
    }
    if (req.role !== "admin" && registration.paymentMethod === "RAZORPAY") {
      return res.status(403).json({
        error: "The registration team can't edit Razorpay-paid registrations.",
      });
    }

    // Merge provided overrides onto the current row, then run the shared
    // validator so the same name/email/phone rules apply as at signup.
    const merged: Record<string, unknown> = {
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      college: registration.college ?? undefined,
      department: registration.department ?? undefined,
      year: registration.year ?? undefined,
      gender: registration.gender ?? undefined,
      foodPreference: registration.foodPreference ?? undefined,
    };
    for (const field of EDITABLE_FIELDS) {
      if (field in (req.body ?? {})) merged[field] = req.body[field];
    }

    const validated = validateRegistrationInput(merged);
    if ("error" in validated) {
      return res.status(400).json({ error: validated.error });
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: validated.data,
    });
    res.json({ registration: updated });
  })
);

// ──────────────────────────────────────────────
//  DELETE /admin/registrations/:id
//  Admin-only. Hard delete — used to clear out spam/test rows.
// ──────────────────────────────────────────────
adminRouter.delete(
  "/admin/registrations/:id",
  adminLoginLimiter,
  requireStaffAuth,
  asyncHandler(async (req, res) => {
    if (!requireAdminRole(req, res)) return;

    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration) {
      return res.status(404).json({ error: "Registration not found." });
    }
    await prisma.registration.delete({ where: { id: registration.id } });
    res.status(204).end();
  })
);
