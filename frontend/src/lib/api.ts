import axios from "axios";

// Ambil hostname dari browser, jika localhost gunakan localhost, jika tidak fallback ke VITE_API_URL
export const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Pastikan cookie/session selalu dikirim
});

// --- API KATALOG ARSIP ---
export const fetchArchives = async () => {
  const response = await api.get("/api/archives");
  return response.data;
};
export const createArchive = async (data: any) => {
  const response = await api.post("/api/archives", data);
  return response.data;
};
export const updateArchive = async (id: string, data: any) => {
  const response = await api.patch(`/api/archives/${id}`, data);
  return response.data;
};
export const deleteArchive = async (id: string) => {
  const response = await api.delete(`/api/archives/${id}`);
  return response.data;
};

export default api;
