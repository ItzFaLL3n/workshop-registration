"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Terminal,
  Code2,
  Key,
  Layers,
  FileText,
  Presentation,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Info,
  Download,
  CheckCircle2,
  FolderGit2,
} from "lucide-react";
import FloatingNavbar from "@/components/FloatingNavbar";

const IconGithub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const installSteps = [
  {
    title: "Install Python 3.11+",
    description:
      "The workshop uses Python as the primary runtime for all agent frameworks. Download from python.org — make sure to check 'Add Python to PATH' on Windows.",
    link: "https://www.python.org/downloads/",
    icon: Terminal,
    tag: "Runtime",
  },
  {
    title: "Install VS Code",
    description:
      "Our recommended editor for the hands-on session. Install the Python and Jupyter extensions after setup.",
    link: "https://code.visualstudio.com/download",
    icon: Code2,
    tag: "IDE",
  },
  {
    title: "Setup Ollama Local Runner",
    description:
      "Run open-source LLMs like Llama 3, DeepSeek, and Mistral locally on your machine with zero cloud latency.",
    link: "https://ollama.com/download",
    icon: Layers,
    tag: "Local AI",
  },
  {
    title: "Install Workshop Libraries",
    description:
      "Run this in your terminal: pip install langchain langchain-community langchain-openai chromadb ollama python-dotenv",
    link: "https://pypi.org/project/langchain/",
    icon: Key,
    tag: "SDKs",
  },
  {
    title: "Google Colab Backup Account",
    description:
      "Google Colab provides a free cloud Python environment — handy as a zero-setup fallback during the session.",
    link: "https://colab.research.google.com",
    icon: Sparkles,
    tag: "Cloud Fallback",
  },
];

const materials = [
  {
    title: "Workshop Slide Deck",
    description: "Complete presentation covering LLM internals, prompt chaining, ReAct loops, and agent tool use.",
    link: "#",
    icon: Presentation,
    ready: false,
    format: "PDF / Slides",
  },
  {
    title: "Hands-on Starter Repository",
    description: "Ready-to-run Jupyter notebooks, Python agent scripts, and pre-built tool integration templates.",
    link: "#",
    icon: IconGithub,
    ready: false,
    format: "GitHub Repo",
  },
  {
    title: "LLM Agents Reference Sheet",
    description: "Fast cheat sheet for LangChain agent APIs, prompt patterns, vector search, and troubleshooting.",
    link: "#",
    icon: FileText,
    ready: false,
    format: "Cheat Sheet",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <FloatingNavbar currentPath="/resources" />

      <main
        style={{
          minHeight: "calc(100vh - 70px)",
          padding: "clamp(32px, 5vw, 64px) 20px 80px",
          background: "radial-gradient(ellipse at 50% 10%, rgba(22, 163, 107, 0.09) 0%, rgba(9, 9, 11, 0) 70%)",
        }}
      >
        <div
          style={{
            maxWidth: 880,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 40,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
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
              <BookOpen style={{ width: 14, height: 14 }} />
              <span>Workshop Preparation</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 4.5vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                margin: "0 0 14px",
                lineHeight: 1.15,
              }}
            >
              Installation &amp; Resources
            </h1>
            <p
              style={{
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                color: "var(--ink-3)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Complete the prerequisite software setup before the workshop day so we can jump straight into building live AI agents.
            </p>
          </div>

          {/* Interactive Guide Callout Banner */}
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--accent-line)",
              borderRadius: 20,
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ maxWidth: 540 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                <Sparkles style={{ width: 13, height: 13 }} />
                <span>Interactive Setup Mode</span>
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)" }}>
                Step-by-Step Terminal &amp; Verification Guide
              </h3>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
                Use our interactive playground to copy terminal commands, inspect live code lines, and verify your Python &amp; Ollama environment.
              </p>
            </div>

            <Link
              href="/install"
              className="nav-cta"
              style={{
                padding: "12px 24px",
                fontSize: 13.5,
                fontWeight: 600,
                borderRadius: 9999,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--accent)",
                color: "#ffffff",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(22, 163, 107, 0.3)",
              }}
            >
              <span>Launch Interactive Guide</span>
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>

          {/* Prerequisite Steps */}
          <div>
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
                Quick Checklist
              </span>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)" }}>
                Before You Arrive
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {installSteps.map((step, i) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={i}
                    style={{
                      background: "var(--surface-1)",
                      border: "1px solid var(--line)",
                      borderRadius: 16,
                      padding: "20px 24px",
                      display: "grid",
                      gridTemplateColumns: "48px 1fr auto",
                      gap: 18,
                      alignItems: "center",
                      transition: "border-color 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "var(--surface-2)",
                        border: "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent)",
                      }}
                    >
                      <IconComponent style={{ width: 22, height: 22 }} />
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)" }}>
                          {i + 1}. {step.title}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontFamily: "var(--font-mono)",
                            padding: "2px 8px",
                            borderRadius: 9999,
                            background: "var(--surface-2)",
                            border: "1px solid var(--line)",
                            color: "var(--ink-4)",
                          }}
                        >
                          {step.tag}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                        {step.description}
                      </p>
                    </div>

                    <a
                      href={step.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "8px 16px",
                        fontSize: 12.5,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        borderRadius: 9999,
                        background: "var(--surface-2)",
                        border: "1px solid var(--line)",
                        color: "var(--ink-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        textDecoration: "none",
                      }}
                    >
                      <span>Get Link</span>
                      <ExternalLink style={{ width: 12, height: 12 }} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workshop Materials Section */}
          <div>
            <div style={{ marginBottom: 16 }}>
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
                Materials &amp; Code
              </span>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)" }}>
                Workshop Handouts
              </h2>
            </div>

            {/* Note banner */}
            <div
              style={{
                background: "rgba(22, 163, 107, 0.08)",
                border: "1px solid rgba(22, 163, 107, 0.2)",
                borderRadius: 12,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
                fontSize: 13,
                color: "var(--ink-2)",
              }}
            >
              <Info style={{ width: 16, height: 16, color: "var(--accent)", flexShrink: 0 }} />
              <span>
                Download links and starter repo access will be activated live on the morning of the workshop.
              </span>
            </div>

            {/* Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {materials.map((item, i) => {
                const MatIcon = item.icon;
                return (
                  <div
                    key={i}
                    style={{
                      background: "var(--surface-1)",
                      border: "1px solid var(--line)",
                      borderRadius: 16,
                      padding: "22px 24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: "var(--surface-2)",
                          border: "1px solid var(--line)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--accent)",
                          marginBottom: 14,
                        }}
                      >
                        <MatIcon style={{ width: 20, height: 20 }} />
                      </div>

                      <span
                        style={{
                          fontSize: 10.5,
                          fontFamily: "var(--font-mono)",
                          color: "var(--ink-4)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        {item.format}
                      </span>
                      <h4 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                        {item.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    </div>

                    <button
                      disabled
                      style={{
                        padding: "8px 16px",
                        fontSize: 12,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        borderRadius: 9999,
                        background: "var(--surface-2)",
                        border: "1px solid var(--line)",
                        color: "var(--ink-4)",
                        cursor: "not-allowed",
                        alignSelf: "flex-start",
                      }}
                    >
                      {item.ready ? "Download" : "Unlocks on Event Day"}
                    </button>
                  </div>
                );
              })}
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
                  <Image src="/department-logo.png" alt="Department of Computer Applications logo" width={32} height={32} style={{ objectFit: "cover" }} />
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
                Department of Computer Applications<br />
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
                  <li><a href="mailto:mca@shctpt.edu">mca@shctpt.edu</a></li>
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
