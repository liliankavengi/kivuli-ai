import axios from "axios";

const API = axios.create({
  // Use env var or fallback to local Django server
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
});

// You can add request/response interceptors here (e.g., for JWT tokens)
API.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
