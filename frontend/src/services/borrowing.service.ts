import api from "@/lib/api";

export type CircStatus =
  | "REQUESTED"
  | "WAITING_PICKUP"
  | "BORROWED"
  | "OVERDUE"
  | "COMPLETED"
  | "REJECTED"
  | "LOST"
  | "DAMAGED"
  | "RETURNED"
  | "CANCELLED";

export interface CirculationItem {
  id: string;
  studentName: string;
  studentId: string;
  archiveTitle: string;
  archiveType: string;
  status: CircStatus;
  requestDate: string;
  pickupCode?: string;
  approvedBy?: string;
  handoverBy?: string;
  borrowDate?: string;
  dueDate?: string;
  fine?: number;
  note?: string;
}

export interface BorrowingData {
  id: string;
  status: string;
  borrowDate: string;
  returnDate: string | null;
  accDate: string | null;
  fineAmount: number;
  pickupCode: string | null;
  archive: {
    title: string;
    author: string;
    archiveType: string;
    category: string;
  };
}

export interface ActiveTicketData {
  id: string;
  pickupCode: string;
  archiveTitle: string;
  archiveType: string;
  status: "REQUESTED" | "WAITING_PICKUP" | "BORROWED" | "OVERDUE";
  requestDate: string;
  dueDate?: string;
  accDate?: string;
}

const mapCirculationItem = (item: any): CirculationItem => ({
  id: item.id,
  studentName: item.user.name,
  studentId: item.user.nim,
  archiveTitle: item.archive.title,
  archiveType: item.archive.archiveType,
  status: item.status as CircStatus,
  requestDate: item.borrowDate,
  dueDate: item.returnDate || "-",
  fine: item.fineAmount,
  approvedBy: item.pickupCode ? "Petugas" : undefined,
});

export const borrowingService = {
  getActive: async (): Promise<CirculationItem[]> => {
    const response = await api.get("/api/borrowings/active");
    return response.data.map(mapCirculationItem);
  },

  getById: async (id: string): Promise<CirculationItem | null> => {
    const response = await api.get("/api/borrowings/active");
    const found = response.data.find((item: any) => item.id === id);
    if (!found) return null;
    return mapCirculationItem(found);
  },

  getMyHistory: async (): Promise<BorrowingData[]> => {
    const response = await api.get("/api/borrowings/my-history");
    return response.data;
  },

  approve: async (id: string) => {
    const response = await api.patch(`/api/borrowings/${id}/approve`);
    return response.data;
  },

  reject: async (id: string, reason: string) => {
    const response = await api.patch(`/api/borrowings/${id}/reject`, { reason });
    return response.data;
  },

  handover: async (id: string, formData: FormData) => {
    const response = await api.patch(`/api/borrowings/${id}/handover`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  returnItem: async (id: string, formData: FormData) => {
    const response = await api.patch(`/api/borrowings/${id}/return`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
