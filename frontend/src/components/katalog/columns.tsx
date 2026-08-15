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
      header: () => <div className="text-center font-black text-blue-900">NO.</div>,
      size: 50,
      cell: ({ row }) => (
        <div className="text-center font-black text-slate-500 text-xs">
          {(currentPage - 1) * pageSize + row.index + 1}
        </div>
      ),
    }),
    columnHelper.accessor("archiveCode", {
      header: () => <div className="text-center font-black text-blue-900">KODE ARSIP</div>,
      size: 125,
      cell: ({ getValue }) => (
        <div className="text-center font-mono text-xs font-black">
          <span className="inline-block bg-amber-300 text-blue-950 px-2.5 py-1 border border-blue-900 shadow-[1.5px_1.5px_0px_#1E3A8A] tracking-wider">
            {getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("title", {
      header: () => <span className="font-black text-blue-900">INFO ARSIP</span>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col pr-2 max-w-[360px] lg:max-w-[480px]">
            <button
              type="button"
              onClick={() => onDetail(item)}
              className="text-left block w-full group/title cursor-pointer"
              title={`Klik untuk melihat detail: "${item.title}"`}
            >
              <span className="block font-black text-blue-950 text-base leading-snug line-clamp-2 overflow-hidden text-ellipsis group-hover/title:text-orange-600 transition-colors">
                {item.title}
              </span>
            </button>
            <span className="font-semibold text-slate-600 mt-1 text-xs tracking-tight">
              {item.author} • <span className="text-slate-500">{item.year}</span>
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("type", {
      header: () => <span className="font-black text-blue-900">JENIS / KATEGORI</span>,
      size: 180,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-1 items-start">
            <Badge
              variant="outline"
              className="text-xs border-2 border-blue-900 text-blue-900 font-bold bg-white shadow-[1px_1px_0px_#1E3A8A]"
            >
              {item.type}
            </Badge>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {item.category}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("location", {
      header: () => <span className="font-black text-blue-900">LOKASI</span>,
      size: 110,
      cell: ({ getValue }) => {
        const val = getValue();
        return (
          <span className="font-semibold text-slate-700 text-sm">
            {val || <span className="text-slate-400 font-normal italic">-</span>}
          </span>
        );
      },
    }),
    columnHelper.accessor("stock", {
      header: () => <div className="text-center font-black text-blue-900">STOK</div>,
      size: 80,
      cell: ({ getValue }) => {
        const stock = getValue();
        return (
          <div className="text-center">
            <Badge
              variant={stock > 0 ? "default" : "destructive"}
              className={`border-2 border-blue-900 font-black uppercase text-xs ${
                stock > 0
                  ? "bg-emerald-400 text-blue-900 hover:bg-emerald-500 shadow-[2px_2px_0px_#1E3A8A]"
                  : "bg-red-500 text-white shadow-[2px_2px_0px_#1E3A8A]"
              }`}
            >
              {stock}
            </Badge>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-center font-black text-blue-900">AKSI</div>,
      size: 140,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-center items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDetail(item)}
              className="h-8 w-8 border-2 border-blue-900 text-blue-950 bg-amber-200 hover:bg-amber-300 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              title="Lihat Detail Lengkap"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(item)}
              className="h-8 w-8 border-2 border-blue-900 text-blue-900 bg-white hover:bg-blue-50 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              title="Edit Data Arsip"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(item)}
              className="h-8 w-8 border-2 border-blue-900 text-red-600 bg-red-50 hover:bg-red-100 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              title="Hapus Arsip"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    }),
  ];
}
