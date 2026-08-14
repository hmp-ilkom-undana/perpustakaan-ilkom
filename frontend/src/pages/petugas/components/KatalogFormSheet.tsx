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
import { Package, Save } from "lucide-react";
import { CatalogItem, ArchiveCategory, ArchiveType } from "@/types/katalog";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: CatalogItem | null;
  formData: Partial<CatalogItem>;
  setFormData: (data: Partial<CatalogItem>) => void;
  onSave: () => void;
}

export function KatalogFormSheet({
  isOpen,
  onOpenChange,
  editingItem,
  formData,
  setFormData,
  onSave,
}: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto z-[60] bg-white border-l-4 border-blue-900 [box-shadow:-6px_0px_0px_#1E3A8A] p-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          {/* HEADER */}
          <SheetHeader className="p-0 border-b-2 border-blue-900 pb-4 text-left">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-2xl font-black text-blue-950">
                {editingItem ? "Edit Data Arsip" : "Tambah Arsip Baru"}
              </SheetTitle>
              {editingItem && (
                <span className="font-mono text-xs font-black bg-amber-300 text-blue-950 px-2.5 py-1 border-2 border-blue-900 [box-shadow:2px_2px_0px_#1E3A8A]">
                  {editingItem.archiveCode}
                </span>
              )}
            </div>
            <SheetDescription className="text-xs font-semibold text-slate-600 mt-1">
              {editingItem
                ? "Perbarui rincian informasi dan metadata arsip ini."
                : "Silakan isi formulir di bawah ini dengan data arsip baru."}
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
                Judul Arsip <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Contoh: Sistem Pendukung Keputusan..."
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border-2 border-blue-900 bg-white font-semibold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-none h-10 placeholder:text-slate-400"
              />
            </div>

            {/* PENULIS */}
            <div className="space-y-1.5">
              <Label
                htmlFor="author"
                className="font-black text-xs uppercase tracking-wider text-blue-950"
              >
                Penulis / Pengarang <span className="text-red-600">*</span>
              </Label>
              <Input
                id="author"
                placeholder="Nama Mahasiswa / Penulis"
                value={formData.author || ""}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="border-2 border-blue-900 bg-white font-semibold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-none h-10 placeholder:text-slate-400"
              />
            </div>

            {/* TAHUN & STOK */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="year"
                  className="font-black text-xs uppercase tracking-wider text-blue-950"
                >
                  Tahun Terbit <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
                  value={formData.year ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: parseInt(e.target.value) || 0,
                    })
                  }
                  className="border-2 border-blue-900 bg-white font-semibold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-none h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="stock"
                  className="font-black text-xs uppercase tracking-wider text-blue-950"
                >
                  Jumlah Stok <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  placeholder="1"
                  value={formData.stock ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  className="border-2 border-blue-900 bg-white font-semibold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-none h-10"
                />
              </div>
            </div>

            {/* JENIS ARSIP */}
            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider text-blue-950">
                Jenis Arsip <span className="text-red-600">*</span>
              </Label>
              <Select
                value={formData.type || "Skripsi"}
                onValueChange={(val) =>
                  val && setFormData({ ...formData, type: val as ArchiveType })
                }
              >
                <SelectTrigger className="w-full border-2 border-blue-900 bg-white font-bold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] rounded-none h-10">
                  <SelectValue placeholder="Pilih Jenis Arsip" />
                </SelectTrigger>
                <SelectContent className="border-2 border-blue-900 bg-white [box-shadow:4px_4px_0px_#1E3A8A] rounded-none">
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
                Kategori Bidang <span className="text-red-600">*</span>
              </Label>
              <Select
                value={formData.category || "Umum"}
                onValueChange={(val) =>
                  val &&
                  setFormData({
                    ...formData,
                    category: val as ArchiveCategory,
                  })
                }
              >
                <SelectTrigger className="w-full border-2 border-blue-900 bg-white font-bold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] rounded-none h-10">
                  <SelectValue placeholder="Pilih Kategori Bidang" />
                </SelectTrigger>
                <SelectContent className="border-2 border-blue-900 bg-white [box-shadow:4px_4px_0px_#1E3A8A] rounded-none">
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
                Lokasi Rak Fisik <span className="text-red-600">*</span>
              </Label>
              <Input
                id="location"
                placeholder="Contoh: Rak-A1 atau Lemari B"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="border-2 border-blue-900 bg-white font-semibold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-none h-10 placeholder:text-slate-400"
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
            className="w-full sm:w-1/2 border-2 border-blue-900 font-bold text-blue-900 bg-slate-100 hover:bg-slate-200 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-none transition-all cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onSave}
            className="w-full sm:w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-black border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-none transition-all cursor-pointer"
          >
            {editingItem ? (
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
