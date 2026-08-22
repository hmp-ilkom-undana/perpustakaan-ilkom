import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2, Loader2, MapPin } from "lucide-react";
import { CatalogItem } from "@/types/katalog";

interface KatalogMobileListProps {
  data: CatalogItem[];
  isLoading: boolean;
  onDetail: (item: CatalogItem) => void;
  onEdit: (item: CatalogItem) => void;
  onDelete: (item: CatalogItem) => void;
}

export function KatalogMobileList({
  data,
  isLoading,
  onDetail,
  onEdit,
  onDelete,
}: KatalogMobileListProps) {
  if (isLoading) {
    return (
      <div className="md:hidden p-10 flex flex-col items-center justify-center gap-2.5 text-blue-950">
        <Loader2 className="w-7 h-7 animate-spin text-orange-500" />
        <span className="font-bold text-xs tracking-wide text-slate-500">
          Memuat data arsip...
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="md:hidden p-10 text-center text-slate-500 font-bold text-xs">
        Tidak ada data arsip yang ditemukan.
      </div>
    );
  }

  return (
    <div className="md:hidden flex flex-col divide-y-2 divide-blue-900">
      {data.map((item) => (
        <div
          key={item.id}
          className="p-4 sm:p-5 flex flex-col bg-white hover:bg-slate-50 transition-colors"
        >
          {/* TOP BAR: CODE & STOCK */}
          <div className="flex justify-between items-start mb-2.5 gap-2">
            <Badge
              variant="amber"
              className="font-mono text-xs font-black tracking-wider border-2"
            >
              {item.archiveCode}
            </Badge>
            <Badge
              variant={item.stock > 0 ? "emerald" : "rose"}
              className="font-black text-xs"
            >
              {item.stock > 0 ? `Stok: ${item.stock}` : "Stok Habis"}
            </Badge>
          </div>

          {/* TITLE & AUTHOR */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => onDetail(item)}
              className="text-left block w-full group/title cursor-pointer mb-1"
              title={`Klik untuk melihat detail: "${item.title}"`}
            >
              <span className="block font-black text-blue-950 text-base leading-snug line-clamp-2 overflow-hidden text-ellipsis group-hover/title:text-orange-600 transition-colors">
                {item.title}
              </span>
            </button>
            <p className="font-semibold text-slate-600 text-xs mt-1">
              {item.author} • <span className="text-slate-500 font-medium">{item.year}</span>
            </p>
          </div>

          {/* FOOTER: TYPE/CATEGORY/LOCATION & ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs font-bold bg-slate-50">
                {item.type}
              </Badge>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {item.category}
              </span>
              {item.location && (
                <span className="flex items-center gap-1 text-xs font-semibold text-orange-600">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="amber"
                size="icon"
                onClick={() => onDetail(item)}
                className="h-8 w-8 cursor-pointer"
                title="Lihat Detail"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(item)}
                className="h-8 w-8 cursor-pointer text-blue-900 bg-white"
                title="Edit Data"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(item)}
                className="h-8 w-8 cursor-pointer"
                title="Hapus Arsip"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
