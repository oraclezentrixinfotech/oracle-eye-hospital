"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({
  faqs = [],
  title = "Frequently Asked Questions",
  subtitle = "Clear answers to help you make an informed decision for yourself and your family.",
  badge = "Common Patient Inquiries",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="mt-16 mx-auto max-w-4xl" id="faq-section">
      <div className="text-center">
        {badge && (
          <span className="text-xs font-bold uppercase tracking-wider text-[#137C8B]">
            {badge}
          </span>
        )}
        <h2 className="mt-2 text-2xl font-bold text-[#0A2A33] sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-[#0A2A33]/70">{subtitle}</p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A2A33] transition hover:bg-gray-50 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="pr-4">{faq.question || faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#137C8B] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div
                  className="border-t border-gray-100 bg-[#FBFDFD] p-5 text-sm leading-relaxed text-[#0A2A33]/80"
                  dangerouslySetInnerHTML={{ __html: faq.answer || faq.a || "" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
