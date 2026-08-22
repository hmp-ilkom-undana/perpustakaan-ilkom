import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { CatalogItem } from "@/types/katalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper<CatalogItem>();

export interface KatalogColumnActions {
  currentPage: number;
  pageSize?: number;
  onDetail: (item: CatalogItem) => void;
  onEdit: (item: CatalogItem) => void;
  onDelete: (item: CatalogItem) => void;
}

export function getKatalogColumns({
  currentPage,
  pageSize = 10,
  onDetail,
  onEdit,
  onDelete,
}: KatalogColumnActions): ColumnDef<CatalogItem, any>[] {
  return [
    columnHelper.display({
      id: "no",
      header: () => (
        <div className="text-center font-black text-blue-950">NO.</div>
      ),
      size: 50,
      cell: ({ row }) => (
        <div className="text-center font-black text-slate-500 text-xs">
          {(currentPage - 1) * pageSize + row.index + 1}
        </div>
      ),
    }),
    columnHelper.accessor("archiveCode", {
      header: () => (
        <div className="text-center font-black text-blue-950">KODE ARSIP</div>
      ),
      size: 130,
      cell: ({ getValue }) => (
        <div className="text-center">
          <Badge
            variant="amber"
            className="font-mono text-xs font-black tracking-wider border-2"
          >
            {getValue()}
          </Badge>
        </div>
      ),
    }),
    columnHelper.accessor("title", {
      header: () => (
        <span className="font-black text-blue-950">INFO ARSIP</span>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col pr-2 max-w-[340px] lg:max-w-[460px]">
            <button
              type="button"
              onClick={() => onDetail(item)}
              className="text-left block w-full group/title cursor-pointer"
              title={`Klik untuk melihat detail: "${item.title}"`}
            >
              <span className="block font-black text-blue-950 text-sm leading-snug line-clamp-2 overflow-hidden text-ellipsis group-hover/title:text-orange-600 transition-colors">
                {item.title}
              </span>
            </button>
            <span className="font-semibold text-slate-600 mt-1 text-xs tracking-tight">
              {item.author} •{" "}
              <span className="text-slate-500 font-medium">{item.year}</span>
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("type", {
      header: () => (
        <div className="text-center font-black text-blue-950">
          JENIS / KATEGORI
        </div>
      ),
      size: 180,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-1 items-center justify-center text-center">
            <Badge
              variant="outline"
              className="text-xs font-black h-auto py-0.5 px-2.5 whitespace-normal text-center max-w-full"
            >
              {item.type}
            </Badge>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
              {item.category}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("location", {
      header: () => (
        <div className="text-center font-black text-blue-950">LOKASI</div>
      ),
      size: 110,
      cell: ({ getValue }) => {
        const val = getValue();
        return (
          <div className="text-center font-bold text-slate-700 text-xs">
            {val || <span className="text-slate-400 font-normal italic">-</span>}
          </div>
        );
      },
    }),
    columnHelper.accessor("stock", {
      header: () => (
        <div className="text-center font-black text-blue-950">STOK</div>
      ),
      size: 80,
      cell: ({ getValue }) => {
        const stock = getValue();
        return (
          <div className="text-center">
            <Badge
              variant={stock > 0 ? "emerald" : "rose"}
              className="font-black text-xs min-w-8 justify-center"
            >
              {stock}
            </Badge>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => (
        <div className="text-center font-black text-blue-950">AKSI</div>
      ),
      size: 135,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-center items-center gap-1.5">
            <Button
              variant="amber"
              size="icon"
              onClick={() => onDetail(item)}
              className="h-8 w-8 cursor-pointer"
              title="Lihat Detail Lengkap"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(item)}
              className="h-8 w-8 cursor-pointer text-blue-900 bg-white hover:bg-blue-50"
              title="Edit Data Arsip"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(item)}
              className="h-8 w-8 cursor-pointer"
              title="Hapus Arsip"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    }),
  ];
}
