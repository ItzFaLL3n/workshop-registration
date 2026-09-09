'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Copy, Check, FileCode2,
  Package, Layers, Zap, BookOpen, ChevronRight,
  Download, Code2, Key,
} from 'lucide-react';

import Link from "next/link";
import Image from "next/image";
import FloatingNavbar from "@/components/FloatingNavbar";
import {
  FloatingIconsHero,
  IconPython, IconAnthropic, IconOpenAI, IconMCP,
  IconLlamaIndex, IconLangChain, IconGemini, IconOllama,
  IconMistral, IconDeepSeek,
  type IconProps,
} from "@/components/ui/floating-icons-hero-section";

// Google Drive folder shared with attendees — the full demo pack
// (SHCTPT_Workshop_09_09_2026: 14 self-contained demos + setup notes).
const DRIVE_URL =
  "https://drive.google.com/drive/folders/1LdccEQ-w8Qt2Yd96t8u3ByhxuYbIi8QG";

// ─────────────────────────────────────────────────────────────────────────────
// Theme context
// ─────────────────────────────────────────────────────────────────────────────
const ThemeCtx = React.createContext<{ dark: boolean; toggle: () => void }>({
  dark: true,
  toggle: () => {},
});

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

/** Terminal demo lines shown in the hero code block */
const INSTALL_CODE = [
  { num: 1,  type: 'comment', text: '# Step 1 — Install Python 3.10+  (python.org, tick "Add python.exe to PATH")' },
  { num: 2,  type: 'code',    tokens: [{ text: 'py', cls: 'text-emerald-400' }, { text: ' --version', cls: 'text-amber-300' }, { text: '          # Windows', cls: 'text-zinc-500' }] },
  { num: 3,  type: 'code',    tokens: [{ text: 'python3', cls: 'text-emerald-400' }, { text: ' --version', cls: 'text-amber-300' }, { text: '     # macOS / Linux', cls: 'text-zinc-500' }] },
  { num: 4,  type: 'empty',   text: '' },
  { num: 5,  type: 'comment', text: '# Step 2 — Enter the demo pack you downloaded from Google Drive' },
  { num: 6,  type: 'code',    tokens: [{ text: 'cd', cls: 'text-emerald-400' }, { text: ' SHCTPT_Workshop_09_09_2026', cls: 'text-rose-400' }] },
  { num: 7,  type: 'empty',   text: '' },
  { num: 8,  type: 'comment', text: '# Step 3 — Create a virtual environment' },
  { num: 9,  type: 'code',    tokens: [{ text: 'py', cls: 'text-emerald-400' }, { text: ' -m venv', cls: 'text-amber-300' }, { text: ' .venv', cls: 'text-rose-400' }, { text: '          # Windows', cls: 'text-zinc-500' }] },
  { num: 10, type: 'code',    tokens: [{ text: 'python3', cls: 'text-emerald-400' }, { text: ' -m venv', cls: 'text-amber-300' }, { text: ' venv', cls: 'text-rose-400' }, { text: '     # macOS / Linux', cls: 'text-zinc-500' }] },
  { num: 11, type: 'empty',   text: '' },
  { num: 12, type: 'comment', text: '# Step 4 — Activate it  (run again in every new terminal)' },
  { num: 13, type: 'code',    tokens: [{ text: '.venv\\Scripts\\Activate.ps1', cls: 'text-amber-300' }, { text: '     # Windows PowerShell', cls: 'text-zinc-500' }] },
  { num: 14, type: 'code',    tokens: [{ text: '.venv\\Scripts\\activate.ps1', cls: 'text-amber-300' }, { text: '     # use this if Activate.ps1 does not work', cls: 'text-zinc-500' }] },
  { num: 15, type: 'code',    tokens: [{ text: 'source', cls: 'text-emerald-400' }, { text: ' venv/bin/activate', cls: 'text-amber-300' }, { text: '   # macOS / Linux', cls: 'text-zinc-500' }] },
  { num: 16, type: 'empty',   text: '' },
  { num: 17, type: 'comment', text: '# Step 5 — Install everything the 14 demos need' },
  { num: 18, type: 'code',    tokens: [{ text: 'pip', cls: 'text-emerald-400' }, { text: ' install', cls: 'text-amber-300' }, { text: ' -r requirements-all.txt', cls: 'text-rose-400' }] },
  { num: 19, type: 'empty',   text: '' },
  { num: 20, type: 'comment', text: '# Step 6 — (Optional) API key for the live demos 05-13' },
  { num: 21, type: 'code',    tokens: [{ text: 'copy', cls: 'text-emerald-400' }, { text: ' .env.example .env', cls: 'text-rose-400' }, { text: '   # macOS / Linux: cp .env.example .env', cls: 'text-zinc-500' }] },
  { num: 22, type: 'comment', text: '#   then paste ONE key:  ANTHROPIC_API_KEY   — or —   OPENROUTER_API_KEY' },
  { num: 23, type: 'empty',   text: '' },
  { num: 24, type: 'comment', text: '# Step 7 — Verify with a demo that needs no key' },
  { num: 25, type: 'code',    tokens: [{ text: 'cd', cls: 'text-emerald-400' }, { text: ' 01-Basic-AI-Example', cls: 'text-rose-400' }] },
  { num: 26, type: 'code',    tokens: [{ text: 'pip', cls: 'text-emerald-400' }, { text: ' install', cls: 'text-amber-300' }, { text: ' -r requirements.txt', cls: 'text-rose-400' }] },
  { num: 27, type: 'code',    tokens: [{ text: 'python', cls: 'text-emerald-400' }, { text: ' rule_based_bot.py', cls: 'text-amber-300' }] },
  { num: 28, type: 'empty',   text: '' },
  { num: 29, type: 'comment', text: '# See output in the terminal? Your machine is workshop-ready.' },
];

const EXPLANATIONS: Record<number, string> = {
  2:  'Confirm Python 3.10 or newer. On Windows always use py — typing python3 there just opens the Microsoft Store.',
  9:  'A virtual environment keeps the workshop packages isolated from your system Python. .venv is only a folder inside the pack.',
  13: 'Activates the environment — your prompt then shows (.venv). If Activate.ps1 does not work, use the lower-case activate.ps1 on the next line.',
  18: 'One command installs every package all 14 demos need. It runs for a few minutes the first time.',
  27: 'This demo needs no API key — it runs in MOCK_MODE. Output in the terminal means you are done.',
};

const STEPS = [
  {
    id: 'python',
    step: '01',
    title: 'Python 3.10 or newer',
    icon: FileCode2,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(52,211,153,0.2)]',
    description:
      'Everything runs on Python. Install it from python.org — not the Microsoft Store — and on Windows tick "Add python.exe to PATH" on the first screen. On Windows use the py launcher; python3 there opens the Store instead of running.',
    proof: {
      label: 'Verify',
      lines: [
        { text: '$ py --version',  dim: false },
        { text: 'Python 3.12.4',   dim: true  },
        { text: '$ pip --version', dim: false },
        { text: 'pip 24.x from ...', dim: true },
      ],
    },
  },
  {
    id: 'pack',
    step: '02',
    title: 'The workshop demo pack',
    icon: Download,
    accent: 'text-sky-400',
    bg: 'bg-sky-400/10',
    border: 'border-sky-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(56,189,248,0.2)]',
    description:
      'Download the shared Google Drive folder and unzip it somewhere easy to reach. It holds 14 self-contained demos (00 to 13), a combined requirements-all.txt, and per-demo notes. Open a terminal inside that folder — every command below runs from there.',
    proof: {
      label: 'Contents',
      lines: [
        { text: '$ cd SHCTPT_Workshop_09_09_2026', dim: false },
        { text: '$ ls', dim: false },
        { text: '00-Setup  01-Basic-AI-Example', dim: true },
        { text: '...  13-Agent-Framework-Chat-UI', dim: true },
      ],
    },
  },
  {
    id: 'venv',
    step: '03',
    title: 'Virtual environment',
    icon: Layers,
    accent: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(251,191,36,0.2)]',
    description:
      'Keeps the workshop packages separate from your system Python. Create it once, then activate it in every new terminal. On Windows PowerShell try Activate.ps1 first; if that does not work, use the lower-case activate.ps1. If PowerShell blocks the script, run Set-ExecutionPolicy -Scope CurrentUser RemoteSigned once.',
    proof: {
      label: 'Activate',
      lines: [
        { text: 'PS> .venv\\Scripts\\Activate.ps1', dim: false },
        { text: 'PS> .venv\\Scripts\\activate.ps1', dim: true  },
        { text: '$  source venv/bin/activate',     dim: false },
        { text: '(.venv) $', dim: true },
      ],
    },
  },
  {
    id: 'deps',
    step: '04',
    title: 'Install dependencies',
    icon: Package,
    accent: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(167,139,250,0.2)]',
    description:
      'One command pulls every package the 14 demos use — anthropic, openai, mcp, flask, fastapi, scikit-learn, tiktoken and more. Each demo folder also has its own requirements.txt if you would rather install per demo.',
    proof: {
      label: 'Install',
      lines: [
        { text: '$ pip install -r requirements-all.txt', dim: false },
        { text: 'Collecting anthropic ...', dim: true  },
        { text: 'Collecting openai ...',    dim: true  },
        { text: 'Successfully installed',   dim: false },
      ],
    },
  },
  {
    id: 'key',
    step: '05',
    title: 'API key  ·  optional',
    icon: Key,
    accent: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(251,113,133,0.2)]',
    description:
      'Every demo runs offline in MOCK_MODE with no key. Add one only to see real model responses in demos 05 to 13. Copy .env.example to .env inside that demo folder and fill in ONE provider — Anthropic (ANTHROPIC_API_KEY) or OpenRouter (OPENROUTER_API_KEY). Never commit a real .env.',
    proof: {
      label: 'Configure',
      lines: [
        { text: '$ copy .env.example .env',        dim: false },
        { text: '# ANTHROPIC_API_KEY=sk-ant-...',  dim: true  },
        { text: '#      — or —',                   dim: true  },
        { text: '# OPENROUTER_API_KEY=sk-or-...',  dim: false },
      ],
    },
  },
  {
    id: 'run',
    step: '06',
    title: 'Run a demo to verify',
    icon: Terminal,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(52,211,153,0.2)]',
    description:
      'Pick a demo that needs no key, install its requirements, and run the script named in its README. Output in the terminal means your environment is ready for Day 1. Re-run each demo you plan to follow along with at least once beforehand.',
    proof: {
      label: 'Smoke test',
      lines: [
        { text: '$ cd 01-Basic-AI-Example',          dim: false },
        { text: '$ pip install -r requirements.txt', dim: true  },
        { text: '$ python rule_based_bot.py',        dim: false },
        { text: 'Bot: hi there  (rule-based)',       dim: true  },
      ],
    },
  },
];

const PREREQS = [
  { icon: Download, label: 'Python 3.10+',     note: 'python.org',            accent: 'text-emerald-400', href: 'https://www.python.org/downloads/' },
  { icon: Code2,    label: 'VS Code',           note: 'visualstudio.com',      accent: 'text-sky-400',     href: 'https://code.visualstudio.com/download' },
  { icon: Layers,   label: 'Python extension',  note: 'ms-python.python',       accent: 'text-violet-400',  href: 'https://marketplace.visualstudio.com/items?itemName=ms-python.python' },
  { icon: BookOpen, label: 'Demo pack',         note: 'Google Drive',          accent: 'text-amber-400',   href: DRIVE_URL },
  { icon: Key,      label: 'Anthropic key',     note: 'anthropic.com',         accent: 'text-rose-400',    href: 'https://console.anthropic.com' },
  { icon: Zap,      label: 'OpenRouter',        note: 'openrouter.ai/keys',     accent: 'text-sky-400',     href: 'https://openrouter.ai/keys' },
];

/** What the workshop actually covers — shown in the floating hero grid. */
const WORKSHOP_STACK: IconProps[] = [
  { id: 1,  name: 'Python 3.10+', category: 'Core runtime',           icon: IconPython },
  { id: 2,  name: 'Claude API',   category: 'Anthropic SDK',          icon: IconAnthropic },
  { id: 3,  name: 'OpenRouter',   category: 'Alternate provider',     icon: IconOpenAI },
  { id: 4,  name: 'MCP',          category: 'Tools via a server',     icon: IconMCP },
  { id: 5,  name: 'RAG',          category: 'Embeddings + retrieval', icon: IconLlamaIndex },
  { id: 6,  name: 'Agents',       category: 'ReAct loop + tools',     icon: IconLangChain },
  { id: 7,  name: 'Multi-agent',  category: 'Pipelines & hand-offs',  icon: IconDeepSeek },
  { id: 8,  name: 'Voice agent',  category: 'STT to LLM to TTS',      icon: IconGemini },
  { id: 9,  name: 'Guardrails',   category: 'PII + output checks',    icon: IconMistral },
  { id: 10, name: 'MOCK_MODE',    category: 'Runs with no API key',   icon: IconOllama },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Copyable inline command snippet */
function CopyCmd({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  const { dark } = React.useContext(ThemeCtx);

  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border font-mono text-sm
      ${dark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
      <span className="flex-1 overflow-x-auto whitespace-nowrap">{cmd}</span>
      <button
        onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className={`shrink-0 transition-colors ${dark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
        aria-label="Copy command"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero — interactive code block
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { dark } = React.useContext(ThemeCtx);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const highlightableLines = [2, 9, 13, 18, 27];

  return (
    <section id="guide" className={`min-h-screen flex items-center justify-center p-6 py-20 md:p-12 md:py-28 border-b
      ${dark ? 'border-zinc-800/50' : 'border-zinc-200/80'}`}>
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* Left copy */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium
              ${dark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
              <Terminal className="w-3.5 h-3.5" />
              <span>Setup Guide · LLM Agents Workshop</span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
              Get your machine ready<br />in about 15 minutes.
            </h1>
            <p className={`leading-relaxed text-sm md:text-base ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Everything for the hands-on demos — Python, a virtual environment, and the
              14-demo pack. Seven short steps, and every demo also runs offline, so venue
              wifi can&apos;t block you.
            </p>
          </div>

          {/* Walkthrough hot-spots */}
          <div className="space-y-2">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Hover a line to learn more
            </p>
            {highlightableLines.map((lineNum) => (
              <button
                key={lineNum}
                onMouseEnter={() => setActiveLine(lineNum)}
                onMouseLeave={() => setActiveLine(null)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300
                  ${activeLine === lineNum
                    ? dark ? 'bg-zinc-900/80 border-zinc-700 shadow-lg shadow-black/50' : 'bg-zinc-100 border-zinc-300 shadow-sm'
                    : dark ? 'bg-transparent border-transparent hover:border-zinc-800 hover:bg-zinc-900/30' : 'bg-transparent border-transparent hover:border-zinc-200 hover:bg-zinc-50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-mono transition-colors
                    ${activeLine === lineNum
                      ? 'border-emerald-500 text-emerald-400'
                      : dark ? 'border-zinc-700 text-zinc-500' : 'border-zinc-300 text-zinc-400'
                    }`}>
                    {lineNum}
                  </div>
                  <p className={`text-sm transition-colors ${activeLine === lineNum ? dark ? 'text-zinc-200' : 'text-zinc-700' : dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {EXPLANATIONS[lineNum]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — code block */}
        <div className="lg:col-span-7 relative group">
          <div className={`absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000
            ${dark ? 'bg-gradient-to-b from-zinc-800 to-zinc-900' : 'bg-gradient-to-b from-zinc-200 to-zinc-300'}`} />

          <div className={`relative rounded-xl overflow-hidden border shadow-2xl
            ${dark ? 'bg-[#0d0d0f] border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-zinc-200/50'}`}>
            {/* Titlebar */}
            <div className={`flex items-center justify-between px-4 py-3 border-b
              ${dark ? 'bg-[#111115] border-zinc-800/80' : 'bg-zinc-50 border-zinc-200/80'}`}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {['bg-red-400/60', 'bg-yellow-400/60', 'bg-green-400/60'].map((c) => (
                    <div key={c} className={`w-2.5 h-2.5 rounded-full ${dark ? c : c}`} />
                  ))}
                </div>
                <div className={`flex items-center gap-2 px-2 py-1 rounded-md border text-xs font-mono
                  ${dark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'}`}>
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  setup.sh
                </div>
              </div>
              <button
                onClick={() => { setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }}
                className={`transition-colors p-1 ${dark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Code */}
            <div className="p-4 font-mono text-sm leading-loose overflow-x-auto no-scrollbar">
              {INSTALL_CODE.map((line, idx) => {
                const isActive   = activeLine === line.num;
                const isDimmed   = activeLine !== null && !isActive;
                return (
                  <motion.div
                    key={idx}
                    animate={{ opacity: isDimmed ? 0.25 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex relative"
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="code-active-bg"
                          className={`absolute inset-y-0 -inset-x-4 border-l-2 pointer-events-none
                            ${dark ? 'bg-zinc-800/40 border-emerald-400' : 'bg-emerald-50 border-emerald-400'}`}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </AnimatePresence>
                    <span className={`w-8 flex-shrink-0 text-right pr-4 select-none relative z-10
                      ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {line.num}
                    </span>
                    <span className="relative z-10 whitespace-pre">
                      {line.type === 'comment' && (
                        <span className={dark ? 'text-zinc-500' : 'text-zinc-400'}>{line.text}</span>
                      )}
                      {line.type === 'code' && line.tokens?.map((t, ti) => (
                        <span key={ti} className={t.cls}>{t.text}</span>
                      ))}
                      {line.type === 'empty' && <span>&nbsp;</span>}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick links — prereq download list
// ─────────────────────────────────────────────────────────────────────────────
function PrerequisiteStrip() {
  const { dark } = React.useContext(ThemeCtx);
  return (
    <section className={`px-6 md:px-12 py-10 border-b ${dark ? 'border-zinc-800/50 bg-[#0d0d0f]' : 'border-zinc-200/80 bg-zinc-50'}`}>
      <div className="max-w-5xl mx-auto">
        <p className={`text-xs font-semibold uppercase tracking-widest mb-6 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Downloads &amp; Links
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PREREQS.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 overflow-hidden
                ${dark
                  ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm'}`}
            >
              <p.icon className={`w-5 h-5 shrink-0 ${p.accent}`} />
              <div className="min-w-0">
                <p className={`text-sm font-medium ${dark ? 'text-zinc-200' : 'text-zinc-700'}`}>{p.label}</p>
                <p className={`text-xs mt-0.5 font-mono break-words leading-tight ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>{p.note}</p>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ml-auto shrink-0 transition-transform group-hover:translate-x-0.5 ${p.accent}`} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step-by-step claim + proof cards
// ─────────────────────────────────────────────────────────────────────────────
function StepsSection() {
  const { dark } = React.useContext(ThemeCtx);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="p-6 md:p-12 lg:p-20 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto space-y-16 w-full">
        <div className="space-y-4 max-w-2xl">
          <h2 className={`text-2xl md:text-3xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            Six steps. About fifteen minutes.
          </h2>
          <p className={`leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            The whole toolchain fits in one virtual environment. Below is each step, why it
            matters, and how to check it worked before Day 1.
          </p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              onMouseEnter={() => setHovered(step.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative flex flex-col md:flex-row items-stretch rounded-2xl overflow-hidden
                border transition-all duration-500
                ${dark
                  ? `bg-[#111115] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#15151a] ${step.glow}`
                  : `bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md`}`}
            >
              {/* Left — explanation */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-2 rounded-lg border ${step.bg} ${step.border}`}>
                    <step.icon className={`w-5 h-5 ${step.accent}`} />
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className={`font-mono text-xs font-bold ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>{step.step}</span>
                    <h3 className={`text-lg font-medium ${dark ? 'text-zinc-100' : 'text-zinc-800'}`}>{step.title}</h3>
                  </div>
                </div>
                <p className={`text-sm md:text-base leading-relaxed max-w-md ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {step.description}
                </p>
              </div>

              {/* Right — proof terminal */}
              <div className={`md:w-80 border-t md:border-t-0 md:border-l relative overflow-hidden flex flex-col
                ${dark ? 'border-zinc-800/50 bg-[#0d0d0f]' : 'border-zinc-100 bg-zinc-50'}`}>
                <div className={`flex items-center justify-between px-4 py-2 border-b
                  ${dark ? 'border-zinc-800/50 bg-[#111115]' : 'border-zinc-200/50 bg-white'}`}>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {step.proof.label}
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2].map((i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity
                        ${dark ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-center font-mono text-xs leading-relaxed relative">
                  {/* Placeholder skeleton */}
                  <div className="absolute inset-4 flex flex-col justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                    {[3/4, 1/2, 5/6].map((w, i) => (
                      <div key={i} className={`h-2 rounded mb-3 ${dark ? 'bg-zinc-800/50' : 'bg-zinc-200/80'}`}
                        style={{ width: `${w * 100}%` }} />
                    ))}
                  </div>
                  {/* Real content */}
                  <div className="relative z-10 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                    {step.proof.lines.map((line, li) => (
                      <motion.div
                        key={li}
                        initial={false}
                        className={`whitespace-pre ${line.dim ? dark ? 'text-zinc-600' : 'text-zinc-400' : step.accent}`}
                      >
                        {line.text}
                      </motion.div>
                    ))}
                  </div>
                  <AnimatePresence>
                    {hovered === step.id && (
                      <motion.div
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: '100%', opacity: [0, 0.5, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
                        className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent to-emerald-500/10 pointer-events-none"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Copy-paste command section
// ─────────────────────────────────────────────────────────────────────────────
function CommandsSection() {
  const { dark } = React.useContext(ThemeCtx);

  const cmds = [
    { label: 'Check Python — Windows',                    cmd: 'py --version' },
    { label: 'Check Python — macOS / Linux',              cmd: 'python3 --version' },
    { label: 'Enter the demo pack',                       cmd: 'cd SHCTPT_Workshop_09_09_2026' },
    { label: 'Create virtual env — Windows',              cmd: 'py -m venv .venv' },
    { label: 'Create virtual env — macOS / Linux',        cmd: 'python3 -m venv venv' },
    { label: 'Activate — Windows PowerShell',             cmd: '.venv\\Scripts\\Activate.ps1' },
    { label: 'Activate — Windows PowerShell (lower-case — use if Activate.ps1 fails)', cmd: '.venv\\Scripts\\activate.ps1' },
    { label: 'Activate — Windows CMD',                    cmd: '.venv\\Scripts\\activate.bat' },
    { label: 'Activate — macOS / Linux',                  cmd: 'source venv/bin/activate' },
    { label: 'Install all dependencies',                  cmd: 'pip install -r requirements-all.txt' },
    { label: 'Copy the env template — Windows',           cmd: 'copy .env.example .env' },
    { label: 'Copy the env template — macOS / Linux',     cmd: 'cp .env.example .env' },
    { label: 'Verify — run a demo that needs no key',     cmd: 'python rule_based_bot.py' },
  ];

  return (
    <section className={`px-6 md:px-12 py-20 border-t ${dark ? 'border-zinc-800/50' : 'border-zinc-200/50'}`}>
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-3">
          <h2 className={`text-2xl md:text-3xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            All commands, ready to paste.
          </h2>
          <p className={`text-sm md:text-base leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Run these in order in your terminal. Each line is individually copyable. Use the
            Windows or the macOS / Linux line for your machine.
          </p>
        </div>

        <div className="space-y-3">
          {cmds.map(({ label, cmd }) => (
            <div key={cmd}>
              <p className={`text-xs mb-1.5 font-medium ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</p>
              <CopyCmd cmd={cmd} />
            </div>
          ))}
        </div>

        <div className={`p-5 rounded-2xl border ${dark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">Need help?</span> Bring your laptop to the venue
            at least 20 minutes early. The team will help with any setup issues before the
            first session. If the network is flaky, every demo still runs in MOCK_MODE with
            no API key.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/#overview"
            className={`group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all
              ${dark
                ? 'bg-zinc-900/50 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:shadow-sm'}`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            Workshop overview
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/#registration"
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all
              ${dark
                ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                : 'border-zinc-200 text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'}`}
          >
            Back to Registration
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Site footer (shared global .site-footer styles — theme-aware via CSS vars)
// ─────────────────────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
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
            <span style={{ fontWeight: 650, letterSpacing: "-0.02em", fontSize: 13.5, color: "var(--ink)", marginTop: 4 }}>
              VORTEX NEOVIA &apos;27 • LLM Agents
            </span>
            <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.6, margin: 0 }}>
              Department of Computer Applications (BCA)<br />
              Sacred Heart College (Autonomous), Tirupattur
            </p>
          </div>

          <div className="footer-links-grid">
            <div>
              <span className="footer-col-title">Navigation</span>
              <ul className="footer-col-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/resources">Resources</Link></li>
                <li><Link href="/live">Live</Link></li>
              </ul>
            </div>

            <div>
              <span className="footer-col-title">Guidelines</span>
              <ul className="footer-col-links">
                <li><Link href="/terms">Terms &amp; Conditions</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <span className="footer-col-title">Help &amp; Inquiries</span>
              <ul className="footer-col-links">
                <li><a href="tel:+916383483749">Help desk: +91&nbsp;63834&nbsp;83749</a></li>
                <li><a href="mailto:bca@shctpt.edu">bca@shctpt.edu</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <span>&copy; {new Date().getFullYear()} Sacred Heart College. All rights reserved. &middot; Designed by Selvan</span>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/privacy" style={{ color: "var(--ink-4)", transition: "color .15s" }}>Privacy</Link>
            <Link href="/terms" style={{ color: "var(--ink-4)", transition: "color .15s" }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root component
// ─────────────────────────────────────────────────────────────────────────────
export function Component({ currentPath = "/resources" }: { currentPath?: string }) {
  const [dark, setDark] = useState(true);

  React.useEffect(() => {
    function syncTheme() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light" || localStorage.getItem("theme") === "light";
      setDark(!isLight);
    }
    syncTheme();

    const handleThemeChange = () => syncTheme();
    window.addEventListener("themechange", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    const observer = new MutationObserver(() => syncTheme());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });

    return () => {
      window.removeEventListener("themechange", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next ? "dark" : "light" } }));
  };

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      <div className={`font-sans min-h-screen transition-colors duration-300 ${dark ? 'bg-[#09090b] text-zinc-300' : 'bg-[#fafafa] text-zinc-700'}`}>
        <FloatingNavbar currentPath={currentPath} />

        {/* Interactive Floating Icons Hero with smooth spring physics */}
        <div className="pt-20 md:pt-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <FloatingIconsHero
            badgeText="LLM AGENTS WORKSHOP · SETUP GUIDE"
            title="Set Up Your Workshop Environment"
            subtitle="Get Python, a virtual environment, and the 14-demo pack ready before Day 1. Every demo also runs fully offline, so venue wifi is never a blocker."
            ctaText="Start the setup"
            ctaHref="#guide"
            secondaryCtaText="Workshop Overview"
            secondaryCtaHref="/#overview"
            icons={WORKSHOP_STACK}
          />
        </div>

        <PrerequisiteStrip />
        <HeroSection />
        <StepsSection />
        <CommandsSection />
        <SiteFooter />
      </div>
    </ThemeCtx.Provider>
  );
}

export default Component;
