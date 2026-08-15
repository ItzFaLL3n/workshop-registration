"use client";

import React from "react";

const PARTNERS = [
  { name: "Sacred Heart College",          icon: "fa-building-columns", tag: "HOST INSTITUTION" },
  { name: "Dept of Computer Applications", icon: "fa-laptop-code",      tag: "BCA DEPT"         },
  { name: "OpenAI Agents",                 icon: "fa-brain",            tag: "AI PLATFORM"      },
  { name: "Anthropic Claude",              icon: "fa-atom",             tag: "RESEARCH"         },
  { name: "LangChain",                     icon: "fa-link",             tag: "FRAMEWORK"        },
  { name: "Hugging Face",                  icon: "fa-face-smile",       tag: "MODELS"           },
  { name: "Model Context Protocol (MCP)",  icon: "fa-network-wired",    tag: "OPEN PROTOCOL"    },
  { name: "Python AI Ecosystem",           icon: "fa-brands fa-python", tag: "RUNTIME"          },
  { name: "PostgreSQL & Vector DBs",       icon: "fa-database",         tag: "KNOWLEDGE BASE"   },
];

export default function MarqueeLogos() {
  return (
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
          {PARTNERS.concat(PARTNERS).map((p, idx) => (
            <div
              key={`${p.name}-${idx}`}
              className="marquee-item flex items-center gap-3 transition-all duration-300 cursor-default shrink-0"
            >
              <div className="marquee-icon-box">
                <i className={`fa-solid ${p.icon.startsWith("fa-") ? p.icon : `fa-${p.icon}`}`} />
              </div>
              <div className="flex flex-col">
                <span className="marquee-name whitespace-nowrap">{p.name}</span>
                <span className="marquee-tag">{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
