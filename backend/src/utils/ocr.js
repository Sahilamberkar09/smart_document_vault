import tesseract from "tesseract.js";

/**
 * Extracts text from an image file using Tesseract.js.
 * @param {string} filePath - Path to the image file.
 * @returns {Promise<string>} - Extracted text.
 */
export const extractText = async (filePath) => {
  try {
    console.log(`Starting OCR for file: ${filePath}`);

    // Recognize text from the image
    const {
      data: { text },
    } = await tesseract.recognize(filePath, "eng", {
      // logger: m => console.log(m) // Uncomment for progress logging
    });

    console.log("OCR completed successfully.");
    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    return "";
  }
};
