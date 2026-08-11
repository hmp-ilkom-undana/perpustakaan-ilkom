import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { CatalogItem, ArchiveCategory, ArchiveType } from "@/types/katalog";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: CatalogItem | null;
  formData: Partial<CatalogItem>;
  setFormData: (data: Partial<CatalogItem>) => void;
  onSave: () => void;
}

export function KatalogFormSheet({ isOpen, onOpenChange, editingItem, formData, setFormData, onSave }: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto z-[60]">
        <SheetHeader className="mb-6">
          <SheetTitle>{editingItem ? "Edit Data Arsip" : "Tambah Arsip Baru"}</SheetTitle>
          <SheetDescription>Silakan isi formulir di bawah ini dengan data arsip yang valid.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Arsip <span className="text-red-500">*</span></Label>
            <Input
              id="title" placeholder="Contoh: Sistem Informasi Manajemen..."
              value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Penulis / Pengarang <span className="text-red-500">*</span></Label>
            <Input
              id="author" placeholder="Nama Pengarang"
              value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Tahun Terbit</Label>
              <Input
                id="year" type="number"
                value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Jumlah Fisik (Stok)</Label>
              <Input
                id="stock" type="number" min={0}
                value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Jenis Arsip</Label>
            <Select value={formData.type} onValueChange={(val) => val && setFormData({ ...formData, type: val as ArchiveType })}>
              <SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Skripsi">Skripsi</SelectItem>
                <SelectItem value="Ringkasan Skripsi">Ringkasan Skripsi</SelectItem>
                <SelectItem value="Naskah Publikasi">Naskah Publikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Kategori Bidang</Label>
            <Select value={formData.category} onValueChange={(val) => val && setFormData({ ...formData, category: val as ArchiveCategory })}>
              <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
                <SelectItem value="Sistem Pakar">Sistem Pakar</SelectItem>
                <SelectItem value="SPK">SPK</SelectItem>
                <SelectItem value="Kriptografi">Kriptografi</SelectItem>
                <SelectItem value="Umum">Umum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi Rak <span className="text-red-500">*</span></Label>
            <Input
              id="location" placeholder="Contoh: Lemari A - Rak 1"
              value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
            <Package className="w-4 h-4 mr-2" />
            Simpan Data
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
