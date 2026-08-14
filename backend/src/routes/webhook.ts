import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyCashfreeWebhook } from "../lib/cashfree.js";
import { sendConfirmationEmail } from "../lib/email.js";

export const webhookRouter = Router();

// NOTE: this route must be mounted with express.raw({ type: "application/json" })
// in index.ts, BEFORE the global express.json() middleware — signature
// verification needs the exact raw bytes Cashfree sent, not the re-serialized JSON.
// Mounted at /webhook/cashfree in index.ts — route path here is just "/"
webhookRouter.post("/", async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"] as string;
    const timestamp = req.headers["x-webhook-timestamp"] as string;
    const rawBody = req.body.toString(); // Buffer from express.raw()

    if (!signature || !timestamp || !verifyCashfreeWebhook(rawBody, timestamp, signature)) {
      console.warn("Rejected webhook: signature mismatch");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = JSON.parse(rawBody);
    const orderId = payload?.data?.order?.order_id;
    const paymentStatus = payload?.data?.payment?.payment_status; // e.g. "SUCCESS", "FAILED"
    const cfPaymentId = payload?.data?.payment?.cf_payment_id;

    if (!orderId) {
      return res.status(400).json({ error: "Missing order_id in payload" });
    }

    const registrationId = orderId.replace(/^wr_/, "");

    if (paymentStatus === "SUCCESS") {
      // Cashfree retries webhooks (e.g. if our response is slow/times out),
      // so guard against re-sending the confirmation email on a retry by
      // only acting on the transition into PAID, not every SUCCESS delivery.
      const existing = await prisma.registration.findUnique({
        where: { id: registrationId },
      });

      if (existing && existing.status !== "PAID") {
        const registration = await prisma.registration.update({
          where: { id: registrationId },
          data: { status: "PAID", cfPaymentId },
        });
        await sendConfirmationEmail(registration.email, registration.name).catch((e) =>
          console.error("Email send failed:", e)
        );
      }
    } else if (paymentStatus === "FAILED") {
      // updateMany + status guard so a delayed/out-of-order FAILED webhook
      // can never downgrade a registration that a later SUCCESS already paid.
      await prisma.registration.updateMany({
        where: { id: registrationId, status: { not: "PAID" } },
        data: { status: "FAILED" },
      });
    }
    // Any other status (e.g. pending user actions) — ignore, wait for next webhook

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    // 500 tells Cashfree to retry — correct here since the signature is
    // already verified, so failures at this point are almost always
    // transient (DB hiccup) rather than a payload we'll never be able to handle.
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
