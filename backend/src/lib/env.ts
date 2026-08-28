// Validates required environment variables once at startup so misconfiguration
// fails loudly and immediately, instead of surfacing later as a cryptic
// Razorpay/DB/email error mid-request.
const REQUIRED_VARS = [
  "DATABASE_URL",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "FRONTEND_URL",
  "ADMIN_PASSWORD",
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
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    EMAIL_FROM: process.env.EMAIL_FROM || "workshop@yourdomain.com",
    WORKSHOP_FEE_RUPEES: Number(process.env.WORKSHOP_FEE_RUPEES || 150),
    PORT: process.env.PORT || 4000,
  } as const;
}

export const env = loadEnv();
