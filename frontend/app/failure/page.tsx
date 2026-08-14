import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Payment Failed | LLM Agents Workshop",
  description: "Your payment did not complete. Please try again.",
};

export default function FailurePage() {
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
          background: "radial-gradient(circle at 50% 30%, #fff3f3 0%, #ffffff 65%)",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            background: "#ffffff",
            border: "1.5px solid #f5c6c6",
            borderRadius: "28px",
            padding: "56px 44px",
            boxShadow: "0 24px 60px rgba(13,54,38,0.10)",
          }}
        >
          {/* Failure icon */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(150deg, #e05555, #a82020)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
              boxShadow: "0 0 0 12px rgba(224,85,85,0.08)",
            }}
          >
            <i className="fa-solid fa-xmark" style={{ color: "#ffffff", fontSize: "2rem" }} />
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: ".72rem",
              fontWeight: 500,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#a82020",
              background: "#fff3f3",
              border: "1px solid #f5c6c6",
              padding: "8px 16px",
              borderRadius: "100px",
              marginBottom: 16,
            }}
          >
            <i className="fa-solid fa-triangle-exclamation" /> Payment Not Completed
          </span>

          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              color: "#08211a",
              fontWeight: 650,
              margin: "18px 0 14px",
              lineHeight: 1.1,
            }}
          >
            Payment Didn&apos;t Go Through
          </h1>

          <p style={{ color: "#3f5c4d", marginBottom: 8, fontSize: "1.02rem" }}>
            No amount was deducted. If any amount was charged, it will be auto-refunded
            within 5–7 business days.
          </p>
          <p style={{ color: "#7c9488", marginBottom: 36, fontSize: ".92rem" }}>
            You can try registering again — your details have been saved.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/#registration" className="btn btn-primary" style={{ justifyContent: "center" }}>
              <i className="fa-solid fa-rotate-right" />
              <span>Try Again</span>
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
