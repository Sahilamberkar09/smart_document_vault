// frontend/src/utils/api.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) => {
  const headers = {};

  // FIX: Retrieve token from localStorage and set Authorization header
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
    // credentials: "include", // Not strictly needed since backend doesn't use cookies, but harmless to leave
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
// FIX: Changed "/document" to "/documents" to match backend server.js routes
export const getDocuments = (query = "") => apiRequest(`/documents${query}`);
export const deleteDocument = (id) => apiRequest(`/documents/${id}`, "DELETE");
export const uploadDocument = (formData) =>
  apiRequest(`/documents/upload`, "POST", formData, true);

export default apiRequest;
