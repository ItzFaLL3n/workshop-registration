import RegistrationForm from "@/components/RegistrationForm";
import ClientScripts from "@/components/ClientScripts";
import dynamic from "next/dynamic";
import BaseVoxelGraphic from "@/components/BaseVoxelGraphic";
import MarqueeLogos from "@/components/MarqueeLogos";
import ThemeToggle from "@/components/ThemeToggle";
import {
  GaugeBlueprint,
  NetworkNodesBlueprint,
  SecurityChainBlueprint,
  RadarBridgeBlueprint,
} from "@/components/BlueprintIllustrations";
import AgentWorkflowDiagram from "@/components/AgentWorkflowDiagram";
import { getRegistrationCount } from "@/lib/api";
import Image from "next/image";

import FloatingNavbar from "@/components/FloatingNavbar";

const PhotoSlideshow = dynamic(() => import("@/components/PhotoSlideshow"), {
  ssr: false,
});

export const revalidate = 60;

export default async function HomePage() {
  const count = await getRegistrationCount();

  return (
    <>
      {/* ── APPLE-STYLED FLOATING NAVBAR ────────────────────── */}
      <FloatingNavbar currentPath="/" />

      <main>
        {/* ── 3. HERO ──────────────────────────────────────────── */}
        <section className="hero-wrapper" id="home">
          <div className="hero-grid">
            {/* Left */}
            <div className="hero-left-col">
              <div className="hero-eyebrow-pill">
                <i className="fa-solid fa-code-fork" style={{ fontSize: 10 }} />
                <span>INTER-COLLEGIATE WORKSHOP / 2026</span>
              </div>

              <h1 className="hero-title-display">
                <span className="hero-title-serif">LLM</span>
                <span className="hero-title-serif accent">AGENTS</span>
              </h1>

              <div className="hero-subtitle-mono">
                Concept, Tools and Applications
              </div>

              <p className="hero-desc-para">
                You are cordially invited to an engaging inter-collegiate workshop
                exploring the world of Large Language Model Agents, their concepts,
                tools and real-world applications.
              </p>

              <p className="hero-desc-para">
                Join students from different colleges, connect with like-minded
                learners, exchange ideas and discover how intelligent AI agents are
                shaping the future of technology.
              </p>

              <div className="hero-btn-row">
                <a href="#registration" className="btn btn-primary btn-lg">
                  Register Now
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} />
                </a>
                <a href="#overview" className="btn btn-ghost btn-lg">
                  Explore Workshop
                </a>
              </div>

              <div className="hero-meta-row">
                <div className="hero-meta-item">
                  <i className="fa-solid fa-graduation-cap" />
                  <span>Open to all colleges</span>
                </div>
                <div className="hero-meta-item">
                  <i className="fa-solid fa-user-group" />
                  <span>
                    <span className="hero-meta-count">{count}</span> registered
                  </span>
                </div>
              </div>
            </div>

            {/* Right — Agent workflow diagram */}
            <div className="hero-right-col">
              <AgentWorkflowDiagram />
            </div>
          </div>
        </section>

        {/* ── 4. MARQUEE ───────────────────────────────────────── */}
        <MarqueeLogos />

        {/* ── 5. FEATURE CARDS ─────────────────────────────────── */}
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
                    <i className="fa-solid fa-brain" />
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
                    <i className="fa-solid fa-toolbox" />
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
                    <i className="fa-solid fa-robot" />
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

        {/* ── 6. STATS ─────────────────────────────────────────── */}
        <section className="section-container" style={{ paddingTop: "64px" }}>
          <div className="section-head centered">
            <span className="section-eyebrow">By The Numbers</span>
            <h2 className="section-title">Where the next generation transacts with AI.</h2>
            <p className="section-desc">
              Setting the benchmark for hands-on, high-impact inter-collegiate tech workshops.
            </p>
          </div>

          <div className="stats-container">
            <div className="stat-cell">
              <span className="stat-number">₹150</span>
              <span className="stat-label">Registration Fee</span>
            </div>
            <div className="stat-cell">
              <span className="stat-number">2–3 Days</span>
              <span className="stat-label">Intensive Sessions</span>
            </div>
            <div className="stat-cell">
              <span className="stat-number">Open</span>
              <span className="stat-label">All Colleges &amp; Majors</span>
            </div>
            <div className="stat-cell">
              <span className="stat-number" id="hero-count">{count}+</span>
              <span className="stat-label">Students Registered</span>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 7. BLUEPRINT GRID ────────────────────────────────── */}
        <section className="section-container" id="curriculum">
          <div
            className="flex flex-col md:flex-row md:items-end justify-between"
            style={{ marginBottom: 40 }}
          >
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="section-eyebrow">Technical Architecture</span>
              <h2 className="section-title">
                The platform for practical <br />
                agent engineering at scale.
              </h2>
            </div>
            <div style={{ marginTop: 16 }}>
              <a href="#registration" className="btn btn-ghost">
                <span>Join Next Cohort</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="blueprint-grid">
            <div className="blueprint-card">
              <div className="blueprint-illustration-wrap">
                <GaugeBlueprint />
              </div>
              <div className="blueprint-content">
                <h3 className="blueprint-title">Instant, low-latency, 24/7 practice</h3>
                <p className="blueprint-desc">
                  Interactive sandbox environments for live experimentation. Test agent
                  prompts, verify token throughput, and inspect trace logs in real time.
                </p>
              </div>
            </div>

            <div className="blueprint-card">
              <div className="blueprint-illustration-wrap">
                <NetworkNodesBlueprint />
              </div>
              <div className="blueprint-content">
                <h3 className="blueprint-title">Connected toolkits &amp; memory nodes</h3>
                <p className="blueprint-desc">
                  Connect agents to external databases, search engines, and custom
                  Python functions using structured schemas and MCP servers.
                </p>
              </div>
            </div>

            <div className="blueprint-card">
              <div className="blueprint-illustration-wrap">
                <SecurityChainBlueprint />
              </div>
              <div className="blueprint-content">
                <h3 className="blueprint-title">Verified &amp; trusted certification</h3>
                <p className="blueprint-desc">
                  Earn an official Certificate of Completion issued by Sacred Heart
                  College Department of Computer Applications for your portfolio.
                </p>
              </div>
            </div>

            <div className="blueprint-card">
              <div className="blueprint-illustration-wrap">
                <RadarBridgeBlueprint />
              </div>
              <div className="blueprint-content">
                <h3 className="blueprint-title">A bridge, not an island</h3>
                <p className="blueprint-desc">
                  Collaborate across departments and colleges. Network with peers,
                  share repositories, and build multi-agent prototypes together.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 8. WORKSHOP TRACKS ───────────────────────────────── */}
        <section className="section-container" style={{ paddingTop: "64px" }}>
          <div className="tracks-header">
            <div>
              <span className="section-eyebrow">Curriculum Highlights</span>
              <h2 className="section-title">Workshop Tracks.</h2>
            </div>
            <div className="carousel-nav-btns">
              <button className="carousel-arrow-btn" aria-label="Previous track">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="carousel-arrow-btn" aria-label="Next track">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="tracks-grid">
            <div className="track-card">
              <div className="track-media" style={{ background: "linear-gradient(135deg, #eaf7f2 0%, #d4ede4 100%)" }}>
                <div className="text-center">
                  <span className="font-mono text-xs font-bold tracking-wider" style={{ color: "var(--accent)" }}>TRACK 01</span>
                  <p className="font-bold text-lg" style={{ color: "#0d3626" }}>LLM Foundations</p>
                </div>
              </div>
              <div className="track-info">
                <h3 className="track-title">Intro to Agentic AI</h3>
                <p className="track-desc">
                  Understand prompting strategies, token mechanics, and the shift from
                  static completion to agentic workflows.
                </p>
                <span className="track-date">Session 1 • Day 1</span>
              </div>
            </div>

            <div className="track-card">
              <div className="track-media" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #d4ecfb 100%)" }}>
                <div className="text-center">
                  <span className="font-mono text-xs font-bold tracking-wider" style={{ color: "#2563eb" }}>TRACK 02</span>
                  <p className="font-bold text-lg" style={{ color: "#1e3a5f" }}>Tool Use &amp; MCP</p>
                </div>
              </div>
              <div className="track-info">
                <h3 className="track-title">Model Context Protocol</h3>
                <p className="track-desc">
                  Connect LLMs to databases, APIs, file systems, and external tools
                  using standard protocol architectures.
                </p>
                <span className="track-date">Session 2 • Day 2</span>
              </div>
            </div>

            <div className="track-card">
              <div className="track-media" style={{ background: "linear-gradient(135deg, #f5f0ff 0%, #e5d9ff 100%)" }}>
                <div className="text-center">
                  <span className="font-mono text-xs font-bold tracking-wider" style={{ color: "#7c3aed" }}>TRACK 03</span>
                  <p className="font-bold text-lg" style={{ color: "#3b1c6e" }}>Multi-Agent Loops</p>
                </div>
              </div>
              <div className="track-info">
                <h3 className="track-title">Swarm Coordination</h3>
                <p className="track-desc">
                  Design agent swarms where specialized worker agents collaborate,
                  critique, and complete complex software tasks.
                </p>
                <span className="track-date">Session 3 • Day 2</span>
              </div>
            </div>

            <div className="track-card">
              <div className="track-media" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fde8c0 100%)" }}>
                <div className="text-center">
                  <span className="font-mono text-xs font-bold tracking-wider" style={{ color: "#b45309" }}>TRACK 04</span>
                  <p className="font-bold text-lg" style={{ color: "#451a03" }}>Live Hackathon</p>
                </div>
              </div>
              <div className="track-info">
                <h3 className="track-title">Project Showcase</h3>
                <p className="track-desc">
                  Build and demonstrate your own custom AI agent solution. Compete for
                  best project recognitions and awards.
                </p>
                <span className="track-date">Session 4 • Day 3</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 9. PHOTO SLIDESHOW ───────────────────────────────── */}
        <PhotoSlideshow />

        <hr className="section-divider" />

        {/* ── 10. REGISTRATION ─────────────────────────────────── */}
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
                <li>Use your official full name as per your college identity card.</li>
                <li>One registration per participant email address.</li>
                <li>Instant payment confirmation via Cashfree PG with receipt.</li>
                <li>Bring your laptop and college ID on the scheduled session days.</li>
                <li>Certificates will be issued upon workshop completion.</li>
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

        {/* ── 11. GUIDELINES ───────────────────────────────────── */}
        <section className="section-container" id="guidelines" style={{ paddingTop: "64px" }}>
          <div className="section-head">
            <span className="section-eyebrow">Event Policy</span>
            <h2 className="section-title">General Instructions</h2>
            <p className="section-desc">Essential information for attending students.</p>
          </div>

          <div className="guidelines-grid">
            {[
              { num: "01", title: "Be On Time",        desc: "Report to the venue 15 minutes before scheduled session time to ensure smooth seating and setup." },
              { num: "02", title: "Bring Laptop & Charger", desc: "Hands-on labs require a working laptop with modern browser and internet connectivity." },
              { num: "03", title: "Valid College ID",  desc: "Carry your physical college identity card for attendance verification and kit issuance." },
              { num: "04", title: "Active Participation", desc: "Engage in collaborative team tasks, ask questions, and build interactive projects." },
              { num: "05", title: "Certificate Criteria", desc: "Attendance across all sessions and project submission required for Certificate of Completion." },
              { num: "06", title: "Refreshments Provided", desc: "Lunch and refreshments will be arranged on workshop days for all registered attendees." },
            ].map((g) => (
              <div key={g.num} className="guideline-card">
                <span className="guideline-num">{g.num}</span>
                <h3 className="guideline-title">{g.title}</h3>
                <p className="guideline-desc">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 12. CTA BANNER ───────────────────────────────────── */}
        <section className="section-container">
          <div className="vibrant-cta-banner">
            <div className="cta-voxel-left">
              <BaseVoxelGraphic variant="banner" />
            </div>
            <div className="cta-voxel-right">
              <BaseVoxelGraphic variant="banner" />
            </div>

            <div
              className="relative z-10 flex flex-col items-center gap-5"
              style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
            >
              <h2>Start your journey with LLM Agents.</h2>
              <p>
                Learn on an open, interactive platform. Build autonomous software,
                exchange ideas with peers, and prepare for the next era of AI.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
                <a href="#registration" className="btn btn-cta-white btn-lg">
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: "var(--accent)",
                      marginRight: 4,
                    }}
                  />
                  Register for Workshop
                </a>
                <a href="/install" className="btn btn-cta-translucent btn-lg">
                  Installation Guide
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── 13. FOOTER ───────────────────────────────────────── */}
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
                  <li><a href="#curriculum">Curriculum</a></li>
                  <li><a href="#gallery">Gallery</a></li>
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
                  <li><a href="mailto:mca@shctpt.edu">mca@shctpt.edu</a></li>
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
