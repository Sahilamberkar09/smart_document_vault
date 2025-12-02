/**
 * Optimized Categorization Logic
 * Uses Regex for more robust matching and fixes typos.
 */
export const categorizeDocument = (text) => {
  if (!text) return "General";

  const lower = text.toLowerCase();

  // Keyword mapping with Regex for flexibility
  const categories = [
    {
      name: "Passport",
      keywords: /passport|republic|nationality|surname|given names/i,
    },
    {
      name: "Invoice",
      keywords: /invoice|bill to|total amount|tax|gst|due date/i,
    },
    { name: "Licence", keywords: /driving|licence|license|permit|driver/i },
    {
      name: "Insurance",
      keywords: /insurance|policy number|coverage|premium/i,
    },
    { name: "Receipt", keywords: /receipt|payment|transaction|paid/i },
    { name: "Contract", keywords: /agreement|contract|signed|witness/i },
    {
      name: "Academic",
      keywords: /university|college|school|grade|transcript|certificate/i,
    },
  ];

  for (const cat of categories) {
    if (cat.keywords.test(lower)) {
      return cat.name;
    }
  }

  return "Others";
};
