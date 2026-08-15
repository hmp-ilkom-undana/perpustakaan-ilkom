import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getKatalogColumns } from "@/components/katalog/columns";
import { CatalogItem } from "@/types/katalog";

interface Props {
  data: CatalogItem[];
  isLoading: boolean;
  currentPage: number;
  pageSize?: number;
  onDetail: (item: CatalogItem) => void;
  onEdit: (item: CatalogItem) => void;
  onDelete: (item: CatalogItem) => void;
}

export function KatalogDesktopTable({
  data,
  isLoading,
  currentPage,
  pageSize = 10,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  const columns = useMemo(
    () =>
      getKatalogColumns({
        currentPage,
        pageSize,
        onDetail,
        onEdit,
        onDelete,
      }),
    [currentPage, pageSize, onDetail, onEdit, onDelete]
  );

  return (
    <div className="hidden md:block w-full">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyText="Data tidak ditemukan"
      />
    </div>
  );
}
