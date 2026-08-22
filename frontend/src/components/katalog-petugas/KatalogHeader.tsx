import { Library, Plus, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KatalogHeaderProps {
  onOpenAdd: () => void;
  onOpenImport: () => void;
}

export function KatalogHeader({ onOpenAdd, onOpenImport }: KatalogHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
          <Library className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
            Manajemen Katalog
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">
            Kelola data buku, skripsi, dan naskah publikasi perpustakaan.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          onClick={onOpenImport}
          variant="outline"
          className="font-bold"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Import Excel
        </Button>
        <Button
          type="button"
          onClick={onOpenAdd}
          variant="default"
          className="font-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Arsip
        </Button>
      </div>
    </div>
  );
}
