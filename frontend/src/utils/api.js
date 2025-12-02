// Unified API helper using fetch with cookies (httpOnly JWT cookie on backend)
// This file exports `apiRequest` (used by AuthContext) and several
// convenience functions used throughout the frontend.

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
    credentials: "include", // send cookies (httpOnly JWT cookie)
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // No JSON body
  }

  if (!res.ok) {
    throw new Error((data && data.message) || "Something went wrong");
  }

  return data;
};

// Auth
export const loginUser = (userData) =>
  apiRequest("/auth/login", "POST", userData);
export const registerUser = (userData) =>
  apiRequest("/auth/register", "POST", userData);

// Documents
export const getDocuments = (query = "") => apiRequest(`/document${query}`);
export const deleteDocument = (id) => apiRequest(`/document/${id}`, "DELETE");
export const uploadDocument = (formData) =>
  apiRequest(`/document/upload`, "POST", formData, true);

export default apiRequest;
