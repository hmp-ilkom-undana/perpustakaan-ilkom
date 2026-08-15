import api from "@/lib/api";

export type UserRole = "ADMIN" | "PETUGAS" | "MAHASISWA";

export interface UserItem {
  id: string;
  name: string;
  identifier: string;
  role: UserRole;
  status: string;
}

export const userService = {
  getAll: async (): Promise<UserItem[]> => {
    const response = await api.get("/api/users");
    return response.data;
  },

  resetPassword: async (identifier: string) => {
    const response = await api.post("/api/users/reset-password", { identifier });
    return response.data;
  },
};
