import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are a clinical content structuring assistant for Oracle Eye Hospital.
Your ONLY job is to take the user's raw text and structure it into a strict JSON object.

CRITICAL RULES:
1. Do NOT rewrite, summarize, shorten, or invent any content. Copy the user's text verbatim into the fields; only structure it.
2. If a field or section is missing in the text, leave it empty (string "", or empty array []). Never invent facts, phone numbers, or clinical claims.
3. Generate a clean URL slug (lowercase, hyphens only, a-z, 0-9) from the H1 title or primary keyword if no URL/slug is given.
4. Categorize each section type as one of: "text", "checklist", "numbered", "highlight".
   - "checklist": sections containing bullet points or lists of symptoms/features.
   - "numbered": sections containing step-by-step procedures or numbered items.
   - "highlight": callout boxes, key clinical facts, or rules.
   - "text": standard paragraphs.
5. Extract all FAQ questions and answers verbatim into the faqs array [{ "q": "...", "a": "..." }].
6. Extract any mentioned doctor names into doctor_names array.
7. Extract any mentioned related service slugs or names into related_slugs array.
8. Extract stat chips (e.g. Procedure Duration, Surgical Technique, Payment & TPA) into hero_chips array [{ "label": "...", "value": "..." }].
9. Return ONLY valid JSON. No markdown code fences, no introductory or concluding text.

JSON SCHEMA:
{
  "slug": "string",
  "meta_title": "string",
  "meta_description": "string",
  "keywords": "string",
  "hero_badge": "string",
  "h1_title": "string",
  "hero_subtitle": "string",
  "hero_chips": [{ "label": "string", "value": "string" }],
  "sections": [
    {
      "heading": "string",
      "type": "text | checklist | numbered | highlight",
      "content": "string",
      "items": ["string"]
    }
  ],
  "faqs": [{ "q": "string", "a": "string" }],
  "doctor_names": ["string"],
  "related_slugs": ["string"]
}`;

async function callClaude(apiKey, userText, isRetry = false) {
  const prompt = isRetry
    ? `The previous response was not valid JSON. Please re-output the exact JSON structure for the following text without markdown fences:\n\n${userText}`
    : `Structure the following content into the requested JSON schema:\n\n${userText}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const textContent = data?.content?.[0]?.text || "";
  // Strip code fences if model enclosed them
  const cleanedJson = textContent
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleanedJson);
}

export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const text = body.text || "";

  if (!text || !text.trim()) {
    return NextResponse.json({ error: "Text content is required." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "ANTHROPIC_API_KEY is not configured in environment.",
        fallbackToBasic: true,
      },
      { status: 503 }
    );
  }

  try {
    let parsedData = null;
    try {
      parsedData = await callClaude(apiKey, text, false);
    } catch (err1) {
      console.warn("First Claude JSON parse attempt failed, retrying once...", err1?.message);
      // Retry once on invalid JSON
      parsedData = await callClaude(apiKey, text, true);
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (err) {
    console.error("Claude parse-content error:", err?.message || err);
    return NextResponse.json(
      {
        error: err?.message || "Failed to parse content with AI.",
        fallbackToBasic: true,
      },
      { status: 502 }
    );
  }
}
