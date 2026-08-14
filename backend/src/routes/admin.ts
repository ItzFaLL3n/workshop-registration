import crypto from "node:crypto";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { env } from "../lib/env.js";
import { asyncHandler } from "../lib/asyncHandler.js";

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

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

function requireAdminAuth(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"];
  if (typeof token !== "string" || !crypto.timingSafeEqual(sha256(token), sha256(env.ADMIN_PASSWORD))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

adminRouter.get(
  "/admin/registrations",
  adminLoginLimiter,
  requireAdminAuth,
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

    res.json({ registrations, counts });
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

    const header = "Name,Email,Phone,College,Department,Year,Gender,Food Preference,PaidAt\n";
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
