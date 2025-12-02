/**
 * Optimized Categorization Logic
 * Includes specific detection for Indian Documents (Aadhaar, PAN, Voter ID, GST).
 */
export const categorizeDocument = (text) => {
  if (!text) return "General";

  const lower = text.toLowerCase();

  const categories = [
    // --- Indian Specific Documents ---
    {
      name: "Aadhaar",
      // Matches 'Aadhaar', 'UIDAI', or the specific text usually found on the card
      keywords: /aadhaar|uidai|unique identification authority|mera aadhaar/i,
    },
    {
      name: "PAN",
      // 'pan' is too generic (matches 'japan', 'company'), so we check for 'pan card' or the full department name
      keywords:
        /permanent account number|income tax department|pan card|govt\.? of india/i,
    },
    {
      name: "Voter ID",
      keywords:
        /election commission|elector's photo|epic no|voter identity|identity card/i,
    },

    // --- Standard Documents (Enhanced) ---
    {
      name: "Passport",
      keywords: /passport|republic|nationality|surname|given names/i,
    },
    {
      name: "Invoice",
      // Added GSTIN, CGST, SGST, IGST for Indian context
      keywords:
        /invoice|bill to|total amount|tax|gst|gstin|cgst|sgst|igst|due date/i,
    },
    {
      name: "Licence",
      keywords: /driving|licence|license|permit|driver|union of india/i,
    },
    {
      name: "Insurance",
      keywords: /insurance|policy number|coverage|premium|sum assured/i,
    },
    {
      name: "Receipt",
      keywords: /receipt|payment|transaction|paid|acknowledgement/i,
    },
    {
      name: "Contract",
      keywords: /agreement|contract|signed|witness|memorandum|deed/i,
    },
    {
      name: "Academic",
      keywords:
        /university|college|school|grade|transcript|certificate|marksheet|board/i,
    },
  ];

  for (const cat of categories) {
    if (cat.keywords.test(lower)) {
      return cat.name;
    }
  }

  return "Others";
};
