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
import { ArchiveCategory, ArchiveType, CatalogItem } from "@/types/katalog";

export default function KatalogAdmin() {
  const [data, setData] = useState<CatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  // --- STATE PAGINASI ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Sheet Form State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  // --- STATE & REF IMPORT EXCEL ---
  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
  const [importType, setImportType] = useState<ArchiveType>("Skripsi");
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
    type: "Skripsi",
    stock: 1,
    location: "",
  });

  useEffect(() => {
    loadData();
  }, [currentPage, filterCategory, filterType]);
  const loadData = async (searchOverride?: string) => {
    setIsLoading(true); // Memulai indikator loading
    try {
      // 1. Tembak API Backend dengan membawa filter
      const response = await fetchArchives({
        page: currentPage,
        limit: 10,
        search: searchOverride !== undefined ? searchOverride : searchQuery,
        category: filterCategory || undefined,
        type: filterType || undefined,
      });

      // 2. Baca response yang strukturnya { data: [...], meta: {...} }
      const rawData = response.data;

      // 3. Mapping agar sesuai dengan interface CatalogItem
      const mapped: CatalogItem[] = rawData.map((item: any) => ({
        id: item.id,
        archiveCode: item.archiveCode,
        title: item.title,
        author: item.author,
        year: item.year,
        category: item.category,
        type: item.archiveType,
        stock: item.quantity,
        location: item.shelfLocation || "",
      }));

      // 4. Update state React
      setData(mapped);
      setTotalPages(response.meta.totalPages || 1);
    } catch (error) {
      toast.error("Gagal mengambil data dari server");
    } finally {
      setIsLoading(false);
    }
  };
  // Fungsi untuk Trigger Pencarian
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadData(searchQuery);
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      author: "",
      year: new Date().getFullYear(),
      category: "Umum",
      type: "Skripsi",
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

  const filteredData = data;

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
            className="font-bold border-2 border-blue-900 text-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] active:translate-x-[4px] active:translate-y-[4px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all"
          >
            Import Excel
          </Button>
          <Button
            onClick={handleOpenAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] active:translate-x-[4px] active:translate-y-[4px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Arsip
          </Button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] flex flex-col md:flex-row gap-4 items-center relative z-20">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Ketik lalu tekan Enter untuk mencari..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <Filter className="h-5 w-5 text-slate-400 hidden md:block" />

          {/* Dropdown 1: Jenis Arsip */}
          <Select
            value={filterType}
            onValueChange={(val) => {
              setFilterType(val === "all" || !val ? "" : val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="Skripsi">Skripsi</SelectItem>
              <SelectItem value="Ringkasan Skripsi">
                Ringkasan Skripsi
              </SelectItem>
              <SelectItem value="Naskah Publikasi">Naskah Publikasi</SelectItem>
            </SelectContent>
          </Select>

          {/* Dropdown 2: Kategori Arsip */}
          <Select
            value={filterCategory}
            onValueChange={(val) => {
              setFilterCategory(val === "all" || !val ? "" : val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
              <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
              <SelectItem value="Sistem Pakar">Sistem Pakar</SelectItem>
              <SelectItem value="SPK">SPK</SelectItem>
              <SelectItem value="Kriptografi">Kriptografi</SelectItem>
              <SelectItem value="Umum">Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DATA VISUALIZATION */}
      <div className="bg-white border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] overflow-hidden relative z-20 flex flex-col">
        {/* MOBILE VIEW (< 768px) */}
        <div className="md:hidden flex flex-col divide-y-2 divide-blue-900">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 font-bold animate-pulse">
              [ Memuat Data Arsip... ]
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-bold">
              Data tidak ditemukan
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col bg-white hover:bg-slate-50 transition-colors"
              >
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
                      onClick={() => handleOpenEdit(item)}
                      className="h-10 w-10 border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
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

        {/* DESKTOP VIEW (>= 768px) */}
        <div className="hidden md:block overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-slate-100 border-b-2 border-blue-900">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[100px] font-black text-blue-900">
                  ID
                </TableHead>
                <TableHead className="font-black text-blue-900">
                  INFO ARSIP
                </TableHead>
                <TableHead className="font-black text-blue-900">
                  JENIS / KATEGORI
                </TableHead>
                <TableHead className="font-black text-blue-900">
                  LOKASI
                </TableHead>
                <TableHead className="font-black text-blue-900 text-center">
                  STOK
                </TableHead>
                <TableHead className="font-black text-blue-900 text-right">
                  AKSI
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-2 divide-blue-900/10">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="font-bold text-slate-500 animate-pulse">
                      [ Memuat Data Arsip... ]
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 font-bold text-slate-500"
                  >
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50 border-none"
                  >
                    <TableCell className="font-bold text-slate-600 text-xs uppercase">
                      {item.archiveCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-blue-900 text-base line-clamp-1">
                          {item.title}
                        </span>
                        <span className="font-medium text-slate-600 mt-1">
                          {item.author} • {item.year}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant="outline"
                          className="text-xs border-2 border-blue-900 text-blue-900 font-bold bg-white"
                        >
                          {item.type}
                        </Badge>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                          {item.category}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {item.location}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.stock > 0 ? "default" : "destructive"}
                        className={`border-2 border-blue-900 font-black uppercase ${
                          item.stock > 0
                            ? "bg-emerald-400 text-blue-900 hover:bg-emerald-500 [box-shadow:2px_2px_0px_#1E3A8A]"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 border-2 border-blue-900 text-red-600 bg-red-50 hover:bg-red-100 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* --- UI NAVIGASI PAGINASI  --- */}
        <div className="p-4 border-t-2 border-blue-900 flex justify-between items-center bg-slate-50">
          <span className="text-sm text-blue-900 font-bold uppercase tracking-wider">
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="font-bold border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="font-bold border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              Selanjutnya
            </Button>
          </div>
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
                  <SelectItem value="Ringkasan Skripsi">
                    Ringkasan Skripsi
                  </SelectItem>
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
                  <SelectItem value="Ringkasan Skripsi">
                    Ringkasan Skripsi
                  </SelectItem>
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
