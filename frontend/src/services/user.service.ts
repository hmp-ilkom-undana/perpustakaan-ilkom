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

export interface BorrowingHistoryItem {
  id: string;
  archiveTitle: string;
  archiveCode: string;
  category: string;
  archiveType: string;
  borrowDate: string;
  returnDate: string | null;
  status: string;
  fineAmount: number;
  kondisiKembali?: string | null;
  pickupCode?: string | null;
}

export const userService = {
  getAll: async (): Promise<UserItem[]> => {
    const response = await api.get("/api/users");
    return response.data;
  },

  getStudents: async (search?: string): Promise<UserItem[]> => {
    const response = await api.get("/api/users/students", {
      params: search ? { search } : undefined,
    });
    return response.data;
  },

  getStudentBorrowings: async (
    userId: string
  ): Promise<BorrowingHistoryItem[]> => {
    const response = await api.get(`/api/users/students/${userId}/borrowings`);
    return response.data;
  },

  getStaff: async (search?: string): Promise<UserItem[]> => {
    const response = await api.get("/api/users/staff", {
      params: search ? { search } : undefined,
    });
    return response.data;
  },

  createStaff: async (data: {
    name: string;
    email: string;
    wa_number?: string;
    password?: string;
    status?: string;
  }) => {
    const response = await api.post("/api/users/staff", data);
    return response.data;
  },

  updateStaff: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      wa_number?: string;
      status?: string;
    }
  ) => {
    const response = await api.patch(`/api/users/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id: string) => {
    const response = await api.delete(`/api/users/staff/${id}`);
    return response.data;
  },

  resetPassword: async (identifier: string) => {
    const response = await api.post("/api/users/reset-password", { identifier });
    return response.data;
  },

  toggleStatus: async (id: string, status: "Aktif" | "Non-Aktif") => {
    const response = await api.patch(`/api/users/staff/${id}`, { status });
    return response.data;
  },
};
