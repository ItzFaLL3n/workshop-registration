import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", "html:not([data-theme='light'])"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#16a36b",
          hover:   "#128f5c",
          light:   "#eaf7f2",
          line:    "#b8e8d4",
        },
        ink: {
          DEFAULT: "var(--ink)",
          "2":     "var(--ink-2)",
          "3":     "var(--ink-3)",
          "4":     "var(--ink-4)",
        },
        line: {
          DEFAULT: "var(--line)",
          "2":     "var(--line-2)",
        },
        surface: {
          "1": "var(--surface-1)",
          "2": "var(--surface-2)",
          "3": "var(--surface-3)",
        },
      },
      fontFamily: {
        sans:  ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono:  ['"IBM Plex Mono"', "monospace"],
      },
      borderRadius: {
        pill: "9999px",
        card: "12px",
        lg:   "16px",
      },
    },
  },
  plugins: [],
};

export default config;
