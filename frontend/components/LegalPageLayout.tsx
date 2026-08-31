import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import FloatingNavbar from "@/components/FloatingNavbar";

export default function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <FloatingNavbar />

      <main
        style={{
          minHeight: "calc(100vh - 70px)",
          padding: "clamp(100px, 14vh, 140px) 20px 80px",
          background: "radial-gradient(ellipse at 50% 10%, rgba(22, 163, 107, 0.06) 0%, rgba(9, 9, 11, 0) 70%)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <Link
              href="/"
              style={{
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                color: "var(--ink-4)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 16,
              }}
            >
              ← Back to Home
            </Link>
            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                margin: "0 0 8px",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 12.5,
                fontFamily: "var(--font-mono)",
                color: "var(--ink-4)",
                margin: 0,
              }}
            >
              Last updated: {updated}
            </p>
          </div>

          {/* Body Card */}
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--line)",
              borderRadius: 20,
              padding: "clamp(24px, 4vw, 36px)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              color: "var(--ink-2)",
              fontSize: 14.5,
              lineHeight: 1.7,
            }}
          >
            {children}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top-row">
            <div className="footer-brand-col">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="logo-img-wrap" style={{ width: 32, height: 32 }}>
                  <Image src="/college-logo.png" alt="Sacred Heart College logo" width={32} height={32} style={{ objectFit: "cover" }} />
                </div>
                <div className="logo-img-wrap" style={{ width: 32, height: 32 }}>
                  <Image src="/department-logo.png" alt="Department of Computer Applications (BCA) logo" width={32} height={32} style={{ objectFit: "cover" }} />
                </div>
              </div>
              <span
                style={{
                  fontWeight: 650,
                  letterSpacing: "-0.02em",
                  fontSize: 13.5,
                  color: "var(--ink)",
                  marginTop: 4,
                }}
              >
                VORTEX NEOVIA &apos;27 • LLM Agents
              </span>
              <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.6, margin: 0 }}>
                Department of Computer Applications (BCA)<br />
                Sacred Heart College (Autonomous), Tirupattur
              </p>
            </div>

            <div className="footer-links-grid">
              <div>
                <span className="footer-col-title">Navigation</span>
                <ul className="footer-col-links">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/install">Setup Guide</Link></li>
                  <li><Link href="/resources">Resources</Link></li>
                </ul>
              </div>

              <div>
                <span className="footer-col-title">Guidelines</span>
                <ul className="footer-col-links">
                  <li><Link href="/terms">Terms &amp; Conditions</Link></li>
                  <li><Link href="/privacy">Privacy Policy</Link></li>
                  <li><Link href="/refund-policy">Refund Policy</Link></li>
                </ul>
              </div>

              <div>
                <span className="footer-col-title">Help &amp; Inquiries</span>
                <ul className="footer-col-links">
                  <li><a href="tel:+916383483749">Help desk: +91&nbsp;63834&nbsp;83749</a></li>
                  <li><a href="mailto:bca@shctpt.edu">bca@shctpt.edu</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <span>&copy; {new Date().getFullYear()} Sacred Heart College. All rights reserved.</span>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <Link href="/privacy" style={{ color: "var(--ink-4)", transition: "color .15s" }}>Privacy</Link>
              <Link href="/refund-policy" style={{ color: "var(--ink-4)", transition: "color .15s" }}>Refunds</Link>
              <Link href="/terms" style={{ color: "var(--ink-4)", transition: "color .15s" }}>Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "1.15rem",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: "var(--ink)",
        margin: 0,
      }}
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ margin: 0, color: "var(--ink-3)" }}>{children}</p>;
}
