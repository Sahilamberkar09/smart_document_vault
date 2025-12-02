const API_URL = "http://localhost:5000/api";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) => {
  const token = localStorage.getItem("token");
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
      throw new Error("Session expired");
    }
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
