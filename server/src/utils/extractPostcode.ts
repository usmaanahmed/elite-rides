// Customer ke address text me se UK postcode nikalta hai (aakhri postcode jaisa text), e.g.
// "Heathrow Airport, Longford TW6 1EW" -> "TW61EW". Na mile to "" wapas karta hai.
// Spaces hata kar uppercase me deta hai taake congestion prefix (e.g. "EC1") se compare ho sake.
export function extractPostcode(address: string): string {
  // Outward code (e.g. "EC1A", "TW6") aur optional inward code (e.g. "1BB")
  const postcodePattern = /\b[A-Z]{1,2}\d[A-Z\d]?(?:\s*\d[A-Z]{2})?\b/gi;
  const matches = address.match(postcodePattern);

  if (!matches) {
    return "";
  }

  const lastMatch = matches[matches.length - 1];
  return lastMatch.replace(/\s+/g, "").toUpperCase();
}
