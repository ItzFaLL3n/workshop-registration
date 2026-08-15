import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

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
      <header className="site-header" id="site-header" style={{ position: "sticky", top: 0 }}>
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-logos">
              <div className="logo-box">
                <Image src="/college-logo.png" alt="Sacred Heart College" width={128} height={128} style={{ objectFit: "cover" }} />
              </div>
              <div className="logo-box">
                <Image src="/department-logo.png" alt="Dept. of Computer Applications" width={128} height={128} style={{ objectFit: "cover" }} />
              </div>
            </div>
            <div className="brand-text">
              <span className="brand-college">Sacred Heart College</span>
              <span className="brand-dept">Dept. of Computer Applications</span>
            </div>
          </div>
          <nav className="main-nav" aria-label="Primary">
            <ul>
              <li><Link href="/" className="nav-link">← Back to Home</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="section">
          <div className="section-inner" style={{ maxWidth: 760 }}>
            <div className="section-head" style={{ textAlign: "left" }}>
              <h1 className="section-title" style={{ fontSize: "clamp(1.7rem, 4vw, 2.3rem)" }}>{title}</h1>
              <p className="section-lede" style={{ fontSize: ".88rem" }}>Last updated: {updated}</p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                color: "#0c2a1d",
                fontSize: ".98rem",
                lineHeight: 1.7,
              }}
            >
              {children}
            </div>
          </div>
        </section>
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

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#08211a", margin: 0 }}>
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ margin: 0, color: "#3f5c4d" }}>{children}</p>;
}
