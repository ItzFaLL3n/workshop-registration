import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./lib/env.js";
import { registerRouter } from "./routes/register.js";
import { webhookRouter } from "./routes/webhook.js";
import { adminRouter } from "./routes/admin.js";

const app = express();

// Caddy sits in front as a single reverse-proxy hop — trust its
// X-Forwarded-For so express-rate-limit identifies clients by real IP.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));

// Webhook route needs the RAW body for signature verification — mount it
// before express.json() so the body isn't parsed/re-serialized first.
app.use(
  "/webhook/razorpay",
  express.raw({ type: "application/json" }),
  webhookRouter
);

app.use(express.json());
app.use(registerRouter);
app.use(adminRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

// Catch-all JSON error handler — the safety net for anything that reaches
// here without being handled by a route's own try/catch (e.g. asyncHandler
// rejections in admin.ts, or anything unexpected in registerRouter).
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
};
app.use(errorHandler);

app.listen(env.PORT, () => console.log(`Backend running on port ${env.PORT}`));
