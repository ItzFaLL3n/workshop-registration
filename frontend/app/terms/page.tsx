import LegalPageLayout, { H2, P } from "@/components/LegalPageLayout";

export const metadata = {
  title: "Terms of Service | LLM Agents Workshop",
  description: "Terms governing registration and participation in VORTEX NEOVIA'27.",
};

const DRAFT_NOTICE = false;

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" updated="August 15, 2026">
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
          Draft — review the bracketed placeholders below and confirm before this goes live.
        </div>
      )}

      <P>
        These Terms govern registration and participation in VORTEX NEOVIA&apos;27, an LLM
        Agents workshop organized by the Department of Computer Applications (BCA), Sacred Heart
        College. By registering through this Site, you agree to these Terms.
      </P>

      <div>
        <H2>1. Eligibility &amp; Registration</H2>
        <P>
          Registration is open to students from any college, as this is an inter-collegiate
          workshop. A valid registration requires accurate name, email, and phone details, and
          payment of the ₹150 registration fee via Cashfree. Registration is confirmed only once
          payment is successfully received.
        </P>
      </div>

      <div>
        <H2>2. Payments</H2>
        <P>
          Payments are processed by Cashfree Payments, a third-party payment gateway. We do not
          store your card, UPI, or banking credentials — Cashfree handles this directly.
          Registration fees are subject to the <a href="/refund-policy" style={{ color: "#146c43", fontWeight: 600 }}>Refund &amp; Cancellation Policy</a>.
        </P>
      </div>

      <div>
        <H2>3. Code of Conduct</H2>
        <P>
          Participants are expected to behave respectfully toward organizers, speakers, and fellow
          attendees. The organizers reserve the right to remove any participant from the workshop,
          without refund, for disruptive or inappropriate conduct.
        </P>
      </div>

      <div>
        <H2>4. Changes to the Workshop</H2>
        <P>
          The organizers may need to change the venue, schedule, or speakers due to circumstances
          beyond their control. Registered participants will be notified of any material change by
          email. See the Refund Policy for what happens if the workshop is cancelled or
          rescheduled.
        </P>
      </div>

      <div>
        <H2>5. Limitation of Liability</H2>
        <P>
          The organizers are not liable for any indirect loss arising from your participation in
          or inability to attend the workshop, beyond a refund of the registration fee where
          applicable under the Refund Policy.
        </P>
      </div>

      <div>
        <H2>6. Governing Law</H2>
        <P>
          These Terms are governed by the laws of India. Any disputes will be subject to the
          jurisdiction of the courts in Tirupattur, Tamil Nadu.
        </P>
      </div>

      <div>
        <H2>7. Contact</H2>
        <P>
          Questions about these Terms can be directed to bca@shctpt.edu, Department of
          Computer Applications (BCA), Sacred Heart College.
        </P>
      </div>
    </LegalPageLayout>
  );
}
