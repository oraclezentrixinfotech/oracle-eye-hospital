"use client";
import { useEffect, useRef } from "react";

function formatNumberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AnimatedCounter({ end, duration = 2500, formatComma = true }) {
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            let startTime = null;

            const animate = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const elapsed = timestamp - startTime;
              const progress = Math.min(elapsed / duration, 1);

              const current = Math.floor(progress * end);

              if (ref.current) {
                ref.current.innerText = formatComma ? formatNumberWithCommas(current) : current.toString();
              }

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                if (ref.current) {
                  ref.current.innerText = formatComma ? formatNumberWithCommas(end) : end.toString();
                }
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [end, duration, formatComma]);

  return (
    <span ref={ref} className="counter">
      0
    </span>
  );
}
