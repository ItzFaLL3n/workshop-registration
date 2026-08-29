"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface FloatingNavbarProps {
  currentPath?: string;
}

export default function FloatingNavbar({ currentPath = "/" }: FloatingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isInstallPage = currentPath.startsWith("/install");
  const isLivePage = currentPath.startsWith("/live");

  const overviewHref = isInstallPage ? "/#overview" : "#overview";
  const registrationHref = isInstallPage ? "/#registration" : "#registration";

  return (
    <header className="site-header" id="site-header">
      <div className="header-inner">
        {/* Brand */}
        <Link href="/" className="brand-wrapper" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-logos-container">
            <div className="logo-img-wrap">
              <Image
                src="/college-logo.png"
                alt="Sacred Heart College logo"
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div className="logo-img-wrap">
              <Image
                src="/department-logo.png"
                alt="Department of Computer Applications (BCA) logo"
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
          <div className="brand-info">
            <span className="brand-title">Sacred Heart College</span>
            <span className="brand-sub">Dept. of Computer Applications (BCA)</span>
          </div>
        </Link>

        {/* Right Section: Nav items + Theme Switcher + CTA */}
        <div className="header-right-group">
          {/* Desktop nav links */}
          <nav className="main-nav" aria-label="Main Navigation">
            <a
              href={overviewHref}
              className={`nav-link${!isInstallPage ? " active" : ""}`}
            >
              Overview
            </a>
            <Link
              href="/install"
              className={`nav-link${isInstallPage ? " active" : ""}`}
            >
              Setup Guide
            </Link>
            <Link
              href="/live"
              className={`nav-link${isLivePage ? " active" : ""}`}
            >
              Live
            </Link>
            <a
              href={registrationHref}
              className="nav-link"
            >
              Registration
            </a>
          </nav>

          {/* Dark / Light Mode Switcher */}
          <div className="desktop-toggle">
            <ThemeToggle />
          </div>

          {/* Desktop CTA */}
          <a href={registrationHref} className="nav-cta desktop-cta">
            Register
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Mobile hamburger button */}
          <button
            className="nav-hamburger"
            aria-label="Open navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            id="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span style={mobileMenuOpen ? { transform: "translateY(6.5px) rotate(45deg)" } : {}} />
            <span style={mobileMenuOpen ? { opacity: 0 } : {}} />
            <span style={mobileMenuOpen ? { transform: "translateY(-6.5px) rotate(-45deg)" } : {}} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}
        id="mobile-menu"
        aria-label="Mobile Navigation"
      >
        <a
          href={overviewHref}
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Overview
        </a>
        <Link
          href="/install"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Setup Guide
        </Link>
        <Link
          href="/live"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Live
        </Link>
        <a
          href={registrationHref}
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Registration
        </a>
        <div style={{ padding: "6px 10px 2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--ink-4)", fontWeight: 500 }}>Theme</span>
          <ThemeToggle />
        </div>
        <a
          href={registrationHref}
          className="nav-cta"
          style={{ marginTop: 8, textAlign: "center", justifyContent: "center" }}
          onClick={() => setMobileMenuOpen(false)}
        >
          Register Now
        </a>
      </div>
    </header>
  );
}
