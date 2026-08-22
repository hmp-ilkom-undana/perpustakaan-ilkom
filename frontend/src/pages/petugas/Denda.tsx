import { usePetugasDenda } from "@/hooks/usePetugasDenda";
import {
  FineHeader,
  FineMetricCards,
  FineFilterBar,
  FineList,
  FinePaymentDialog,
} from "@/components/denda-petugas";

export default function Denda() {
  const {
    fines,
    stats,
    isStatsLoading,
    isFinesLoading,
    isFetching,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleClearSearch,
    isPaymentOpen,
    setIsPaymentOpen,
    selectedFine,
    paymentMethod,
    setPaymentMethod,
    paymentNotes,
    setPaymentNotes,
    isPaying,
    handleOpenPayment,
    handleConfirmPayment,
  } = usePetugasDenda();

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <FineHeader />

      {/* 2. Metric Statistics Cards */}
      <FineMetricCards stats={stats} isLoading={isStatsLoading} />

      {/* 3. Filter & Tab Controls */}
      <FineFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unpaidCount={stats.unpaidCount}
        paidCount={stats.paidCount}
        isFetching={isFetching}
        isFinesLoading={isFinesLoading}
      />

      {/* 4. Fine Records List */}
      <FineList
        fines={fines}
        isLoading={isFinesLoading}
        searchQuery={searchQuery}
        activeTab={activeTab}
        onPay={handleOpenPayment}
      />

      {/* 5. Cashier Payment Modal Dialog */}
      <FinePaymentDialog
        isOpen={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        selectedFine={selectedFine}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        paymentNotes={paymentNotes}
        onPaymentNotesChange={setPaymentNotes}
        isPaying={isPaying}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
