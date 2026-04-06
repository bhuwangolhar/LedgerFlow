import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000, // 30 second timeout for production
  withCredentials: true, // Send cookies for CORS
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network error - server may be down");
      return Promise.reject(new Error("Unable to connect to server. Please check your internet connection."));
    }

    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      // Only redirect if not already on signin page
      if (window.location.pathname !== "/signin") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
    }

    // Handle 5xx server errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.status);
    }

    return Promise.reject(error);
  }
);

export default api;