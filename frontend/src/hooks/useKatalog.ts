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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterCategory, filterType]);

  useEffect(() => {
    loadData();
  }, [currentPage, debouncedSearch, filterCategory, filterType]);

  const loadData = async (searchOverride?: string) => {
    setIsLoading(true);
    try {
      const activeSearch = searchOverride !== undefined ? searchOverride : debouncedSearch;
      const response = await fetchArchives({
        page: currentPage,
        limit: 10,
        search: activeSearch.trim() || undefined,
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
      setDebouncedSearch(searchQuery);
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadData(searchQuery);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
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

  const handleOpenDelete = (item: CatalogItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await deleteArchive(deletingItem.id);
      toast.success(`Arsip [${deletingItem.archiveCode}] berhasil dihapus`);
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
      loadData();
    } catch {
      toast.error("Gagal menghapus data arsip");
    } finally {
      setIsDeleting(false);
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
      if (success === 0 && skipped > 0) {
        toast.info("Tidak Ada Data Baru", {
          description: `Semua ${skipped} data dalam file sudah ada di database.`,
        });
      } else {
        toast.success(`Import Data [${importType}] Berhasil!`, {
          description: `${success} arsip berhasil ditambahkan (${skipped} duplikat dilewati dari total ${total} data).`,
        });
      }
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
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingItem,
    isDeleting,
    formData,
    setFormData,
    isImportSheetOpen,
    setIsImportSheetOpen,
    importType,
    setImportType,
    isImporting,
    fileInputRef,
    handleSearchSubmit,
    handleClearSearch,
    handleOpenAdd,
    handleOpenDetail,
    handleOpenEdit,
    handleOpenDelete,
    handleConfirmDelete,
    handleSave,
    handleImport,
  };
}
