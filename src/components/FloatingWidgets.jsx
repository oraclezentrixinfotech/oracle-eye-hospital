"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function FloatingWidgets({ settings = {} }) {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatAnimated, setChatAnimated] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showIncoming, setShowIncoming] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const hasBeenOpenedRef = useRef(false);

  const whatsappRaw = settings?.whatsapp || "918006803111";
  const whatsappNum = String(whatsappRaw).replace(/\D/g, "") || "918006803111";

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    // Auto open after 3 seconds
    const autoTimer = setTimeout(() => {
      if (!hasBeenOpenedRef.current) {
        openChat();
      }
    }, 3000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(autoTimer);
    };
  }, []);

  const openChat = () => {
    hasBeenOpenedRef.current = true;
    setChatVisible(true);
    setTimeout(() => {
      setChatAnimated(true);
    }, 50);

    setTimeout(() => {
      setShowTyping(true);
    }, 1000);

    setTimeout(() => {
      setShowTyping(false);
      setShowIncoming(true);
    }, 3000);
  };

  const closeChat = () => {
    setChatAnimated(false);
    setTimeout(() => {
      setChatVisible(false);
    }, 500);
  };

  const handleWhatsAppRedirect = () => {
    window.open(
      `https://api.whatsapp.com/send/?phone=${whatsappNum}&text&type=phone_number&app_absent=0`,
      "_blank"
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Chat Header */}
      <div
        className="chat-header"
        id="chat-header"
        style={{
          display: chatVisible ? "flex" : "none",
          opacity: chatAnimated ? 1 : 0,
          transform: chatAnimated ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="avatar-container">
          <img src="/Assets/img/clients-5.jpg" alt="Support" />
          <div className="online-dot"></div>
        </div>
        <div className="chat-header-info">
          <h1 style={{ transform: "translateY(2px)", color: "#fff" }}>Customer Service</h1>
          <div style={{ color: "#eeeeee" }}>online</div>
        </div>
        <button className="close-btn" id="close-btn" onClick={closeChat}>
          &times;
        </button>
      </div>

      {/* Chat Content */}
      <div
        className="chat-content"
        id="chat-content"
        style={{
          display: chatVisible ? "block" : "none",
          opacity: chatAnimated ? 1 : 0,
          transform: chatAnimated ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {showTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {showIncoming && (
          <div className="message received">
            Hello, I want to book an eye check-up appointment at Oracle Eye Hospital. Please share the available slots.
          </div>
        )}
      </div>

      {/* Message Input with WhatsApp Button */}
      <div
        className="message-input"
        id="message-input"
        style={{
          display: chatVisible ? "flex" : "none",
          opacity: chatAnimated ? 1 : 0,
          transform: chatAnimated ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <button className="whatsapp-btn" id="whatsapp-btn" onClick={handleWhatsAppRedirect}>
          Chat in WhatsApp
        </button>
      </div>

      {/* Chat Launcher Icon */}
      <div
        className="chat-icon"
        id="chat-icon"
        onClick={openChat}
        style={{
          display: !chatVisible ? "flex" : "none",
          cursor: "pointer",
        }}
      >
        <img src="/Assets/img/whatsapp_icon.webp" alt="WhatsApp" />
      </div>

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
