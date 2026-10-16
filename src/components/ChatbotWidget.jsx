"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Minimize2,
  Calendar,
  Eye,
  Stethoscope,
  Clock,
  MapPin,
  Phone,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronRight,
  ExternalLink,
  Bot,
  User,
  ShieldCheck,
} from "lucide-react";
import { SITE, SERVICES, DOCTORS } from "@/lib/content";

// Primary Services available for quick selection in appointment flow
const APPOINTMENT_SERVICES = [
  "Cataract Surgery (Phaco & MICS)",
  "Cornea & LASIK (Vision Correction)",
  "Glaucoma Screening & Care",
  "Computer Vision Syndrome & Dry Eyes",
  "Retina & Diabetic Eye Care",
  "General Eye Checkup",
];

const TIME_SLOTS = [
  "Morning (10:00 AM – 01:00 PM)",
  "Afternoon (01:00 PM – 05:00 PM)",
  "Evening (05:00 PM – 08:00 PM)",
];

export default function ChatbotWidget({ settings = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [showLauncherTooltip, setShowLauncherTooltip] = useState(false);

  // Guided Appointment State
  const [appointmentState, setAppointmentState] = useState({
    active: false,
    step: "service", // "service" | "date" | "time" | "contact" | "confirm"
    service: "",
    date: "",
    timeSlot: "",
    name: "",
    phone: "",
    notes: "",
    isSubmitting: false,
    errorMessage: "",
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const hasAutoOpenedRef = useRef(false);

  // Settings with content.js fallbacks
  const whatsappRaw = settings?.whatsapp || SITE.whatsapp || "918006803111";
  const whatsappNum = String(whatsappRaw).replace(/\D/g, "") || "918006803111";
  const hospitalPhone = settings?.phone || SITE.helpline || "+91 8006803111";
  const workingHours = settings?.working_hours || SITE.hours || "Mon – Sat, 10:00 AM – 8:00 PM";
  const hospitalAddress = settings?.address || SITE.address || "491, Hi-Street, Near TDI City, Parampara, MDA, Moradabad, Uttar Pradesh 244001, India";
  const mapUrl = SITE.mapUrl || "https://maps.google.com";

  // Initial Welcome Message
  useEffect(() => {
    const initialMessages = [
      {
        id: "msg-welcome-1",
        sender: "bot",
        text: "Welcome to Oracle Eye Hospital! 👋",
        type: "welcome_intro",
        time: getFormattedTime(),
      },
      {
        id: "msg-welcome-2",
        sender: "bot",
        text: "I am your patient care assistant. How can we help you today? You can choose a quick topic below or type your question about our services, doctors, timings, or appointments.",
        type: "welcome_actions",
        time: getFormattedTime(),
      },
    ];
    setMessages(initialMessages);

    // Auto-prompt launcher tooltip after 2.5 seconds
    const tooltipTimer = setTimeout(() => {
      if (!isOpen) setShowLauncherTooltip(true);
    }, 2500);

    // Auto open gently after 5 seconds if not yet opened
    const autoOpenTimer = setTimeout(() => {
      if (!hasAutoOpenedRef.current && !isOpen) {
        hasAutoOpenedRef.current = true;
        setIsOpen(true);
        setUnreadCount(0);
        setShowLauncherTooltip(false);
      }
    }, 5000);

    return () => {
      clearTimeout(tooltipTimer);
      clearTimeout(autoOpenTimer);
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isMinimized, appointmentState]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
      setShowLauncherTooltip(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function getFormattedTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Handle WhatsApp redirect
  const handleWhatsAppRedirect = (customText = "") => {
    const textParam = encodeURIComponent(
      customText || "Hello Oracle Eye Hospital, I would like to inquire about eye care services."
    );
    window.open(
      `https://api.whatsapp.com/send/?phone=${whatsappNum}&text=${textParam}&type=phone_number&app_absent=0`,
      "_blank"
    );
  };

  // Bot response simulator with typing effect
  const botReply = (text, type = "text", customProps = {}) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          sender: "bot",
          text,
          type,
          time: getFormattedTime(),
          ...customProps,
        },
      ]);
    }, 600);
  };

  // Add User Message
  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        sender: "user",
        text,
        time: getFormattedTime(),
      },
    ]);
  };

  // Reset/Restart Conversation
  const handleResetChat = () => {
    setAppointmentState({
      active: false,
      step: "service",
      service: "",
      date: "",
      timeSlot: "",
      name: "",
      phone: "",
      notes: "",
      isSubmitting: false,
      errorMessage: "",
    });
    setMessages([
      {
        id: `msg-${Date.now()}-1`,
        sender: "bot",
        text: "Conversation restarted. Welcome back to Oracle Eye Hospital! How may we assist you?",
        type: "welcome_actions",
        time: getFormattedTime(),
      },
    ]);
  };

  // Quick Action Click Handlers
  const handleQuickAction = (actionKey) => {
    switch (actionKey) {
      case "book_appointment":
        addUserMessage("Book an Appointment");
        startAppointmentFlow();
        break;

      case "services":
        addUserMessage("Eye Care Services");
        botReply(
          "Oracle Eye Hospital offers comprehensive, state-of-the-art ophthalmic care across specialized departments:",
          "services_list"
        );
        break;

      case "doctors":
        addUserMessage("Doctor Information");
        botReply(
          "Our clinical team consists of renowned ophthalmologists and ophthalmic surgeons committed to preserving your vision:",
          "doctors_list"
        );
        break;

      case "timings":
        addUserMessage("Hospital Timings");
        botReply(
          `🏥 **Hospital Timings & Availability**:\n\n` +
          `• **Monday to Saturday**: 10:00 AM – 08:00 PM\n` +
          `• **Sunday**: Emergency & pre-scheduled visits\n\n` +
          `📞 **Emergency Helpline**: ${hospitalPhone} (Available for urgent guidance)\n\n` +
          `Walk-in consultations are welcome, but we recommend booking an appointment to minimize waiting time.`,
          "text",
          {
            quickButtons: [
              { label: "📅 Book Appointment", action: "book_appointment" },
              { label: "📍 View Location", action: "location" },
            ],
          }
        );
        break;

      case "location":
        addUserMessage("Location & Directions");
        botReply(
          `📍 **Oracle Eye Hospital Address**:\n\n` +
          `${hospitalAddress}\n\n` +
          `🚗 **Landmark**: Near TDI City & Parampara, Hi-Street Commercial Hub, Moradabad.`,
          "location_card"
        );
        break;

      case "contact":
        addUserMessage("Talk to Our Team");
        botReply(
          `🤝 **Connect with Oracle Eye Hospital**:\n\n` +
          `• **Reception & Helpline**: ${hospitalPhone}\n` +
          `• **Alternate Phone**: +91 7500503111\n` +
          `• **Email**: ${SITE.email || "oracleeyehospital@gmail.com"}\n` +
          `• **WhatsApp**: Active for instant patient inquiries`,
          "contact_card"
        );
        break;

      default:
        break;
    }
  };

  // Start the Step-by-Step Appointment Flow
  const startAppointmentFlow = () => {
    setAppointmentState({
      active: true,
      step: "service",
      service: "",
      date: "",
      timeSlot: "",
      name: "",
      phone: "",
      notes: "",
      isSubmitting: false,
      errorMessage: "",
    });

    botReply(
      "Let's schedule your eye checkup in a few simple steps. First, please select the eye care service or specialty you need:",
      "appointment_service_select"
    );
  };

  // Appointment Step 1: Select Service
  const handleSelectService = (service) => {
    addUserMessage(service);
    setAppointmentState((prev) => ({
      ...prev,
      service,
      step: "date",
    }));

    botReply(
      `Great. You selected **${service}**. When would you prefer to visit Oracle Eye Hospital?`,
      "appointment_date_select",
      { selectedService: service }
    );
  };

  // Appointment Step 2: Select Date
  const handleSelectDate = (dateString, displayLabel) => {
    addUserMessage(displayLabel || dateString);
    setAppointmentState((prev) => ({
      ...prev,
      date: dateString,
      step: "time",
    }));

    botReply(
      `Noted: **${displayLabel || dateString}**. What time slot works best for you?`,
      "appointment_time_select"
    );
  };

  // Appointment Step 3: Select Time Slot
  const handleSelectTime = (timeSlot) => {
    addUserMessage(timeSlot);
    setAppointmentState((prev) => ({
      ...prev,
      timeSlot,
      step: "contact",
    }));

    botReply(
      `Almost done! Please provide your name and phone number so our hospital team can confirm your appointment.`,
      "appointment_contact_form"
    );
  };

  // Appointment Step 4: Submit Contact Details
  const handleAppointmentSubmit = async (e) => {
    if (e) e.preventDefault();

    const name = appointmentState.name.trim();
    const phone = appointmentState.phone.trim();

    if (!name || name.length < 2) {
      setAppointmentState((prev) => ({
        ...prev,
        errorMessage: "Please enter your full name (at least 2 letters).",
      }));
      return;
    }

    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setAppointmentState((prev) => ({
        ...prev,
        errorMessage: "Please enter a valid 10-digit mobile number.",
      }));
      return;
    }

    setAppointmentState((prev) => ({
      ...prev,
      isSubmitting: true,
      errorMessage: "",
    }));

    addUserMessage(`Patient: ${name}, Phone: ${phone}`);

    try {
      const payload = {
        name,
        phone,
        service: appointmentState.service || "General Eye Checkup",
        preferredDate: appointmentState.date || null,
        message: `Booked via Patient Support Chatbot (Time slot: ${appointmentState.timeSlot || "Flexible"})${
          appointmentState.notes ? ` - Note: ${appointmentState.notes}` : ""
        }`,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setAppointmentState((prev) => ({
          ...prev,
          isSubmitting: false,
          step: "success",
        }));

        botReply(
          `✅ **Appointment Request Received!**\n\n` +
          `Thank you, **${name}**! Your request for **${appointmentState.service}** has been registered.\n\n` +
          `📅 **Requested Date**: ${appointmentState.date || "Next Available"}\n` +
          `⏰ **Preferred Time**: ${appointmentState.timeSlot || "Flexible"}\n` +
          `📞 **Contact**: ${phone}\n\n` +
          `Our hospital reception team will call you shortly to confirm your exact appointment token.`,
          "appointment_success",
          {
            appointmentSummary: {
              name,
              phone,
              service: appointmentState.service,
              date: appointmentState.date,
              time: appointmentState.timeSlot,
            },
          }
        );
      } else {
        throw new Error(data.error || "Could not save your appointment request.");
      }
    } catch (err) {
      setAppointmentState((prev) => ({
        ...prev,
        isSubmitting: false,
        errorMessage: err.message || "Failed to submit appointment request.",
      }));

      botReply(
        `⚠️ We encountered an issue submitting your request online. Please contact our front desk directly at **${hospitalPhone}** or click below to speak directly with our reception.`,
        "appointment_error"
      );
    }
  };

  // Natural Query & Keyword Answering
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    addUserMessage(query);
    setInputVal("");

    const lower = query.toLowerCase();

    // 1. EMERGENCY TRIAGE & RED FLAGS (High priority healthcare safety)
    const isEmergency =
      lower.includes("emergency") ||
      lower.includes("severe pain") ||
      lower.includes("sudden loss") ||
      lower.includes("lost vision") ||
      lower.includes("blind") ||
      lower.includes("chemical") ||
      lower.includes("acid") ||
      lower.includes("blood") ||
      lower.includes("injury") ||
      lower.includes("trauma") ||
      lower.includes("foreign body") ||
      lower.includes("cut");

    if (isEmergency) {
      botReply(
        `🚨 **URGENT MEDICAL NOTICE**:\n\n` +
        `If you or someone nearby is experiencing **sudden vision loss, severe eye pain, chemical exposure, or traumatic ocular injury**, please seek IMMEDIATE in-person medical care.\n\n` +
        `⚠️ Do NOT delay for online chat responses.\n\n` +
        `Please call our emergency helpline immediately:\n` +
        `📞 **${hospitalPhone}**\n\n` +
        `Or proceed directly to **Oracle Eye Hospital Emergency Unit**, 491, Hi-Street, Moradabad.`,
        "emergency_alert"
      );
      return;
    }

    // 2. Appointment Booking
    if (
      lower.includes("appointment") ||
      lower.includes("book") ||
      lower.includes("consult") ||
      lower.includes("slot") ||
      lower.includes("schedule") ||
      lower.includes("checkup")
    ) {
      startAppointmentFlow();
      return;
    }

    // 3. Cataract Inquiries
    if (lower.includes("cataract") || lower.includes("motiyabind") || lower.includes("mics") || lower.includes("phaco")) {
      botReply(
        `👁️ **Cataract Care at Oracle Eye Hospital**:\n\n` +
        `Cataract is a clouding of the eye's natural crystalline lens. At Oracle Eye Hospital, Dr. Girjesh Kain and our surgical team perform advanced **Microincision Cataract Surgery (MICS)** with premium foldable intraocular lens (IOL) implants for rapid, painless visual recovery.\n\n` +
        `• Blade-free, sutureless microincision procedure\n` +
        `• Monofocal, Toric & Multifocal IOL options\n` +
        `• Day-care procedure with same-day return home\n\n` +
        `Would you like to schedule a cataract evaluation?`,
        "text",
        {
          quickButtons: [
            { label: "📅 Book Cataract Consultation", action: "book_appointment" },
            { label: "📖 Learn More About Cataract", link: "/services/cataract" },
          ],
        }
      );
      return;
    }

    // 4. LASIK & Vision Correction
    if (
      lower.includes("lasik") ||
      lower.includes("specs") ||
      lower.includes("glasses") ||
      lower.includes("spectacle") ||
      lower.includes("laser") ||
      lower.includes("refractive") ||
      lower.includes("contoura") ||
      lower.includes("prk")
    ) {
      botReply(
        `✨ **LASIK & Laser Vision Correction**:\n\n` +
        `Looking to get rid of glasses or contact lenses? Oracle Eye Hospital provides comprehensive corneal topography and precision laser refractive evaluation to determine your eligibility for LASIK.\n\n` +
        `• Quick, painless corneal laser treatment\n` +
        `• Thorough suitability screening by corneal specialists\n` +
        `• Safe and proven outcomes for myopia, hyperopia, and astigmatism\n\n` +
        `Would you like to check your suitability with an eye checkup?`,
        "text",
        {
          quickButtons: [
            { label: "📅 Book LASIK Consultation", action: "book_appointment" },
            { label: "📖 Cornea & Refractive Care", link: "/services/cornea-refractive" },
          ],
        }
      );
      return;
    }

    // 5. Glaucoma Inquiries
    if (lower.includes("glaucoma") || lower.includes("kala motia") || lower.includes("pressure") || lower.includes("iop")) {
      botReply(
        `🩺 **Glaucoma Management & Surgery**:\n\n` +
        `Glaucoma (often called the silent thief of sight) damages the optic nerve due to increased intraocular pressure. Early detection is vital to prevent irreversible vision loss.\n\n` +
        `Under **Dr. Ramesh Kumar Shukla** (Glaucoma Surgeon), we provide:\n` +
        `• Advanced applanation tonometry & pachymetry\n` +
        `• Visual field analysis & OCT optic nerve head scanning\n` +
        `• Medical, laser, and surgical filtration management`,
        "text",
        {
          quickButtons: [
            { label: "📅 Schedule Glaucoma Screening", action: "book_appointment" },
            { label: "👨‍⚕️ View Doctor Profile", link: "/doctor-team" },
          ],
        }
      );
      return;
    }

    // 6. Computer Vision Syndrome / Dry Eyes
    if (
      lower.includes("screen") ||
      lower.includes("computer") ||
      lower.includes("dry eye") ||
      lower.includes("strain") ||
      lower.includes("headache") ||
      lower.includes("tired eyes")
    ) {
      botReply(
        `💻 **Computer Vision Syndrome & Digital Eye Strain**:\n\n` +
        `Extended screen time causes reduced blink rates, dry eyes, eye fatigue, and headaches.\n\n` +
        `💡 **Quick Ergonomic Tips**:\n` +
        `• **Follow the 20-20-20 Rule**: Every 20 minutes, look at something 20 feet away for 20 seconds.\n` +
        `• Position screens 20–28 inches away, slightly below eye level.\n` +
        `• Use lubricating drops prescribed by an ophthalmologist.\n\n` +
        `Visit us for tear-film evaluation and specialized computer glasses prescription.`,
        "text",
        {
          quickButtons: [
            { label: "📅 Book Eye Strain Checkup", action: "book_appointment" },
            { label: "📖 Computer Vision Details", link: "/services/computer-vision-syndrome" },
          ],
        }
      );
      return;
    }

    // 7. Retina & Diabetes
    if (lower.includes("retina") || lower.includes("diabet") || lower.includes("floater") || lower.includes("flash")) {
      botReply(
        `👁️ **Retina & Diabetic Eye Care**:\n\n` +
        `Diabetes can damage retinal blood vessels (diabetic retinopathy) without early symptoms. Annual dilated retinal examinations are critical for all diabetic patients.\n\n` +
        `If you notice sudden floaters, flashes of light, or a curtain-like shadow, seek immediate ophthalmic evaluation.`,
        "text",
        {
          quickButtons: [
            { label: "📅 Book Retinal Examination", action: "book_appointment" },
            { label: "📞 Call Helpline", action: "contact" },
          ],
        }
      );
      return;
    }

    // 8. Doctors & Specialists
    if (
      lower.includes("doctor") ||
      lower.includes("specialist") ||
      lower.includes("surgeon") ||
      lower.includes("girjesh") ||
      lower.includes("kain") ||
      lower.includes("ramesh") ||
      lower.includes("rachana") ||
      lower.includes("sujata") ||
      lower.includes("qualification")
    ) {
      botReply(
        `👨‍⚕️ **Doctors at Oracle Eye Hospital**:\n\n` +
        `• **Dr. Girjesh Kain** – Founder & Managing Director (MS Ophthalmology, FICO)\n` +
        `• **Dr. Ramesh Kumar Shukla** – Glaucoma Surgeon\n` +
        `• **Dr. Rachana** – Ophthalmologist (MBBS, MS)\n` +
        `• **Dr. Sujata Tomar** – Ophthalmologist\n\n` +
        `Would you like to book a consultation with our medical team?`,
        "doctors_list"
      );
      return;
    }

    // 9. Timings & Hours
    if (
      lower.includes("timing") ||
      lower.includes("time") ||
      lower.includes("hour") ||
      lower.includes("open") ||
      lower.includes("close") ||
      lower.includes("sunday") ||
      lower.includes("holiday")
    ) {
      handleQuickAction("timings");
      return;
    }

    // 10. Location / Address / Directions
    if (
      lower.includes("location") ||
      lower.includes("address") ||
      lower.includes("where") ||
      lower.includes("reach") ||
      lower.includes("direction") ||
      lower.includes("map") ||
      lower.includes("moradabad") ||
      lower.includes("tdi")
    ) {
      handleQuickAction("location");
      return;
    }

    // 11. Cost / Price / Fees
    if (
      lower.includes("cost") ||
      lower.includes("price") ||
      lower.includes("fee") ||
      lower.includes("charge") ||
      lower.includes("rate") ||
      lower.includes("how much")
    ) {
      botReply(
        `💳 **Consultation & Treatment Charges**:\n\n` +
        `At Oracle Eye Hospital, we maintain transparent, patient-first pricing:\n\n` +
        `• General OPD consultations are nominal.\n` +
        `• Surgical costs (such as cataract lenses or LASIK) depend on the diagnostic assessment and lens choice tailored to your lifestyle.\n` +
        `• We also offer **Cashless Mediclaim & TPA facilities** for insured patients.\n\n` +
        `Please contact our front desk at **${hospitalPhone}** for a transparent estimate or schedule a comprehensive checkup.`,
        "text",
        {
          quickButtons: [
            { label: "📅 Book Initial Checkup", action: "book_appointment" },
            { label: "💳 Cashless Insurance Info", link: "/cashless-facility" },
          ],
        }
      );
      return;
    }

    // 12. Cashless / Insurance / TPA
    if (
      lower.includes("cashless") ||
      lower.includes("insurance") ||
      lower.includes("tpa") ||
      lower.includes("mediclaim") ||
      lower.includes("ayushman") ||
      lower.includes("panel")
    ) {
      botReply(
        `💳 **Cashless Hospitalization Facility**:\n\n` +
        `Oracle Eye Hospital is empaneled with major Third-Party Administrators (TPAs) and leading private health insurance companies for hassle-free cashless hospitalization.\n\n` +
        `Our dedicated TPA desk assists with pre-authorization, approvals, and documentation for cataract, glaucoma, and ocular surgeries.`,
        "text",
        {
          quickButtons: [
            { label: "📖 View Cashless Facility", link: "/cashless-facility" },
            { label: "📞 Speak to TPA Helpdesk", action: "contact" },
          ],
        }
      );
      return;
    }

    // 13. Contact / Helpline / WhatsApp
    if (
      lower.includes("contact") ||
      lower.includes("phone") ||
      lower.includes("call") ||
      lower.includes("whatsapp") ||
      lower.includes("number") ||
      lower.includes("reception") ||
      lower.includes("helpline")
    ) {
      handleQuickAction("contact");
      return;
    }

    // 14. Greetings
    if (
      lower === "hi" ||
      lower === "hello" ||
      lower === "hey" ||
      lower === "namaste" ||
      lower.startsWith("good morning") ||
      lower.startsWith("good afternoon") ||
      lower.startsWith("good evening")
    ) {
      botReply(
        `Hello! Welcome to Oracle Eye Hospital. I am here to help you with booking an eye checkup, finding a doctor, or answering questions regarding our eye care services. How can I assist you right now?`,
        "welcome_actions"
      );
      return;
    }

    // 15. Default Fallback
    botReply(
      `Thank you for reaching out to Oracle Eye Hospital. I can assist you with scheduling an appointment, checking hospital timings, learning about our doctors, or sharing information on treatments like Cataract, LASIK, and Glaucoma.\n\n` +
      `Please select a quick option below, or call our patient helpline at **${hospitalPhone}**.`,
      "welcome_actions"
    );
  };

  // Helper date generators for appointment selection
  const getNextDays = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const formatDateVal = (d) => d.toISOString().split("T")[0];
    const formatDisplay = (d) =>
      d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    return [
      {
        value: formatDateVal(today),
        label: `Today (${formatDisplay(today)})`,
      },
      {
        value: formatDateVal(tomorrow),
        label: `Tomorrow (${formatDisplay(tomorrow)})`,
      },
      {
        value: formatDateVal(dayAfter),
        label: `${formatDisplay(dayAfter)}`,
      },
    ];
  };

  return (
    <>
      {/* ========================================================
          1. FLOATING CHAT LAUNCHER BUTTON
          ======================================================== */}
      {!isOpen && (
        <div className="oeh-launcher-wrapper">
          {showLauncherTooltip && (
            <div
              className="oeh-launcher-tooltip"
              onClick={() => {
                setIsOpen(true);
                setShowLauncherTooltip(false);
              }}
              role="button"
              tabIndex={0}
            >
              <div className="oeh-tooltip-inner">
                <span className="oeh-tooltip-wave">👋</span>
                <div>
                  <strong>Need Eye Care Advice?</strong>
                  <p>Chat with our Patient Care Assistant</p>
                </div>
              </div>
              <button
                className="oeh-tooltip-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLauncherTooltip(false);
                }}
                aria-label="Close message preview"
              >
                &times;
              </button>
            </div>
          )}

          <button
            className="oeh-chatbot-launcher"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setShowLauncherTooltip(false);
            }}
            aria-label="Open Oracle Eye Hospital Assistant"
            title="Open Oracle Eye Hospital Assistant"
          >
            <div className="oeh-launcher-icon">
              <MessageSquare className="oeh-icon-chat" />
            </div>
            <span className="oeh-online-indicator" aria-hidden="true">
              <span className="oeh-ping-ring"></span>
              <span className="oeh-dot"></span>
            </span>
            {unreadCount > 0 && (
              <span className="oeh-badge" aria-label="1 new message">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ========================================================
          2. CHAT WINDOW PANEL
          ======================================================== */}
      <div
        ref={chatWindowRef}
        className={`oeh-chat-window ${isOpen ? "oeh-open" : ""} ${isMinimized ? "oeh-minimized" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Oracle Eye Hospital Patient Support Chat"
      >
        {/* HEADER */}
        <div className="oeh-chat-header">
          <div className="oeh-header-branding">
            <div className="oeh-avatar-box">
              <img
                src="/Assets/img/logo.png"
                alt="Oracle Eye Hospital"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="oeh-avatar-fallback" style={{ display: "none" }}>
                <Eye className="w-5 h-5 text-white" />
              </div>
              <span className="oeh-header-online-dot" title="Online now"></span>
            </div>

            <div className="oeh-header-text">
              <div className="oeh-header-title-row">
                <h2 className="oeh-header-title">Oracle Eye Hospital</h2>
                <span className="oeh-verified-badge" title="Verified Hospital Assistant">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="oeh-header-subtitle">Patient Support Assistant</p>
              <div className="oeh-header-status">
                <span className="oeh-status-pulse"></span>
                <span>Online Assistance</span>
              </div>
            </div>
          </div>

          <div className="oeh-header-controls">
            <button
              type="button"
              className="oeh-btn-icon"
              onClick={handleResetChat}
              title="Restart Conversation"
              aria-label="Restart Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="oeh-btn-icon"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Expand" : "Minimize"}
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="oeh-btn-icon oeh-btn-close"
              onClick={() => setIsOpen(false)}
              title="Close Chat"
              aria-label="Close Chat"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* CHAT BODY (Messages Area) */}
        {!isMinimized && (
          <div className="oeh-chat-body" role="log" aria-live="polite">
            <div className="oeh-date-stamp">
              <span>Today • Patient Concierge</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`oeh-message-row ${msg.sender === "user" ? "oeh-user-row" : "oeh-bot-row"}`}
              >
                {msg.sender === "bot" && (
                  <div className="oeh-bot-avatar" aria-hidden="true">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="oeh-message-bubble-wrapper">
                  <div
                    className={`oeh-message-bubble ${
                      msg.sender === "user" ? "oeh-bubble-user" : "oeh-bubble-bot"
                    }`}
                  >
                    {/* Plain text / Markdown-like paragraphs */}
                    {Boolean(msg.text) && (
                      <div className="oeh-message-text">
                        {String(msg.text).split("\n\n").map((para, pIdx) => (
                          <p key={pIdx}>
                            {para.split("\n").map((line, lIdx) => (
                              <span key={lIdx}>
                                {renderFormattedText(line)}
                                {lIdx < para.split("\n").length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Specialized Interactive Cards within Messages */}

                    {/* Quick Topics on Welcome */}
                    {msg.type === "welcome_actions" && (
                      <div className="oeh-quick-grid">
                        <button
                          type="button"
                          className="oeh-quick-btn oeh-quick-highlight"
                          onClick={() => handleQuickAction("book_appointment")}
                        >
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>Book an Appointment</span>
                        </button>
                        <button
                          type="button"
                          className="oeh-quick-btn"
                          onClick={() => handleQuickAction("services")}
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span>Eye Care Services</span>
                        </button>
                        <button
                          type="button"
                          className="oeh-quick-btn"
                          onClick={() => handleQuickAction("doctors")}
                        >
                          <Stethoscope className="w-3.5 h-3.5 text-primary" />
                          <span>Doctor Information</span>
                        </button>
                        <button
                          type="button"
                          className="oeh-quick-btn"
                          onClick={() => handleQuickAction("timings")}
                        >
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>Hospital Timings</span>
                        </button>
                        <button
                          type="button"
                          className="oeh-quick-btn"
                          onClick={() => handleQuickAction("location")}
                        >
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>Location & Directions</span>
                        </button>
                        <button
                          type="button"
                          className="oeh-quick-btn"
                          onClick={() => handleQuickAction("contact")}
                        >
                          <Phone className="w-3.5 h-3.5 text-primary" />
                          <span>Talk to Our Team</span>
                        </button>
                      </div>
                    )}

                    {/* Services List Card */}
                    {msg.type === "services_list" && (
                      <div className="oeh-card-list">
                        {SERVICES.map((srv) => (
                          <div key={srv.slug} className="oeh-service-item">
                            <div>
                              <strong>{srv.title}</strong>
                              <p>{srv.short}</p>
                            </div>
                            <div className="oeh-service-actions">
                              <Link href={`/services/${srv.slug}`} className="oeh-link-chip">
                                Learn More <ChevronRight className="w-3 h-3 ml-0.5" />
                              </Link>
                              <button
                                type="button"
                                className="oeh-book-chip"
                                onClick={() => handleSelectService(srv.title)}
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="oeh-quick-btn oeh-quick-highlight mt-2 w-full"
                          onClick={startAppointmentFlow}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Any Eye Service</span>
                        </button>
                      </div>
                    )}

                    {/* Doctors List Card */}
                    {msg.type === "doctors_list" && (
                      <div className="oeh-card-list">
                        {DOCTORS.map((doc) => (
                          <div key={doc.slug} className="oeh-doctor-item">
                            <div className="oeh-doctor-avatar">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="oeh-doctor-info">
                              <strong>{doc.name}</strong>
                              <span className="oeh-doc-title">{doc.title}</span>
                              <span className="oeh-doc-quals">{doc.quals}</span>
                            </div>
                            <button
                              type="button"
                              className="oeh-book-chip"
                              onClick={() => {
                                addUserMessage(`Consult with ${doc.name}`);
                                setAppointmentState((prev) => ({
                                  ...prev,
                                  active: true,
                                  notes: `Preferred Doctor: ${doc.name}`,
                                  step: "service",
                                }));
                                botReply(
                                  `You chose **${doc.name}**. Which service do you require?`,
                                  "appointment_service_select"
                                );
                              }}
                            >
                              Book
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Location Card */}
                    {msg.type === "location_card" && (
                      <div className="oeh-embedded-card">
                        <div className="oeh-embed-row">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs leading-relaxed text-gray-700">{hospitalAddress}</p>
                            <p className="text-xs font-semibold text-primary mt-1">
                              Landmark: Parampara, Near TDI City, Moradabad
                            </p>
                          </div>
                        </div>
                        <div className="oeh-embed-actions">
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="oeh-action-btn oeh-action-primary"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open in Google Maps</span>
                          </a>
                          <button
                            type="button"
                            className="oeh-action-btn oeh-action-secondary"
                            onClick={() => handleQuickAction("timings")}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>View Timings</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Contact Card */}
                    {msg.type === "contact_card" && (
                      <div className="oeh-embedded-card">
                        <div className="oeh-contact-actions">
                          <a href={`tel:${hospitalPhone}`} className="oeh-contact-tile">
                            <Phone className="w-4 h-4 text-primary" />
                            <div>
                              <span>Call Helpline</span>
                              <strong>{hospitalPhone}</strong>
                            </div>
                          </a>
                          <button
                            type="button"
                            className="oeh-contact-tile oeh-whatsapp-tile"
                            onClick={() => handleWhatsAppRedirect()}
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span>Chat on WhatsApp</span>
                              <strong>Instant Support</strong>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Emergency Notice Card */}
                    {msg.type === "emergency_alert" && (
                      <div className="oeh-emergency-banner">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div>
                          <strong>Immediate Attention Recommended</strong>
                          <p>
                            Please call our 24/7 hotline directly or visit emergency triage at 491, Hi-Street.
                          </p>
                          <a href={`tel:${hospitalPhone}`} className="oeh-emergency-call-btn">
                            <Phone className="w-3.5 h-3.5 mr-1.5" />
                            Call Emergency Hotline ({hospitalPhone})
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Interactive Appointment Step 1: Select Service */}
                    {msg.type === "appointment_service_select" && appointmentState.active && (
                      <div className="oeh-step-container">
                        <p className="oeh-step-label">Select eye care specialty:</p>
                        <div className="oeh-pill-grid">
                          {APPOINTMENT_SERVICES.map((srv) => (
                            <button
                              key={srv}
                              type="button"
                              className="oeh-pill-btn"
                              onClick={() => handleSelectService(srv)}
                            >
                              {srv}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Appointment Step 2: Select Date */}
                    {msg.type === "appointment_date_select" && appointmentState.active && (
                      <div className="oeh-step-container">
                        <p className="oeh-step-label">Choose preferred appointment date:</p>
                        <div className="oeh-pill-grid">
                          {getNextDays().map((d) => (
                            <button
                              key={d.value}
                              type="button"
                              className="oeh-pill-btn"
                              onClick={() => handleSelectDate(d.value, d.label)}
                            >
                              📅 {d.label}
                            </button>
                          ))}
                        </div>
                        <div className="oeh-custom-date mt-2.5">
                          <label htmlFor="custom-date-picker" className="text-xs text-gray-500 block mb-1">
                            Or select another date:
                          </label>
                          <input
                            id="custom-date-picker"
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className="oeh-date-input"
                            onChange={(e) => {
                              if (e.target.value) {
                                handleSelectDate(e.target.value, e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Interactive Appointment Step 3: Select Time Slot */}
                    {msg.type === "appointment_time_select" && appointmentState.active && (
                      <div className="oeh-step-container">
                        <p className="oeh-step-label">Preferred time slot:</p>
                        <div className="oeh-pill-grid">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              className="oeh-pill-btn"
                              onClick={() => handleSelectTime(slot)}
                            >
                              ⏰ {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Appointment Step 4: Contact Form */}
                    {msg.type === "appointment_contact_form" && appointmentState.active && (
                      <form onSubmit={handleAppointmentSubmit} className="oeh-inline-form">
                        <div className="oeh-form-group">
                          <label htmlFor="patient-full-name">Patient Full Name *</label>
                          <input
                            id="patient-full-name"
                            type="text"
                            required
                            placeholder="e.g. Ramesh Sharma"
                            value={appointmentState.name}
                            onChange={(e) =>
                              setAppointmentState((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="oeh-form-input"
                            autoComplete="name"
                          />
                        </div>

                        <div className="oeh-form-group">
                          <label htmlFor="patient-phone-number">Mobile Number (10 Digits) *</label>
                          <input
                            id="patient-phone-number"
                            type="tel"
                            inputMode="tel"
                            required
                            placeholder="e.g. 9876543210"
                            value={appointmentState.phone}
                            onChange={(e) =>
                              setAppointmentState((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            className="oeh-form-input"
                            autoComplete="tel"
                          />
                        </div>

                        {appointmentState.errorMessage && (
                          <div className="oeh-form-error" role="alert">
                            {appointmentState.errorMessage}
                          </div>
                        )}

                        <div className="oeh-form-actions">
                          <button
                            type="submit"
                            disabled={appointmentState.isSubmitting}
                            className="oeh-submit-btn"
                          >
                            {appointmentState.isSubmitting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                <span>Confirm & Submit Appointment</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Interactive Appointment Step 5: Success Summary */}
                    {msg.type === "appointment_success" && (
                      <div className="oeh-success-card">
                        <div className="oeh-success-header">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <strong>Appointment Request Confirmed</strong>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Our clinical coordinator will call you to confirm your slot token and doctor schedule.
                        </p>
                        <div className="oeh-success-buttons mt-3">
                          <button
                            type="button"
                            className="oeh-action-btn oeh-action-secondary"
                            onClick={() => {
                              handleWhatsAppRedirect(
                                `Hello, I just booked an appointment for ${appointmentState.name} (${appointmentState.phone}) for ${appointmentState.service}. Please confirm my slot.`
                              );
                            }}
                          >
                            <span>Share on WhatsApp</span>
                          </button>
                          <Link href="/appointment" className="oeh-action-btn oeh-action-primary">
                            <span>Open Web Booking Page</span>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Quick Button Pills Attached to Bot Message */}
                    {msg.quickButtons && (
                      <div className="oeh-attached-buttons">
                        {msg.quickButtons.map((btn, bIdx) =>
                          btn.link ? (
                            <Link key={bIdx} href={btn.link} className="oeh-attached-btn">
                              {btn.label} <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                          ) : (
                            <button
                              key={bIdx}
                              type="button"
                              className="oeh-attached-btn"
                              onClick={() => handleQuickAction(btn.action)}
                            >
                              {btn.label}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <span className="oeh-message-timestamp">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="oeh-message-row oeh-bot-row">
                <div className="oeh-bot-avatar" aria-hidden="true">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div className="oeh-message-bubble oeh-bubble-bot oeh-typing-bubble">
                  <div className="oeh-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* CHAT FOOTER & INPUT COMPOSER */}
        {!isMinimized && (
          <div className="oeh-chat-footer">
            {/* Secondary WhatsApp Pill Action */}
            <div className="oeh-secondary-whatsapp-bar">
              <button
                type="button"
                className="oeh-whatsapp-pill"
                onClick={() => handleWhatsAppRedirect()}
                title="Continue conversation on WhatsApp"
              >
                <span className="oeh-whatsapp-icon-dot"></span>
                <span>Continue on WhatsApp</span>
                <ChevronRight className="w-3 h-3 text-emerald-600" />
              </button>
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} className="oeh-chat-composer">
              <input
                ref={inputRef}
                type="text"
                className="oeh-composer-input"
                placeholder="Ask us about your eye care..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isTyping}
                aria-label="Message Oracle Eye Hospital Assistant"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="oeh-composer-send"
                aria-label="Send Message"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="oeh-footer-disclaimer">
              <span>Oracle Assistant provides general care info • Helpline: {hospitalPhone}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Simple text formatter for bold **words**
function renderFormattedText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
