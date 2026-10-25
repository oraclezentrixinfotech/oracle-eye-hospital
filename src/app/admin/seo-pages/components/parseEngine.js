// Universal Content Parser & Validation Engine for SEO Pages
// Supports Word (.docx), Plain Text (.txt), and Markdown structures

import { sanitizeHtml } from "../../../../lib/sanitizeHtml.js";

export function normalizeRawText(rawText) {
  if (!rawText) return "";

  let text = String(rawText);

  // 1. Remove zero-width characters and BOM
  text = text.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // 2. Normalize Windows newlines
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 3. Convert smart quotes and special typographical marks to standard ASCII
  text = text
    .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u00B4]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u25E6\u2043\u2219]/g, "•")
    .replace(/\u00A0/g, " "); // non-breaking space

  // 4. Strip markdown bold / italic wrapper from heading markers & key labels
  text = text.replace(/^(#+\s*)\*\*([^*]+)\*\*/gm, "$1$2");
  text = text.replace(/^\*\*([A-Za-z0-9\s/_-]+):\*\*/gm, "$1:");
  text = text.replace(/^\*\*([A-Za-z0-9\s/_-]+)\*\*$/gm, "$1");

  // 5. Collapse 3 or more consecutive blank lines down to 2
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function parseChipsString(chipsStr) {
  if (!chipsStr || !chipsStr.trim()) return [];
  const chips = [];

  // Format: "label | value ; label | value" or multiple lines
  const delimiter = chipsStr.includes(";") ? ";" : "\n";
  const parts = chipsStr.split(delimiter);

  parts.forEach((p) => {
    const trimmed = p.replace(/^[-*•]\s*/, "").trim();
    if (!trimmed) return;

    if (trimmed.includes("|")) {
      const [lbl, val] = trimmed.split("|").map((x) => x.trim());
      if (lbl && val) chips.push({ label: lbl, value: val });
    } else if (trimmed.includes(":")) {
      const [lbl, ...rest] = trimmed.split(":");
      const val = rest.join(":").trim();
      if (lbl && val) chips.push({ label: lbl.trim(), value: val });
    }
  });

  return chips;
}

export function matchDoctorIds(doctorNamesInput, doctorsList = [], fullText = "") {
  const matchedIds = [];
  const unmatched = [];

  const cleanName = (str) =>
    String(str || "")
      .toLowerCase()
      .replace(/^\s*(?:and|&)\s+/i, "")
      .replace(/^dr\.?\s+/i, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim();

  // 1. If explicit doctor names provided
  if (doctorNamesInput) {
    const names = Array.isArray(doctorNamesInput)
      ? doctorNamesInput
      : String(doctorNamesInput)
          .split(/[,;\n]|\band\b/i)
          .map((n) => n.trim())
          .filter(Boolean);

    names.forEach((name) => {
      const target = cleanName(name);
      if (!target) return;

      const found = doctorsList.find((d) => {
        const dClean = cleanName(d.name);
        if (dClean === target || dClean.includes(target) || target.includes(dClean)) {
          return true;
        }
        const targetWords = target.split(/\s+/).filter((w) => w.length >= 4);
        const dWords = dClean.split(/\s+/).filter((w) => w.length >= 4);
        return targetWords.some((tw) => dWords.includes(tw));
      });

      if (found && !matchedIds.includes(found.id)) {
        matchedIds.push(found.id);
      } else if (!found) {
        unmatched.push(String(name));
      }
    });
  }

  // 2. Scan entire text for doctor names from DB if not already added
  if (fullText && doctorsList.length > 0) {
    doctorsList.forEach((d) => {
      if (matchedIds.includes(d.id)) return;
      const dClean = cleanName(d.name);
      if (dClean.length < 3) return;

      const regex = new RegExp(`\\b${dClean}\\b`, "i");
      if (regex.test(fullText)) {
        matchedIds.push(d.id);
      }
    });
  }

  // 3. Fallback to first 2 active doctors if none matched
  if (matchedIds.length === 0 && doctorsList.length > 0) {
    matchedIds.push(...doctorsList.slice(0, 2).map((d) => d.id));
  }

  return { matchedIds, unmatched };
}

export function matchRelatedIds(relatedInput, allPages = []) {
  const matchedIds = [];
  const unmatched = [];

  if (!relatedInput) {
    if (allPages.length > 0) {
      return { matchedIds: allPages.slice(0, 4).map((p) => p.id), unmatched: [] };
    }
    return { matchedIds: [], unmatched: [] };
  }

  const items = Array.isArray(relatedInput)
    ? relatedInput
    : String(relatedInput)
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

  items.forEach((item) => {
    const itemStr = typeof item === "object" && item !== null ? item.slug || item.h1Title || "" : String(item || "");
    const slugCandidate = slugify(itemStr);
    const found = allPages.find(
      (p) =>
        p.id === item ||
        p.slug === slugCandidate ||
        p.slug.includes(slugCandidate) ||
        p.h1Title?.toLowerCase().includes(itemStr.toLowerCase())
    );

    if (found && !matchedIds.includes(found.id)) {
      matchedIds.push(found.id);
    } else if (!found) {
      unmatched.push(itemStr);
    }
  });

  if (matchedIds.length === 0 && allPages.length > 0) {
    matchedIds.push(...allPages.slice(0, 4).map((p) => p.id));
  }

  return { matchedIds, unmatched };
}

// Convert markdown bold and italic formatting to clean HTML tags
function formatInlineMarkdown(text) {
  if (!text) return "";
  let str = String(text);
  // bold **text** or __text__
  str = str.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  str = str.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // italic *text* or _text_
  str = str.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, "$1<em>$2</em>$3");
  return str;
}

// Parses raw markdown or ASCII tables into structured { headers: [], rows: [[]] }
export function parseTableContent(tableLines) {
  if (!Array.isArray(tableLines) || tableLines.length < 2) return null;

  const parsedRows = tableLines.map((line) => {
    return line
      .split("|")
      .map((c) => c.trim())
      .filter((c, idx, arr) => (idx === 0 && c === "" ? false : idx === arr.length - 1 && c === "" ? false : true));
  }).filter((r) => r.length > 0 && !r.every((c) => /^[-:\s]+$/.test(c))); // filter separator line |---|---|

  if (parsedRows.length < 2) return null;

  const headers = parsedRows[0];
  const rows = parsedRows.slice(1);

  return { headers, rows };
}

/**
 * Universal Parser: Extracts structured SEO page data from text or HTML
 */
export function parseBasicText(rawText, doctorsList = [], allPages = [], extraMetadata = {}) {
  if (!rawText || !rawText.trim()) return null;

  const text = normalizeRawText(rawText);

  // Check if raw JSON was provided
  if (text.startsWith("{") && text.endsWith("}")) {
    try {
      const data = JSON.parse(text);
      return sanitizeParsedOutput(data, doctorsList, allPages, text);
    } catch {
      // not JSON, continue
    }
  }

  const lines = text.split("\n");

  let h1Title = "";
  let slug = "";
  let metaTitle = "";
  let metaDescription = "";
  let keywords = "";
  let canonicalUrl = "";
  let ogImage = "";
  let heroBadge = "";
  let heroSubtitle = "";
  let heroImage = "/Assets/img/services/Cataract-Service.png";
  let heroChips = [];
  let ctaPrimaryText = "Book Appointment";
  let ctaPhone = "+91 8006803111";
  let rawDoctors = "";
  let rawRelated = "";

  const sections = [];
  const faqs = [];
  const unmappedContent = [];

  let contentStartIndex = 0;
  const metadataKeySet = new Set([
    "url",
    "slug",
    "url slug",
    "meta title",
    "meta_title",
    "meta description",
    "meta_description",
    "description",
    "keywords",
    "meta keywords",
    "canonical",
    "canonical url",
    "canonical_url",
    "og image",
    "og_image",
    "badge",
    "hero badge",
    "hero_badge",
    "h1",
    "h1 title",
    "h1_title",
    "main heading",
    "page title",
    "title",
    "subtitle",
    "hero subtitle",
    "hero_subtitle",
    "intro",
    "introduction",
    "chips",
    "hero chips",
    "hero_chips",
    "stat chips",
    "image",
    "hero image",
    "hero_image",
    "cta",
    "primary cta",
    "phone",
    "helpline",
    "doctors",
    "doctor",
    "specialists",
    "related",
    "related services",
  ]);

  // ── PASS 1: Extract Top Header Metadata Keys ────────────────────────
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check separator line (e.g. _____________________ or ----- or ===)
    if (/^[_\-—=]{3,}$/.test(line)) {
      contentStartIndex = i + 1;
      break;
    }

    // Check if line is a section heading: metadata block ended
    if (/^##+\s+/.test(line) || /^Section\s*\d+/i.test(line)) {
      contentStartIndex = i;
      break;
    }

    let isMetadataLine = false;
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && colonIdx < 35) {
      const potentialKey = line.slice(0, colonIdx).trim().toLowerCase();
      const val = line.slice(colonIdx + 1).trim();

      if (metadataKeySet.has(potentialKey)) {
        isMetadataLine = true;
        contentStartIndex = i + 1;

        if (potentialKey === "url" || potentialKey === "slug" || potentialKey === "url slug") {
          slug = slugify(val);
        } else if (potentialKey === "meta title" || potentialKey === "meta_title" || potentialKey === "page title") {
          metaTitle = val;
        } else if (
          potentialKey === "meta description" ||
          potentialKey === "meta_description" ||
          potentialKey === "description"
        ) {
          metaDescription = val;
        } else if (potentialKey === "keywords" || potentialKey === "meta keywords") {
          keywords = val;
        } else if (potentialKey === "canonical" || potentialKey === "canonical url" || potentialKey === "canonical_url") {
          canonicalUrl = val;
        } else if (potentialKey === "og image" || potentialKey === "og_image") {
          ogImage = val;
        } else if (
          potentialKey === "badge" ||
          potentialKey === "hero badge" ||
          potentialKey === "hero_badge"
        ) {
          heroBadge = val;
        } else if (
          potentialKey === "h1" ||
          potentialKey === "h1 title" ||
          potentialKey === "h1_title" ||
          potentialKey === "main heading" ||
          potentialKey === "title"
        ) {
          h1Title = val;
          if (!slug) slug = slugify(val);
        } else if (
          potentialKey === "subtitle" ||
          potentialKey === "hero subtitle" ||
          potentialKey === "hero_subtitle" ||
          potentialKey === "intro" ||
          potentialKey === "introduction"
        ) {
          heroSubtitle = val;
        } else if (
          potentialKey === "chips" ||
          potentialKey === "hero chips" ||
          potentialKey === "hero_chips" ||
          potentialKey === "stat chips"
        ) {
          heroChips = parseChipsString(val);
        } else if (
          potentialKey === "image" ||
          potentialKey === "hero image" ||
          potentialKey === "hero_image"
        ) {
          heroImage = val;
        } else if (potentialKey === "cta" || potentialKey === "primary cta") {
          ctaPrimaryText = val;
        } else if (potentialKey === "phone" || potentialKey === "helpline") {
          ctaPhone = val;
        } else if (
          potentialKey === "doctors" ||
          potentialKey === "doctor" ||
          potentialKey === "specialists"
        ) {
          rawDoctors = val;
        } else if (potentialKey === "related" || potentialKey === "related services") {
          rawRelated = val;
        }
        continue;
      }
    }

    if (!isMetadataLine) {
      // If we already parsed at least one metadata key or H1, the metadata block has ended
      if (contentStartIndex > 0) {
        contentStartIndex = i;
        break;
      }
      // First non-metadata line before separator is H1 Title if not yet found
      if (!h1Title && !line.startsWith("#") && line.length < 120 && !line.includes("|") && !line.endsWith(":")) {
        h1Title = line;
        if (!slug) slug = slugify(line);
        contentStartIndex = i + 1;
      }
    }
  }

  // Fallback for H1 Title if empty
  if (!h1Title && metaTitle) {
    const cleanMeta = metaTitle.split(/[|\-–]/)[0].trim();
    h1Title = cleanMeta;
    if (!slug) slug = slugify(cleanMeta);
  }

  // ── PASS 2: Body Lines Parsing (Sections, Steps, Callouts, Tables, FAQs) ────
  const bodyLines = lines.slice(contentStartIndex);
  let currentSection = null;
  let inFaqBlock = false;
  let currentFaq = null;
  const introParagraphs = [];
  let tableAccumulator = [];

  function flushTable() {
    if (tableAccumulator.length >= 2 && currentSection) {
      const parsed = parseTableContent(tableAccumulator);
      if (parsed) {
        currentSection.table = parsed;
      }
    }
    tableAccumulator = [];
  }

  function isSectionHeading(line) {
    const t = line.trim();
    if (!t) return false;

    // Explicit markdown heading (## Section)
    if (/^##\s+(.+)$/.test(t)) return true;
    if (/^Section\s*\d+:?/i.test(t)) return true;

    // Sub-headings like ### Step 1 or "Step 1: ..." are step items
    if (/^(?:###\s*)?Step\s*\d+/i.test(t)) return false;

    // Callouts are NOT headings
    if (t.startsWith(">")) return false;

    // FAQs start - never treat as a regular section heading
    if (
      /^(?:#{1,6}\s*|<h[1-6][^>]*>)?(?:\*\*)?(?:Frequently Asked Questions|Patient FAQs|General FAQs|FAQs?)(?:\*\*)?(?:<\/h[1-6]>)?(?:\s*:)?$/i.test(
        t.replace(/<[^>]*>/g, "").trim()
      ) ||
      /^(?:Frequently Asked Questions|FAQs?)(?:\s*:)?$/i.test(t)
    ) {
      return false;
    }

    // Trailing metadata keys are NOT headings
    if (/^(?:DOCTORS|RELATED):\s*/i.test(t)) return false;

    // Table rows or bullet lines are NOT headings
    if (t.startsWith("|") || t.endsWith("|")) return false;
    if (/^[•\-\*\u2022]/.test(t) || /^\d+\./.test(t)) return false;

    // Short title-case lines (< 70 chars, not ending with sentence punctuation)
    if (t.length <= 70 && !t.endsWith(".") && !t.endsWith(",") && !t.endsWith(";")) {
      if (/^[A-Z0-9]/.test(t) && !t.includes("  ")) {
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      flushTable();
      continue;
    }

    // Check table row (e.g. | Col 1 | Col 2 |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      tableAccumulator.push(trimmed);
      continue;
    } else {
      flushTable();
    }

    // Check trailing DOCTORS or RELATED metadata at bottom of document
    const trailingKvMatch = trimmed.match(/^(DOCTORS|RELATED):\s*(.+)$/i);
    if (trailingKvMatch) {
      const k = trailingKvMatch[1].toUpperCase();
      const v = trailingKvMatch[2].trim();
      if (k === "DOCTORS") rawDoctors = rawDoctors ? `${rawDoctors}, ${v}` : v;
      if (k === "RELATED") rawRelated = rawRelated ? `${rawRelated}, ${v}` : v;
      continue;
    }

    // 1. FAQ Block Trigger: Matches "## Frequently Asked Questions", "### FAQs", "<h3>FAQs</h3>", "FAQs:", "Frequently Asked Questions", etc.
    const isFaqHeader =
      /^(?:#{1,6}\s*|<h[1-6][^>]*>)?(?:\*\*)?(?:Frequently Asked Questions|Patient FAQs|General FAQs|FAQs?)(?:\*\*)?(?:<\/h[1-6]>)?(?:\s*:)?$/i.test(
        trimmed.replace(/<[^>]*>/g, "").trim()
      ) ||
      /^(?:Frequently Asked Questions|FAQs?)(?:\s*:)?$/i.test(trimmed);

    if (isFaqHeader) {
      inFaqBlock = true;
      if (currentSection) {
        sections.push(currentSection);
        currentSection = null;
      }
      continue;
    }

    // 2. Inside FAQ Block
    if (inFaqBlock) {
      const cleanLine = trimmed.replace(/^<[^>]+>|<\/[^>]+>$/g, "").trim();

      // Check explicit Q: or Question: or "Q1." or "Q1:"
      const isQExplicit = /^(?:Q\d*|Question\s*\d*)\s*[:\.\-]\s*(.+)$/i.exec(cleanLine);
      // Check question ending with question mark '?'
      const isQQuestionMark =
        !isQExplicit &&
        (cleanLine.endsWith("?") || cleanLine.endsWith("?</strong>") || cleanLine.endsWith("?</b>")) &&
        cleanLine.length < 250;
      // Check markdown heading inside FAQ (### Is it safe?)
      const isQHeading =
        !isQExplicit &&
        !isQQuestionMark &&
        /^(?:#{2,6}\s+|<h[2-6]>)(.+?)(?:<\/h[2-6]>)?$/i.test(trimmed);

      if (isQExplicit || isQQuestionMark || isQHeading) {
        if (currentFaq && currentFaq.question && currentFaq.answer) {
          faqs.push(currentFaq);
        }
        let qText = "";
        if (isQExplicit) {
          qText = isQExplicit[1].trim();
        } else if (isQHeading) {
          const match = trimmed.match(/^(?:#{2,6}\s+|<h[2-6]>)(.+?)(?:<\/h[2-6]>)?$/i);
          qText = match ? match[1].replace(/<[^>]*>/g, "").trim() : cleanLine.replace(/^#+\s*/, "");
        } else {
          qText = cleanLine.replace(/<[^>]*>/g, "").trim();
        }
        // Remove leading markdown hashes or bold wrappers if any
        qText = qText.replace(/^#+\s*/, "").replace(/^\*\*(.+)\*\*$/, "$1").trim();

        currentFaq = { question: qText, answer: "" };
        continue;
      }

      const aMatch = cleanLine.match(/^(?:A\d*|Answer\s*\d*)\s*[:\.\-]\s*(.+)$/i);
      if (aMatch && currentFaq) {
        const aText = formatInlineMarkdown(aMatch[1].trim());
        currentFaq.answer = currentFaq.answer ? `${currentFaq.answer}\n\n${aText}` : aText;
        continue;
      }

      if (currentFaq) {
        const formatted = formatInlineMarkdown(trimmed);
        if (!currentFaq.answer) {
          currentFaq.answer = formatted;
        } else {
          // If subsequent lines belong to the answer (multiline answer)
          currentFaq.answer += `\n\n${formatted}`;
        }
        continue;
      }

      // If in FAQ block before any question is encountered
      continue;
    }

    // 3. Section Heading Trigger
    if (isSectionHeading(line)) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const cleanHeading = trimmed
        .replace(/^##+\s+/, "")
        .replace(/^Section\s*\d+:?\s*/i, "")
        .trim();
      let heading = cleanHeading;
      let secId = slugify(cleanHeading).slice(0, 35) || `section-${sections.length + 1}`;

      const colonIdx = cleanHeading.indexOf(":");
      if (colonIdx > 0 && colonIdx <= 25) {
        const prefix = cleanHeading.slice(0, colonIdx).trim();
        const candidateHeading = cleanHeading.slice(colonIdx + 1).trim();
        if (candidateHeading) {
          secId = slugify(prefix).slice(0, 30) || secId;
          heading = candidateHeading;
        }
      }

      currentSection = {
        id: secId,
        heading: heading,
        type: "text",
        content: "",
        items: [],
      };
      continue;
    }

    // 4. Intro paragraphs before any section heading
    if (!currentSection && sections.length === 0) {
      introParagraphs.push(trimmed);
      continue;
    }

    // 5. Inside Active Section Content
    if (currentSection) {
      // Callout box marker: "> quote"
      if (trimmed.startsWith(">")) {
        const calloutText = trimmed.replace(/^>\s*/, "").trim();
        if (calloutText) {
          if (currentSection.content || currentSection.items.length > 0) {
            sections.push(currentSection);
            currentSection = null;
          }

          let calloutHeading = "Key Highlights & Advantages";
          let calloutBody = calloutText;
          if (calloutText.includes(":")) {
            const [h, ...rest] = calloutText.split(":");
            if (h.length < 50) {
              calloutHeading = h.trim();
              calloutBody = rest.join(":").trim();
            }
          }

          currentSection = {
            id: slugify(calloutHeading).slice(0, 35) || `highlight-${sections.length + 1}`,
            heading: calloutHeading,
            type: "highlight",
            content: formatInlineMarkdown(calloutBody),
            items: [],
          };
        }
        continue;
      }

      // Explicit section type tag: [highlight], [checklist], [numbered], [text]
      const typeTagMatch = trimmed.match(/^\[(highlight|checklist|numbered|text)\]$/i);
      if (typeTagMatch) {
        currentSection.type = typeTagMatch[1].toLowerCase();
        continue;
      }

      // Sub-heading "### Heading" or "### Step 1: ..."
      if (/^###\s+/.test(trimmed)) {
        const subText = trimmed.replace(/^###\s+/, "").trim();
        const stepMatch = subText.match(/^(Step\s*\d+:?\s*.+)$/i);
        if (stepMatch) {
          if (
            currentSection.type !== "numbered" &&
            !currentSection.heading.toLowerCase().includes("step") &&
            (currentSection.content || currentSection.items.length > 0)
          ) {
            sections.push(currentSection);
            currentSection = {
              id: "step-by-step-procedure",
              heading: "Step-by-Step Procedure",
              type: "numbered",
              content: "",
              items: [formatInlineMarkdown(stepMatch[1].trim())],
            };
          } else {
            currentSection.type = "numbered";
            currentSection.items.push(formatInlineMarkdown(stepMatch[1].trim()));
          }
        } else {
          if (currentSection.content || currentSection.items.length > 0) {
            sections.push(currentSection);
          }
          currentSection = {
            id: slugify(subText).slice(0, 35) || `section-${sections.length + 1}`,
            heading: subText,
            type: "text",
            content: "",
            items: [],
          };
        }
        continue;
      }

      // Step item without ###
      const plainStepMatch = trimmed.match(/^(Step\s*\d+:?\s*.+)$/i);
      if (plainStepMatch) {
        if (
          currentSection.type !== "numbered" &&
          !currentSection.heading.toLowerCase().includes("step") &&
          (currentSection.content || currentSection.items.length > 0)
        ) {
          sections.push(currentSection);
          currentSection = {
            id: "step-by-step-procedure",
            heading: "Step-by-Step Procedure",
            type: "numbered",
            content: "",
            items: [formatInlineMarkdown(plainStepMatch[1].trim())],
          };
        } else {
          currentSection.type = "numbered";
          currentSection.items.push(formatInlineMarkdown(plainStepMatch[1].trim()));
        }
        continue;
      }

      // Numbered list item
      const numMatch = trimmed.match(/^(\d+)\.\s*(.+)$/);
      if (numMatch) {
        currentSection.type = "numbered";
        currentSection.items.push(formatInlineMarkdown(numMatch[2].trim()));
        continue;
      }

      // Bullet checklist item
      const bulletMatch = trimmed.match(/^([•\-\*]|\u2022)\s*(.+)$/);
      if (bulletMatch) {
        currentSection.items.push(formatInlineMarkdown(bulletMatch[2].trim()));
        if (currentSection.type === "text") {
          currentSection.type = "checklist";
        }
        continue;
      }

      // Appending to previous numbered item if it was a step title
      if (
        currentSection.type === "numbered" &&
        currentSection.items.length > 0 &&
        !trimmed.endsWith(":")
      ) {
        const lastIdx = currentSection.items.length - 1;
        if (currentSection.items[lastIdx].length < 60) {
          currentSection.items[lastIdx] += ` - ${formatInlineMarkdown(trimmed)}`;
          continue;
        }
      }

      // Regular paragraph line
      if (trimmed) {
        const formatted = formatInlineMarkdown(trimmed);
        if (!currentSection.content) {
          currentSection.content = formatted;
        } else {
          currentSection.content += `\n\n${formatted}`;
        }
      }
    }
  }

  flushTable();

  // Push pending section & FAQ
  if (currentSection) {
    sections.push(currentSection);
  }
  if (currentFaq && currentFaq.question && currentFaq.answer) {
    faqs.push(currentFaq);
  }

  // Populate hero subtitle if missing
  if (introParagraphs.length > 0 && !heroSubtitle) {
    heroSubtitle = introParagraphs.join(" ").slice(0, 320);
  }

  // Default chips if none parsed
  if (heroChips.length === 0) {
    heroChips = [
      { label: "Procedure Duration", value: "15-Min Walk-In" },
      { label: "Surgical Technique", value: "Stitchless & Painless" },
      { label: "Payment & TPA", value: "Cashless Insurance" },
    ];
  }

  // Match doctors & related pages
  const { matchedIds: doctorIds, unmatched: unmatchedDoctors } = matchDoctorIds(
    rawDoctors,
    doctorsList,
    text
  );
  const { matchedIds: relatedIds, unmatched: unmatchedRelated } = matchRelatedIds(
    rawRelated,
    allPages
  );

  return sanitizeParsedOutput(
    {
      h1Title,
      slug,
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogImage,
      heroBadge,
      heroSubtitle,
      heroImage,
      heroChips,
      ctaPrimaryText,
      ctaPhone,
      sections,
      doctorIds,
      faqs,
      relatedIds,
      unmatchedDoctors,
      unmatchedRelated,
      unmappedContent,
    },
    doctorsList,
    allPages,
    text
  );
}

export function sanitizeParsedOutput(data, doctorsList = [], allPages = [], fullText = "") {
  if (!data) return null;

  const h1Title = data.h1_title || data.h1Title || "";
  const slug = slugify(data.slug || h1Title);
  const metaTitle = data.meta_title || data.metaTitle || (h1Title ? `${h1Title} | Oracle Eye Hospital` : "");
  const metaDescription =
    data.meta_description ||
    data.metaDescription ||
    data.hero_subtitle ||
    data.heroSubtitle ||
    "";

  const heroBadge = data.hero_badge || data.heroBadge || "NABH-Aligned Centre • 25,000+ Surgeries";

  let heroChips = [];
  const rawChips = data.hero_chips || data.heroChips;
  if (Array.isArray(rawChips) && rawChips.length > 0) {
    heroChips = rawChips.map((c) => ({
      label: String(c.label || "").trim(),
      value: String(c.value || "").trim(),
    })).filter((c) => c.label && c.value);
  }
  if (heroChips.length === 0) {
    heroChips = [
      { label: "Procedure Duration", value: "15-Min Walk-In" },
      { label: "Surgical Technique", value: "Stitchless & Painless" },
      { label: "Payment & TPA", value: "Cashless Insurance" },
    ];
  }

  // Sanitize Sections
  const rawSections = data.sections || [];
  const sections = Array.isArray(rawSections)
    ? rawSections.map((s, idx) => ({
        id: slugify(s.heading || `section-${idx + 1}`).slice(0, 35) || `section-${idx + 1}`,
        heading: String(s.heading || `Section ${idx + 1}`).trim(),
        type: ["text", "checklist", "numbered", "highlight"].includes(s.type)
          ? s.type
          : Array.isArray(s.items) && s.items.length > 0
          ? "checklist"
          : "text",
        content: sanitizeHtml(String(s.content || s.html || "").trim()),
        items: Array.isArray(s.items)
          ? s.items.map((it) => sanitizeHtml(String(it).trim())).filter(Boolean)
          : [],
        table: s.table || null,
      }))
    : [];

  // FAQs
  const rawFaqs = data.faqs || [];
  const faqs = Array.isArray(rawFaqs)
    ? rawFaqs
        .map((f) => ({
          question: String(f.question || f.q || "").trim(),
          answer: sanitizeHtml(String(f.answer || f.a || "").trim()),
        }))
        .filter((f) => f.question && f.answer)
    : [];

  // Doctors
  const rawDoctorNames = data.doctor_names || data.doctors || data.doctorNames || [];
  const { matchedIds: doctorIds, unmatched: unmatchedDoctors } = matchDoctorIds(
    rawDoctorNames.length > 0 ? rawDoctorNames : data.doctorIds,
    doctorsList,
    fullText
  );

  // Related Pages
  const rawRelatedSlugs = data.related_slugs || data.related || data.relatedSlugs || [];
  const { matchedIds: relatedIds, unmatched: unmatchedRelated } = matchRelatedIds(
    rawRelatedSlugs.length > 0 ? rawRelatedSlugs : data.relatedIds,
    allPages
  );

  return {
    h1Title,
    slug,
    status: data.status || "published",
    metaTitle,
    metaDescription,
    keywords: data.keywords || "",
    canonicalUrl: data.canonicalUrl || (slug ? `https://www.oracleeyehospital.com/services/${slug}` : ""),
    ogImage: data.ogImage || data.heroImage || "/Assets/img/services/Cataract-Service.png",
    heroBadge,
    heroSubtitle: sanitizeHtml(data.hero_subtitle || data.heroSubtitle || metaDescription),
    heroImage: data.hero_image || data.heroImage || "/Assets/img/services/Cataract-Service.png",
    heroChips,
    ctaPrimaryText: data.ctaPrimaryText || "Book Appointment",
    ctaPhone: data.ctaPhone || "+91 8006803111",
    sections,
    doctorIds,
    faqs,
    relatedIds,
    unmatchedDoctors: data.unmatchedDoctors || unmatchedDoctors,
    unmatchedRelated: data.unmatchedRelated || unmatchedRelated,
    unmappedContent: Array.isArray(data.unmappedContent) ? data.unmappedContent : [],
  };
}

/**
 * Validation Engine: Returns blocking errors, warnings, and mapped fields count
 */
export function validateSeoPageData(parsedData, existingSlugs = []) {
  const errors = [];
  const warnings = [];
  let mappedFieldsCount = 0;

  if (!parsedData) {
    return {
      isValid: false,
      errors: [{ field: "document", reason: "Document is empty or unreadable.", action: "Upload a valid .txt or .docx file." }],
      warnings: [],
      mappedFieldsCount: 0,
    };
  }

  // 1. H1 Title Validation (BLOCKING)
  if (!parsedData.h1Title || parsedData.h1Title.trim().length < 2) {
    errors.push({
      field: "h1Title",
      reason: "Missing Main Heading (H1 Title).",
      action: "Add an 'H1: <Your Title>' or top heading in the document, or enter it manually.",
    });
  } else {
    mappedFieldsCount++;
  }

  // 2. Slug Validation (BLOCKING)
  if (!parsedData.slug) {
    errors.push({
      field: "slug",
      reason: "Missing URL slug.",
      action: "Provide a URL slug (e.g., 'cataract-surgery-in-moradabad') or enter an H1 title to auto-generate one.",
    });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parsedData.slug)) {
    errors.push({
      field: "slug",
      reason: `Invalid URL slug: '${parsedData.slug}'. Slugs must contain only lowercase letters, numbers, and single hyphens.`,
      action: "Use lowercase alphanumeric characters separated by single hyphens.",
    });
  } else {
    mappedFieldsCount++;
  }

  // 3. Duplicate Slug Check (BLOCKING unless updating existing)
  if (parsedData.slug && Array.isArray(existingSlugs) && existingSlugs.includes(parsedData.slug)) {
    warnings.push({
      field: "slugConflict",
      reason: `Duplicate URL slug: '/services/${parsedData.slug}'. A page already exists with this slug.`,
      action: "Choose whether to update the existing page or generate a new unique slug (e.g. adding -1).",
    });
  }

  // 4. Meta Title Validation
  if (!parsedData.metaTitle) {
    warnings.push({
      field: "metaTitle",
      reason: "Meta Title is empty. The H1 title will be used as a fallback.",
      action: "Specify a Meta Title (recommended 50-60 characters ending with '| Oracle Eye Hospital').",
    });
  } else {
    mappedFieldsCount++;
    if (parsedData.metaTitle.length > 65) {
      warnings.push({
        field: "metaTitle",
        reason: `Meta Title is ${parsedData.metaTitle.length} characters (recommended 50–60). May truncate in Google search results.`,
        action: "Shorten Meta Title to under 60 characters for optimal display.",
      });
    }
  }

  // 5. Meta Description Validation
  if (!parsedData.metaDescription) {
    warnings.push({
      field: "metaDescription",
      reason: "Meta Description is empty. Search engines will auto-generate snippets from page content.",
      action: "Provide a 140–160 character clinical description with a call to action.",
    });
  } else {
    mappedFieldsCount++;
    if (parsedData.metaDescription.length > 165) {
      warnings.push({
        field: "metaDescription",
        reason: `Meta Description is ${parsedData.metaDescription.length} characters (recommended 140–160). May truncate on mobile search results.`,
        action: "Trim Meta Description to between 140 and 160 characters.",
      });
    }
  }

  // 6. Keywords
  if (parsedData.keywords) mappedFieldsCount++;

  // 7. Hero Subtitle / Intro
  if (parsedData.heroSubtitle) mappedFieldsCount++;

  // 8. Hero Chips
  if (Array.isArray(parsedData.heroChips) && parsedData.heroChips.length > 0) {
    mappedFieldsCount++;
  }

  // 9. Sections Validation (BLOCKING if zero sections or empty headings)
  if (!Array.isArray(parsedData.sections) || parsedData.sections.length === 0) {
    errors.push({
      field: "sections",
      reason: "No content sections detected in document.",
      action: "Add structured sections with '## Heading' or 'Section 1: ...' markers.",
    });
  } else {
    mappedFieldsCount += parsedData.sections.length;
    parsedData.sections.forEach((sec, idx) => {
      if (!sec.heading || !sec.heading.trim()) {
        errors.push({
          field: `sections[${idx}]`,
          reason: `Section ${idx + 1} has an empty heading.`,
          action: "Provide a descriptive title for this section.",
        });
      }
      if (!sec.content && (!Array.isArray(sec.items) || sec.items.length === 0) && !sec.table) {
        warnings.push({
          field: `sections[${idx}]`,
          reason: `Section "${sec.heading}" has no paragraph text or checklist items.`,
          action: "Add descriptive paragraphs, checklist items, or remove empty section.",
        });
      }
    });
  }

  // 10. FAQs Validation
  if (Array.isArray(parsedData.faqs) && parsedData.faqs.length > 0) {
    mappedFieldsCount += parsedData.faqs.length;
    parsedData.faqs.forEach((faq, idx) => {
      if (!faq.question || !faq.question.trim()) {
        errors.push({
          field: `faqs[${idx}]`,
          reason: `FAQ #${idx + 1} is missing a question.`,
          action: "Add a question or remove incomplete FAQ entry.",
        });
      }
      if (!faq.answer || !faq.answer.trim()) {
        errors.push({
          field: `faqs[${idx}]`,
          reason: `FAQ #${idx + 1} ("${faq.question?.slice(0, 30)}...") has no answer.`,
          action: "Provide a comprehensive answer for this FAQ question.",
        });
      }
    });
  } else {
    warnings.push({
      field: "faqs",
      reason: "No FAQs detected. Adding FAQs improves SEO rich snippet rankings in Google.",
      action: "Add a 'FAQ' section with 'Q: ...' and 'A: ...' pairs.",
    });
  }

  // 11. Doctor Assignments
  if (Array.isArray(parsedData.doctorIds) && parsedData.doctorIds.length > 0) {
    mappedFieldsCount++;
  }

  // 12. Unmapped Content Warning
  if (Array.isArray(parsedData.unmappedContent) && parsedData.unmappedContent.length > 0) {
    warnings.push({
      field: "unmappedContent",
      reason: `${parsedData.unmappedContent.length} unmapped content block(s) detected.`,
      action: "Review unmapped content in the review tray below and assign to template sections before publishing.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    mappedFieldsCount,
  };
}
