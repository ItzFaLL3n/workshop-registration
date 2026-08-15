"use client";

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowDown, CheckCircle2, Terminal } from 'lucide-react';

// Interface for the props of each individual icon.
export interface IconProps {
  id: number;
  name: string;
  category?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

export interface FloatingIconsHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  badgeText?: string;
  icons?: IconProps[];
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop detection hook (Gating all animations on mobile devices)
// ─────────────────────────────────────────────────────────────────────────────

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}

// ─────────────────────────────────────────────────────────────────────────────
// Structured Tool Card (Desktop: Mouse Repulsion Physics / Mobile: Pure Static)
// ─────────────────────────────────────────────────────────────────────────────

const StructuredToolCard = ({
  iconData,
  index,
  mouseX,
  mouseY,
  isDesktop,
}: {
  iconData: IconProps;
  index: number;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  isDesktop: boolean;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Motion values for desktop spring physics mouse repulsion
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 20 });
  const springY = useSpring(y, { stiffness: 240, damping: 20 });

  React.useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const iconCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(mouseX.current - iconCenterX, 2) +
            Math.pow(mouseY.current - iconCenterY, 2)
        );

        // Repel the card only when the cursor is within 160px on desktop
        if (distance < 160) {
          const angle = Math.atan2(
            mouseY.current - iconCenterY,
            mouseX.current - iconCenterX
          );
          const force = (1 - distance / 160) * 45;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, mouseX, mouseY, isDesktop]);

  // ── MOBILE: 100% Pure Static HTML (Zero Animations, Zero Physics) ──
  if (!isDesktop) {
    return (
      <div className="relative select-none w-full">
        <div
          className="relative flex items-center gap-2 px-2.5 py-2 rounded-xl border shadow-sm backdrop-blur-md"
          style={{
            background: "var(--surface-1)",
            borderColor: "var(--line)",
          }}
        >
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <iconData.icon className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left min-w-0 flex-1">
            <span className="text-[11px] font-semibold tracking-tight truncate" style={{ color: "var(--ink)" }}>
              {iconData.name}
            </span>
            {iconData.category && (
              <span className="text-[9px] font-mono truncate" style={{ color: "var(--ink-4)" }}>
                {iconData.category}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP: Dynamic Cursor-Only Spring Physics ──
  return (
    <motion.div
      ref={ref}
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02, duration: 0.35 }}
      className="relative select-none w-full"
    >
      <div
        className="group relative flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg border transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-md"
        style={{
          background: "var(--surface-1)",
          borderColor: "var(--line)",
        }}
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0">
          <iconData.icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110" />
        </div>
        <div className="flex flex-col text-left min-w-0 flex-1">
          <span className="text-[11px] sm:text-xs font-semibold tracking-tight truncate" style={{ color: "var(--ink)" }}>
            {iconData.name}
          </span>
          {iconData.category && (
            <span className="text-[9px] sm:text-[10px] font-mono truncate" style={{ color: "var(--ink-4)" }}>
              {iconData.category}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Vector Icons for AI, LLM, and Developer Frameworks (Adaptive Light / Dark)
// ─────────────────────────────────────────────────────────────────────────────

export const IconOpenAI = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--ink)" }}>
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.66-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1401-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1684a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1636a.0804.0804 0 0 1-.038-.0567V6.0743a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4593a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
  </svg>
);

export const IconAnthropic = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M13.827 3.5H19.5L13.827 20.5H8.154L13.827 3.5Z" fill="#D97706" />
    <path d="M4.5 20.5L10.173 3.5H13.827L8.154 20.5H4.5Z" fill="#F59E0B" />
  </svg>
);

export const IconLangChain = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M7 6H17V10H7V6Z" fill="#10B981" />
    <path d="M4 14H14V18H4V14Z" fill="#059669" />
    <circle cx="17" cy="8" r="4" fill="#34D399" opacity="0.9" />
    <circle cx="7" cy="16" r="4" fill="#10B981" opacity="0.9" />
    <path d="M10 10L14 14" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconOllama = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="8" fill="var(--surface-2)" stroke="var(--ink)" strokeWidth="1.75" />
    <circle cx="9" cy="11" r="2.2" fill="var(--ink)" />
    <circle cx="15" cy="11" r="2.2" fill="var(--ink)" />
    <path d="M9 16C10 17.2 14 17.2 15 16" stroke="var(--ink)" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M8 4V2M16 4V2" stroke="var(--ink)" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const IconHuggingFace = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#FBBF24" />
    <ellipse cx="8.5" cy="10" rx="1.5" ry="2" fill="#1E293B" />
    <ellipse cx="15.5" cy="10" rx="1.5" ry="2" fill="#1E293B" />
    <circle cx="9" cy="9.5" r="0.5" fill="#FFFFFF" />
    <circle cx="16" cy="9.5" r="0.5" fill="#FFFFFF" />
    <path d="M8 13.5C9 16 15 16 16 13.5" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 14C3 11.5 1.8 13 1.8 15C1.8 17 3.8 17.5 5 16" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M20 14C21 11.5 22.2 13 22.2 15C22.2 17 20.2 17.5 19 16" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconPython = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M11.91 2C6.44 2 6.78 4.38 6.78 4.38L6.79 6.84H12V7.61H4.37S2 7.34 2 12.82C2 18.3 4.07 18.04 4.07 18.04H5.66V15.79S5.58 13.14 8.27 13.14H13.43S15.93 13.22 15.93 10.79V4.38S16.35 2 11.91 2ZM9.39 3.53C9.9 3.53 10.31 3.94 10.31 4.45C10.31 4.96 9.9 5.37 9.39 5.37C8.88 5.37 8.47 4.96 8.47 4.45C8.47 3.94 8.88 3.53 9.39 3.53Z" fill="#38BDF8" />
    <path d="M12.09 22C17.56 22 17.22 19.62 17.22 19.62L17.21 17.16H12V16.39H19.63S22 16.66 22 11.18C22 5.7 19.93 5.96 19.93 5.96H18.34V8.21S18.42 10.86 15.73 10.86H10.57S8.07 10.78 8.07 13.21V19.62S7.65 22 12.09 22ZM14.61 20.47C14.1 20.47 13.69 20.06 13.69 19.55C13.69 19.04 14.1 18.63 14.61 18.63C15.12 18.63 15.53 19.04 15.53 19.55C15.53 20.06 15.12 20.47 14.61 20.47Z" fill="#FACC15" />
  </svg>
);

export const IconGemini = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" fill="url(#gemini-gradient-install-final-4)" />
    <defs>
      <linearGradient id="gemini-gradient-install-final-4" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="0.5" stopColor="#818CF8" />
        <stop offset="1" stopColor="#C084FC" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconMCP = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="3" fill="#10B981" />
    <circle cx="18" cy="6" r="3" fill="#06B6D4" />
    <circle cx="12" cy="18" r="3" fill="#8B5CF6" />
    <path d="M6 6L18 6M6 6L12 18M18 6L12 18" stroke="#10B981" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
  </svg>
);

export const IconLlamaIndex = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M4 19L12 5L20 19H4Z" fill="#6366F1" opacity="0.35" />
    <path d="M8 19L12 11L16 19H8Z" fill="#4F46E5" />
    <circle cx="12" cy="7" r="2" fill="#818CF8" />
  </svg>
);

export const IconMetaLlama = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M7 16C5 16 3 14 3 11.5C3 9 5 7 7.5 7C9.5 7 11 8.5 12 10C13 8.5 14.5 7 16.5 7C19 7 21 9 21 11.5C21 14 19 16 17 16C14.5 16 13 13.5 12 12C11 13.5 9.5 16 7 16Z" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconMistral = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="4" height="4" fill="#F97316" />
    <rect x="17" y="4" width="4" height="4" fill="#F97316" />
    <rect x="3" y="10" width="4" height="4" fill="#EA580C" />
    <rect x="10" y="10" width="4" height="4" fill="#F97316" />
    <rect x="17" y="10" width="4" height="4" fill="#EA580C" />
    <rect x="3" y="16" width="4" height="4" fill="#C2410C" />
    <rect x="17" y="16" width="4" height="4" fill="#C2410C" />
  </svg>
);

export const IconDeepSeek = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M3 13C3 7.5 8 3 14 3C18 3 21 6 21 10C21 14 18 17 14 17C12 17 10 18 8 20C8 18 6 17 3 13Z" fill="#2563EB" opacity="0.9" />
    <circle cx="15" cy="9" r="1.5" fill="#FFFFFF" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Core AI Toolchain Dataset (Structured 12-Tool Matrix, NO Side Logos)
// ─────────────────────────────────────────────────────────────────────────────

export const CORE_AI_TOOLCHAIN: IconProps[] = [
  { id: 1,  name: 'OpenAI Agents',    category: 'Function Calling & Tools', icon: IconOpenAI },
  { id: 2,  name: 'Claude 3.7',       category: 'Extended Thinking & MCP',   icon: IconAnthropic },
  { id: 3,  name: 'LangChain',        category: 'Chains & ReAct Loops',     icon: IconLangChain },
  { id: 4,  name: 'Ollama Runner',    category: 'Local Offline LLMs',        icon: IconOllama },
  { id: 5,  name: 'Google Gemini',    category: 'Multimodal Reasoning',      icon: IconGemini },
  { id: 6,  name: 'LlamaIndex',       category: 'RAG & Vector Retrieval',    icon: IconLlamaIndex },
  { id: 7,  name: 'MCP Protocol',     category: 'Anthropic Standards',       icon: IconMCP },
  { id: 8,  name: 'Hugging Face',     category: 'Open Model Hub',            icon: IconHuggingFace },
  { id: 9,  name: 'Meta Llama 3',     category: 'Open Weights Engine',       icon: IconMetaLlama },
  { id: 10, name: 'Mistral AI',       category: 'Efficient Function Calling',icon: IconMistral },
  { id: 11, name: 'DeepSeek R1',      category: 'Reasoning Runtimes',        icon: IconDeepSeek },
  { id: 12, name: 'Python 3.11',      category: 'Core Runtime Engine',       icon: IconPython },
];

// ─────────────────────────────────────────────────────────────────────────────
// FloatingIconsHero Component
// ─────────────────────────────────────────────────────────────────────────────

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(({
  className,
  title = "Initialize Your Agent Workbench",
  subtitle = "Configure your local Python environment, model runtimes, and LLM frameworks before Day 1. Everything you need to build autonomous systems.",
  ctaText = "Start 4-Step Setup",
  ctaHref = "#guide",
  secondaryCtaText = "Workshop Overview",
  secondaryCtaHref = "/#overview",
  badgeText = "LLM AGENTS WORKSHOP · ENVIRONMENT SETUP",
  icons = CORE_AI_TOOLCHAIN,
  ...props
}, ref) => {
  const isDesktop = useIsDesktop();
  const mouseX = React.useRef(0);
  const mouseY = React.useRef(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDesktop) {
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
    }
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative w-full min-h-[560px] flex items-center overflow-hidden py-12 md:py-16',
        className
      )}
      style={{
        background: "var(--canvas)",
      }}
      {...props}
    >
      {/* Structured 2-Column Responsive Layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pointer-events-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Clear Text Zone */}
          <div className="lg:col-span-6 text-left space-y-5 sm:space-y-6">
            {/* Eyebrow Badge */}
            {badgeText && (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono font-medium backdrop-blur-md"
                style={{
                  background: "rgba(22, 163, 107, 0.08)",
                  borderColor: "rgba(22, 163, 107, 0.25)",
                  color: "var(--accent)",
                }}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{badgeText}</span>
              </div>
            )}

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12]"
              style={{
                color: "var(--ink)",
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
              style={{
                color: "var(--ink-3)",
              }}
            >
              {subtitle}
            </p>

            {/* Actions */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6 sm:px-7 py-5 sm:py-6 text-xs sm:text-sm font-semibold rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/25 transition-all">
                <a href={ctaHref} className="inline-flex items-center gap-2">
                  <span>{ctaText}</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
              </Button>

              {secondaryCtaText && secondaryCtaHref && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-6 sm:px-7 py-5 sm:py-6 text-xs sm:text-sm font-medium rounded-full backdrop-blur-md transition-all"
                  style={{
                    background: "var(--surface-1)",
                    borderColor: "var(--line)",
                    color: "var(--ink-2)",
                  }}
                >
                  <a href={secondaryCtaHref}>{secondaryCtaText}</a>
                </Button>
              )}
            </div>

            {/* Specs Bar */}
            <div
              className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono"
              style={{
                color: "var(--ink-4)",
              }}
            >
              <span className="inline-flex items-center gap-1.5" style={{ color: "var(--ink-3)" }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                Python 3.11+
              </span>
              <span style={{ color: "var(--line-2)" }}>·</span>
              <span className="inline-flex items-center gap-1.5" style={{ color: "var(--ink-3)" }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                Ollama Local Runner
              </span>
              <span style={{ color: "var(--line-2)" }}>·</span>
              <span className="inline-flex items-center gap-1.5" style={{ color: "var(--ink-3)" }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                LangChain &amp; LlamaIndex
              </span>
            </div>
          </div>

          {/* Right Column: Structured AI Toolchain Grid (NO Side Logos) */}
          <div className="lg:col-span-6 relative w-full pt-4 lg:pt-0">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold" style={{ color: "var(--ink-4)" }}>
                Core Agent Ecosystem · Live Tools
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--accent)" }}>
                {isDesktop ? "Interactive Physics" : "12 Tools Ready"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              {icons.map((iconData, index) => (
                <StructuredToolCard
                  key={iconData.id}
                  iconData={iconData}
                  index={index}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isDesktop={isDesktop}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});

FloatingIconsHero.displayName = 'FloatingIconsHero';

export { FloatingIconsHero };
export default FloatingIconsHero;
