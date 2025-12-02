const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
// Ensure GEMINI_API_KEY is set in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Categorizes a document based on its text content using Gemini 1.5 Flash.
 * @param {string} text - The text extracted from the document via OCR.
 * @returns {Promise<string>} - The determined category.
 */
const categorizeDocument = async (text) => {
  if (!text || text.trim().length === 0) {
    return "Uncategorized";
  }

  try {
    // Use the flash model for speed and efficiency
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following text extracted from a document and categorize it into exactly one of these categories: 
      "Invoice", "Receipt", "Contract", "Resume", "Report", "Personal", "Bill", or "Other".

      If the text is too sparse or ambiguous to determine a category, return "Other".
      Return *only* the category name as a single string. Do not include any explanation or punctuation.

      Document Text:
      "${text.substring(
        0,
        3000
      )}" // Truncate to avoid token limits if necessary, though 1.5 Flash has a large window
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const category = response.text().trim();

    // Clean up response just in case (remove potential markdown or extra spaces)
    const cleanedCategory = category.replace(/[^a-zA-Z]/g, "");

    // Validate against expected categories
    const validCategories = [
      "Invoice",
      "Receipt",
      "Contract",
      "Resume",
      "Report",
      "Personal",
      "Bill",
      "Other",
    ];

    // Simple fuzzy match or fallback
    const match = validCategories.find((c) =>
      cleanedCategory.toLowerCase().includes(c.toLowerCase())
    );

    return match || "Other";
  } catch (error) {
    console.error("AI Categorization Error:", error);
    // Fallback if AI fails
    return "Uncategorized";
  }
};

module.exports = { categorizeDocument };
