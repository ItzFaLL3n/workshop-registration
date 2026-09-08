"use client";

import { useSearchParams } from "next/navigation";
import { Radio } from "lucide-react";

// Build-time default (Cloudflare Pages env var). The ?v= URL param overrides it
// at runtime so a stream can be swapped without a redeploy.
const ENV_VIDEO_ID = (process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || "").trim();

// Only accept something that looks like a YouTube id from the URL, ignore junk.
const fromParam = (v: string | null) =>
  v && /^[A-Za-z0-9_-]{6,20}$/.test(v) ? v : "";

export default function LivePlayer() {
  const params = useSearchParams();
  const VIDEO_ID = fromParam(params.get("v")) || ENV_VIDEO_ID;

  return VIDEO_ID ? (
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
  );
}
