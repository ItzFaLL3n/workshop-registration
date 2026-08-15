"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Home,
  Terminal,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Laptop,
  Mail,
  Download,
  Share2,
} from "lucide-react";
import FloatingNavbar from "@/components/FloatingNavbar";

interface SuccessPageProps {
  searchParams?: {
    order_id?: string;
  };
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams?.order_id || "VN27-CONFIRMED";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <FloatingNavbar currentPath="/success" />

      <main
        style={{
          minHeight: "calc(100vh - 70px)",
          padding: "clamp(100px, 14vh, 140px) 20px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          background: "radial-gradient(ellipse at 50% 15%, rgba(22, 163, 107, 0.12) 0%, rgba(9, 9, 11, 0) 70%)",
        }}
      >
        {/* Container */}
        <div
          style={{
            maxWidth: 780,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Main Success Hero Card */}
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
            {/* Ambient subtle glow inside card */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: 140,
                background: "radial-gradient(ellipse at 50% 0%, rgba(22, 163, 107, 0.22) 0%, rgba(22, 163, 107, 0) 75%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
              {/* Animated Icon Badge */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(22, 163, 107, 0.14)",
                  border: "1px solid rgba(22, 163, 107, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 0 32px rgba(22, 163, 107, 0.3)",
                }}
              >
                <CheckCircle2
                  style={{
                    width: 38,
                    height: 38,
                    color: "var(--accent)",
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
                  background: "var(--accent-light)",
                  border: "1px solid var(--accent-line)",
                  color: "var(--accent)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                <Sparkles style={{ width: 14, height: 14 }} />
                <span>Payment Confirmed · Seat Reserved</span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 2.75rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                  margin: "0 0 14px",
                  lineHeight: 1.15,
                }}
              >
                You&apos;re Registered! 🎉
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.08rem)",
                  color: "var(--ink-3)",
                  maxWidth: 580,
                  margin: "0 auto 32px",
                  lineHeight: 1.6,
                }}
              >
                Welcome to <strong>Vortex Neovia &apos;27</strong>: LLM Agents Workshop. Your transaction has been verified and your delegate pass is officially reserved.
              </p>

              {/* ── Prominent Order ID Card ── */}
              <div
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--line-2)",
                  borderRadius: 16,
                  padding: "20px 24px",
                  textAlign: "left",
                  marginBottom: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--ink-4)",
                        fontWeight: 600,
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Official Order &amp; Reference ID
                    </span>
                    <span
                      style={{
                        fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        color: "var(--accent)",
                        letterSpacing: "0.02em",
                        wordBreak: "break-all",
                      }}
                    >
                      {orderId}
                    </span>
                  </div>

                  <button
                    onClick={handleCopy}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 16px",
                      borderRadius: 9999,
                      background: copied ? "var(--accent)" : "var(--surface-3)",
                      color: copied ? "#ffffff" : "var(--ink)",
                      border: "1px solid var(--line)",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    title="Copy Order ID to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check style={{ width: 14, height: 14 }} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy style={{ width: 14, height: 14 }} />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Important Notice inside Order ID card */}
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(22, 163, 107, 0.08)",
                    border: "1px solid rgba(22, 163, 107, 0.2)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <ShieldCheck
                    style={{
                      width: 18,
                      height: 18,
                      color: "var(--accent)",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      color: "var(--ink-2)",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Keep this for your records:</strong> Please screenshot or save your Order ID. You will need to show this ID along with your valid Student/College ID card at the verification desk on event day.
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
                  href="/install"
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
                  <Terminal style={{ width: 16, height: 16 }} />
                  <span>Start Pre-Workshop Setup</span>
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>

                <Link
                  href="/resources"
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
                  <Download style={{ width: 15, height: 15 }} />
                  <span>Workshop Materials</span>
                </Link>

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

          {/* ── Event Quick Snapshot & Check-in Details ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {/* Date & Time */}
            <div
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)" }}>
                <Calendar style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-4)", fontWeight: 600 }}>
                  Event Date &amp; Time
                </span>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>
                February 27, 2026
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
                <Clock style={{ width: 13, height: 13 }} />
                <span>09:30 AM – 04:30 PM IST</span>
              </div>
            </div>

            {/* Venue */}
            <div
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)" }}>
                <MapPin style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-4)", fontWeight: 600 }}>
                  Venue Location
                </span>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>
                Kamarajar Arangam
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                Sacred Heart College (Autonomous), Tirupattur
              </div>
            </div>

            {/* Requirements */}
            <div
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)" }}>
                <Laptop style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-4)", fontWeight: 600 }}>
                  What to Bring
                </span>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>
                Laptop + Charger
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                With Python 3.11+ &amp; Ollama installed
              </div>
            </div>
          </div>

          {/* ── Next Steps Roadmap Card ── */}
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--line)",
              borderRadius: 20,
              padding: "28px 30px",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--accent)",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Delegate Checklist
              </span>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)" }}>
                What you need to do before arriving
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Step 1 */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  1
                </div>
                <div>
                  <h4 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                    Check your Email Inbox
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                    Your payment receipt and registration details have been sent. Check spam or promotions folder if not visible within 5 minutes.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  2
                </div>
                <div>
                  <h4 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                    Complete Pre-Workshop Toolchain Setup
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                    Visit our{" "}
                    <Link href="/install" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                      Interactive Setup Guide
                    </Link>{" "}
                    to pre-download Python 3.11+, Ollama runner, LangChain, and LlamaIndex to ensure you hit the ground running.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  3
                </div>
                <div>
                  <h4 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                    Arrive with your College ID &amp; Order ID
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                    Registration check-in counter opens promptly at <strong>09:00 AM</strong> at the <strong>Kamarajar Arangam entrance lobby</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Matching Footer ── */}
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
                  <li><Link href="/install">Installation Guide</Link></li>
                  <li><Link href="/terms">Terms &amp; Conditions</Link></li>
                  <li><Link href="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>

              <div>
                <span className="footer-col-title">Help &amp; Inquiries</span>
                <ul className="footer-col-links">
                  <li><Link href="/refund-policy">Refund Policy</Link></li>
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
