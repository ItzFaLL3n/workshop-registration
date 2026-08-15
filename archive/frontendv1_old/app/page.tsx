import RegistrationForm from "@/components/RegistrationForm";
import ClientScripts from "@/components/ClientScripts";
import { getRegistrationCount } from "@/lib/api";
import Image from "next/image";

export const revalidate = 60; // ISR — revalidate every 60s for count

export default async function HomePage() {
  const count = await getRegistrationCount();

  return (
    <>
      {/* ============ HEADER ============ */}
      <header className="site-header" id="site-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-logos">
              <div className="logo-box" aria-label="Sacred Heart College logo">
                <Image
                  src="/college-logo.png"
                  alt="Sacred Heart College logo"
                  width={46}
                  height={46}
                  style={{ objectFit: "cover" }}
                  onError={undefined}
                />
              </div>
              <div className="logo-box" aria-label="Department of Computer Applications logo">
                <Image
                  src="/department-logo.png"
                  alt="Department of Computer Applications logo"
                  width={46}
                  height={46}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="brand-text">
              <span className="brand-college">Sacred Heart College</span>
              <span className="brand-dept">Dept. of Computer Applications</span>
            </div>
          </div>

          <nav className="main-nav" id="main-nav" aria-label="Primary">
            <ul>
              <li><a href="#home" className="nav-link active" data-nav="home">Home</a></li>
              <li><a href="#registration" className="nav-link" data-nav="registration">Registration</a></li>
              <li><a href="#instructions" className="nav-link" data-nav="instructions">Instructions</a></li>
              <li><a href="#tutorial" className="nav-link" data-nav="tutorial">Tutorial</a></li>
            </ul>
          </nav>

          <button
            className="hamburger"
            id="hamburger"
            aria-label="Toggle navigation menu"
            aria-expanded="false"
            aria-controls="mobile-nav"
          >
            <span /><span /><span />
          </button>
        </div>

        <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile">
          <a href="#home" className="mobile-link" data-nav="home">Home</a>
          <a href="#registration" className="mobile-link" data-nav="registration">Registration</a>
          <a href="#instructions" className="mobile-link" data-nav="instructions">Instructions</a>
          <a href="#tutorial" className="mobile-link" data-nav="tutorial">Tutorial</a>
        </nav>
      </header>

      <main>
        {/* ============ HOME / HERO ============ */}
        <section className="section hero" id="home">
          <div className="hero-bg" aria-hidden="true">
            <canvas id="agent-canvas" />
          </div>

          <div className="hero-inner reveal">
            <div className="hero-copy">
              <span className="eyebrow">
                <i className="fa-solid fa-diagram-project" />
                Inter&#8209;Collegiate Workshop&nbsp;/&nbsp;2026
              </span>

              <h1 className="hero-title">
                <span className="line">LLM</span>
                <span className="line accent">AGENTS</span>
              </h1>

              <p className="hero-subtitle">Concept, Tools and Applications</p>

              <p className="hero-text">
                You are cordially invited to an engaging inter-collegiate workshop exploring
                the world of Large Language Model Agents, their concepts, tools and
                real-world applications.
              </p>

              <p className="hero-text">
                Join students from different colleges, connect with like-minded learners,
                exchange ideas and discover how intelligent AI agents are shaping the future
                of technology.
              </p>

              <div className="hero-actions">
                <a href="#registration" className="btn btn-primary">
                  <span>Register Now</span>
                  <i className="fa-solid fa-arrow-right" />
                </a>
                <a href="#tutorial" className="btn btn-ghost">Explore Workshop</a>
              </div>

              <div className="hero-meta">
                <div className="meta-item">
                  <i className="fa-solid fa-graduation-cap" />
                  Open to all colleges
                </div>
                <div className="meta-item">
                  <i className="fa-solid fa-users" />
                  <span id="hero-count">{count}</span> registered
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="agent-diagram">
                <div className="node node-user" style={{ "--d": "0" } as React.CSSProperties}>
                  <i className="fa-solid fa-user" /><span>User</span>
                </div>
                <div className="node node-llm" style={{ "--d": "1" } as React.CSSProperties}>
                  <i className="fa-solid fa-brain" /><span>LLM</span>
                </div>
                <div className="node node-tools" style={{ "--d": "2" } as React.CSSProperties}>
                  <i className="fa-solid fa-toolbox" /><span>Tools</span>
                </div>
                <div className="node node-agent" style={{ "--d": "3" } as React.CSSProperties}>
                  <i className="fa-solid fa-robot" /><span>Agent</span>
                </div>
                <div className="node node-action" style={{ "--d": "4" } as React.CSSProperties}>
                  <i className="fa-solid fa-bolt" /><span>Action</span>
                </div>
                <svg className="agent-links" viewBox="0 0 400 400" preserveAspectRatio="none">
                  <path className="link" d="M110,70 C180,90 220,150 240,180" />
                  <path className="link" d="M240,180 C280,140 320,120 340,90" />
                  <path className="link" d="M240,180 C220,230 160,270 120,300" />
                  <path className="link" d="M120,300 C200,330 280,320 320,300" />
                </svg>
                <div className="diagram-badge">Agentic Workflow</div>
              </div>
            </div>
          </div>

          <button className="scroll-cue" id="scroll-cue" aria-label="Scroll to next section">
            <span>Scroll</span>
            <i className="fa-solid fa-chevron-down" />
          </button>
        </section>

        {/* ============ MISSION & VISION ============ */}
        <section className="section mission-section" id="mission">
          <div className="section-inner">
            <div className="section-head reveal">
              <span className="eyebrow">
                <i className="fa-solid fa-seedling" /> Purpose
              </span>
              <h2 className="section-title">Our Mission &amp; Vision</h2>
              <p className="section-lede">
                This workshop brings together students from different colleges to create an
                open platform for learning, interaction, knowledge exchange and exploration
                of emerging Artificial Intelligence technologies.
              </p>
            </div>

            <div className="mv-grid">
              <div className="mv-card reveal">
                <div className="mv-icon"><i className="fa-solid fa-bullseye" /></div>
                <h3>Mission</h3>
                <p>
                  To bring together students from different colleges and provide an interactive
                  learning environment where participants can gain practical knowledge about LLM
                  Agents, explore modern AI tools, exchange ideas and build meaningful academic
                  connections beyond their institutions.
                </p>
              </div>
              <div className="mv-card reveal">
                <div className="mv-icon"><i className="fa-solid fa-eye" /></div>
                <h3>Vision</h3>
                <p>
                  To create a collaborative inter-collegiate community of future-ready students
                  who are confident in exploring Artificial Intelligence, capable of applying
                  emerging technologies and inspired to innovate together for the future.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ REGISTRATION ============ */}
        <section className="section reg-section" id="registration">
          <div className="section-inner">
            <div className="section-head reveal">
              <span className="eyebrow">
                <i className="fa-solid fa-pen-to-square" /> Join Us
              </span>
              <h2 className="section-title">Workshop Registration</h2>
              <p className="section-lede">Students from all colleges are welcome to register.</p>
              <div className="reg-counter">
                <i className="fa-solid fa-user-group" />
                Registered Participants: <span id="reg-count">{String(count).padStart(2, "0")}</span>
              </div>
            </div>

            <div className="reg-grid">
              <RegistrationForm />

              <aside className="reg-side reveal">
                <div className="side-card">
                  <h4><i className="fa-solid fa-circle-info" /> Before you register</h4>
                  <ul>
                    <li>Open to students from any college or department.</li>
                    <li>Use your full legal name as per your college ID.</li>
                    <li>One registration per participant per email address.</li>
                    <li>Bring your payment confirmation and college ID on the day.</li>
                    <li>A confirmation email will be sent after successful payment.</li>
                  </ul>
                </div>
                <div className="side-card side-quote">
                  <i className="fa-solid fa-quote-left" />
                  <p>Every agent starts with a single well-defined goal.</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ============ INSTRUCTIONS ============ */}
        <section className="section instructions-section" id="instructions">
          <div className="section-inner">
            <div className="section-head reveal">
              <span className="eyebrow">
                <i className="fa-solid fa-list-check" /> Guidelines
              </span>
              <h2 className="section-title">General Instructions</h2>
              <p className="section-lede">Important information for all participants</p>
            </div>

            <div className="instructions-grid">
              {[
                {
                  n: "01",
                  icon: "fa-clock",
                  title: "Be on Time",
                  desc: "Please reach the venue before the scheduled reporting time and be present throughout the sessions.",
                },
                {
                  n: "02",
                  icon: "fa-laptop",
                  title: "Bring Your Laptop",
                  desc: "Carry your laptop along with its charger for hands-on activities and practical sessions.",
                },
                {
                  n: "03",
                  icon: "fa-bottle-water",
                  title: "Bring a Water Bottle",
                  desc: "Participants are encouraged to carry their own water bottle and stay hydrated throughout the event.",
                },
                {
                  n: "04",
                  icon: "fa-id-card",
                  title: "Carry Your ID Card",
                  desc: "Bring your valid college ID card for participant verification and entry.",
                },
                {
                  n: "05",
                  icon: "fa-comments",
                  title: "Participate Actively",
                  desc: "Interact with participants from other colleges, ask questions and make the most of the workshop.",
                },
              ].map((card) => (
                <div key={card.n} className="instr-card reveal">
                  <span className="instr-num">{card.n}</span>
                  <div className="instr-icon">
                    <i className={`fa-solid ${card.icon}`} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ TUTORIAL ============ */}
        <section className="section tutorial-section" id="tutorial">
          <div className="section-inner">
            <div className="section-head reveal">
              <span className="eyebrow">
                <i className="fa-solid fa-book-open" /> Get Ready
              </span>
              <h2 className="section-title">Workshop Tutorial</h2>
              <p className="section-lede">Prepare yourself for the LLM Agents session</p>
              <p className="section-para">
                The workshop introduces participants to the fundamentals of LLM Agents and
                demonstrates how modern AI tools can be used to create intelligent,
                task-oriented applications.
              </p>
            </div>

            <div className="tutorial-grid">
              {[
                {
                  n: "01",
                  icon: "fa-lightbulb",
                  title: "Concepts",
                  desc: "Understand Large Language Models, AI agents, agentic workflows and how intelligent systems operate.",
                },
                {
                  n: "02",
                  icon: "fa-screwdriver-wrench",
                  title: "Tools",
                  desc: "Explore modern tools and frameworks used to build and experiment with LLM-powered agents.",
                },
                {
                  n: "03",
                  icon: "fa-rocket",
                  title: "Applications",
                  desc: "Discover practical applications of LLM Agents across education, business, automation and technology.",
                },
              ].map((card) => (
                <div key={card.n} className="tut-card reveal">
                  <span className="tut-num">{card.n}</span>
                  <div className="tut-icon">
                    <i className={`fa-solid ${card.icon}`} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="workflow-wrap reveal">
              <h3 className="workflow-title">How an Agent Thinks</h3>
              <div className="workflow">
                {[
                  { icon: "fa-user", label: "User" },
                  { icon: "fa-brain", label: "LLM" },
                  { icon: "fa-toolbox", label: "Tools" },
                  { icon: "fa-robot", label: "Agent" },
                  { icon: "fa-bolt", label: "Action" },
                  { icon: "fa-flag-checkered", label: "Result" },
                ].map((step, i, arr) => (
                  <div key={step.label} style={{ display: "contents" }}>
                    <div className="wf-step">
                      <div className="wf-dot">
                        <i className={`fa-solid ${step.icon}`} />
                      </div>
                      <span>{step.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="wf-arrow">
                        <i className="fa-solid fa-chevron-down" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-event">
              VORTEX NEOVIA<sup>&apos;27</sup>
            </span>
            <p className="footer-workshop">
              LLM Agents<br />
              <span>Concept, Tools and Applications</span>
            </p>
          </div>
          <div className="footer-org">
            <p>Department of Computer Applications</p>
            <p>Sacred Heart College</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <a href="#home">Home</a>
            <a href="#registration">Registration</a>
            <a href="#instructions">Instructions</a>
            <a href="#tutorial">Tutorial</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Department of Computer Applications. All Rights Reserved.</p>
          <nav className="footer-legal" aria-label="Legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/refund-policy">Refund Policy</a>
            <a href="/terms">Terms of Service</a>
          </nav>
        </div>
      </footer>

      {/* Back to top */}
      <button className="back-to-top" id="back-to-top" aria-label="Back to top">
        <i className="fa-solid fa-arrow-up" />
      </button>

      {/* Toast */}
      <div className="toast" id="toast" role="status" aria-live="polite">
        <i className="fa-solid fa-circle-check" />
        <span>Registration submitted successfully!</span>
      </div>

      <ClientScripts />
    </>
  );
}
