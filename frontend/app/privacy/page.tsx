import LegalPageLayout, { H2, P } from "@/components/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy | LLM Agents Workshop",
  description: "How VORTEX NEOVIA'27 collects, uses, and protects your registration data.",
};

const DRAFT_NOTICE = true; // flip to false once the bracketed placeholders below are filled in

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="[DATE — confirm before publishing]">
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
          Draft — review the bracketed placeholders below (contact email, retention period) and
          confirm before this goes live.
        </div>
      )}

      <P>
        This Privacy Policy explains how the Department of Computer Applications, Sacred Heart
        College, collects and uses information submitted through the VORTEX NEOVIA&apos;27
        registration site (&quot;the Site&quot;).
      </P>

      <div>
        <H2>1. Information We Collect</H2>
        <P>
          When you register, we collect your name, email address, phone number, college,
          department, year of study, gender, and food preference. This information is provided
          directly by you through the registration form.
        </P>
      </div>

      <div>
        <H2>2. How We Use Your Information</H2>
        <P>
          We use this information to process your registration and payment, confirm your seat by
          email, plan logistics (e.g. catering based on food preference), and contact you with
          essential updates about the workshop. We do not use your information for marketing
          unrelated to this event, and we do not sell your data.
        </P>
      </div>

      <div>
        <H2>3. Third Parties We Share Data With</H2>
        <P>
          Payment processing is handled by <strong>Cashfree Payments</strong>, which receives the
          details necessary to process your transaction (name, email, phone, and payment amount).
          Confirmation emails are sent via <strong>Resend</strong>. Neither party uses your data
          for any purpose beyond providing their service to us. We do not share your information
          with any other third party.
        </P>
      </div>

      <div>
        <H2>4. Data Retention</H2>
        <P>
          Registration data is retained for [RETENTION PERIOD — e.g. one academic year after the
          event] for record-keeping and to handle any post-event queries, after which it is
          deleted.
        </P>
      </div>

      <div>
        <H2>5. Your Rights</H2>
        <P>
          You may request to see, correct, or delete the information we hold about you by
          contacting us at [CONTACT EMAIL].
        </P>
      </div>

      <div>
        <H2>6. Contact</H2>
        <P>
          Questions about this policy can be directed to [CONTACT EMAIL], Department of Computer
          Applications, Sacred Heart College.
        </P>
      </div>
    </LegalPageLayout>
  );
}
