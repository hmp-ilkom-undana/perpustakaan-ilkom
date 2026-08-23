export type ArchiveCategory =
  | "Machine Learning"
  | "Sistem Informasi"
  | "Sistem Pakar"
  | "SPK"
  | "Kriptografi"
  | "Umum";

export type ArchiveType = "Skripsi" | "Ringkasan Skripsi" | "Naskah Publikasi";

export interface CatalogItem {
  id: string;
  archiveCode: string;
  title: string;
  author: string;
  year: number;
  category: ArchiveCategory;
  type: ArchiveType;
  stock: number;
  location: string;
  quantity?: number;
  shelfLocation?: string;
  archiveType?: string;
  status?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
