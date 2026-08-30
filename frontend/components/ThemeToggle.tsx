"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // `mounted` gate: SSR and the first client render can't know the saved
  // theme, so render a neutral placeholder until the effect runs. Without
  // this the button flashes the wrong icon/label on light-mode loads.
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(true); // dark is the site default

  useEffect(() => {
    function checkTheme() {
      const isLight =
        document.documentElement.getAttribute("data-theme") === "light" ||
        localStorage.getItem("theme") === "light";
      setDark(!isLight);
    }
    checkTheme();
    setMounted(true);

    const handleThemeChange = () => checkTheme();
    window.addEventListener("themechange", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("themechange", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);

    const root = document.documentElement;
    // Suppress every transition for one frame so the palette swap is instant
    // instead of dozens of elements sweeping colours at slightly different
    // speeds (the "glitch" on dense views like the form / admin table).
    root.classList.add("theme-switching");

    if (next) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme: next ? "dark" : "light" } })
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("theme-switching"));
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle-btn"
      style={!mounted ? { visibility: "hidden" } : undefined}
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Sun style={{ width: 15, height: 15, color: "#fbbf24" }} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Moon style={{ width: 15, height: 15, color: "#818cf8" }} />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="theme-toggle-label">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
