import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyRazorpayWebhook, fetchRazorpayOrder } from "../lib/razorpay.js";
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
      let existing = await prisma.registration.findFirst({
        where: { razorpayOrderId: orderId },
      });

      // The row's razorpayOrderId gets overwritten whenever the user presses
      // "Register & Pay" again (each press mints a fresh order). If a payment
      // lands on one of those older orders, no row matches by order id — so
      // recover the registration from the order's own notes/receipt, which
      // still point back to it. Without this, the payment would be silently
      // dropped (money in, registration never marked PAID).
      if (!existing) {
        try {
          const order = await fetchRazorpayOrder(orderId);
          const regId =
            order.notes?.registrationId ||
            (order.receipt && order.receipt.startsWith("wr_")
              ? order.receipt.slice(3)
              : undefined);
          if (regId) {
            existing = await prisma.registration.findUnique({ where: { id: regId } });
          }
        } catch (e) {
          console.error(`Webhook: recovery lookup for order ${orderId} failed:`, e);
        }
      }

      if (!existing) {
        // Genuinely unknown — a stray test event, or a payment for an order we
        // never stored. Ack with 200 so Razorpay stops retrying something we
        // can never match; nothing to do.
        console.warn(`Webhook payment.captured for unknown order ${orderId} — ignoring`);
        return res.status(200).json({ received: true, ignored: "unknown order" });
      }

      // Defence-in-depth idempotency: if this exact payment id already landed
      // on a PAID row, this is a retry — no-op. (razorpayPaymentId is unique
      // at the DB level too.)
      if (paymentId) {
        const byPayment = await prisma.registration.findFirst({
          where: { razorpayPaymentId: paymentId },
        });
        if (byPayment && byPayment.status === "PAID") {
          return res.status(200).json({ received: true, ignored: "already processed" });
        }
      }

      if (existing.status !== "PAID") {
        // Atomic transition: updateMany with a `status: { not: "PAID" }` guard
        // so if two payment.captured deliveries land at the same time, exactly
        // one UPDATE matches (count === 1) and only that one sends the email.
        // Also pins razorpayOrderId to the order actually paid (matters when
        // this was a stale-order recovery).
        const { count } = await prisma.registration.updateMany({
          where: { id: existing.id, status: { not: "PAID" } },
          data: { status: "PAID", razorpayPaymentId: paymentId, razorpayOrderId: orderId },
        });
        if (count === 1) {
          const registration = await prisma.registration.findUnique({
            where: { id: existing.id },
          });
          if (registration) {
            await sendConfirmationEmail(registration.email, registration.name).catch((e) =>
              console.error("Email send failed:", e)
            );
          }
        }
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
