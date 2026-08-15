import api from "@/lib/api";

export type FineStatus = "UNPAID" | "PAID";
export type FineType = "Terlambat" | "Kerusakan Fisik" | "Kehilangan Arsip";

export interface FineItem {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  archiveTitle: string;
  fineType: FineType;
  amount: number;
  status: FineStatus;
  createdAt: string;
  paidAt?: string;
  paymentMethod?: "Tunai" | "Transfer";
  receivedBy?: string;
  notes?: string;
}

export interface PayFinePayload {
  method: "Tunai" | "Transfer";
  notes: string;
  officerName: string;
}

export const fineService = {
  getAll: async (): Promise<FineItem[]> => {
    const response = await api.get("/api/fines");
    return response.data;
  },

  pay: async (id: string, payload: PayFinePayload) => {
    const response = await api.patch(`/api/fines/${id}/pay`, payload);
    return response.data;
  },
};
