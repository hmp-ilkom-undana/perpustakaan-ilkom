import api from "@/lib/api";

export type UserRole = "ADMIN" | "PETUGAS" | "MAHASISWA";

export interface UserItem {
  id: string;
  name: string;
  identifier: string;
  nim?: string;
  email?: string;
  wa_number?: string;
  role: UserRole;
  status: "Aktif" | "Non-Aktif" | string;
  createdAt?: string;
  activeBorrowings?: number;
}

export const userService = {
  getAll: async (): Promise<UserItem[]> => {
    const response = await api.get("/api/users");
    return response.data;
  },

  getStudents: async (): Promise<UserItem[]> => {
    const response = await api.get("/api/users/students");
    return response.data;
  },

  getStaff: async (): Promise<UserItem[]> => {
    const response = await api.get("/api/users/staff");
    return response.data;
  },

  resetPassword: async (identifier: string) => {
    const response = await api.post("/api/users/reset-password", { identifier });
    return response.data;
  },

  toggleStatus: async (id: string, status: "Aktif" | "Non-Aktif") => {
    const response = await api.patch(`/api/users/${id}/status`, { status });
    return response.data;
  },
};
