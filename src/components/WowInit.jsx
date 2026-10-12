"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function WowInit() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({
        duration: 800,
        once: true, // run animation only once
        offset: 50,
      });
      
      // Refresh AOS after a short delay on route changes to ensure DOM is ready
      setTimeout(() => {
        AOS.refresh();
      }, 150);
    }
  }, [pathname]);

  return null;
}



