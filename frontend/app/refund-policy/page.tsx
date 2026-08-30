import LegalPageLayout, { H2, P } from "@/components/LegalPageLayout";

export const metadata = {
  title: "Refund Policy | LLM Agents Workshop",
  description: "Cancellation and refund terms for VORTEX NEOVIA'27 registration.",
};

const DRAFT_NOTICE = false;

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund &amp; Cancellation Policy" updated="August 15, 2026">
      {DRAFT_NOTICE && (
        <div
          style={{
            background: "#eaf7ef",
            border: "1.5px solid #8fdcb2",
            borderRadius: 14,
            padding: "14px 20px",
            fontSize: ".88rem",
            color: "#146c43",
          }}
        >
          Draft — the refund window and processing time below are placeholders. Decide the real
          terms and confirm before this goes live; Razorpay reviews this page during onboarding.
        </div>
      )}

      <P>
        This policy covers cancellations and refunds for registrations to VORTEX
        NEOVIA&apos;27 (₹150 registration fee), organized by the Department of Computer
        Applications, Sacred Heart College.
      </P>

      <div>
        <H2>1. Cancellations by You</H2>
        <P>
          The ₹150 fee is only collected in cash at the registration desk on event day, so
          cancelling a seat reservation beforehand costs you nothing — just email
          itzselvan74@gmail.com so we can free up your place. If you have already paid in cash at
          the desk and need to withdraw before the workshop begins, ask a registration-desk
          organizer on the day for a full cash refund of your ₹150.
        </P>
      </div>

      <div>
        <H2>2. If the Workshop Is Cancelled or Rescheduled by Us</H2>
        <P>
          If the organizers cancel or indefinitely postpone the workshop, any registration fee
          already paid will be refunded in full. If the workshop is rescheduled to a new date,
          your registration carries over automatically; you may withdraw it at any time before
          the new date at no cost.
        </P>
      </div>

      <div>
        <H2>3. Overpayment at the Desk</H2>
        <P>
          Payment is made in person at the registration desk, so online payment failures do not
          apply. If you believe you were given incorrect change or asked to pay more than the
          ₹150 fee, raise it with a registration-desk organizer immediately, or email
          itzselvan74@gmail.com with your name and Reference ID and it will be corrected.
        </P>
      </div>

      <div>
        <H2>4. How Refunds Are Issued</H2>
        <P>
          Where a fee has been collected, refunds are issued in cash at the registration desk on
          event day. If a refund is due because the workshop was cancelled, the organizers will
          arrange it directly with you by email.
        </P>
      </div>

      <div>
        <H2>5. Contact</H2>
        <P>
          For any refund or cancellation request, email itzselvan74@gmail.com with your registered
          name and email address.
        </P>
      </div>
    </LegalPageLayout>
  );
}
