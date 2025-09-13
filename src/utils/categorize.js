export const categorizeDocument = (text) => {
  const lower = text.toLowerCase();

  if (lower.includes("password")) return "Passport";
  if (lower.includes("invoice")) return "Invoice";
  if (lower.includes("licence")) return "Licence";
  if (lower.includes("insurance")) return "Insurance";

  return "Others";
};
