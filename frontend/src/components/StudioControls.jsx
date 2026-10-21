import React, { useState, useEffect } from 'react';

/**
 * StudioControls
 * - 12-Column Engineered Grid (Toggle with key "G")
 * - Subtle Studio Cursor (Desktop Only)
 */
export default function StudioControls() {
  const [showGrid, setShowGrid] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');

  // Keyboard shortcut 'G' to toggle visible 12-column hairline grid
  useEffect(() => {
    function handleKeyDown(e) {
      // Don't trigger if typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'g' || e.key === 'G') {
        setShowGrid((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle desktop cursor tracking
  useEffect(() => {
    // Only initialize on devices with mouse pointer
    if (window.matchMedia('(hover: none)').matches) return;

    function handleMouseMove(e) {
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive target
      const target = e.target.closest('button, a, [role="button"], input, select, textarea');
      if (target) {
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
          setCursorHovered(true);
          setCursorLabel(target.getAttribute('data-cursor') || '');
        } else {
          setCursorHovered(false);
          setCursorLabel('');
        }
      } else {
        setCursorHovered(false);
        setCursorLabel('');
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* 12-Column Engineered Grid Hairlines */}
      {showGrid && (
        <div className="studio-grid-overlay" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="relative flex justify-between">
              <span className="font-mono text-[9px] text-[var(--color-signal)] opacity-40 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Studio Cursor Ring & Center Dot (Desktop only) */}
      <div
        className="studio-cursor-dot fixed top-0 left-0 pointer-events-none hidden md:block z-[100000]"
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`
        }}
      />
      <div
        className={`studio-cursor-ring fixed top-0 left-0 pointer-events-none hidden md:flex items-center justify-center z-[99999] ${
          cursorHovered ? 'cursor-active' : ''
        }`}
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`
        }}
      >
        {cursorLabel && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-signal)] select-none pointer-events-none">
            {cursorLabel}
          </span>
        )}
      </div>
    </>
  );
}
