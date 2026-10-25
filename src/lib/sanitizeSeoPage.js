import { sanitizeHtml } from "./sanitizeHtml";

export function sanitizeSeoSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.map((section) => ({
    ...section,
    content: sanitizeHtml(String(section?.content || "")),
    items: Array.isArray(section?.items)
      ? section.items.map((item) => sanitizeHtml(String(item || ""))).filter(Boolean)
      : [],
    steps: Array.isArray(section?.steps)
      ? section.steps.map((step) => sanitizeHtml(String(step || ""))).filter(Boolean)
      : section?.steps,
  }));
}

export function sanitizeSeoFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs.map((faq) => ({
    ...faq,
    answer: sanitizeHtml(String(faq?.answer || faq?.a || "")),
  }));
}
