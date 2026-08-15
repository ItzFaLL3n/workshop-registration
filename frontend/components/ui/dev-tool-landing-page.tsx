'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Copy, Check, FileCode2,
  Cpu, ShieldCheck, Activity, Sun, Moon,
  Download, Package, Layers, Zap, BookOpen, ChevronRight,
} from 'lucide-react';

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
  { num: 1,  type: 'comment', text: '# Step 1 — Install Python 3.11 (if not already)' },
  { num: 2,  type: 'comment', text: '# Download from https://python.org/downloads' },
  { num: 3,  type: 'empty',   text: '' },
  { num: 4,  type: 'code',    tokens: [{ text: 'python', cls: 'text-emerald-400' }, { text: ' --version', cls: 'text-amber-300' }] },
  { num: 5,  type: 'comment', text: '# Expected: Python 3.11.x or 3.12.x' },
  { num: 6,  type: 'empty',   text: '' },
  { num: 7,  type: 'comment', text: '# Step 2 — Create a virtual environment' },
  { num: 8,  type: 'code',    tokens: [{ text: 'python', cls: 'text-emerald-400' }, { text: ' -m venv', cls: 'text-amber-300' }, { text: ' llm-env', cls: 'text-rose-400' }] },
  { num: 9,  type: 'code',    tokens: [{ text: 'source', cls: 'text-emerald-400' }, { text: ' llm-env/bin/activate', cls: 'text-amber-300' }, { text: '   # Windows: llm-env\\Scripts\\activate', cls: 'text-zinc-500' }] },
  { num: 10, type: 'empty',   text: '' },
  { num: 11, type: 'comment', text: '# Step 3 — Install core packages' },
  { num: 12, type: 'code',    tokens: [{ text: 'pip', cls: 'text-emerald-400' }, { text: ' install', cls: 'text-amber-300' }, { text: ' langchain langchain-community', cls: 'text-rose-400' }] },
  { num: 13, type: 'code',    tokens: [{ text: 'pip', cls: 'text-emerald-400' }, { text: ' install', cls: 'text-amber-300' }, { text: ' llama-index openai', cls: 'text-rose-400' }] },
  { num: 14, type: 'empty',   text: '' },
];

const EXPLANATIONS: Record<number, string> = {
  4:  'Verify Python is installed. We need 3.11+ for all workshop exercises.',
  8:  'A virtual env keeps workshop packages isolated from your system Python.',
  12: 'LangChain is our primary agent framework. Community adds tool integrations.',
  13: 'LlamaIndex handles RAG & data pipelines. OpenAI SDK gives us model access.',
};

const STEPS = [
  {
    id: 'python',
    step: '01',
    title: 'Python 3.11',
    icon: FileCode2,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(52,211,153,0.2)]',
    description:
      'The entire workshop runs on Python. Install 3.11 (or 3.12) from python.org. During install on Windows, tick **"Add Python to PATH"** — this is critical.',
    proof: {
      label: 'Verify Install',
      lines: [
        { text: '$ python --version',   dim: false },
        { text: 'Python 3.11.9',        dim: true  },
        { text: '$ pip --version',      dim: false },
        { text: 'pip 24.0 from ...',    dim: true  },
      ],
    },
  },
  {
    id: 'ollama',
    step: '02',
    title: 'Ollama (Local LLM)',
    icon: Cpu,
    accent: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(251,191,36,0.2)]',
    description:
      'Ollama lets you run Llama 3, Mistral, and Gemma locally — no API key needed. Download from **ollama.com**, install, then pull the workshop model.',
    proof: {
      label: 'Pull Model',
      lines: [
        { text: '$ ollama pull llama3.2',          dim: false },
        { text: 'pulling manifest ...',             dim: true  },
        { text: 'success',                          dim: false },
        { text: '$ ollama run llama3.2',            dim: true  },
      ],
    },
  },
  {
    id: 'langchain',
    step: '03',
    title: 'LangChain + LlamaIndex',
    icon: Layers,
    accent: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(251,113,133,0.2)]',
    description:
      'These are the two primary agent frameworks used in the workshop. LangChain powers tool-use and ReAct agents; LlamaIndex handles RAG pipelines and data queries.',
    proof: {
      label: 'Quick Check',
      lines: [
        { text: 'import langchain',        dim: false },
        { text: 'print(langchain.__version__)',  dim: true  },
        { text: '0.3.x',                   dim: false },
        { text: 'import llama_index',      dim: true  },
      ],
    },
  },
  {
    id: 'vscode',
    step: '04',
    title: 'VS Code + Extensions',
    icon: Activity,
    accent: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(167,139,250,0.2)]',
    description:
      'VS Code is the recommended editor. Install the **Python** extension by Microsoft, and optionally **Jupyter** for interactive notebooks. The Ruff linter extension is also helpful.',
    proof: {
      label: 'Extensions',
      lines: [
        { text: 'ms-python.python',        dim: false },
        { text: 'ms-toolsai.jupyter',      dim: true  },
        { text: 'charliermarsh.ruff',      dim: false },
        { text: 'GitHub.copilot',          dim: true  },
      ],
    },
  },
];

const PREREQS = [
  { icon: Download,  label: 'Python 3.11+',          note: 'python.org/downloads',    accent: 'text-emerald-400', href: 'https://www.python.org/downloads/' },
  { icon: Package,   label: 'Ollama',                 note: 'ollama.com',              accent: 'text-amber-400',  href: 'https://ollama.com' },
  { icon: Layers,    label: 'LangChain',              note: 'pip install langchain',   accent: 'text-rose-400',   href: 'https://python.langchain.com' },
  { icon: Zap,       label: 'LlamaIndex',             note: 'pip install llama-index', accent: 'text-violet-400', href: 'https://docs.llamaindex.ai' },
  { icon: BookOpen,  label: 'Workshop Notebook',      note: 'Shared on Day 1',         accent: 'text-sky-400',    href: '#' },
];

import FloatingNavbar from "@/components/FloatingNavbar";
import { FloatingIconsHero } from "@/components/ui/floating-icons-hero-section";

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

  const highlightableLines = [4, 8, 12, 13];

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
              Get your machine<br />ready in 4 steps.
            </h1>
            <p className={`leading-relaxed text-sm md:text-base ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Everything you need for the hands-on sessions — Python, a local model runner,
              and the agent frameworks. Follow the guide below before Day 1.
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
                  install.sh
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {PREREQS.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200
                ${dark
                  ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm'}`}
            >
              <p.icon className={`w-5 h-5 ${p.accent}`} />
              <div>
                <p className={`text-sm font-medium ${dark ? 'text-zinc-200' : 'text-zinc-700'}`}>{p.label}</p>
                <p className={`text-xs mt-0.5 font-mono ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>{p.note}</p>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform group-hover:translate-x-0.5 ${p.accent}`} />
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
            Four things to install. That's it.
          </h2>
          <p className={`leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            The entire workshop toolchain fits in a single virtual environment. Below is every package you'll need, 
            why it matters, and how to verify it's working before Day 1.
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
    { label: 'Create virtual environment',       cmd: 'python -m venv llm-env' },
    { label: 'Activate (macOS / Linux)',          cmd: 'source llm-env/bin/activate' },
    { label: 'Activate (Windows)',                cmd: '.\\llm-env\\Scripts\\activate' },
    { label: 'Install LangChain',                 cmd: 'pip install langchain langchain-community langchain-ollama' },
    { label: 'Install LlamaIndex',                cmd: 'pip install llama-index llama-index-llms-ollama' },
    { label: 'Install OpenAI SDK (optional)',     cmd: 'pip install openai' },
    { label: 'Pull Llama 3.2 via Ollama',        cmd: 'ollama pull llama3.2' },
    { label: 'Run quick sanity check',            cmd: 'python -c "import langchain; print(langchain.__version__)"' },
  ];

  return (
    <section className={`px-6 md:px-12 py-20 border-t ${dark ? 'border-zinc-800/50' : 'border-zinc-200/50'}`}>
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-3">
          <h2 className={`text-2xl md:text-3xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            All commands, ready to paste.
          </h2>
          <p className={`text-sm md:text-base leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Run these in order in your terminal. Each line is individually copyable.
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
            <span className="font-semibold">Need help?</span> Bring your laptop to the venue at least 20 minutes early.
            Facilitators will be on hand to help with any installation issues before the first session begins.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root component
// ─────────────────────────────────────────────────────────────────────────────
export function Component() {
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
        <FloatingNavbar currentPath="/install" />

        {/* Interactive Floating Icons Hero with smooth spring physics */}
        <div className="pt-20 md:pt-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <FloatingIconsHero
            badgeText="LLM AGENTS WORKSHOP · ENVIRONMENT SETUP"
            title="Initialize Your Agent Workbench"
            subtitle="Configure your local Python environment, model runtimes, and LLM frameworks before Day 1. Everything you need to build autonomous systems."
            ctaText="Start 4-Step Setup"
            ctaHref="#guide"
            secondaryCtaText="Workshop Overview"
            secondaryCtaHref="/#overview"
          />
        </div>

        <PrerequisiteStrip />
        <HeroSection />
        <StepsSection />
        <CommandsSection />
      </div>
    </ThemeCtx.Provider>
  );
}

export default Component;
