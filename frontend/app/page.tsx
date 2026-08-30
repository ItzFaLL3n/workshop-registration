import RegistrationForm from "@/components/RegistrationForm";
import ClientScripts from "@/components/ClientScripts";
import dynamic from "next/dynamic";
import EventCountdown from "@/components/EventCountdown";
import Image from "next/image";
import FloatingNavbar from "@/components/FloatingNavbar";
import {
  Compass,
  Target,
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

// lucide-react at this pinned version has no LinkedIn glyph — inline the mark.
function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const PhotoSlideshow = dynamic(() => import("@/components/PhotoSlideshow"), {
  ssr: false,
});

export default function HomePage() {
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
                <span>INTER-COLLEGIATE WORKSHOP • 7TH SEPT 2026</span>
              </div>

              <h1 className="hero-title-display">
                <span className="hero-title-serif">LLM</span>
                <span className="hero-title-serif accent">AGENTS</span>
              </h1>

              <div className="hero-subtitle-mono">
                Concept, Tools and Applications
              </div>

              <p className="hero-desc-para">
                The <strong>Department of Computer Applications (BCA)</strong> at Sacred Heart College cordially invites you to an intensive hands-on workshop on <strong>September 7, 2026</strong> at <strong>Kamarajar Arangam</strong> exploring Large Language Model Agents, autonomous reasoning, and modern AI toolchains.
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
                  <span>Hands-on Lab · Limited Seats</span>
                </div>
              </div>
            </div>

            {/* Right Column — event countdown (replaces the workflow diagram on desktop) */}
            <div className="hero-right-col">
              <EventCountdown />
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

        {/* ── 7. RESOURCE PERSONS (Right after Mission & Vision) ── */}
        <section className="section-container" id="speaker">
          <div className="section-head">
            <span className="section-eyebrow">Industry Mentors</span>
            <h2 className="section-title">Resource Persons</h2>
            <p className="section-desc">
              The hands-on sessions are led by two practising software engineers.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                photo: "/prabha.jpeg",
                name: "Mr. Prabhakaran Dasarathan",
                role: "Manager – Software Engineering Development",
                org: "Planview India Pvt. Ltd.",
                bio: "An experienced technology professional specializing in software engineering, application development, system design, and modern technologies.",
                Icon: Code2,
                linkedin: "https://www.linkedin.com/in/prabhakaran-dasarathan-05860293/",
              },
              {
                photo: "/dhaya.jpeg",
                name: "Mr. Dayanithi Manimaran",
                role: "Senior Software Engineer",
                org: "GAKBA Tech AI Private Limited",
                bio: "A skilled software professional with expertise in Artificial Intelligence, software development, emerging technologies, and real-world AI applications.",
                Icon: Cpu,
                linkedin: null,
              },
            ].map((p) => (
              <div
                key={p.name}
                style={{
                  background: "var(--surface-1)",
                  border: "1px solid var(--line)",
                  borderRadius: 20,
                  padding: "clamp(24px, 3.5vw, 34px)",
                  boxShadow: "0 14px 36px rgba(0, 0, 0, 0.22)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* Ambient corner glow */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 140,
                    height: 140,
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(22, 163, 107, 0.14) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid var(--accent-line)",
                      flexShrink: 0,
                      background: "var(--surface-2)",
                    }}
                  >
                    <Image
                      src={p.photo}
                      alt={p.name}
                      width={64}
                      height={64}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "var(--ink)",
                        margin: "0 0 4px",
                        lineHeight: 1.3,
                      }}
                    >
                      {p.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0, lineHeight: 1.5 }}>
                      {p.role}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    gap: 7,
                    fontSize: 11.5,
                    fontFamily: "var(--font-mono)",
                    padding: "5px 12px",
                    borderRadius: 9999,
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--ink-2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <p.Icon style={{ width: 13, height: 13, color: "var(--accent)" }} />
                  {p.org}
                </div>

                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-2)",
                    lineHeight: 1.65,
                    margin: 0,
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {p.bio}
                </p>

                {p.linkedin && (
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      alignSelf: "flex-start",
                      gap: 8,
                      marginTop: "auto",
                      padding: "8px 16px",
                      borderRadius: 9999,
                      fontSize: 13,
                      fontWeight: 600,
                      background: "var(--accent-light)",
                      border: "1px solid var(--accent-line)",
                      color: "var(--accent)",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <LinkedInIcon size={15} />
                    View LinkedIn
                  </a>
                )}
              </div>
            ))}
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
                <li><strong>Event Date:</strong> Sunday, September 7, 2026 (09:30 AM – 04:30 PM IST).</li>
                <li><strong>Registration closes:</strong> September 5, 2026 — two days before the event.</li>
                <li><strong>Venue:</strong> Kamarajar Arangam, Sacred Heart College (Autonomous).</li>
                <li>Use your official full name as per your college identity card.</li>
                <li>One registration per participant email address.</li>
                <li>Pay the ₹150 fee in cash at the registration desk on event day.</li>
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
                  Registrations are processed in real-time. Online registration closes on
                  September 5, 2026 (two days before the event).
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
              { num: "04", title: "Student ID Card",   desc: "Carry your valid college identity card and the Reference ID from your confirmation email for check-in." },
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
                <div className="logo-img-wrap" style={{ width: 38, height: 38 }}>
                  <Image src="/college-logo.png" alt="Sacred Heart College logo" width={40} height={40} style={{ objectFit: "contain" }} />
                </div>
                <div className="logo-img-wrap" style={{ width: 38, height: 38 }}>
                  <Image src="/department-logo.png" alt="Department of Computer Applications (BCA) logo" width={40} height={40} style={{ objectFit: "contain" }} />
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
                  <li><a href="#speaker">Resource Persons</a></li>
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
