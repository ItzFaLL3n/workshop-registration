import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyRazorpayWebhook } from "../lib/razorpay.js";
import { sendConfirmationEmail } from "../lib/email.js";

export const webhookRouter = Router();

// NOTE: this route must be mounted with express.raw({ type: "application/json" })
// in index.ts, BEFORE the global express.json() middleware — signature
// verification needs the exact raw bytes Razorpay sent, not the re-serialized JSON.
// Mounted at /webhook/razorpay in index.ts — route path here is just "/"
webhookRouter.post("/", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    const rawBody = req.body.toString(); // Buffer from express.raw()

    if (!signature || !verifyRazorpayWebhook(rawBody, signature)) {
      console.warn("Rejected webhook: signature mismatch");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = JSON.parse(rawBody);
    const event = payload?.event; // e.g. "payment.captured", "payment.failed"
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id; // Razorpay order id, e.g. "order_xxx"
    const paymentId = paymentEntity?.id;

    if (!orderId) {
      return res.status(400).json({ error: "Missing order_id in payload" });
    }

    if (event === "payment.captured") {
      // Razorpay retries webhooks on a slow/failed response, so guard against
      // re-sending the confirmation email on a retry by only acting on the
      // transition into PAID, not every payment.captured delivery.
      const existing = await prisma.registration.findFirst({
        where: { razorpayOrderId: orderId },
      });

      if (existing && existing.status !== "PAID") {
        const registration = await prisma.registration.update({
          where: { id: existing.id },
          data: { status: "PAID", razorpayPaymentId: paymentId },
        });
        await sendConfirmationEmail(registration.email, registration.name).catch((e) =>
          console.error("Email send failed:", e)
        );
      }
    } else if (event === "payment.failed") {
      // updateMany + status guard so a delayed/out-of-order failed webhook
      // can never downgrade a registration that a later captured payment
      // already marked PAID.
      await prisma.registration.updateMany({
        where: { razorpayOrderId: orderId, status: { not: "PAID" } },
        data: { status: "FAILED" },
      });
    }
    // Any other event (order.paid, refund.*, etc.) — ignore, we only need
    // payment.captured/payment.failed to drive registration status.

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    // 500 tells Razorpay to retry — correct here since the signature is
    // already verified, so failures at this point are almost always
    // transient (DB hiccup) rather than a payload we'll never be able to handle.
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
