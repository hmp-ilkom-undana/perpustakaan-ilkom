import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  fetchArchives,
  createArchive,
  updateArchive,
  deleteArchive,
} from "@/lib/api";
import { CatalogItem, ArchiveType } from "@/types/katalog";

export function useKatalog() {
  const [data, setData] = useState<CatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<CatalogItem | null>(null);

  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
  const [importType, setImportType] = useState<ArchiveType>("Skripsi");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIsLoading(true);
    try {
      const response = await fetchArchives({
        page: currentPage,
        limit: 10,
        search: searchOverride !== undefined ? searchOverride : searchQuery,
        category: filterCategory || undefined,
        type: filterType || undefined,
      });

      const rawData = response.data;
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

      setData(mapped);
      setTotalPages(response.meta.totalPages || 1);
      setTotalRecords(response.meta.total || 0);
    } catch (error) {
      toast.error("Gagal mengambil data dari server");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleOpenDetail = (item: CatalogItem) => {
    setDetailItem(item);
    setIsDetailOpen(true);
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

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Pilih file Excel terlebih dahulu");
      return;
    }
    setIsImporting(true);
    const apiFormData = new FormData();
    apiFormData.append("file", file);
    apiFormData.append("archiveType", importType);
    try {
      const { default: api } = await import("@/lib/api");
      const response = await api.post("/api/archives/import", apiFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { success, skipped, total } = response.data;
      toast.success(
        `Import selesai! Sukses: ${success}, Di-skip: ${skipped} (Total dibaca: ${total})`,
      );
      setIsImportSheetOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal mengimport file Excel",
      );
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return {
    data,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    totalPages,
    totalRecords,
    isLoading,
    isSheetOpen,
    setIsSheetOpen,
    editingItem,
    isDetailOpen,
    setIsDetailOpen,
    detailItem,
    formData,
    setFormData,
    isImportSheetOpen,
    setIsImportSheetOpen,
    importType,
    setImportType,
    isImporting,
    fileInputRef,
    handleSearchSubmit,
    handleOpenAdd,
    handleOpenDetail,
    handleOpenEdit,
    handleDelete,
    handleSave,
    handleImport,
  };
}
