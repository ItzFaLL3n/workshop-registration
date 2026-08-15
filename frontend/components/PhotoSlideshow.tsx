"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  title: string;
  caption?: string;
}

const SLIDES: Slide[] = [
  {
    src: "/photos/workshop-1.jpg",
    title: "Hands-on Technical Sessions",
    caption: "Students collaborating on practical exercises and live agent workflows",
  },
  {
    src: "/photos/workshop-2.jpg",
    title: "Interactive Lab Environment",
    caption: "Step-by-step experimentation and coding with modern tools",
  },
  {
    src: "/photos/workshop-3.jpg",
    title: "Knowledge Sharing & Discussions",
    caption: "Faculty and student interactions exploring real-world AI applications",
  },
  {
    src: "/photos/workshop-4.jpg",
    title: "Team Problem Solving",
    caption: "Cross-department teams tackling challenges and building solutions",
  },
  {
    src: "/photos/workshop-5.jpg",
    title: "Engaged Learning Atmosphere",
    caption: "A vibrant room full of curious minds exploring cutting-edge technology",
  },
  {
    src: "/photos/workshop-6.jpg",
    title: "Peer Collaboration & Brainstorming",
    caption: "Exchanging ideas, debugging code, and sharing project insights",
  },
  {
    src: "/photos/workshop-7.jpg",
    title: "Moments of Achievement",
    caption: "Celebrating teamwork, successful builds, and collective milestones",
  },
];

const AUTOPLAY_MS = 4500;

export default function PhotoSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const go = useCallback(
    (idx: number) => setCurrent((idx + SLIDES.length) % SLIDES.length),
    []
  );
  const prev = useCallback(() => { setIsPaused(true); go(current - 1); }, [current, go]);
  const next = useCallback(() => { setIsPaused(true); go(current + 1); }, [current, go]);

  /* Auto-advance */
  useEffect(() => {
    if (isPaused) {
      const resume = setTimeout(() => setIsPaused(false), 6000);
      return () => clearTimeout(resume);
    }
    const id = setInterval(() => go(current + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [current, isPaused, go]);

  /* Keyboard nav */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <section className="slideshow-section" id="gallery">
      <div className="slideshow-wrap">
        {/* Header */}
        <div className="section-head" style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">From the Archives</span>
          <h2 className="section-title">Moments from Past Workshops</h2>
          <p className="section-desc">
            A glimpse into the energy, collaboration, and learning from previous editions.
          </p>
        </div>

        {/* Stage */}
        <div
          className="slideshow-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-roledescription="carousel"
          aria-label="Workshop photo gallery"
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`slide${i === current ? " active" : ""}`}
              aria-hidden={i !== current}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                sizes="(max-width: 768px) 100vw, 1240px"
                style={{ objectFit: "cover" }}
                priority={i === 0}
              />

              {/* Caption overlay */}
              <div className="slide-caption">
                <div className="slide-caption-title">{slide.title}</div>
                {slide.caption && (
                  <div className="slide-caption-sub">{slide.caption}</div>
                )}
              </div>
            </div>
          ))}

          {/* Prev / Next */}
          <button className="slide-btn prev" onClick={prev} aria-label="Previous photo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="slide-btn next" onClick={next} aria-label="Next photo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="slideshow-dots" role="tablist" aria-label="Slide indicators">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`slide-dot${i === current ? " active" : ""}`}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => { setIsPaused(true); go(i); }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
