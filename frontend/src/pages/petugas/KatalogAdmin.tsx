import { useState, useEffect, useRef } from "react";
import { Search, Plus, Filter, Package, Trash2, Edit2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  fetchArchives,
  createArchive,
  updateArchive,
  deleteArchive,
} from "@/lib/api";

// Definisikan tipe
export type ArchiveCategory =
  | "Machine Learning"
  | "Sistem Informasi"
  | "Sistem Pakar"
  | "SPK"
  | "Kriptografi"
  | "Umum";
export type ArchiveType = "Skripsi" | "Ringkasan Skripsi" | "Naskah Publikasi";

export interface CatalogItem {
  id: string;
  title: string;
  author: string;
  year: number;
  category: ArchiveCategory;
  type: ArchiveType;
  stock: number;
  location: string;
}

export default function KatalogAdmin() {
  const [data, setData] = useState<CatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Sheet Form State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  // --- STATE & REF IMPORT EXCEL ---
  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
  const [importType, setImportType] = useState<ArchiveType>("Buku");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- FUNGSI HANDLE IMPORT EXCEL ---
  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Pilih file Excel terlebih dahulu");
      return;
    }
    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("archiveType", importType);
    try {
      const { default: api } = await import("@/lib/api");
      const response = await api.post("/api/archives/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { success, skipped, total } = response.data;
      toast.success(
        `Import selesai! Sukses: ${success}, Di-skip: ${skipped} (Total dibaca: ${total})`,
      );

      setIsImportSheetOpen(false);
      loadData(); // Tarik data terbaru
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal mengimport file Excel",
      );
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file
    }
  };

  // Form Fields
  const [formData, setFormData] = useState<Partial<CatalogItem>>({
    title: "",
    author: "",
    year: new Date().getFullYear(),
    category: "Umum",
    type: "Buku",
    stock: 1,
    location: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const rawData = await fetchArchives();
      // Mapping dari struktur backend ke frontend agar UI tidak rusak
      const mapped: CatalogItem[] = rawData.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        year: item.year,
        category: item.category,
        type: item.archiveType,
        stock: item.quantity,
        location: item.shelfLocation || "",
      }));
      setData(mapped);
    } catch (error) {
      toast.error("Gagal mengambil data dari server");
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      author: "",
      year: new Date().getFullYear(),
      category: "Umum",
      type: "Buku",
      stock: 1,
      location: "",
    });
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus arsip ini?")) {
      try {
        await deleteArchive(id);
        toast.success("Arsip berhasil dihapus");
        loadData();
      } catch (error) {
        toast.error("Gagal menghapus arsip");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author || !formData.location) {
      toast.error("Mohon lengkapi semua field yang wajib");
      return;
    }

    try {
      // Mapping data frontend ke backend DTO
      const payload = {
        title: formData.title,
        author: formData.author,
        year: formData.year,
        category: formData.category,
        archiveType: formData.type,
        quantity: formData.stock,
        shelfLocation: formData.location,
      };

      if (editingItem) {
        await updateArchive(editingItem.id, payload);
        toast.success("Arsip berhasil diperbarui");
      } else {
        await createArchive(payload);
        toast.success("Arsip baru berhasil ditambahkan");
      }

      setIsSheetOpen(false);
      loadData();
    } catch (error) {
      toast.error("Gagal menyimpan data arsip");
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Katalog
          </h1>
          <p className="text-sm text-slate-500">
            Kelola data buku, skripsi, dan naskah publikasi.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsImportSheetOpen(true)}
            variant="outline"
            className="font-semibold"
          >
            Import Excel
          </Button>
          <Button
            onClick={handleOpenAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Arsip
          </Button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center relative z-20">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Cari judul, penulis, atau ID arsip..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64 flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-400 hidden md:block" />
          <Select
            value={filterCategory}
            onValueChange={(val) => val && setFilterCategory(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="Skripsi">Skripsi</SelectItem>
              <SelectItem value="Buku">Buku</SelectItem>
              <SelectItem value="Naskah Publikasi">Naskah Publikasi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DATA VISUALIZATION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative z-20">
        {/* MOBILE VIEW (< 768px) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Data tidak ditemukan
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="p-4 space-y-3 flex flex-col hover:bg-slate-50"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {item.id}
                  </span>
                  <Badge
                    variant={item.stock > 0 ? "default" : "destructive"}
                    className={
                      item.stock > 0
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    {item.stock > 0 ? `Stok: ${item.stock}` : "Habis"}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {item.author} • {item.year}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-300 text-slate-600"
                  >
                    {item.type}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(item)}
                      className="h-8 w-8 text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px] font-bold">ID</TableHead>
                <TableHead className="font-bold">Info Arsip</TableHead>
                <TableHead className="font-bold">Jenis / Kategori</TableHead>
                <TableHead className="font-bold">Lokasi</TableHead>
                <TableHead className="font-bold text-center">Stok</TableHead>
                <TableHead className="font-bold text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-slate-500"
                  >
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-600">
                      {item.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </span>
                        <span className="text-sm text-slate-500">
                          {item.author} • {item.year}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          {item.type}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {item.category}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {item.location}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.stock > 0 ? "default" : "destructive"}
                        className={
                          item.stock > 0
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : ""
                        }
                      >
                        {item.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(item)}
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* FORM SHEET (Slide-out Form) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md overflow-y-auto z-[60]"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>
              {editingItem ? "Edit Data Arsip" : "Tambah Arsip Baru"}
            </SheetTitle>
            <SheetDescription>
              Silakan isi formulir di bawah ini dengan data arsip yang valid.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Judul Arsip <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Contoh: Sistem Informasi Manajemen..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">
                Penulis / Pengarang <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                placeholder="Nama Pengarang"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Tahun Terbit</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: parseInt(e.target.value) || 2024,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Jumlah Fisik (Stok)</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Jenis Arsip</Label>
              <Select
                value={formData.type}
                onValueChange={(val) =>
                  val && setFormData({ ...formData, type: val as ArchiveType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Skripsi">Skripsi</SelectItem>
                  <SelectItem value="Buku">Buku</SelectItem>
                  <SelectItem value="Naskah Publikasi">
                    Naskah Publikasi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kategori Bidang</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  val &&
                  setFormData({ ...formData, category: val as ArchiveCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Machine Learning">
                    Machine Learning
                  </SelectItem>
                  <SelectItem value="Sistem Pendukung Keputusan">
                    Sistem Pendukung Keputusan
                  </SelectItem>
                  <SelectItem value="Rekayasa Perangkat Lunak">
                    Rekayasa Perangkat Lunak
                  </SelectItem>
                  <SelectItem value="Jaringan Komputer">
                    Jaringan Komputer
                  </SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Lokasi Rak <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder="Contoh: Lemari A - Rak 1"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>

          <SheetFooter className="mt-8">
            <Button
              variant="outline"
              onClick={() => setIsSheetOpen(false)}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Package className="w-4 h-4 mr-2" />
              Simpan Data
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* FORM SHEET UNTUK IMPORT EXCEL */}
      <Sheet open={isImportSheetOpen} onOpenChange={setIsImportSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md overflow-y-auto z-[60]"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Import Data Excel</SheetTitle>
            <SheetDescription>
              Pilih jenis arsip dan unggah file .xlsx Anda. Sistem akan melewati
              data yang sudah ada (duplikat).
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Jenis Arsip dalam File</Label>
              <Select
                value={importType}
                onValueChange={(val) => setImportType(val as ArchiveType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Skripsi">Skripsi</SelectItem>
                  <SelectItem value="Buku">Buku</SelectItem>
                  <SelectItem value="Naskah Publikasi">
                    Naskah Publikasi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>File Excel (.xlsx)</Label>
              <Input type="file" accept=".xlsx, .xls" ref={fileInputRef} />
            </div>
          </div>

          <SheetFooter className="mt-8">
            <Button
              variant="outline"
              onClick={() => setIsImportSheetOpen(false)}
              disabled={isImporting}
            >
              Batal
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isImporting ? "Memproses..." : "Mulai Import"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
