import { Resend } from "resend";
import { env } from "./env.js";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendConfirmationEmail(to: string, name: string) {
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "You're registered for the workshop 🎉",
    html: `
      <p>Hi ${name},</p>
      <p>Your registration is confirmed and payment received.</p>
      <p>Check the <a href="${env.FRONTEND_URL}/resources">Installation & Resources page</a>
      before the workshop — it has everything you need to set up in advance.</p>
      <p>See you there!</p>
    `,
  });
}

// Sent when someone picks "Pay Cash at Event" — their seat is reserved
// but not yet paid, so this is deliberately worded differently from the
// confirmation above (which only ever fires once payment is actually in).
export async function sendCashReservationEmail(to: string, name: string, amountRupees: number) {
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "Your seat is reserved — pay cash at check-in 🎟️",
    html: `
      <p>Hi ${name},</p>
      <p>Your seat for the workshop is reserved. You chose to pay at the event, so nothing is
      charged yet — please bring <strong>₹${amountRupees} in cash</strong> (exact amount preferred)
      along with a valid student/college ID to the registration desk on event day.</p>
      <p>Check the <a href="${env.FRONTEND_URL}/resources">Installation & Resources page</a>
      before the workshop — it has everything you need to set up in advance.</p>
      <p>See you there!</p>
    `,
  });
}
