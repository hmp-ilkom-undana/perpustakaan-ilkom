import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useKatalog } from "@/hooks/useKatalog";
import { KatalogDesktopTable } from "./components/KatalogDesktopTable";
import { KatalogMobileList } from "./components/KatalogMobileList";
import { KatalogFormSheet } from "./components/KatalogFormSheet";
import { KatalogImportSheet } from "./components/KatalogImportSheet";

export default function KatalogAdmin() {
  const {
    data,
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterType, setFilterType,
    currentPage, setCurrentPage,
    totalPages,
    isLoading,
    isSheetOpen, setIsSheetOpen,
    editingItem,
    formData, setFormData,
    isImportSheetOpen, setIsImportSheetOpen,
    importType, setImportType,
    isImporting,
    fileInputRef,
    handleSearchSubmit,
    handleOpenAdd,
    handleOpenEdit,
    handleDelete,
    handleSave,
    handleImport
  } = useKatalog();

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
              <SelectItem value="Ringkasan Skripsi">Ringkasan Skripsi</SelectItem>
              <SelectItem value="Naskah Publikasi">Naskah Publikasi</SelectItem>
            </SelectContent>
          </Select>

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
        {/* MOBILE VIEW */}
        <KatalogMobileList
          data={data}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        {/* DESKTOP VIEW */}
        <KatalogDesktopTable
          data={data}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        {/* PAGINATION UI */}
        <div className="p-4 border-t-2 border-blue-900 flex justify-between items-center bg-slate-50">
          <span className="text-sm text-blue-900 font-bold uppercase tracking-wider">
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="font-bold border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="font-bold border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>

      {/* FORM & IMPORT SHEETS */}
      <KatalogFormSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />

      <KatalogImportSheet
        isOpen={isImportSheetOpen}
        onOpenChange={setIsImportSheetOpen}
        importType={importType}
        setImportType={setImportType}
        isImporting={isImporting}
        onImport={handleImport}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}
