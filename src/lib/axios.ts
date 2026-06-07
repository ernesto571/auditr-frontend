import axiosLib from "axios";

const axios = axiosLib.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:3001/api"
    : `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});

axios.interceptors.request.use((config) => {
  console.log("🌐 Making request to:", config.url);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log("✅ Response from:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("❌ Request failed:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default axios;