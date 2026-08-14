import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Installation & Resources | LLM Agents Workshop",
  description: "Setup guide and workshop materials for the LLM Agents Workshop.",
};

const installSteps = [
  {
    title: "Install Python 3.11+",
    description:
      "The workshop uses Python as the primary runtime for all agent frameworks. Download from python.org — make sure to tick 'Add Python to PATH' on Windows.",
    link: "https://www.python.org/downloads/",
    icon: "fa-brands fa-python",
  },
  {
    title: "Install VS Code",
    description:
      "Our recommended editor for the hands-on session. Install the Python and Jupyter extensions after setup.",
    link: "https://code.visualstudio.com/download",
    icon: "fa-solid fa-code",
  },
  {
    title: "Create an OpenAI Account",
    description:
      "We'll use the OpenAI API to power the LLM Agents. A free trial with $5 credits is sufficient for the entire workshop.",
    link: "https://platform.openai.com/signup",
    icon: "fa-solid fa-key",
  },
  {
    title: "Install Workshop Libraries",
    description:
      "Run this in your terminal after Python is installed: pip install openai langchain langchain-openai python-dotenv",
    link: "https://pypi.org/project/langchain/",
    icon: "fa-solid fa-cube",
  },
  {
    title: "Create a Google Account (Colab backup)",
    description:
      "Google Colab provides a free cloud Python environment — useful as a backup if local setup runs into issues.",
    link: "https://colab.research.google.com",
    icon: "fa-brands fa-google",
  },
];

const resources = [
  {
    title: "Workshop Slide Deck",
    description: "Main presentation covering LLM concepts, agentic workflows and tool use.",
    link: "#",
    icon: "fa-solid fa-file-powerpoint",
    ready: false,
  },
  {
    title: "Starter Code Repository",
    description: "Hands-on notebook and starter scripts for the workshop exercises.",
    link: "#",
    icon: "fa-brands fa-github",
    ready: false,
  },
  {
    title: "LLM Agents Cheat Sheet",
    description: "Quick reference card for agent patterns, LangChain APIs and prompt templates.",
    link: "#",
    icon: "fa-solid fa-file-lines",
    ready: false,
  },
];

export default function ResourcesPage() {
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
          <nav className="main-nav" aria-label="Primary">
            <ul>
              <li><Link href="/" className="nav-link">Home</Link></li>
              <li><Link href="/#registration" className="nav-link">Registration</Link></li>
              <li><Link href="/resources" className="nav-link active">Resources</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="section" style={{ background: "radial-gradient(circle at 70% 10%, #eaf7ef 0%, #ffffff 55%)" }}>
          <div className="section-inner">
            <div className="section-head">
              <span className="eyebrow">
                <i className="fa-solid fa-book-open" /> Preparation
              </span>
              <h1 className="section-title">Installation &amp; Resources</h1>
              <p className="section-lede">
                Complete these steps <strong>before the workshop day</strong> so we don&apos;t
                lose time on setup. Everything below is free.
              </p>
            </div>

            {/* Install Steps */}
            <div style={{ marginBottom: 72 }}>
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "#08211a",
                  marginBottom: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#1a8a54,#0d3626)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: ".82rem",
                  }}
                >
                  <i className="fa-solid fa-download" />
                </span>
                Before You Arrive
              </h2>
              <ol style={{ display: "flex", flexDirection: "column", gap: 16, listStyle: "none", padding: 0, margin: 0 }}>
                {installSteps.map((step, i) => (
                  <li
                    key={i}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dcece2",
                      borderRadius: 18,
                      padding: "28px 32px",
                      boxShadow: "0 2px 10px rgba(13,54,38,0.06)",
                      display: "grid",
                      gridTemplateColumns: "56px 1fr auto",
                      gap: 20,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        background: "linear-gradient(150deg,#1a8a54,#0d3626)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "1.3rem",
                        flexShrink: 0,
                      }}
                    >
                      <i className={step.icon} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "Fraunces, serif",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          color: "#08211a",
                          margin: "0 0 4px",
                        }}
                      >
                        {i + 1}. {step.title}
                      </p>
                      <p style={{ fontSize: ".88rem", color: "#3f5c4d", margin: 0 }}>{step.description}</p>
                    </div>
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost"
                      style={{ fontSize: ".84rem", padding: "11px 20px", flexShrink: 0 }}
                    >
                      Get it <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: ".75em" }} />
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Workshop Materials */}
            <div>
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "#08211a",
                  marginBottom: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#1a8a54,#0d3626)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: ".82rem",
                  }}
                >
                  <i className="fa-solid fa-folder-open" />
                </span>
                Workshop Materials
              </h2>
              <div
                style={{
                  background: "#eaf7ef",
                  border: "1.5px solid #8fdcb2",
                  borderRadius: 14,
                  padding: "14px 20px",
                  marginBottom: 22,
                  fontSize: ".88rem",
                  color: "#146c43",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <i className="fa-solid fa-circle-info" />
                Links will be activated on the morning of the workshop.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
                {resources.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dcece2",
                      borderRadius: 18,
                      padding: "28px 24px",
                      boxShadow: "0 2px 10px rgba(13,54,38,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "#eaf7ef",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#146c43",
                        fontSize: "1.2rem",
                      }}
                    >
                      <i className={r.icon} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "1.05rem", color: "#08211a", margin: "0 0 6px" }}>
                        {r.title}
                      </p>
                      <p style={{ fontSize: ".86rem", color: "#3f5c4d", margin: 0 }}>{r.description}</p>
                    </div>
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost"
                      style={{ fontSize: ".84rem", padding: "10px 18px", opacity: r.ready ? 1 : 0.5, pointerEvents: r.ready ? "auto" : "none" }}
                    >
                      {r.ready ? "Open" : "Coming Soon"}
                    </a>
                  </div>
                ))}
              </div>
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
        </div>
      </footer>
    </>
  );
}
