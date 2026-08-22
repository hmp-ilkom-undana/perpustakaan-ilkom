import { useState, useRef, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useArchiveQuery } from "./queries/useArchiveQuery";
import {
  useCreateArchiveMutation,
  useUpdateArchiveMutation,
  useDeleteArchiveMutation,
  useImportArchiveMutation,
} from "./queries/useArchiveMutation";
import type { CatalogItem, ArchiveType, ArchiveCategory } from "@/types/katalog";

export interface CatalogFormData {
  title: string;
  author: string;
  year: number;
  category: ArchiveCategory;
  type: ArchiveType;
  stock: number;
  location: string;
}

const INITIAL_FORM_DATA: CatalogFormData = {
  title: "",
  author: "",
  year: new Date().getFullYear(),
  category: "Umum",
  type: "Skripsi",
  stock: 1,
  location: "",
};

export function usePetugasKatalog() {
  // 1. Search, Filter, and Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query to prevent excessive server requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setActiveSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Modal & Sheet UI States
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<CatalogItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null);
  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
  const [importType, setImportType] = useState<ArchiveType>("Skripsi");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Form Data State
  const [formData, setFormData] = useState<CatalogFormData>(INITIAL_FORM_DATA);

  // 4. TanStack Query & Mutation Hooks
  const { data, isPending: isLoading } = useArchiveQuery({
    page: currentPage,
    search: activeSearch.trim() || undefined,
    category: filterCategory || undefined,
    type: filterType || undefined,
  });

  const createMutation = useCreateArchiveMutation();
  const updateMutation = useUpdateArchiveMutation();
  const deleteMutation = useDeleteArchiveMutation();
  const importMutation = useImportArchiveMutation();

  // 5. Form Dirty Checking
  const isDirty = useMemo(() => {
    if (!editingItem) {
      return (
        formData.title.trim() !== "" ||
        formData.author.trim() !== "" ||
        formData.location.trim() !== "" ||
        formData.category !== "Umum" ||
        formData.type !== "Skripsi" ||
        formData.stock !== 1
      );
    }
    return (
      formData.title !== editingItem.title ||
      formData.author !== editingItem.author ||
      formData.year !== editingItem.year ||
      formData.category !== editingItem.category ||
      formData.type !== editingItem.type ||
      formData.stock !== editingItem.stock ||
      formData.location !== editingItem.location
    );
  }, [formData, editingItem]);

  // 6. Action Handlers: Add & Edit
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(INITIAL_FORM_DATA);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      author: item.author,
      year: item.year,
      category: item.category as ArchiveCategory,
      type: item.type as ArchiveType,
      stock: item.stock,
      location: item.location,
    });
    setIsSheetOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.location.trim()) {
      toast.error("Mohon lengkapi seluruh kolom yang bertanda bintang (*)");
      return;
    }

    if (formData.stock < 0) {
      toast.error("Jumlah stok tidak boleh bernilai negatif");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      year: Number(formData.year) || new Date().getFullYear(),
      category: formData.category,
      archiveType: formData.type,
      quantity: Number(formData.stock) || 1,
      shelfLocation: formData.location.trim(),
    };

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsSheetOpen(false);
      setFormData(INITIAL_FORM_DATA);
      setEditingItem(null);
    } catch {
      // Error handled by mutation error toast
    }
  };

  // 7. Action Handlers: Detail View
  const handleOpenDetail = (item: CatalogItem) => {
    setDetailItem(item);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setDetailItem(null);
  };

  // 8. Action Handlers: Delete Confirmation
  const handleOpenDelete = (item: CatalogItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMutation.mutateAsync(deletingItem.id);
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  // 9. Action Handlers: Excel Import
  const handleOpenImport = () => {
    setImportType("Skripsi");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsImportSheetOpen(true);
  };

  const handleCloseImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsImportSheetOpen(false);
  };

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Pilih file spreadsheet (.xlsx / .xls) terlebih dahulu");
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append("file", file);
    apiFormData.append("archiveType", importType);

    try {
      await importMutation.mutateAsync(apiFormData);
      setIsImportSheetOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      // Error handled by mutation toast
    }
  };

  // 10. Search & Filter Reset Handlers
  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setFilterCategory(val === "all" || !val ? "" : val);
    setCurrentPage(1);
  };

  const handleTypeChange = (val: string) => {
    setFilterType(val === "all" || !val ? "" : val);
    setCurrentPage(1);
  };

  return {
    // Data & Pagination
    data: data?.data ?? [],
    totalPages: data?.meta.totalPages ?? 1,
    totalRecords: data?.meta.total ?? 0,
    currentPage,
    setCurrentPage,
    isLoading,

    // Search & Filter
    searchQuery,
    setSearchQuery,
    filterCategory,
    handleCategoryChange,
    filterType,
    handleTypeChange,
    handleClearSearch,

    // Form State & Add/Edit
    formData,
    setFormData,
    editingItem,
    isSheetOpen,
    setIsSheetOpen,
    isDirty,
    isSaving: createMutation.isPending || updateMutation.isPending,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,

    // Detail View
    detailItem,
    isDetailOpen,
    setIsDetailOpen,
    handleOpenDetail,
    handleCloseDetail,

    // Delete State
    deletingItem,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDeleting: deleteMutation.isPending,
    handleOpenDelete,
    handleConfirmDelete,

    // Import State
    importType,
    setImportType,
    isImportSheetOpen,
    setIsImportSheetOpen,
    isImporting: importMutation.isPending,
    fileInputRef,
    handleOpenImport,
    handleCloseImport,
    handleImport,
  };
}
