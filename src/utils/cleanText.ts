export function cleanText(text: string | null): string | null {
  if (!text) return null;
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\(Source:.*?\)/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
