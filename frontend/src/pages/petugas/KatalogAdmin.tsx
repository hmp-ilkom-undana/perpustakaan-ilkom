import { usePetugasKatalog } from "@/hooks/usePetugasKatalog";
import {
  KatalogHeader,
  KatalogFilterBar,
  KatalogTable,
  KatalogMobileList,
  KatalogPagination,
  KatalogDetailSheet,
  KatalogFormSheet,
  KatalogImportSheet,
  KatalogDeleteDialog,
} from "@/components/katalog-petugas";

export default function KatalogAdmin() {
  const {
    data,
    totalPages,
    totalRecords,
    currentPage,
    setCurrentPage,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterCategory,
    handleCategoryChange,
    filterType,
    handleTypeChange,
    handleClearSearch,
    formData,
    setFormData,
    editingItem,
    isSheetOpen,
    setIsSheetOpen,
    isSaving,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    detailItem,
    isDetailOpen,
    setIsDetailOpen,
    handleOpenDetail,
    deletingItem,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDeleting,
    handleOpenDelete,
    handleConfirmDelete,
    importType,
    setImportType,
    isImportSheetOpen,
    setIsImportSheetOpen,
    isImporting,
    fileInputRef,
    handleOpenImport,
    handleImport,
  } = usePetugasKatalog();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Action CTAs */}
      <KatalogHeader
        onOpenAdd={handleOpenAdd}
        onOpenImport={handleOpenImport}
      />

      {/* 2. Search & Filter Bar */}
      <KatalogFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        filterType={filterType}
        onTypeChange={handleTypeChange}
        filterCategory={filterCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* 3. Data Visualization Container */}
      <div className="bg-white border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] rounded-xl overflow-hidden flex flex-col">
        <KatalogMobileList
          data={data}
          isLoading={isLoading}
          onDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        <KatalogTable
          data={data}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={10}
          onDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        <KatalogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 4. Detail View Sheet */}
      <KatalogDetailSheet
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        item={detailItem}
        onEdit={handleOpenEdit}
      />

      {/* 5. Delete Confirmation Dialog */}
      <KatalogDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* 6. Form Add / Edit Sheet */}
      <KatalogFormSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        isSaving={isSaving}
        onSave={handleSave}
      />

      {/* 7. Excel Import Sheet */}
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
