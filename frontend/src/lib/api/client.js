const DEFAULT_API_URL = "http://localhost:5000";

const getApiBaseUrl = () =>
  (import.meta.env?.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  let payload;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.error || payload?.message || "Gagal mengambil data dari server.";
    throw new Error(message);
  }

  return payload;
}
