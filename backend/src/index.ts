import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./lib/env.js";
import { prisma } from "./lib/prisma.js";
import { registerRouter } from "./routes/register.js";
import { adminRouter } from "./routes/admin.js";

const app = express();

// Caddy sits in front as a single reverse-proxy hop — trust its
// X-Forwarded-For so express-rate-limit identifies clients by real IP.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));

// NOTE: the Razorpay webhook route (`POST /webhook/razorpay`) is intentionally
// NOT mounted — online payment is disabled (registration is cash-only, see
// HANDOFF.md 2026-08-30). Requests to it get a plain 404. To re-enable online
// payment, restore the `webhookRouter` import and the
// `app.use("/webhook/razorpay", express.raw({ type: "application/json" }), webhookRouter)`
// mount here (it must stay above `express.json()` for raw-body signature checks).

app.use(express.json());
app.use(registerRouter);
app.use(adminRouter);

// Health check with a lightweight DB round-trip — used by the uptime
// monitor, so a dead Postgres surfaces as a 503 instead of a false-green 200.
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: true });
  } catch (err) {
    console.error("Health check DB query failed:", err);
    res.status(503).json({ ok: false, db: false });
  }
});

// Catch-all JSON error handler — the safety net for anything that reaches
// here without being handled by a route's own try/catch (e.g. asyncHandler
// rejections in admin.ts, or anything unexpected in registerRouter).
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  // Prisma "record required but not found" — happens when two staff act on the
  // same registration at once (e.g. both hit Delete, or one edits a row the
  // other just deleted). Return a clean 404 instead of a scary 500 so the
  // second click just says "already gone".
  const code = (err as { code?: string })?.code;
  if (code === "P2025") {
    return res
      .status(404)
      .json({ error: "That registration no longer exists — it may have just been changed or deleted by someone else." });
  }
  // Unique-constraint violation (defence-in-depth; not reachable on the
  // cash-only path today, but keep it a clean 409 rather than a 500).
  if (code === "P2002") {
    return res.status(409).json({ error: "That record already exists." });
  }

  res.status(500).json({ error: "Something went wrong. Please try again." });
};
app.use(errorHandler);

app.listen(env.PORT, () => console.log(`Backend running on port ${env.PORT}`));
