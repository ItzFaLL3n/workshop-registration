import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        "bg-alt": "#f5faf7",
        "bg-deep": "#eef7f1",
        ink: "#0c2a1d",
        "ink-soft": "#3f5c4d",
        "ink-faint": "#7c9488",
        "g-950": "#08211a",
        "g-900": "#0d3626",
        "g-700": "#146c43",
        "g-600": "#1a8a54",
        "g-500": "#1fa863",
        "g-300": "#8fdcb2",
        "g-150": "#d9f0e2",
        "g-100": "#eaf7ef",
        line: "#dcece2",
        "line-soft": "#eaf3ee",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      borderRadius: {
        sm: "10px",
        md: "18px",
        lg: "28px",
      },
      boxShadow: {
        sm: "0 2px 10px rgba(13,54,38,0.06)",
        md: "0 12px 32px rgba(13,54,38,0.10)",
        lg: "0 24px 60px rgba(13,54,38,0.14)",
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(.22,1,.36,1)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        dashmove: {
          to: { strokeDashoffset: "-130" },
        },
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        "pulse-arrow": {
          "0%,100%": { opacity: "0.4", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(3px)" },
        },
        reveal: {
          from: { opacity: "0", transform: "translateY(26px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 5.5s ease-in-out infinite",
        bob: "bob 2.2s ease-in-out infinite",
        "pulse-arrow": "pulse-arrow 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
