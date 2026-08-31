import Link from "next/link";
import Image from "next/image";
import { Radio, ArrowRight } from "lucide-react";
import FloatingNavbar from "@/components/FloatingNavbar";

export const metadata = {
  title: "Live · VORTEX NEOVIA '27",
  description: "Watch the LLM Agents Workshop live stream.",
};

// Just the YouTube video / stream id (inlined at build time). Blank until
// the stream is set up — set it in the Cloudflare Pages project env and
// redeploy on event day.
const VIDEO_ID = (process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || "").trim();

export default function LivePage() {
  return (
    <>
      <FloatingNavbar currentPath="/live" />

      <main
        style={{
          minHeight: "calc(100vh - 70px)",
          padding: "clamp(100px, 14vh, 140px) 20px 80px",
          background:
            "radial-gradient(ellipse at 50% 12%, rgba(22, 163, 107, 0.08) 0%, rgba(9, 9, 11, 0) 70%)",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 24, textAlign: "center" }}>
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
                marginBottom: 14,
              }}
            >
              <Radio style={{ width: 14, height: 14 }} />
              <span>Live Stream</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                margin: "0 0 10px",
                lineHeight: 1.15,
              }}
            >
              LLM Agents Workshop — Live
            </h1>
            <p
              style={{
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                color: "var(--ink-3)",
                maxWidth: 560,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              The session streams here on event day. If the video isn&apos;t playing yet,
              refresh closer to the start time.
            </p>
          </div>

          {/* Player / placeholder */}
          {VIDEO_ID ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--line)",
                background: "var(--surface-2)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
              }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
                title="VORTEX NEOVIA '27 — Live"
                loading="lazy"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                borderRadius: 20,
                border: "1px dashed var(--line-2)",
                background: "var(--surface-1)",
                padding: "clamp(48px, 10vw, 88px) 24px",
                textAlign: "center",
                color: "var(--ink-3)",
              }}
            >
              <Radio
                style={{ width: 30, height: 30, color: "var(--ink-4)", margin: "0 auto 14px" }}
              />
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--ink-2)" }}>
                The live stream hasn&apos;t started yet
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 13.5 }}>
                Check back on event day — September 9, 2026, from 08:30 AM IST.
              </p>
            </div>
          )}

          {/* Footer link */}
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link
              href="/resources"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                borderRadius: 9999,
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                color: "var(--ink-2)",
                fontSize: 13.5,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <span>Workshop resources &amp; materials</span>
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-bottom-row">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="logo-img-wrap" style={{ width: 26, height: 26 }}>
                <Image
                  src="/college-logo.png"
                  alt="Sacred Heart College logo"
                  width={26}
                  height={26}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span>&copy; {new Date().getFullYear()} Sacred Heart College. All rights reserved.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <Link href="/" style={{ color: "var(--ink-4)", transition: "color .15s" }}>
                Home
              </Link>
              <Link href="/resources" style={{ color: "var(--ink-4)", transition: "color .15s" }}>
                Resources
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
