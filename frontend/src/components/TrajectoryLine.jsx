import React, { useState, useEffect } from 'react';

/**
 * TrajectoryLine
 * Thin 1.5px SVG flight path travelling down the page driven by scroll position.
 * Features a flat geometric rocket mark riding the leading edge in Signal (#7C83FF) + Spark (#F06BAA).
 */
export default function TrajectoryLine({ activeSection = 0 }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = window.scrollY / totalHeight;
        setScrollProgress(Math.min(Math.max(current, 0), 1));
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute rocket vertical position
  const rocketTopPercent = Math.min(Math.max(scrollProgress * 92 + 4, 4), 96);

  return (
    <div
      className="hidden lg:block absolute left-4 xl:left-8 top-32 bottom-32 w-10 pointer-events-none z-20 select-none"
      aria-hidden="true"
    >
      {/* 1.5px Vertical Trajectory Guide Line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1.5px] bg-[var(--color-line)]">
        {/* Dynamic Drawn Path in Signal Accent */}
        <div
          className="w-full bg-[var(--color-signal)] transition-all duration-75 ease-out"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Flat Geometric Rocket Mark Riding The Leading Edge */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-transform duration-100 ease-out"
        style={{ top: `${rocketTopPercent}%` }}
      >
        <div className="relative -translate-y-1/2 flex flex-col items-center">
          {/* Rocket SVG Mark (Flat, Signal with single Spark exhaust dot) */}
          <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Fuselage & Nose */}
            <path
              d="M9 1C12.5 5 13.5 10 13.5 15H4.5C4.5 10 5.5 5 9 1Z"
              fill="var(--color-signal)"
            />
            {/* Left Delta Fin */}
            <path d="M4.5 12L1 17H4.5V12Z" fill="var(--color-signal)" />
            {/* Right Delta Fin */}
            <path d="M13.5 12L17 17H13.5V12Z" fill="var(--color-signal)" />
            {/* Center Engine Body */}
            <rect x="7" y="15" width="4" height="2" fill="var(--color-surface-2)" />
            {/* Single Spark Exhaust Dot (Rare Accent Highlight) */}
            <circle cx="9" cy="19.5" r="1.5" fill="var(--color-spark)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
