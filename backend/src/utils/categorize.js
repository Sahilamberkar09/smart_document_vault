/**
 * Categorizes a document based on its text content using keyword matching.
 * @param {string} text - The text extracted from the document via OCR.
 * @returns {Promise<string>} - The determined category.
 */
export const categorizeDocument = async (text) => {
  if (!text || text.trim().length === 0) {
    return "Uncategorized";
  }

  const lowerText = text.toLowerCase();

  // Define keywords for each category
  const categories = {
    Invoice: [
      "invoice",
      "bill to",
      "due date",
      "balance due",
      "tax invoice",
      "gst",
      "vat",
    ],
    Receipt: [
      "receipt",
      "total",
      "amount",
      "cash",
      "credit card",
      "payment",
      "transaction",
    ],
    Contract: [
      "agreement",
      "contract",
      "parties",
      "witness",
      "signed",
      "terms and conditions",
      "whereas",
    ],
    Resume: [
      "resume",
      "experience",
      "education",
      "skills",
      "curriculum vitae",
      "cv",
      "profile",
      "work history",
    ],
    Report: [
      "report",
      "summary",
      "conclusion",
      "analysis",
      "introduction",
      "overview",
      "status",
    ],
    Personal: [
      "personal",
      "confidential",
      "dear",
      "sincerely",
      "letter",
      "diary",
    ],
    Bill: [
      "bill",
      "statement",
      "payment due",
      "utility",
      "electricity",
      "gas",
      "water",
    ],
  };

  let bestCategory = "Other";
  let maxMatches = 0;

  // Count keyword matches for each category
  for (const [category, keywords] of Object.entries(categories)) {
    let matches = 0;
    keywords.forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        matches++;
      }
    });

    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  // If no significant matches are found, default to 'Other'
  if (maxMatches === 0) {
    return "Other";
  }

  return bestCategory;
};
