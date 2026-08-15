"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true); // dark is default

  /* Read saved preference on mount and listen to changes */
  useEffect(() => {
    function checkTheme() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light" || localStorage.getItem("theme") === "light";
      setDark(!isLight);
    }
    checkTheme();

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
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle-btn"
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
      <span className="theme-toggle-label">
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
