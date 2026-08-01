import axios from "axios";

// Ambil URL dari .env, atau fallback ke localhost jika tidak ada
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Pastikan cookie/session selalu dikirim
});

export default api;
