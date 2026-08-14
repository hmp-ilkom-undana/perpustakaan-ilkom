import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { CatalogItem } from "@/types/katalog";

interface Props {
  data: CatalogItem[];
  isLoading: boolean;
  onDetail: (item: CatalogItem) => void;
  onEdit: (item: CatalogItem) => void;
  onDelete: (id: string) => void;
}

export function KatalogMobileList({
  data,
  isLoading,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="md:hidden flex flex-col divide-y-2 divide-blue-900">
      {isLoading ? (
        <div className="p-8 text-center text-slate-500 font-bold animate-pulse">
          [ Memuat Data Arsip... ]
        </div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center text-slate-500 font-bold">
          Data tidak ditemukan
        </div>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            className="p-5 flex flex-col bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3 gap-2">
              <span className="text-xs font-mono font-black text-blue-900 bg-amber-300 px-2 py-1 border-2 border-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] uppercase tracking-wider">
                {item.archiveCode}
              </span>
              <Badge
                variant={item.stock > 0 ? "default" : "destructive"}
                className={`border-2 border-blue-900 font-black uppercase ${
                  item.stock > 0
                    ? "bg-emerald-400 text-blue-900 hover:bg-emerald-500 [box-shadow:2px_2px_0px_#1E3A8A]"
                    : "bg-red-500 text-white"
                }`}
              >
                {item.stock > 0 ? `Stok: ${item.stock}` : "Habis"}
              </Badge>
            </div>
            <div className="mb-4">
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
                {item.author} • <span className="text-slate-500">{item.year}</span>
              </p>
            </div>
            <div className="flex justify-between items-end gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {item.category}
                </span>
                <Badge
                  variant="outline"
                  className="w-fit text-xs border-2 border-blue-900 text-blue-900 font-bold bg-slate-100"
                >
                  {item.type}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDetail(item)}
                  className="h-9 w-9 border-2 border-blue-900 text-blue-900 bg-amber-100 hover:bg-amber-200 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                  title="Lihat Detail"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(item)}
                  className="h-9 w-9 border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                  title="Edit Data"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(item.id)}
                  className="h-9 w-9 border-2 border-blue-900 text-red-600 bg-red-50 hover:bg-red-100 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                  title="Hapus Arsip"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
