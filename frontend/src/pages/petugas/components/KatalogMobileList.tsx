import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { CatalogItem } from "@/types/katalog";

interface Props {
  data: CatalogItem[];
  isLoading: boolean;
  onEdit: (item: CatalogItem) => void;
  onDelete: (id: string) => void;
}

export function KatalogMobileList({ data, isLoading, onEdit, onDelete }: Props) {
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
          <div key={item.id} className="p-5 flex flex-col bg-white hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-3 gap-2">
              <span className="text-xs font-black text-blue-900 bg-amber-300 px-2 py-1 border-2 border-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] uppercase tracking-wider">
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
              <h3 className="font-black text-blue-900 text-lg leading-tight mb-1">
                {item.title}
              </h3>
              <p className="font-medium text-slate-700">
                {item.author} • {item.year}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.category}</span>
                <Badge variant="outline" className="w-fit text-xs border-2 border-blue-900 text-blue-900 font-bold bg-slate-100">
                  {item.type}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline" size="icon"
                  onClick={() => onEdit(item)}
                  className="h-10 w-10 border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" size="icon"
                  onClick={() => onDelete(item.id)}
                  className="h-10 w-10 border-2 border-blue-900 text-red-600 bg-red-50 hover:bg-red-100 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
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
