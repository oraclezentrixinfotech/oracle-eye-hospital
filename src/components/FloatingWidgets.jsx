"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ChatbotWidget from "./ChatbotWidget";

export default function FloatingWidgets({ settings = {} }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Modern Healthcare Chatbot Widget */}
      <ChatbotWidget settings={settings} />

      {/* Side Get Appointment Tab */}
      <div className="SideOption">
        <Link className="ApplicationWidget_btn" href="/appointment">
          Get Appointment
        </Link>
      </div>

      {/* Scroll to Top */}
      <button
        className={`scroltop ${showScrollTop ? "show" : ""}`}
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{ display: showScrollTop ? "inline-block" : "none" }}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
}
