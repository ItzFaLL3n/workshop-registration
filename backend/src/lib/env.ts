// Validates required environment variables once at startup so misconfiguration
// fails loudly and immediately, instead of surfacing later as a cryptic
// Razorpay/DB/email error mid-request.
// RAZORPAY_* are NOT required — online payment is disabled and registration is
// cash-only (see HANDOFF.md 2026-08-30). They can be removed from `.env`
// entirely; leave them only if you're actively re-enabling online payment.
const REQUIRED_VARS = [
  "DATABASE_URL",
  "FRONTEND_URL",
  "ADMIN_PASSWORD",
  "REGISTRATION_TEAM_PASSWORD",
  "RESEND_API_KEY",
] as const;

function loadEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        `Copy .env.example to .env and fill these in before starting the server.`
    );
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    // Optional — only used if online payment is re-enabled (webhook re-mounted).
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ?? "",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ?? "",
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
    FRONTEND_URL: process.env.FRONTEND_URL!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    REGISTRATION_TEAM_PASSWORD: process.env.REGISTRATION_TEAM_PASSWORD!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    EMAIL_FROM: process.env.EMAIL_FROM || "workshop@yourdomain.com",
    WORKSHOP_FEE_RUPEES: Number(process.env.WORKSHOP_FEE_RUPEES || 200),
    // Master switch for public online registration. Flip to close it without a
    // code change or a frontend rebuild: set REGISTRATION_OPEN=false in
    // backend/.env and restart the backend container. Unset — or anything other
    // than the exact string "false" — means OPEN. Only POST /register is gated;
    // the admin desk can still add walk-ins and confirm cash after it closes.
    REGISTRATION_OPEN:
      (process.env.REGISTRATION_OPEN ?? "true").trim().toLowerCase() !== "false",
    PORT: process.env.PORT || 4000,
  } as const;
}

export const env = loadEnv();
