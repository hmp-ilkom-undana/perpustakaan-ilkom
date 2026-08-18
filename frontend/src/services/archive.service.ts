import api from "@/lib/api";
import type { CatalogItem } from "@/types/katalog";

export interface ArchiveQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  category?: string;
  availability?: string;
}

export interface PaginatedArchiveResponse {
  data: CatalogItem[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ArchivePayload {
  title: string;
  author: string;
  year: number;
  category: string;
  archiveType: string;
  quantity: number;
  shelfLocation: string;
}

const mapArchive = (item: any): CatalogItem => ({
  id: item.id,
  archiveCode: item.archiveCode,
  title: item.title,
  author: item.author,
  year: item.year,
  category: item.category,
  type: item.archiveType,
  stock: item.quantity,
  location: item.shelfLocation || "",
});

export const archiveService = {
  getAll: async (params: ArchiveQueryParams): Promise<PaginatedArchiveResponse> => {
    const response = await api.get("/api/archives", { params });
    return {
      data: response.data.data.map(mapArchive),
      meta: response.data.meta,
    };
  },

  getPublic: async (params?: ArchiveQueryParams): Promise<{ data: any[]; meta: any }> => {
    const response = await api.get("/api/archives", { params: { limit: 8, ...params } });
    return {
      data: response.data.data ?? response.data,
      meta: response.data.meta ?? {
        total: Array.isArray(response.data) ? response.data.length : 0,
        totalPages: 1,
        page: 1,
        limit: params?.limit || 8,
      },
    };
  },

  create: async (payload: ArchivePayload) => {
    const response = await api.post("/api/archives", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<ArchivePayload>) => {
    const response = await api.patch(`/api/archives/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/archives/${id}`);
    return response.data;
  },

  import: async (formData: FormData) => {
    const response = await api.post("/api/archives/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
