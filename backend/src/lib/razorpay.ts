import crypto from "node:crypto";
import { env } from "./env.js";

const RZP_BASE_URL = "https://api.razorpay.com/v1";

const keyId = env.RAZORPAY_KEY_ID;
const keySecret = env.RAZORPAY_KEY_SECRET;

// Unlike Cashfree, Razorpay has no separate sandbox/production API host —
// Test Mode vs Live Mode is determined purely by which key pair you use
// (rzp_test_... vs rzp_live_...). Going live is just swapping keys, no
// env-flag/URL split to get wrong.
function authHeader() {
  return "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

interface CreateOrderInput {
  receipt: string; // our internal reference, e.g. `wr_<registrationId>` — max 40 ASCII chars
  amountRupees: number; // whole rupees — converted to paise below
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(input: CreateOrderInput) {
  let res: Response;
  try {
    res = await fetch(`${RZP_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify({
        amount: Math.round(input.amountRupees * 100), // paise
        currency: "INR",
        receipt: input.receipt,
        notes: input.notes,
      }),
      // Node's fetch has no default timeout — without this a stalled Razorpay
      // API would hang the /register request indefinitely and pile up under load.
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    throw new Error(
      `Razorpay order request failed (timeout or network): ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Razorpay order creation failed: ${res.status} ${errBody}`);
  }

  return res.json() as Promise<{
    id: string; // e.g. "order_xxx" — this is what we store as razorpayOrderId
    amount: number;
    currency: string;
    status: string;
  }>;
}

/**
 * Fetches a single order by id. Used by the webhook to recover the owning
 * registration when a payment lands on an order whose id is no longer on any
 * row (the user pressed "Register & Pay" again, which mints a fresh order and
 * overwrites razorpayOrderId). The order still carries our notes + receipt.
 */
export async function fetchRazorpayOrder(orderId: string) {
  const res = await fetch(`${RZP_BASE_URL}/orders/${orderId}`, {
    headers: { Authorization: authHeader() },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    throw new Error(`Razorpay order fetch failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<{
    id: string;
    receipt: string | null;
    notes: Record<string, string> | null;
  }>;
}

/**
 * Verifies a Razorpay webhook using the raw request body (NOT the parsed JSON).
 * Signature = hex(HMAC_SHA256(webhook_secret, rawBody))
 * This is a *different* webhook secret than the API key/secret pair — set it
 * separately when adding the webhook URL in the Razorpay dashboard.
 * https://razorpay.com/docs/webhooks/validate-test/
 */
export function verifyRazorpayWebhook(rawBody: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  // constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
