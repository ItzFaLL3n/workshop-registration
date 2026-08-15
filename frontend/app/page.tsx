import RegistrationForm from "@/components/RegistrationForm";
import ClientScripts from "@/components/ClientScripts";
import dynamic from "next/dynamic";
import AgentWorkflowDiagram from "@/components/AgentWorkflowDiagram";
import { getRegistrationCount } from "@/lib/api";
import Image from "next/image";
import FloatingNavbar from "@/components/FloatingNavbar";
import {
  Compass,
  Target,
  Sparkles,
  Eye,
  Rocket,
  CheckCircle2,
  Brain,
  ArrowRight,
  UserCheck,
  Layers,
  Cpu,
  Terminal,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Code2,
} from "lucide-react";

const PhotoSlideshow = dynamic(() => import("@/components/PhotoSlideshow"), {
  ssr: false,
});

export const revalidate = 60;

export default async function HomePage() {
  const count = await getRegistrationCount();

  return (
    <>
      {/* ── 1. FLOATING NAVBAR ───────────────────────────────── */}
      <FloatingNavbar currentPath="/" />

      <main>
        {/* ── 2. HERO SECTION ──────────────────────────────────── */}
        <section className="hero-wrapper" id="home">
          <div className="hero-grid">
            {/* Left Column */}
            <div className="hero-left-col">
              <div className="hero-eyebrow-pill">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                <span>INTER-COLLEGIATE WORKSHOP • 27TH FEB 2026</span>
              </div>

              <h1 className="hero-title-display">
                <span className="hero-title-serif">LLM</span>
                <span className="hero-title-serif accent">AGENTS</span>
              </h1>

              <div className="hero-subtitle-mono">
                Concept, Tools and Applications
              </div>

              <p className="hero-desc-para">
                The <strong>Department of Computer Applications (BCA)</strong> at Sacred Heart College cordially invites you to an intensive hands-on workshop on <strong>February 27, 2026</strong> at <strong>Kamarajar Arangam</strong> exploring Large Language Model Agents, autonomous reasoning, and modern AI toolchains.
              </p>

              <p className="hero-desc-para">
                Join students and tech enthusiasts across institutions to experiment with live local models, build custom agentic pipelines, and discover how intelligent autonomous systems are redefining software engineering.
              </p>

              <div className="hero-btn-row">
                <a href="#registration" className="btn btn-primary btn-lg">
                  <span>Register Now</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </a>
                <a href="#overview" className="btn btn-ghost btn-lg">
                  Explore Workshop
                </a>
              </div>

              <div className="hero-meta-row">
                <div className="hero-meta-item">
                  <GraduationCap style={{ width: 15, height: 15, color: "var(--accent)" }} />
                  <span>Open to All Colleges &amp; Majors</span>
                </div>
                <div className="hero-meta-item">
                  <Users style={{ width: 15, height: 15, color: "var(--accent)" }} />
                  <span>
                    <strong className="hero-meta-count">{count}</strong> registered
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column — Agent workflow diagram */}
            <div className="hero-right-col">
              <AgentWorkflowDiagram />
            </div>
          </div>
        </section>

        {/* ── 3. WHAT YOU WILL LEARN (MARQUEE) ─────────────────── */}
        <div className="marquee-section">
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", marginBottom: 14, textAlign: "center" }}>
            <p className="marquee-label">
              What you will learn by the end of this workshop
            </p>
          </div>

          <div
            className="relative w-full overflow-hidden flex items-center"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="marquee-track flex shrink-0 items-center gap-12 sm:gap-16 py-2">
              {[
                { name: "Sacred Heart College",          icon: GraduationCap, tag: "HOST INSTITUTION" },
                { name: "Autonomous AI Agents",          icon: Brain,         tag: "CORE ARCHITECTURE" },
                { name: "LangChain Framework",           icon: Layers,        tag: "AGENT ORCHESTRATION" },
                { name: "Local LLMs with Ollama",        icon: Terminal,      tag: "ON-DEVICE INFERENCE" },
                { name: "Model Context Protocol (MCP)",  icon: Cpu,           tag: "OPEN PROTOCOL" },
                { name: "Python AI Ecosystem",           icon: Code2,         tag: "DEVELOPMENT STACK" },
                { name: "Multi-Agent Swarm Loops",       icon: Users,         tag: "COLLABORATIVE AI" },
                { name: "Vector Databases & Memory",     icon: Target,        tag: "KNOWLEDGE RETRIEVAL" },
              ].concat([
                { name: "Sacred Heart College",          icon: GraduationCap, tag: "HOST INSTITUTION" },
                { name: "Autonomous AI Agents",          icon: Brain,         tag: "CORE ARCHITECTURE" },
                { name: "LangChain Framework",           icon: Layers,        tag: "AGENT ORCHESTRATION" },
                { name: "Local LLMs with Ollama",        icon: Terminal,      tag: "ON-DEVICE INFERENCE" },
                { name: "Model Context Protocol (MCP)",  icon: Cpu,           tag: "OPEN PROTOCOL" },
                { name: "Python AI Ecosystem",           icon: Code2,         tag: "DEVELOPMENT STACK" },
                { name: "Multi-Agent Swarm Loops",       icon: Users,         tag: "COLLABORATIVE AI" },
                { name: "Vector Databases & Memory",     icon: Target,        tag: "KNOWLEDGE RETRIEVAL" },
              ]).map((p, idx) => {
                const IconComp = p.icon;
                return (
                  <div
                    key={`${p.name}-${idx}`}
                    className="marquee-item flex items-center gap-3 transition-all duration-300 cursor-default shrink-0"
                  >
                    <div className="marquee-icon-box">
                      <IconComp style={{ width: 18, height: 18, color: "var(--accent)" }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="marquee-name whitespace-nowrap">{p.name}</span>
                      <span className="marquee-tag">{p.tag}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 4. PILLARS OF THE WORKSHOP ───────────────────────── */}
        <section className="section-container" id="overview">
          <div className="section-head">
            <span className="section-eyebrow">Pillars of the Workshop</span>
            <h2 className="section-title">Where intelligent systems are built.</h2>
            <p className="section-desc">
              Discover the core concepts, modern toolkits, and autonomous workflows
              powering the future of AI.
            </p>
          </div>

          <div className="feature-tri-grid">
            <div className="base-feature-card">
              <div>
                <div className="card-top-icon-row">
                  <div className="card-icon-box">
                    <Brain style={{ width: 22, height: 22, color: "var(--accent)" }} />
                  </div>
                  <div className="card-arrow-indicator">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 14L14 6M14 6H7M14 6V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="card-title">Agentic Architecture</h3>
                <p className="card-desc">
                  Understand how Large Language Models transition from conversational
                  chat to autonomous reasoning, memory retrieval, and planning loops.
                </p>
              </div>
            </div>

            <div className="base-feature-card">
              <div>
                <div className="card-top-icon-row">
                  <div className="card-icon-box">
                    <Cpu style={{ width: 22, height: 22, color: "var(--accent)" }} />
                  </div>
                  <div className="card-arrow-indicator">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 14L14 6M14 6H7M14 6V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="card-title">Modern AI Frameworks</h3>
                <p className="card-desc">
                  Gain direct experience with LangChain, LlamaIndex, Model Context
                  Protocol (MCP), and local LLMs through live coding sandboxes.
                </p>
              </div>
            </div>

            <div className="base-feature-card">
              <div>
                <div className="card-top-icon-row">
                  <div className="card-icon-box">
                    <Terminal style={{ width: 22, height: 22, color: "var(--accent)" }} />
                  </div>
                  <div className="card-arrow-indicator">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 14L14 6M14 6H7M14 6V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="card-title">Autonomous Solutions</h3>
                <p className="card-desc">
                  Deploy custom agents that interact with real-world APIs, automate
                  multi-step web tasks, execute code, and collaborate in teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 5. WORKSHOP PHOTOS (In container previously occupied by stats) ── */}
        <PhotoSlideshow />

        <hr className="section-divider" />

        {/* ── 6. MISSION & VISION (2 Sleek Linear Boxes with Relevant Icons) ── */}
        <section className="section-container" id="mission-vision">
          <div
            className="flex flex-col md:flex-row md:items-end justify-between"
            style={{ marginBottom: 36 }}
          >
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="section-eyebrow">Academic Excellence &amp; Purpose</span>
              <h2 className="section-title">
                Mission &amp; Vision
              </h2>
              <p className="section-desc" style={{ marginTop: 8 }}>
                Fostering computational innovation, industry-aligned technical skillsets, and ethical leadership in software systems.
              </p>
            </div>
            <div style={{ marginTop: 16 }}>
              <a href="#registration" className="btn btn-ghost">
                <span>Join Workshop</span>
                <ArrowRight style={{ width: 15, height: 15 }} />
              </a>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {/* Box 1: Vision */}
            <div
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--line)",
                borderRadius: 20,
                padding: "clamp(28px, 4vw, 36px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 20,
                boxShadow: "0 14px 36px rgba(0, 0, 0, 0.22)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle ambient glow */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 140,
                  height: 140,
                  background: "radial-gradient(circle at 100% 0%, rgba(22, 163, 107, 0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "rgba(22, 163, 107, 0.12)",
                      border: "1px solid rgba(22, 163, 107, 0.28)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      boxShadow: "0 0 20px rgba(22, 163, 107, 0.15)",
                    }}
                  >
                    <Compass style={{ width: 26, height: 26 }} />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      padding: "4px 12px",
                      borderRadius: 9999,
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      color: "var(--accent)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Vision
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  Nurturing Global Computational Leaders
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-3)",
                    lineHeight: 1.65,
                    margin: "0 0 20px",
                  }}
                >
                  To be a premier academic center for computer applications that cultivates intellectually agile, ethically grounded, and innovative professionals capable of pioneering transformative AI and digital technologies.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                  {[
                    "Intellectual rigor and modern computer science foundations",
                    "Ethical stewardship in emerging autonomous systems",
                    "Research orientation and technical excellence",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-2)" }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 2: Mission */}
            <div
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--line)",
                borderRadius: 20,
                padding: "clamp(28px, 4vw, 36px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 20,
                boxShadow: "0 14px 36px rgba(0, 0, 0, 0.22)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle ambient glow */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 140,
                  height: 140,
                  background: "radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.12) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "rgba(37, 99, 235, 0.12)",
                      border: "1px solid rgba(37, 99, 235, 0.28)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#38bdf8",
                      boxShadow: "0 0 20px rgba(37, 99, 235, 0.15)",
                    }}
                  >
                    <Target style={{ width: 26, height: 26 }} />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      padding: "4px 12px",
                      borderRadius: 9999,
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      color: "#38bdf8",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Mission
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  Experiential Learning &amp; Industry Alignment
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-3)",
                    lineHeight: 1.65,
                    margin: "0 0 20px",
                  }}
                >
                  To deliver an industry-responsive curriculum with intensive hands-on lab sessions, project-driven learning, and collaborative workshops in state-of-the-art domains like Agentic AI, Cloud Toolchains, and Full-Stack Engineering.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                  {[
                    "Hands-on immersion with production-grade AI frameworks",
                    "Industry-aligned skill development and problem-solving",
                    "Inter-collegiate collaboration and community building",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-2)" }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 7. ABOUT THE RESOURCE PERSON (Right after Mission & Vision) ── */}
        <section className="section-container" id="speaker">
          <div className="section-head">
            <span className="section-eyebrow">Keynote &amp; Workshop Leader</span>
            <h2 className="section-title">About the Resource Person</h2>
            <p className="section-desc">
              Learn directly from an experienced AI practitioner and software engineer.
            </p>
          </div>

          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--line)",
              borderRadius: 24,
              padding: "clamp(28px, 4vw, 44px)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ambient top glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "70%",
                height: 120,
                background: "radial-gradient(ellipse at 50% 0%, rgba(22, 163, 107, 0.18) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 32,
                alignItems: "center",
                position: "relative",
                zIndex: 2,
              }}
              className="md:grid-cols-12"
            >
              {/* Speaker Avatar & Badges */}
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "var(--surface-2)",
                    border: "2px solid var(--accent)",
                    boxShadow: "0 0 32px rgba(22, 163, 107, 0.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    position: "relative",
                  }}
                >
                  <Brain style={{ width: 54, height: 54, color: "var(--accent)" }} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      border: "2px solid var(--surface-1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                    }}
                  >
                    <Sparkles style={{ width: 12, height: 12 }} />
                  </span>
                </div>

                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
                  Distinguished Speaker
                </h3>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  AI Architect &amp; Practitioner
                </span>
                <p style={{ fontSize: 13, color: "var(--ink-4)", margin: 0 }}>
                  Specialist in Agentic AI Systems, LangChain, and Local LLM Deployment.
                </p>
              </div>

              {/* Speaker Content & Workshop Deliverables */}
              <div className="md:col-span-8 space-y-4">
                <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 8px" }}>
                  Hands-on Mentorship &amp; Industry-Grade Insights
                </h4>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
                  The workshop sessions are led by an active industry professional specializing in autonomous LLM workflows and distributed AI architectures. Attendees will gain end-to-end exposure from fundamental prompting concepts to deploying production-ready multi-agent swarms.
                </p>

                {/* Key Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 6 }}>
                  {[
                    "Agentic AI Architecture",
                    "LangChain & LlamaIndex",
                    "Local LLMs (Ollama)",
                    "Tool Calling & MCP",
                    "Vector DBs & Embeddings",
                    "Live Code Troubleshooting",
                  ].map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11.5,
                        fontFamily: "var(--font-mono)",
                        padding: "5px 12px",
                        borderRadius: 9999,
                        background: "var(--surface-2)",
                        border: "1px solid var(--line)",
                        color: "var(--ink-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <CheckCircle2 style={{ width: 12, height: 12, color: "var(--accent)" }} />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>

                {/* Takeaway Box */}
                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 18px",
                    borderRadius: 12,
                    background: "rgba(22, 163, 107, 0.08)",
                    border: "1px solid rgba(22, 163, 107, 0.22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                    <strong>Interactive Q&amp;A Session:</strong> Dedicated time for project architecture reviews and career guidance in AI engineering.
                  </div>
                  <a
                    href="#registration"
                    className="btn btn-primary"
                    style={{ fontSize: 12.5, padding: "8px 18px", borderRadius: 9999 }}
                  >
                    <span>Reserve Your Seat</span>
                    <ArrowRight style={{ width: 13, height: 13 }} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Note: Curriculum Highlights / Workshop Tracks section temporarily hidden per request */}

        {/* ── 9. REGISTRATION ─────────────────────────────────── */}
        <section className="section-container" id="registration">
          <div className="section-head">
            <span className="section-eyebrow">Participant Portal</span>
            <h2 className="section-title">Workshop Registration</h2>
            <p className="section-desc">
              Students from any college, department, or semester are eligible to register.
            </p>
          </div>

          <div className="reg-section-wrap">
            <RegistrationForm />

            <div className="side-info-card">
              <h4>Before you register</h4>
              <ul className="side-info-list">
                <li><strong>Event Date:</strong> February 27, 2026 (09:30 AM – 04:30 PM).</li>
                <li><strong>Venue:</strong> Kamarajar Arangam, Sacred Heart College (Autonomous).</li>
                <li>Use your official full name as per your college identity card.</li>
                <li>One registration per participant email address.</li>
                <li>Instant payment confirmation via Cashfree PG with receipt.</li>
                <li>Certificates will be issued by Department of Computer Applications (BCA).</li>
              </ul>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "var(--r-md)",
                  background: "var(--accent-light)",
                  border: "1px solid var(--accent-line)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Live Registration Status
                </p>
                <p style={{ fontSize: 13.5, fontWeight: 550, color: "var(--ink)" }}>
                  Registrations are actively processed in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 10. GUIDELINES ──────────────────────────────────── */}
        <section className="section-container" id="guidelines" style={{ paddingTop: "64px" }}>
          <div className="section-head">
            <span className="section-eyebrow">Event Policy</span>
            <h2 className="section-title">General Instructions</h2>
            <p className="section-desc">Essential information for attending students.</p>
          </div>

          <div className="guidelines-grid">
            {[
              { num: "01", title: "Reporting Time",    desc: "Report to Kamarajar Arangam 15 minutes before the 09:30 AM session for ID verification." },
              { num: "02", title: "Hardware",          desc: "Carry your laptop (Windows / macOS / Linux) with charger for hands-on lab exercises." },
              { num: "03", title: "Prerequisites",     desc: "Basic familiarity with any programming language is helpful. No prior AI experience is required." },
              { num: "04", title: "Student ID Card",   desc: "Carry your valid college identity card and Order ID for verification at check-in." },
              { num: "05", title: "Lunch & Refreshments", desc: "Lunch and session refreshments will be provided for all registered attendees." },
              { num: "06", title: "Certificate",       desc: "Issued by Sacred Heart College Dept. of Computer Applications (BCA) upon full attendance." },
            ].map((g, i) => (
              <div key={i} className="guideline-card">
                <span className="guideline-num">{g.num}</span>
                <h3 className="guideline-title">{g.title}</h3>
                <p className="guideline-desc">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── 11. FOOTER ───────────────────────────────────────── */}
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
              <div className="status-indicator">
                <span className="status-dot" />
                <span>Registrations Open</span>
              </div>
            </div>

            <div className="footer-links-grid">
              <div>
                <span className="footer-col-title">Navigation</span>
                <ul className="footer-col-links">
                  <li><a href="#home">Home</a></li>
                  <li><a href="#overview">Overview</a></li>
                  <li><a href="#mission-vision">Mission &amp; Vision</a></li>
                  <li><a href="#speaker">Resource Person</a></li>
                  <li><a href="#registration">Registration</a></li>
                </ul>
              </div>

              <div>
                <span className="footer-col-title">Guidelines</span>
                <ul className="footer-col-links">
                  <li><a href="#guidelines">Instructions</a></li>
                  <li><a href="/install">Installation Guide</a></li>
                  <li><a href="/resources">Resources</a></li>
                  <li><a href="/terms">Terms &amp; Conditions</a></li>
                  <li><a href="/privacy">Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <span className="footer-col-title">Contact &amp; Help</span>
                <ul className="footer-col-links">
                  <li><a href="/refund-policy">Refund Policy</a></li>
                  <li><a href="mailto:bca@shctpt.edu">bca@shctpt.edu</a></li>
                  <li><a href="/admin">Admin Portal</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "16px 0 4px" }}>
            <div style={{ height: 1, flex: 1, maxWidth: 100, background: "var(--line)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 9999, border: "1px solid var(--line)", background: "var(--surface-2)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
                LLM Learning &amp; Autonomous Agents · 2026
              </span>
            </div>
            <div style={{ height: 1, flex: 1, maxWidth: 100, background: "var(--line)" }} />
          </div>

          <div className="footer-bottom-row">
            <span>&copy; {new Date().getFullYear()} Sacred Heart College. All rights reserved.</span>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <a href="/privacy"        style={{ color: "var(--ink-4)", transition: "color .15s" }}>Privacy</a>
              <a href="/refund-policy"  style={{ color: "var(--ink-4)", transition: "color .15s" }}>Refunds</a>
              <a href="/terms"          style={{ color: "var(--ink-4)", transition: "color .15s" }}>Terms</a>
            </div>
          </div>
        </div>
      </footer>

      <ClientScripts />
    </>
  );
}
