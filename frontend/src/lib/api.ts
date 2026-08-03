import axios from "axios";

// Ambil hostname dari browser, jika localhost gunakan localhost, jika tidak fallback ke VITE_API_URL
export const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Pastikan cookie/session selalu dikirim
});

export default api;
