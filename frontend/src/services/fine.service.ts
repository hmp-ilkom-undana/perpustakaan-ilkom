import api from "@/lib/api";

export type FineStatus = "UNPAID" | "PAID";
export type FineType = "Terlambat" | "Kerusakan Fisik" | "Kehilangan Arsip" | string;

export interface FineItem {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  studentEmail?: string;
  studentPhone?: string;
  archiveTitle: string;
  archiveCode?: string;
  fineType: FineType;
  amount: number;
  status: FineStatus;
  createdAt: string;
  paidAt?: string | null;
  paymentMethod?: "Tunai" | "Transfer" | string | null;
  receivedBy?: string | null;
  notes?: string | null;
  borrowStatus?: string;
}

export interface FineStats {
  totalUnpaidAmount: number;
  unpaidCount: number;
  totalPaidAmount: number;
  paidCount: number;
  blockedStudentsCount: number;
}

export interface FineQueryParams {
  status?: "UNPAID" | "PAID" | string;
  search?: string;
}

export interface PayFinePayload {
  paymentMethod: "Tunai" | "Transfer" | string;
  notes?: string;
}

export const fineService = {
  getAll: async (params?: FineQueryParams): Promise<FineItem[]> => {
    const response = await api.get("/api/fines", { params });
    return response.data;
  },

  getStats: async (): Promise<FineStats> => {
    const response = await api.get("/api/fines/stats");
    return response.data;
  },

  pay: async (id: string, payload: PayFinePayload): Promise<FineItem> => {
    const response = await api.patch(`/api/fines/${id}/pay`, payload);
    return response.data;
  },
};
