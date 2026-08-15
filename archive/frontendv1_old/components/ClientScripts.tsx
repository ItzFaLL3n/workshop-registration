"use client";

import { useEffect } from "react";

export default function ClientScripts() {
  useEffect(() => {
    /* ---- STICKY HEADER SHADOW ---- */
    const header = document.getElementById("site-header") as HTMLElement;
    function onScrollHeader() {
      header?.classList.toggle("scrolled", window.scrollY > 12);
    }
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    /* ---- HAMBURGER MENU ---- */
    const hamburger = document.getElementById("hamburger") as HTMLButtonElement;
    const mobileNav = document.getElementById("mobile-nav") as HTMLElement;

    function closeMobileNav() {
      hamburger?.classList.remove("open");
      hamburger?.setAttribute("aria-expanded", "false");
      mobileNav?.classList.remove("open");
    }

    hamburger?.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      mobileNav?.classList.toggle("open", isOpen);
    });

    mobileNav?.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });

    /* ---- SMOOTH SCROLL ---- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (!href) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = header?.offsetHeight ?? 0;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - (headerH - 1);
        window.scrollTo({ top, behavior: "smooth" });
        closeMobileNav();
      });
    });

    const scrollCue = document.getElementById("scroll-cue");
    scrollCue?.addEventListener("click", () => {
      document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" });
    });

    /* ---- ACTIVE NAV ON SCROLL ---- */
    const sections = ["home", "registration", "instructions", "tutorial"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    function setActiveNav(id: string) {
      document.querySelectorAll(".nav-link").forEach((l) =>
        l.classList.toggle("active", (l as HTMLElement).dataset.nav === id)
      );
      document.querySelectorAll(".mobile-link").forEach((l) =>
        l.classList.toggle("active", (l as HTMLElement).dataset.nav === id)
      );
    }

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      {
        rootMargin: `-${(header?.offsetHeight ?? 0) + 20}px 0px -60% 0px`,
        threshold: 0.1,
      }
    );
    sections.forEach((s) => navObserver.observe(s));

    /* ---- SCROLL REVEAL ---- */
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    /* ---- BACK TO TOP ---- */
    const backToTop = document.getElementById("back-to-top");
    function onScrollTop() {
      backToTop?.classList.toggle("visible", window.scrollY > 480);
    }
    window.addEventListener("scroll", onScrollTop, { passive: true });
    backToTop?.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

    /* ---- HERO CANVAS ---- */
    const canvas = document.getElementById("agent-canvas") as HTMLCanvasElement | null;
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d")!;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
      let width = 0, height = 0, dpr = 1;
      let rafId: number;

      function resize() {
        const rect = canvas!.parentElement!.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        canvas!.width = width * dpr;
        canvas!.height = height * dpr;
        canvas!.style.width = width + "px";
        canvas!.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParticles();
      }

      function initParticles() {
        const count = Math.max(24, Math.min(60, Math.floor((width * height) / 26000)));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.8,
        }));
      }

      function step() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 140;
            if (dist < maxDist) {
              ctx.strokeStyle = `rgba(31,168,99,${(1 - dist / maxDist) * 0.16})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        particles.forEach((p) => {
          ctx.fillStyle = "rgba(20,108,67,0.35)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        if (!prefersReducedMotion) rafId = requestAnimationFrame(step);
      }

      resize();
      window.addEventListener("resize", resize);
      step();

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
      };
    }

    return () => {
      window.removeEventListener("scroll", onScrollHeader);
      window.removeEventListener("scroll", onScrollTop);
      navObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  return null;
}
