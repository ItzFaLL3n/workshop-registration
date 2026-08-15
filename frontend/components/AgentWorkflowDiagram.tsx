"use client";

import React from "react";

export default function AgentWorkflowDiagram() {
  return (
    <div
      className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] aspect-square mx-auto flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* Background connecting SVG curves with animated dashed lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M 95 90 Q 145 135 195 165"
          stroke="#86EFAC"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="animate-dash"
        />
        <path
          d="M 205 165 Q 260 125 305 90"
          stroke="#86EFAC"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="animate-dash"
        />
        <path
          d="M 195 210 Q 145 250 100 280"
          stroke="#86EFAC"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="animate-dash"
        />
        <path
          d="M 205 210 Q 255 255 300 290"
          stroke="#86EFAC"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="animate-dash"
        />
        <path
          d="M 100 280 Q 200 335 300 290"
          stroke="#BBF7D0"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          className="animate-dash"
          opacity="0.65"
        />
      </svg>

      {/* 1. Top-Left Node: USER */}
      <div
        className="absolute top-[8%] left-[6%] flex flex-col items-center justify-center gap-1 w-[64px] h-[64px] sm:w-[74px] sm:h-[74px] md:w-[80px] md:h-[80px] rounded-2xl bg-white/95 backdrop-blur-sm border border-neutral-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-float-0 transition-transform hover:scale-105"
      >
        <i className="fa-solid fa-user text-emerald-700 text-base sm:text-lg" />
        <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
          USER
        </span>
      </div>

      {/* 2. Top-Right Node: TOOLS */}
      <div
        className="absolute top-[8%] right-[6%] flex flex-col items-center justify-center gap-1 w-[64px] h-[64px] sm:w-[74px] sm:h-[74px] md:w-[80px] md:h-[80px] rounded-2xl bg-white/95 backdrop-blur-sm border border-neutral-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-float-1 transition-transform hover:scale-105"
      >
        <i className="fa-solid fa-toolbox text-emerald-700 text-base sm:text-lg" />
        <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
          TOOLS
        </span>
      </div>

      {/* 3. Central Node: LLM (Dark Green Core Box) */}
      <div
        className="absolute top-[35%] left-[35%] flex flex-col items-center justify-center gap-1 w-[80px] h-[80px] sm:w-[94px] sm:h-[94px] md:w-[102px] md:h-[102px] rounded-2xl bg-[#064E3B] text-white shadow-[0_12px_32px_rgba(6,78,59,0.30)] border border-emerald-500/30 animate-float-core transition-transform hover:scale-105 z-10"
      >
        <i className="fa-solid fa-brain text-emerald-300 text-xl sm:text-2xl" />
        <span className="font-mono text-[10px] sm:text-[12px] font-extrabold tracking-widest text-emerald-100 uppercase">
          LLM
        </span>
      </div>

      {/* 4. Path Badge: AGENTIC WORKFLOW */}
      <div
        className="absolute top-[52%] left-[45%] z-20 -translate-x-1/2 bg-[#0A0F0D] text-emerald-300 text-[8px] sm:text-[9.5px] font-mono font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-neutral-700 shadow-md tracking-wider uppercase whitespace-nowrap"
      >
        AGENTIC WORKFLOW
      </div>

      {/* 5. Bottom-Left Node: AGENT */}
      <div
        className="absolute bottom-[14%] left-[8%] flex flex-col items-center justify-center gap-1 w-[64px] h-[64px] sm:w-[74px] sm:h-[74px] md:w-[80px] md:h-[80px] rounded-2xl bg-white/95 backdrop-blur-sm border border-neutral-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-float-2 transition-transform hover:scale-105"
      >
        <i className="fa-solid fa-robot text-emerald-700 text-base sm:text-lg" />
        <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
          AGENT
        </span>
      </div>

      {/* 6. Bottom-Right Node: ACTION */}
      <div
        className="absolute bottom-[12%] right-[8%] flex flex-col items-center justify-center gap-1 w-[64px] h-[64px] sm:w-[74px] sm:h-[74px] md:w-[80px] md:h-[80px] rounded-2xl bg-white/95 backdrop-blur-sm border border-neutral-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-float-3 transition-transform hover:scale-105"
      >
        <i className="fa-solid fa-bolt text-emerald-700 text-base sm:text-lg" />
        <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
          ACTION
        </span>
      </div>
    </div>
  );
}
