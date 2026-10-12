"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AosAnimationProvider() {
  const pathname = usePathname();

  useEffect(() => {
    let observer = null;

    const initAnimations = () => {
      const animElements = document.querySelectorAll(".wow, [data-aos]");
      if (!animElements.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;

              const delay =
                el.getAttribute("data-wow-delay") ||
                el.getAttribute("data-aos-delay") ||
                "0s";
              const duration =
                el.getAttribute("data-wow-duration") ||
                el.getAttribute("data-aos-duration") ||
                "0.8s";

              el.style.animationDelay = delay;
              el.style.animationDuration = duration;
              el.style.visibility = "visible";
              el.classList.add("animated");

              const aosType = el.getAttribute("data-aos");
              if (aosType) {
                if (aosType === "fade-up") el.classList.add("fadeInUp");
                else if (aosType === "fade-down") el.classList.add("fadeInDown");
                else if (aosType === "fade-left") el.classList.add("fadeInLeft");
                else if (aosType === "fade-right") el.classList.add("fadeInRight");
                else if (aosType === "zoom-in") el.classList.add("zoomIn");
                else el.classList.add("fadeIn");
              }

              observer.unobserve(el);
            }
          });
        },
        {
          rootMargin: "0px 0px -20px 0px",
          threshold: 0.05,
        }
      );

      animElements.forEach((el) => {
        // Always ensure element is visible so content never disappears
        el.style.visibility = "visible";
        if (!el.classList.contains("animated")) {
          observer.observe(el);
        }
      });
    };

    const timer = setTimeout(initAnimations, 50);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}
