export type CircStatus = "REQUESTED" | "WAITING_PICKUP" | "BORROWED" | "OVERDUE" | "COMPLETED" | "REJECTED" | "LOST" | "DAMAGED";

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

const INITIAL_DATA: CirculationItem[] = [
  // REQUESTED
  {
    id: "PK-8192",
    studentName: "Budi Santoso",
    studentId: "19051234001",
    archiveTitle: "Analisis Algoritma Dijkstra pada Jaringan Distribusi",
    archiveType: "Skripsi",
    status: "REQUESTED",
    requestDate: "2026-07-24T08:00:00",
  },
  {
    id: "PK-8201",
    studentName: "Nadia Putri",
    studentId: "20051234055",
    archiveTitle: "Rancang Bangun Sistem Pakar Diagnosa Penyakit Padi",
    archiveType: "Skripsi",
    status: "REQUESTED",
    requestDate: "2026-07-24T09:15:00",
  },
  {
    id: "PK-8202",
    studentName: "Fajar Nugroho",
    studentId: "21051234088",
    archiveTitle: "Pengenalan Pola Sidik Jari dengan Metode CNN",
    archiveType: "Skripsi",
    status: "REQUESTED",
    requestDate: "2026-07-24T10:30:00",
  },

  // WAITING_PICKUP
  {
    id: "PK-8193",
    studentName: "Siti Aminah",
    studentId: "20051234002",
    archiveTitle: "Sistem Informasi Manajemen Perpustakaan",
    archiveType: "Buku",
    status: "WAITING_PICKUP",
    requestDate: "2026-07-23T10:00:00",
    approvedBy: "NIP-001 (Admin)",
  },
  {
    id: "PK-8198",
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
    id: "PK-8194",
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
    id: "PK-8196",
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
    id: "PK-8199",
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
    id: "PK-8195",
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
    id: "PK-8200",
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

// ==========================================
// MOCK DATA: KATALOG (ARCHIVES)
// ==========================================

export type ArchiveCategory = "Machine Learning" | "Sistem Pendukung Keputusan" | "Rekayasa Perangkat Lunak" | "Jaringan Komputer" | "Umum";
export type ArchiveType = "Skripsi" | "Naskah Publikasi" | "Buku";

export interface CatalogItem {
  id: string;
  title: string;
  author: string;
  year: number;
  category: ArchiveCategory;
  type: ArchiveType;
  stock: number;
  location: string;
}

const CATALOG_INITIAL_DATA: CatalogItem[] = [
  {
    id: "ARC-001",
    title: "Analisis Algoritma Dijkstra pada Jaringan Distribusi",
    author: "Budi Santoso",
    year: 2023,
    category: "Jaringan Komputer",
    type: "Skripsi",
    stock: 2,
    location: "Lemari A - Rak 1",
  },
  {
    id: "ARC-002",
    title: "Sistem Informasi Manajemen Perpustakaan",
    author: "Siti Aminah",
    year: 2021,
    category: "Rekayasa Perangkat Lunak",
    type: "Buku",
    stock: 0,
    location: "Lemari B - Rak 2",
  },
  {
    id: "ARC-003",
    title: "Penerapan Machine Learning dalam Prediksi Cuaca",
    author: "Dina Mariana",
    year: 2024,
    category: "Machine Learning",
    type: "Naskah Publikasi",
    stock: 5,
    location: "Lemari C - Rak 1",
  }
];

const CATALOG_STORAGE_KEY = "catalog_mock_db";

export function getCatalogData(): CatalogItem[] {
  const stored = localStorage.getItem(CATALOG_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(CATALOG_INITIAL_DATA));
  return CATALOG_INITIAL_DATA;
}

export function saveCatalogData(data: CatalogItem[]) {
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(data));
}

export function addCatalogItem(item: Omit<CatalogItem, "id">) {
  const data = getCatalogData();
  const newId = `ARC-${String(data.length + 1).padStart(3, '0')}`;
  const newItem = { ...item, id: newId };
  data.unshift(newItem);
  saveCatalogData(data);
  return newItem;
}

export function updateCatalogItem(id: string, updates: Partial<CatalogItem>) {
  const data = getCatalogData();
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    saveCatalogData(data);
  }
}

export function deleteCatalogItem(id: string) {
  const data = getCatalogData();
  const filtered = data.filter(item => item.id !== id);
  saveCatalogData(filtered);
}

// ==========================================
// MOCK DATA: DENDA (FINES)
// ==========================================

export type FineStatus = "UNPAID" | "PAID";
export type FineType = "Terlambat" | "Kerusakan Fisik" | "Kehilangan Arsip";

export interface FineItem {
  id: string; // e.g. FIN-001
  transactionId: string; // e.g. REQ-8192
  studentName: string;
  studentId: string;
  archiveTitle: string;
  fineType: FineType;
  amount: number;
  status: FineStatus;
  createdAt: string;
  // Audit Trail (only if PAID)
  paidAt?: string;
  paymentMethod?: "Tunai" | "Transfer";
  receivedBy?: string;
  notes?: string;
}

const FINE_INITIAL_DATA: FineItem[] = [
  {
    id: "FIN-001",
    transactionId: "REQ-8150",
    studentName: "Budi Santoso",
    studentId: "19051234001",
    archiveTitle: "Analisis Algoritma Dijkstra pada Jaringan Distribusi",
    fineType: "Terlambat",
    amount: 25000,
    status: "UNPAID",
    createdAt: "2026-07-20T09:00:00",
  },
  {
    id: "FIN-002",
    transactionId: "REQ-8110",
    studentName: "Ahmad Fauzi",
    studentId: "18051234022",
    archiveTitle: "Sistem Informasi Manajemen Perpustakaan",
    fineType: "Kerusakan Fisik",
    amount: 150000,
    status: "UNPAID",
    createdAt: "2026-07-22T10:30:00",
  },
  {
    id: "FIN-003",
    transactionId: "REQ-8099",
    studentName: "Siti Aminah",
    studentId: "20051234002",
    archiveTitle: "Dasar-Dasar Keamanan Jaringan Komputer",
    fineType: "Terlambat",
    amount: 50000,
    status: "UNPAID",
    createdAt: "2026-07-23T11:15:00",
  },
  {
    id: "FIN-004",
    transactionId: "REQ-8055",
    studentName: "Dina Mariana",
    studentId: "22051234004",
    archiveTitle: "Penerapan Machine Learning dalam Prediksi Cuaca",
    fineType: "Terlambat",
    amount: 150000,
    status: "PAID",
    createdAt: "2026-06-02T10:00:00",
    paidAt: "2026-06-10T14:20:00",
    paymentMethod: "Tunai",
    receivedBy: "Petugas Perpustakaan",
    notes: "Uang pas",
  },
  {
    id: "FIN-005",
    transactionId: "REQ-8012",
    studentName: "Tono Mulyono",
    studentId: "18051234066",
    archiveTitle: "Sistem Kendali Robotik",
    fineType: "Kehilangan Arsip",
    amount: 300000,
    status: "PAID",
    createdAt: "2026-05-11T09:00:00",
    paidAt: "2026-05-15T09:30:00",
    paymentMethod: "Transfer",
    receivedBy: "Petugas Perpustakaan",
    notes: "Transfer BCA",
  }
];

const FINE_STORAGE_KEY = "fine_mock_db";

export function getFineData(): FineItem[] {
  const stored = localStorage.getItem(FINE_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(FINE_STORAGE_KEY, JSON.stringify(FINE_INITIAL_DATA));
  return FINE_INITIAL_DATA;
}

export function saveFineData(data: FineItem[]) {
  localStorage.setItem(FINE_STORAGE_KEY, JSON.stringify(data));
}

export function payFine(id: string, method: "Tunai" | "Transfer", notes: string, officerName: string) {
  const data = getFineData();
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { 
      ...data[index], 
      status: "PAID",
      paidAt: new Date().toISOString(),
      paymentMethod: method,
      receivedBy: officerName,
      notes: notes
    };
    saveFineData(data);
  }
}
