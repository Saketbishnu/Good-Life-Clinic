import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: backendUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const isAuthTokenError = (error) => {
  const status = error.response?.status;
  const message = String(error.response?.data?.message || "").toLowerCase();

  return (
    status === 401 &&
    (
      message.includes("jwt expired") ||
      message.includes("authorization failed") ||
      message.includes("token is invalid") ||
      message.includes("token is missing") ||
      message.includes("not authorized")
    )
  );
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAuthTokenError(error)) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-token-cleared"));

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
