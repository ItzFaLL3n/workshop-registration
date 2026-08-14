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
          terms and confirm before this goes live; Cashfree reviews this page during onboarding.
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
          If you wish to cancel your registration, contact us at itzselvan74@gmail.com at least
          2 days before the workshop date. Requests made after this window are not eligible for
          a refund. Once approved, refunds are processed to the original payment method within
          7 business days.
        </P>
      </div>

      <div>
        <H2>2. If the Workshop Is Cancelled or Rescheduled by Us</H2>
        <P>
          If the organizers cancel or indefinitely postpone the workshop, all registered
          participants will receive a full refund, processed within 7 business days of the
          cancellation being announced. If the workshop is rescheduled to a new date, your
          registration carries over automatically unless you request a refund within 7 days of
          the new date being announced.
        </P>
      </div>

      <div>
        <H2>3. Failed or Duplicate Payments</H2>
        <P>
          If a payment is deducted but your registration does not show as confirmed, or if you are
          charged more than once, contact itzselvan74@gmail.com with your payment reference — this
          will be verified and any erroneous charge refunded in full within 7 business days. (Note:
          a payment that fails on Cashfree&apos;s side without a registration being created is
          auto-reversed by Cashfree directly — no separate action is needed for that case.)
        </P>
      </div>

      <div>
        <H2>4. How Refunds Are Issued</H2>
        <P>
          Approved refunds are credited back to the original payment method used at checkout
          (UPI, card, or netbanking) via Cashfree. Processing time after approval is typically
          up to 7 business days, depending on your bank.
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
