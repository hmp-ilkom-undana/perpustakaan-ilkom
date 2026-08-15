import { useState, useRef } from "react";
import { toast } from "sonner";
import { useArchiveQuery } from "./queries/useArchiveQuery";
import {
  useCreateArchiveMutation,
  useUpdateArchiveMutation,
  useDeleteArchiveMutation,
  useImportArchiveMutation,
} from "./queries/useArchiveMutation";
import { CatalogItem, ArchiveType } from "@/types/katalog";

export function useKatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<CatalogItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null);
  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
  const [importType, setImportType] = useState<ArchiveType>("Skripsi");
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

  const { data, isPending: isLoading } = useArchiveQuery({
    page: currentPage,
    search: searchQuery.trim() || undefined,
    category: filterCategory || undefined,
    type: filterType || undefined,
  });

  const createMutation = useCreateArchiveMutation();
  const updateMutation = useUpdateArchiveMutation();
  const deleteMutation = useDeleteArchiveMutation();
  const importMutation = useImportArchiveMutation();

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
    await deleteMutation.mutateAsync(deletingItem.id);
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author || !formData.location) {
      toast.error("Mohon lengkapi semua field yang wajib");
      return;
    }

    const payload = {
      title: formData.title!,
      author: formData.author!,
      year: formData.year!,
      category: formData.category!,
      archiveType: formData.type!,
      quantity: formData.stock!,
      shelfLocation: formData.location!,
    };

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsSheetOpen(false);
  };

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Pilih file Excel terlebih dahulu");
      return;
    }
    const apiFormData = new FormData();
    apiFormData.append("file", file);
    apiFormData.append("archiveType", importType);
    await importMutation.mutateAsync(apiFormData);
    setIsImportSheetOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return {
    data: data?.data ?? [],
    totalPages: data?.meta.totalPages ?? 1,
    totalRecords: data?.meta.total ?? 0,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    isSheetOpen,
    setIsSheetOpen,
    editingItem,
    isDetailOpen,
    setIsDetailOpen,
    detailItem,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingItem,
    isDeleting: deleteMutation.isPending,
    formData,
    setFormData,
    isImportSheetOpen,
    setIsImportSheetOpen,
    importType,
    setImportType,
    isImporting: importMutation.isPending,
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
