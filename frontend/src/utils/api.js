import axios from "axios";

const API_URL = "http://localhost:5000/api";

// --- 1. AXIOS INSTANCE & INTERCEPTORS ---

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Adds Token to every request
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles 401 (Auth) errors globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// --- 2. GENERIC API HELPER FUNCTION ---

/**
 * A wrapper around the axios client to simplify API calls.
 * Automatically handles JSON stringification and error extraction.
 */
export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) => {
  try {
    const config = {
      url: endpoint,
      method: method,
      data: body,
      headers: {},
    };

    // If sending files (FormData), let browser/axios handle Content-Type boundary
    if (isFormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    // Make the request using the interceptor-configured client
    const response = await client(config);

    // Return only data (matching the behavior of your fetch snippet)
    return response.data;
  } catch (error) {
    // Standardize error messages
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    throw new Error(message);
  }
};

// Export the raw client for advanced use-cases
export default client;
