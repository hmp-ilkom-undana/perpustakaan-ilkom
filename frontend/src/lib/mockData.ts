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
  // REQUESTED
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
    id: "REQ-8201",
    studentName: "Nadia Putri",
    studentId: "20051234055",
    archiveTitle: "Rancang Bangun Sistem Pakar Diagnosa Penyakit Padi",
    archiveType: "Skripsi",
    status: "REQUESTED",
    requestDate: "2026-07-24T09:15:00",
  },
  {
    id: "REQ-8202",
    studentName: "Fajar Nugroho",
    studentId: "21051234088",
    archiveTitle: "Pengenalan Pola Sidik Jari dengan Metode CNN",
    archiveType: "Skripsi",
    status: "REQUESTED",
    requestDate: "2026-07-24T10:30:00",
  },

  // WAITING_PICKUP
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
    id: "REQ-8198",
    studentName: "Reza Rahadian",
    studentId: "19051234099",
    archiveTitle: "Arsitektur Komputer Modern",
    archiveType: "Buku",
    status: "WAITING_PICKUP",
    requestDate: "2026-07-23T14:20:00",
    approvedBy: "NIP-002 (Petugas)",
  },

  // BORROWED
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
    dueDate: "2026-07-16T14:00:00",
  },
  {
    id: "REQ-8196",
    studentName: "Maya Indah",
    studentId: "22051234011",
    archiveTitle: "Optimasi Query Database dengan Indexing",
    archiveType: "Naskah Publikasi",
    status: "BORROWED",
    requestDate: "2026-07-10T11:00:00",
    approvedBy: "NIP-002 (Petugas)",
    handoverBy: "NIP-001 (Admin)",
    borrowDate: "2026-07-11T09:30:00",
    dueDate: "2026-08-11T09:30:00",
  },
  {
    id: "REQ-8199",
    studentName: "Kevin Sanjaya",
    studentId: "20051234044",
    archiveTitle: "Pemrograman Web Lanjut",
    archiveType: "Buku",
    status: "BORROWED",
    requestDate: "2026-07-15T13:00:00",
    approvedBy: "NIP-001 (Admin)",
    handoverBy: "NIP-002 (Petugas)",
    borrowDate: "2026-07-16T10:00:00",
    dueDate: "2026-08-16T10:00:00",
  },

  // OVERDUE
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
  },
  {
    id: "REQ-8200",
    studentName: "Tono Mulyono",
    studentId: "18051234066",
    archiveTitle: "Sistem Kendali Robotik",
    archiveType: "Buku",
    status: "OVERDUE",
    requestDate: "2026-04-10T08:00:00",
    approvedBy: "NIP-002 (Petugas)",
    handoverBy: "NIP-001 (Admin)",
    borrowDate: "2026-04-11T09:00:00",
    dueDate: "2026-05-11T09:00:00",
    fine: 215000,
  }
];

const STORAGE_KEY = "circ_mock_db_v2";

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
