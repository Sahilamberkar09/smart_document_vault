// Use env var or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) => {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
    credentials: "include", // IMPORTANT: This allows cookies to be sent/received
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // If we get a 401, the AuthContext will handle the state update usually,
    // but throwing here allows the calling component to handle errors UI.
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
