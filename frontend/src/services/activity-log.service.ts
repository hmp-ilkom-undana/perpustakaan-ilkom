import api from "@/lib/api";

export type ActivityRole = "ADMIN" | "PETUGAS" | "MAHASISWA";

export interface ActivityLogItem {
  id: string;
  userId: string | null;
  userName: string;
  userRole: ActivityRole;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string | null;
  description: string;
  metadata?: any | null;
  createdAt: string;
}

export interface ActivityLogStats {
  totalLogs: number;
  todayLogs: number;
  adminLogs: number;
  petugasLogs: number;
  topActions: Array<{ action: string; count: number }>;
}

export interface ActivityLogQueryParams {
  search?: string;
  role?: ActivityRole | "ALL" | string;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ActivityLogPaginationResponse {
  data: ActivityLogItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const activityLogService = {
  getLogs: async (
    params?: ActivityLogQueryParams,
  ): Promise<ActivityLogPaginationResponse> => {
    const queryParams: Record<string, any> = {};

    if (params?.search) queryParams.search = params.search;
    if (params?.role && params.role !== "ALL") queryParams.role = params.role;
    if (params?.action && params.action !== "ALL") queryParams.action = params.action;
    if (params?.entity && params.entity !== "ALL") queryParams.entity = params.entity;
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const response = await api.get("/api/activity-logs", {
      params: queryParams,
    });
    return response.data;
  },

  getStats: async (): Promise<ActivityLogStats> => {
    const response = await api.get("/api/activity-logs/stats");
    return response.data;
  },
};
