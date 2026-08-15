"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Mail,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import FloatingNavbar from "@/components/FloatingNavbar";

export default function FailurePage() {
  return (
    <>
      <FloatingNavbar currentPath="/failure" />

      <main
        style={{
          minHeight: "calc(100vh - 70px)",
          padding: "clamp(100px, 14vh, 140px) 20px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          background: "radial-gradient(ellipse at 50% 15%, rgba(248, 113, 113, 0.10) 0%, rgba(9, 9, 11, 0) 70%)",
        }}
      >
        <div
          style={{
            maxWidth: 680,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Main Card */}
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--line)",
              borderRadius: 24,
              padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ambient subtle glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: 140,
                background: "radial-gradient(ellipse at 50% 0%, rgba(248, 113, 113, 0.18) 0%, rgba(248, 113, 113, 0) 75%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
              {/* Icon */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(248, 113, 113, 0.12)",
                  border: "1px solid rgba(248, 113, 113, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 0 32px rgba(248, 113, 113, 0.25)",
                }}
              >
                <AlertTriangle
                  style={{
                    width: 36,
                    height: 36,
                    color: "var(--error)",
                  }}
                />
              </div>

              {/* Eyebrow badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 14px",
                  borderRadius: 9999,
                  background: "var(--error-bg)",
                  border: "1px solid var(--error-line)",
                  color: "var(--error)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                <span>Transaction Incomplete</span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                  margin: "0 0 14px",
                  lineHeight: 1.15,
                }}
              >
                Payment Didn&apos;t Go Through
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                  color: "var(--ink-3)",
                  maxWidth: 520,
                  margin: "0 auto 28px",
                  lineHeight: 1.6,
                }}
              >
                The payment session was cancelled or timed out by the gateway. If any amount was deducted, your issuing bank will automatically refund it within 3–5 business days.
              </p>

              {/* Security info box */}
              <div
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--line-2)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  textAlign: "left",
                  marginBottom: 28,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <ShieldAlert
                  style={{
                    width: 20,
                    height: 20,
                    color: "var(--error)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
                    Your Registration Details Are Safe
                  </h4>
                  <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
                    You can try registering again immediately. You can choose any UPI app (GPay, PhonePe, Paytm) or card at the gateway.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                }}
              >
                <Link
                  href="/#registration"
                  className="nav-cta"
                  style={{
                    padding: "12px 28px",
                    fontSize: 14,
                    fontWeight: 600,
                    borderRadius: 9999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "var(--accent)",
                    color: "#ffffff",
                    textDecoration: "none",
                    boxShadow: "0 4px 18px rgba(22, 163, 107, 0.35)",
                  }}
                >
                  <RotateCcw style={{ width: 16, height: 16 }} />
                  <span>Retry Registration</span>
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>

                <a
                  href="mailto:bca@shctpt.edu"
                  style={{
                    padding: "12px 24px",
                    fontSize: 13.5,
                    fontWeight: 500,
                    borderRadius: 9999,
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--ink-2)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Mail style={{ width: 15, height: 15 }} />
                  <span>Contact Support</span>
                </a>

                <Link
                  href="/"
                  style={{
                    padding: "12px 20px",
                    fontSize: 13.5,
                    fontWeight: 500,
                    borderRadius: 9999,
                    background: "transparent",
                    border: "1px solid var(--line)",
                    color: "var(--ink-3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Home style={{ width: 15, height: 15 }} />
                  <span>Home</span>
                </Link>
              </div>
            </div>
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
                  <li><Link href="/#registration">Registration</Link></li>
                  <li><Link href="/install">Setup Guide</Link></li>
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
