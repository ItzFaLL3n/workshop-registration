import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Registration Successful | LLM Agents Workshop",
  description: "Your registration for the LLM Agents Workshop is confirmed.",
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { order_id?: string };
}) {
  const orderId = searchParams.order_id;

  return (
    <>
      <header className="site-header" id="site-header" style={{ position: "sticky", top: 0 }}>
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-logos">
              <div className="logo-box">
                <Image src="/college-logo.png" alt="Sacred Heart College" width={46} height={46} style={{ objectFit: "cover" }} />
              </div>
              <div className="logo-box">
                <Image src="/department-logo.png" alt="Dept. of Computer Applications" width={46} height={46} style={{ objectFit: "cover" }} />
              </div>
            </div>
            <div className="brand-text">
              <span className="brand-college">Sacred Heart College</span>
              <span className="brand-dept">Dept. of Computer Applications</span>
            </div>
          </div>
        </div>
      </header>

      <main
        style={{
          minHeight: "calc(100vh - 92px - 200px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          background: "radial-gradient(circle at 50% 30%, #eaf7ef 0%, #ffffff 65%)",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            background: "#ffffff",
            border: "1px solid #dcece2",
            borderRadius: "28px",
            padding: "56px 44px",
            boxShadow: "0 24px 60px rgba(13,54,38,0.14)",
          }}
        >
          {/* Success icon */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(150deg, #1a8a54, #0d3626)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
              boxShadow: "0 0 0 12px rgba(31,168,99,0.1)",
            }}
          >
            <i className="fa-solid fa-check" style={{ color: "#ffffff", fontSize: "2rem" }} />
          </div>

          <span className="eyebrow" style={{ marginBottom: 16, display: "inline-flex" }}>
            <i className="fa-solid fa-party-horn" /> Payment Confirmed
          </span>

          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              color: "#08211a",
              fontWeight: 650,
              margin: "18px 0 14px",
              lineHeight: 1.1,
            }}
          >
            You&apos;re Registered! 🎉
          </h1>

          <p style={{ color: "#3f5c4d", marginBottom: 12, fontSize: "1.02rem" }}>
            A confirmation email is on its way to your inbox. Check your spam folder if you
            don&apos;t see it within a few minutes.
          </p>

          {orderId && (
            <p
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: ".76rem",
                color: "#7c9488",
                marginBottom: 32,
              }}
            >
              Order ID: {orderId}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/resources" className="btn btn-primary" style={{ justifyContent: "center" }}>
              <span>View Installation &amp; Resources</span>
              <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ justifyContent: "center" }}>
              <i className="fa-solid fa-house" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-event">VORTEX NEOVIA<sup>&apos;27</sup></span>
            <p className="footer-workshop">LLM Agents<br /><span>Concept, Tools and Applications</span></p>
          </div>
          <div className="footer-org">
            <p>Department of Computer Applications</p>
            <p>Sacred Heart College</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <Link href="/">Home</Link>
            <Link href="/#registration">Registration</Link>
            <Link href="/resources">Resources</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Department of Computer Applications. All Rights Reserved.</p>
          <nav className="footer-legal" aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
