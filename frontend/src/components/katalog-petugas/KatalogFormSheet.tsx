import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package, Save, Loader2 } from "lucide-react";
import { CatalogItem, ArchiveCategory, ArchiveType } from "@/types/katalog";
import type { CatalogFormData } from "@/hooks/usePetugasKatalog";

interface KatalogFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: CatalogItem | null;
  formData: CatalogFormData;
  setFormData: React.Dispatch<React.SetStateAction<CatalogFormData>>;
  isSaving: boolean;
  onSave: () => void;
}

export function KatalogFormSheet({
  isOpen,
  onOpenChange,
  editingItem,
  formData,
  setFormData,
  isSaving,
  onSave,
}: KatalogFormSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto z-[60] bg-white border-l-4 border-blue-900 shadow-[-6px_0px_0px_#1E3A8A] p-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          {/* HEADER */}
          <SheetHeader className="p-0 border-b-2 border-blue-900 pb-4 text-left">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-2xl font-black text-blue-950">
                {editingItem ? "Edit Data Arsip" : "Tambah Arsip Baru"}
              </SheetTitle>
              {editingItem && (
                <span className="font-mono text-xs font-black bg-amber-300 text-blue-950 px-2.5 py-1 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded">
                  {editingItem.archiveCode}
                </span>
              )}
            </div>
            <SheetDescription className="text-xs font-semibold text-slate-600 mt-1">
              {editingItem
                ? "Perbarui rincian informasi dan metadata arsip perpustakaan ini."
                : "Silakan isi formulir di bawah ini dengan lengkap untuk menambahkan data arsip baru."}
            </SheetDescription>
          </SheetHeader>

          {/* FORM FIELDS */}
          <div className="space-y-4">
            {/* JUDUL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="font-black text-xs uppercase tracking-wider text-blue-950"
              >
                Judul Arsip <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Contoh: Sistem Pendukung Keputusan..."
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                disabled={isSaving}
                className="border-2 border-blue-900 bg-white font-semibold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-lg h-11 placeholder:text-slate-400"
              />
            </div>

            {/* PENULIS */}
            <div className="space-y-1.5">
              <Label
                htmlFor="author"
                className="font-black text-xs uppercase tracking-wider text-blue-950"
              >
                Penulis / Pengarang <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="author"
                placeholder="Nama Mahasiswa / Penulis"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                disabled={isSaving}
                className="border-2 border-blue-900 bg-white font-semibold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-lg h-11 placeholder:text-slate-400"
              />
            </div>

            {/* TAHUN & STOK */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="year"
                  className="font-black text-xs uppercase tracking-wider text-blue-950"
                >
                  Tahun Terbit <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      year: e.target.value === "" ? "" : parseInt(e.target.value, 10) || "",
                    }))
                  }
                  disabled={isSaving}
                  className="border-2 border-blue-900 bg-white font-semibold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-lg h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="stock"
                  className="font-black text-xs uppercase tracking-wider text-blue-950"
                >
                  Jumlah Stok <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  placeholder="1"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stock: e.target.value === "" ? "" : parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  disabled={isSaving}
                  className="border-2 border-blue-900 bg-white font-semibold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-lg h-11"
                />
              </div>
            </div>

            {/* JENIS ARSIP */}
            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider text-blue-950">
                Jenis Arsip <span className="text-rose-600">*</span>
              </Label>
              <Select
                value={formData.type || "Skripsi"}
                onValueChange={(val) =>
                  val &&
                  setFormData((prev) => ({ ...prev, type: val as ArchiveType }))
                }
                disabled={isSaving}
              >
                <SelectTrigger className="w-full border-2 border-blue-900 bg-white font-bold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] rounded-lg h-11">
                  <SelectValue placeholder="Pilih Jenis Arsip" />
                </SelectTrigger>
                <SelectContent className="w-[var(--anchor-width)] max-w-[calc(100vw-32px)]">
                  <SelectItem value="Skripsi">Skripsi</SelectItem>
                  <SelectItem value="Ringkasan Skripsi">
                    Ringkasan Skripsi
                  </SelectItem>
                  <SelectItem value="Naskah Publikasi">
                    Naskah Publikasi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* KATEGORI BIDANG */}
            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider text-blue-950">
                Kategori Bidang <span className="text-rose-600">*</span>
              </Label>
              <Select
                value={formData.category || "Umum"}
                onValueChange={(val) =>
                  val &&
                  setFormData((prev) => ({
                    ...prev,
                    category: val as ArchiveCategory,
                  }))
                }
                disabled={isSaving}
              >
                <SelectTrigger className="w-full border-2 border-blue-900 bg-white font-bold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] rounded-lg h-11">
                  <SelectValue placeholder="Pilih Kategori Bidang" />
                </SelectTrigger>
                <SelectContent className="w-[var(--anchor-width)] max-w-[calc(100vw-32px)]">
                  <SelectItem value="Machine Learning">
                    Machine Learning
                  </SelectItem>
                  <SelectItem value="Sistem Informasi">
                    Sistem Informasi
                  </SelectItem>
                  <SelectItem value="Sistem Pakar">Sistem Pakar</SelectItem>
                  <SelectItem value="SPK">SPK</SelectItem>
                  <SelectItem value="Kriptografi">Kriptografi</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* LOKASI RAK */}
            <div className="space-y-1.5">
              <Label
                htmlFor="location"
                className="font-black text-xs uppercase tracking-wider text-blue-950"
              >
                Lokasi Rak Fisik <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="location"
                placeholder="Contoh: Rak-A1 atau Lemari B"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                disabled={isSaving}
                className="border-2 border-blue-900 bg-white font-semibold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-lg h-11 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <SheetFooter className="p-0 pt-6 mt-6 border-t-2 border-blue-900 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="w-full sm:w-1/2 font-bold"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            variant="default"
            className="w-full sm:w-1/2 font-black"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : editingItem ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Perbarui Data
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Simpan Data
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
