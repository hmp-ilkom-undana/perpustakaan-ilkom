import { useQuery } from "@tanstack/react-query";
import { archiveService, type ArchiveQueryParams } from "@/services/archive.service";

export const ARCHIVE_QUERY_KEY = "archives";

export function useArchiveQuery(params: ArchiveQueryParams) {
  return useQuery({
    queryKey: [ARCHIVE_QUERY_KEY, params],
    queryFn: () => archiveService.getAll({ ...params, limit: 10 }),
    placeholderData: (prev) => prev,
  });
}

export function usePublicArchiveQuery(params?: ArchiveQueryParams) {
  return useQuery({
    queryKey: [ARCHIVE_QUERY_KEY, "public", params],
    queryFn: () => archiveService.getPublic(params),
    placeholderData: (prev) => prev,
  });
}
