import crypto from "node:crypto";
import { env } from "./env.js";

const CF_BASE_URL =
  env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const clientId = env.CASHFREE_CLIENT_ID;
const clientSecret = env.CASHFREE_CLIENT_SECRET;

interface CreateOrderInput {
  orderId: string;
  amountRupees: number; // whole rupees, not paise — Cashfree order_amount is decimal rupees
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  notifyUrl: string;
}

export async function createCashfreeOrder(input: CreateOrderInput) {
  const res = await fetch(`${CF_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
      "x-api-version": "2023-08-01",
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amountRupees,
      order_currency: "INR",
      customer_details: {
        customer_id: input.customerId,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone,
      },
      order_meta: {
        return_url: input.returnUrl,
        notify_url: input.notifyUrl,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Cashfree order creation failed: ${res.status} ${errBody}`);
  }

  return res.json() as Promise<{
    cf_order_id: string;
    order_id: string;
    payment_session_id: string;
    order_status: string;
  }>;
}

/**
 * Verifies a Cashfree webhook using the raw request body (NOT the parsed JSON).
 * Signature = base64(HMAC_SHA256(secret, timestamp + rawBody))
 * Confirm this against current Cashfree docs before going live —
 * https://www.cashfree.com/docs/payments/online/webhooks/signature-verification
 */
export function verifyCashfreeWebhook(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac("sha256", clientSecret)
    .update(timestamp + rawBody)
    .digest("base64");

  // constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
