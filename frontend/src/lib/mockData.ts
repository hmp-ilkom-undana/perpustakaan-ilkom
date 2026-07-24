export type CircStatus = "REQUESTED" | "WAITING_PICKUP" | "BORROWED" | "OVERDUE" | "COMPLETED" | "REJECTED" | "LOST" | "DAMAGED";

export interface CirculationItem {
  id: string;
  studentName: string;
  studentId: string;
  archiveTitle: string;
  archiveType: string;
  status: CircStatus;
  requestDate: string;
  approvedBy?: string;
  handoverBy?: string;
  borrowDate?: string;
  dueDate?: string;
  fine?: number;
  note?: string;
}

const INITIAL_DATA: CirculationItem[] = [
  {
    id: "REQ-8192",
    studentName: "Budi Santoso",
    studentId: "19051234001",
    archiveTitle: "Analisis Algoritma Dijkstra pada Jaringan Distribusi",
    archiveType: "Skripsi",
    status: "REQUESTED",
    requestDate: "2026-07-24T08:00:00",
  },
  {
    id: "REQ-8193",
    studentName: "Siti Aminah",
    studentId: "20051234002",
    archiveTitle: "Sistem Informasi Manajemen Perpustakaan",
    archiveType: "Buku",
    status: "WAITING_PICKUP",
    requestDate: "2026-07-23T10:00:00",
    approvedBy: "NIP-001 (Admin)",
  },
  {
    id: "REQ-8194",
    studentName: "Andi Saputra",
    studentId: "21051234003",
    archiveTitle: "Dasar-Dasar Keamanan Jaringan Komputer",
    archiveType: "Buku",
    status: "BORROWED",
    requestDate: "2026-06-15T09:00:00",
    approvedBy: "NIP-001 (Admin)",
    handoverBy: "NIP-001 (Admin)",
    borrowDate: "2026-06-16T14:00:00",
    dueDate: "2026-07-16T14:00:00", // Already past due date, but keeping it borrowed to show transition
  },
  {
    id: "REQ-8195",
    studentName: "Dina Mariana",
    studentId: "22051234004",
    archiveTitle: "Penerapan Machine Learning dalam Prediksi Cuaca",
    archiveType: "Naskah Publikasi",
    status: "OVERDUE",
    requestDate: "2026-05-01T09:00:00",
    approvedBy: "NIP-001 (Admin)",
    handoverBy: "NIP-001 (Admin)",
    borrowDate: "2026-05-02T10:00:00",
    dueDate: "2026-06-02T10:00:00",
    fine: 150000,
  }
];

const STORAGE_KEY = "circ_mock_db";

export function getCirculationData(): CirculationItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
}

export function getCirculationItem(id: string): CirculationItem | undefined {
  const data = getCirculationData();
  return data.find(item => item.id === id);
}

export function updateCirculationItem(id: string, updates: Partial<CirculationItem>) {
  const data = getCirculationData();
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
