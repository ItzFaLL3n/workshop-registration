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

    /* ── 2. MOBILE HAMBURGER TOGGLE ─────────────────────── */
    const hamburger = document.getElementById("hamburger-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    function toggleMenu() {
      if (!hamburger || !mobileMenu) return;
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      const spans = hamburger.querySelectorAll("span");
      if (isOpen) {
        (spans[0] as HTMLElement).style.transform = "translateY(6.5px) rotate(45deg)";
        (spans[1] as HTMLElement).style.opacity = "0";
        (spans[2] as HTMLElement).style.transform = "translateY(-6.5px) rotate(-45deg)";
      } else {
        spans.forEach((s) => {
          (s as HTMLElement).style.transform = "";
          (s as HTMLElement).style.opacity = "";
        });
      }
    }

    function closeMenu() {
      if (!hamburger || !mobileMenu) return;
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.querySelectorAll("span").forEach((s) => {
        (s as HTMLElement).style.transform = "";
        (s as HTMLElement).style.opacity = "";
      });
    }

    hamburger?.addEventListener("click", toggleMenu);
    mobileMenu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    /* ── 3. SCROLL-REVEAL ───────────────────────────────── */
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

    /* ── 4. SMOOTH ANCHOR SCROLL ────────────────────────── */
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
        closeMenu();
      }
    }
    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      hamburger?.removeEventListener("click", toggleMenu);
      document.removeEventListener("click", handleAnchorClick);
      io.disconnect();
    };
  }, []);

  return null;
}
