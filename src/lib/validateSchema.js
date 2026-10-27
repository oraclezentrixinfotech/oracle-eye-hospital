/**
 * Validate JSON-LD schema on server side
 * Enforces:
 * 1. Valid JSON
 * 2. Must be an object or array of objects
 * 3. Each object must have "@type" OR have "@graph" array
 * 4. Checks for aggregateRating or review unless allowRatings is true
 */
export function validateSchemaJson(rawInput, allowRatings = false) {
  if (rawInput === null || rawInput === undefined || rawInput === "") {
    return { valid: true, schemaJson: null, warning: null };
  }

  let parsed = rawInput;
  if (typeof rawInput === "string") {
    let cleanText = rawInput.trim();
    if (cleanText.startsWith("<script") && cleanText.endsWith("</script>")) {
      cleanText = cleanText.replace(/<script[^>]*>/i, "").replace(/<\/script>$/i, "").trim();
    }
    if (!cleanText) {
      return { valid: true, schemaJson: null, warning: null };
    }
    try {
      parsed = JSON.parse(cleanText);
    } catch (err) {
      return { valid: false, error: `Invalid JSON syntax: ${err.message}` };
    }
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { valid: false, error: "Schema must be a JSON object or array of objects." };
  }

  // Check for aggregateRating or review if not allowed
  const jsonString = JSON.stringify(parsed);
  const containsRatings = /\b(aggregateRating|review)\b/i.test(jsonString);
  if (containsRatings && !allowRatings) {
    return {
      valid: false,
      error:
        'Schema contains "aggregateRating" or "review". Please confirm this rating markup or remove it before saving.',
      warning: "contains_ratings",
    };
  }

  // Validate objects structure
  const items = Array.isArray(parsed) ? parsed : [parsed];
  if (items.length === 0) {
    return { valid: true, schemaJson: null, warning: null };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return { valid: false, error: `Schema item at index ${i} must be a valid JSON object.` };
    }
    const hasType = Boolean(item["@type"]);
    const hasGraph = Array.isArray(item["@graph"]) && item["@graph"].length > 0;
    if (!hasType && !hasGraph) {
      return {
        valid: false,
        error: `Schema item at index ${i} must contain a "@type" property or an "@graph" array.`,
      };
    }
  }

  return { valid: true, schemaJson: parsed, warning: containsRatings ? "contains_ratings" : null };
}
