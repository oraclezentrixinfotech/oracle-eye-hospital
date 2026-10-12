"use client";
import { useEffect, useRef } from "react";

// An illustrated eye whose iris follows the cursor / finger. Pure SVG, no libraries.
export default function EyeHero() {
  const svgRef = useRef(null);
  const irisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const MAX = 34; // how far the iris can travel (SVG units)

    const move = (e) => {
      const svg = svgRef.current;
      const iris = irisRef.current;
      if (!svg || !iris) return;
      const r = svg.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(dist / 300, 1) * MAX; // eases in as the cursor gets closer
      iris.style.transform = `translate(${(dx / dist) * k}px, ${(dy / dist) * k * 0.55}px)`;
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // iris fibres: thin lines radiating from the pupil
  const fibres = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={200 + Math.cos(a) * 34}
        y1={150 + Math.sin(a) * 34}
        x2={200 + Math.cos(a) * 76}
        y2={150 + Math.sin(a) * 76}
        stroke={i % 3 === 0 ? "#0E5F6B" : "#7CC4CE"}
        strokeWidth={i % 3 === 0 ? 1.4 : 0.8}
        opacity="0.65"
      />
    );
  });

  return (
    <svg ref={svgRef} viewBox="0 0 400 300" role="img" aria-label="Illustration of an eye" className="h-auto w-full">
      <defs>
        <clipPath id="eyeClip">
          <path d="M14 150C90 28 310 28 386 150 310 272 90 272 14 150Z" />
        </clipPath>
        <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1B9AAB" />
          <stop offset="70%" stopColor="#137C8B" />
          <stop offset="100%" stopColor="#0A4650" />
        </radialGradient>
      </defs>

      <g className="blink">
        {/* white of the eye */}
        <path d="M14 150C90 28 310 28 386 150 310 272 90 272 14 150Z" fill="#FFFFFF" stroke="#0A2A33" strokeWidth="3" />
        <g clipPath="url(#eyeClip)">
          {/* soft shading under the upper lid */}
          <path d="M0 0H400V110C300 70 100 70 0 110Z" fill="#0A2A33" opacity="0.07" />
          <g ref={irisRef} style={{ transition: "transform 120ms ease-out" }}>
            <circle cx="200" cy="150" r="80" fill="url(#irisGrad)" />
            <circle cx="200" cy="150" r="80" fill="none" stroke="#0A2A33" strokeWidth="3" />
            {fibres}
            <circle cx="200" cy="150" r="32" fill="#0A2A33" />
            <circle cx="214" cy="136" r="9" fill="#FFFFFF" opacity="0.9" />
            <circle cx="187" cy="165" r="4" fill="#FFFFFF" opacity="0.5" />
          </g>
        </g>
      </g>
    </svg>
  );
}
