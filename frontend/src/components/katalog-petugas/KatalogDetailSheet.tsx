import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  User,
  MapPin,
  Layers,
  Archive,
  CheckCircle2,
  Loader2,
  Clock,
  Edit2,
} from "lucide-react";
import { CatalogItem } from "@/types/katalog";
import { useArchiveDetailQuery } from "@/hooks/queries/useArchiveQuery";

interface KatalogDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: CatalogItem | null;
  onEdit?: (item: CatalogItem) => void;
}

export function KatalogDetailSheet({
  isOpen,
  onOpenChange,
  item,
  onEdit,
}: KatalogDetailSheetProps) {
  // Use TanStack Query caching for detail fetch
  const { data: detailData, isLoading } = useArchiveDetailQuery(
    item?.id || null
  );

  const currentItem = detailData || item;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto z-[60] p-0 flex flex-col bg-slate-50 border-l-2 border-blue-900 shadow-[-4px_0px_0px_#1E3A8A]"
      >
        {/* TOP BANNER / HEADER */}
        <div className="bg-blue-900 p-6 text-white border-b-2 border-blue-950">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider bg-amber-300 text-blue-950 px-2.5 py-1 border-2 border-blue-950 shadow-[2px_2px_0px_#0f172a] rounded">
              {currentItem?.archiveCode || item?.archiveCode || "KODE ARSIP"}
            </span>
            <Badge
              variant={
                (currentItem?.quantity ?? currentItem?.stock ?? 1) > 0
                  ? "emerald"
                  : "rose"
              }
              className="font-black text-xs uppercase px-2.5 py-0.5"
            >
              {(currentItem?.quantity ?? currentItem?.stock ?? 1) > 0
                ? "TERSEDIA"
                : "HABIS"}
            </Badge>
          </div>
          <SheetHeader className="p-0 text-left">
            <SheetTitle className="text-xl font-black text-white leading-snug">
              Detail Informasi Arsip
            </SheetTitle>
          </SheetHeader>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            <p className="text-xs font-bold animate-pulse">
              Memuat data lengkap arsip dari server...
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 flex-1">
            {/* TITLE CARD */}
            <div className="bg-white p-5 border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] rounded-xl">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">
                Judul Lengkap
              </span>
              <h2 className="text-base sm:text-lg font-black text-blue-950 leading-snug">
                {currentItem?.title}
              </h2>
            </div>

            {/* TWO-COLUMN METADATA GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* PENULIS */}
              <div className="bg-white p-4 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <User className="w-4 h-4 text-blue-900" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Penulis
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  {currentItem?.author || "-"}
                </p>
              </div>

              {/* TAHUN TERBIT */}
              <div className="bg-white p-4 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Calendar className="w-4 h-4 text-blue-900" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Tahun Terbit
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  {currentItem?.year || "-"}
                </p>
              </div>

              {/* JENIS ARSIP */}
              <div className="bg-white p-4 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Archive className="w-4 h-4 text-blue-900" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Jenis Arsip
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  {currentItem?.archiveType || currentItem?.type || "-"}
                </p>
              </div>

              {/* KATEGORI BIDANG */}
              <div className="bg-white p-4 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Layers className="w-4 h-4 text-blue-900" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Kategori Bidang
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  {currentItem?.category || "-"}
                </p>
              </div>

              {/* LOKASI RAK */}
              <div className="bg-white p-4 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Lokasi Rak
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  {currentItem?.shelfLocation || currentItem?.location || "-"}
                </p>
              </div>

              {/* KUANTITAS FISIK */}
              <div className="bg-white p-4 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <BookOpen className="w-4 h-4 text-blue-900" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Stok Fisik
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  {currentItem?.quantity ?? currentItem?.stock ?? 0} Eksemplar
                </p>
              </div>
            </div>

            {/* STATUS & RECORD INFO */}
            <div className="bg-white p-4 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Status Ketersediaan:
                </span>
                <span className="font-black text-blue-950 uppercase">
                  {currentItem?.status || "TERSEDIA"}
                </span>
              </div>
              {currentItem?.createdAt && (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Waktu Terdaftar:
                  </span>
                  <span className="font-medium text-slate-700">
                    {new Date(currentItem.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-white border-t-2 border-blue-900 flex justify-between items-center gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-bold"
          >
            Tutup
          </Button>

          {onEdit && currentItem && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit({
                  id: currentItem.id,
                  archiveCode: currentItem.archiveCode,
                  title: currentItem.title,
                  author: currentItem.author,
                  year: currentItem.year,
                  category: currentItem.category,
                  type: currentItem.archiveType || currentItem.type,
                  stock: currentItem.quantity ?? currentItem.stock,
                  location: currentItem.shelfLocation || currentItem.location,
                });
              }}
              variant="navy"
              className="font-black"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Data Ini
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
