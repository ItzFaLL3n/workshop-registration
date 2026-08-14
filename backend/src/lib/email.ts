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
