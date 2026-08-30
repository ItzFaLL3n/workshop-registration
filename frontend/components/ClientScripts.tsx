"use client";

import { useEffect } from "react";

export default function ClientScripts() {
  useEffect(() => {
    /* ── 0. INIT THEME FROM STORAGE (before paint) ──────── */
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    /* ── 1. SCROLL-HIDE NAVBAR ───────────────────────────── */
    const header = document.getElementById("site-header");
    let lastY = 0;
    let ticking = false;

    function handleScrollNav() {
      if (!header) return;
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu && mobileMenu.classList.contains("open")) return;

      const currentY = window.scrollY;

      // Hide when scrolling DOWN past 80px; reveal on scroll UP or near top
      if (currentY > lastY && currentY > 80) {
        header.classList.add("nav-hidden");
      } else if (currentY < lastY || currentY <= 20) {
        header.classList.remove("nav-hidden");
      }

      lastY = currentY <= 0 ? 0 : currentY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(handleScrollNav);
        ticking = true;
      }
    }

    handleScrollNav();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── 2. SCROLL-REVEAL ───────────────────────────────── */
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));

    /* ── 3. SMOOTH ANCHOR SCROLL ────────────────────────── */
    // Note: the mobile menu is fully React-controlled in FloatingNavbar (its
    // own useState + per-link onClick that closes it) — no imperative
    // hamburger wiring here, or the two fight over the `.open` class.
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 60;
        const top = el.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
    document.addEventListener("click", handleAnchorClick);

    /* ── 4. DEEP-LINK ON LOAD (e.g. arriving at /#registration) ── */
    if (window.location.hash && window.location.hash.length > 1) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        // let layout settle, then scroll with the sticky-header offset
        setTimeout(() => {
          const headerH = header ? header.offsetHeight : 60;
          const top = el.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
          window.scrollTo({ top, behavior: "auto" });
        }, 60);
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", handleAnchorClick);
      io.disconnect();
    };
  }, []);

  return null;
}
