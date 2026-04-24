import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { CUSTOMERS, PRODUCTS } from "./constants";
import { DateRangeFilterModal } from "./_components/date-range-filter-modal";
import { EmptyState } from "./_components/empty-state";
import { HistoryFilters } from "./_components/history-filters";
import { HistoryStatsCards } from "./_components/history-stats-cards";
import { OrderDetailsPanel } from "./_components/order-details-panel";
import { OrderForm } from "./_components/order-form";
import { OrderList } from "./_components/order-list";
import { OrderPagination } from "./_components/order-pagination";
import { RefundModal } from "./_components/refund-modal";
import { SaleOrderLayout } from "./_components/sale-order-layout";
import { SubTabs } from "./_components/sub-tabs";
import { TopTabs } from "./_components/top-tabs";
import { useDateRangeFilter } from "./hooks/use-date-range-filter";
import { useHistoryStats } from "./hooks/use-history-stats";
import { useOrderFilters } from "./hooks/use-order-filters";
import { useOrderForm } from "./hooks/use-order-form";
import { useOrders } from "./hooks/use-orders";
import { useRefundHandler } from "./hooks/use-refund-handler";
import type { OrderStatus, TopTab } from "./types";

type ViewMode = "empty" | "view" | "form";

export default function SaleOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("empty");

  const { orders, orderMap, saveOrder, updateStatus, markRefunded } = useOrders();

  const {
    activeTopTab,
    activeSubTab,
    searchTerm,
    dateRange,
    activeSubTabs,
    paginatedOrders,
    page,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    setSearchTerm,
    setDateRange,
    goToNextPage,
    goToPreviousPage,
    handleTabChange,
  } = useOrderFilters(orders, CUSTOMERS);

  const {
    formState,
    formProductSelect,
    formQtySelect,
    activeCustomer,
    totals,
    openCreateForm,
    openUpdateForm,
    resetForm,
    setField,
    setFormProductSelect,
    setFormQtySelect,
    addItem,
    removeItem,
  } = useOrderForm(CUSTOMERS, PRODUCTS);

  const {
    isDateModalOpen,
    tempDateRange,
    setTempDateRange,
    openDateModal,
    closeDateModal,
    applyDateFilter,
    clearDateFilter,
  } = useDateRangeFilter(dateRange, setDateRange);

  const {
    isRefundModalOpen,
    refundData,
    hasRefundSelection,
    openRefundModal,
    closeRefundModal,
    setRefundQty,
  } = useRefundHandler();

  const historyStats = useHistoryStats(orders, dateRange, CUSTOMERS);

  const currentViewOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return orderMap.get(selectedOrderId) ?? null;
  }, [orderMap, selectedOrderId]);

  const resetRightPanel = () => {
    setViewMode("empty");
    setSelectedOrderId(null);
  };

  const handleTopTabChange = (tab: TopTab) => {
    handleTabChange(tab);
    resetRightPanel();
  };

  const handleSubTabChange = (status: OrderStatus) => {
    handleTabChange(activeTopTab, status);
    resetRightPanel();
  };

  const handleOpenCreateForm = () => {
    resetRightPanel();
    openCreateForm();
    setViewMode("form");
  };

  const handleOpenUpdateForm = (order?: typeof currentViewOrder) => {
    const targetOrder = order ?? currentViewOrder;
    if (!targetOrder) return;
    openUpdateForm(targetOrder);
    setViewMode("form");
  };

  const handleSaveOrder = (shouldProcess: boolean) => {
    if (!formState) return;

    if (formState.items.length === 0) {
      window.alert("Please add at least one item.");
      return;
    }

    saveOrder(formState, shouldProcess);
    resetForm();
    resetRightPanel();
    handleTabChange("ACTIVE", shouldProcess ? "PROCESSING" : "DRAFT");
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateStatus(orderId, status);

    if (["COMPLETED", "CANCELLED", "REFUNDED"].includes(status)) {
      handleTabChange("HISTORY", status);
      resetRightPanel();
      return;
    }

    handleTabChange("ACTIVE", status);
    setViewMode("view");
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setViewMode("view");
  };

  const handleOpenRefundModal = (order?: typeof currentViewOrder) => {
    const targetOrder = order ?? currentViewOrder;
    if (!targetOrder) return;
    resetRightPanel();
    openRefundModal(targetOrder);
  };

  const handleProcessRefund = () => {
    if (!refundData.orderId || !hasRefundSelection) {
      closeRefundModal();
      return;
    }

    markRefunded(refundData.orderId);
    closeRefundModal();
    handleTabChange("HISTORY", "REFUNDED");
  };

  const handleDownloadReport = () => {
    window.alert("Download report started (mock).");
  };

  const detailContent =
    viewMode === "view" && currentViewOrder ? (
      <OrderDetailsPanel
        order={currentViewOrder}
        customer={CUSTOMERS.find(customer => customer.id === currentViewOrder.customerId)}
        customers={CUSTOMERS}
        onEdit={handleOpenUpdateForm}
        onUpdateStatus={handleUpdateStatus}
        onOpenRefund={handleOpenRefundModal}
      />
    ) : viewMode === "form" && formState ? (
      <OrderForm
        formState={formState}
        customers={CUSTOMERS}
        products={PRODUCTS}
        activeCustomer={activeCustomer}
        formTotals={totals}
        formProductSelect={formProductSelect}
        formQtySelect={formQtySelect}
        onCancel={() => {
          resetForm();
          resetRightPanel();
        }}
        onSetField={setField}
        onSetProductSelect={setFormProductSelect}
        onSetQtySelect={setFormQtySelect}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onSaveDraft={() => handleSaveOrder(false)}
        onSaveAndProcess={() => handleSaveOrder(true)}
      />
    ) : (
      <div className="flex flex-1 flex-col items-center justify-center bg-muted/20 p-4 text-center animate-in fade-in duration-300">
        <EmptyState
          title="No order selected"
          description="Select an order from the list to view details or start a new sale order."
        />
        <button
          type="button"
          onClick={handleOpenCreateForm}
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
          Start New Order
        </button>
      </div>
    );

  return (
    <div className="flex h-full flex-col">
      <SaleOrderLayout
        header={
          <TopTabs
            activeTopTab={activeTopTab}
            onChange={handleTopTabChange}
            onCreateOrder={handleOpenCreateForm}
          />
        }
        filters={
          <div className="space-y-3">
            <HistoryFilters
              mode={activeTopTab}
              searchTerm={searchTerm}
              dateRange={dateRange}
              onSearchChange={setSearchTerm}
              onOpenDateFilter={openDateModal}
              onClearDateFilter={clearDateFilter}
              onDownloadReport={handleDownloadReport}
            />
            {activeTopTab === "HISTORY" && <HistoryStatsCards stats={historyStats} />}
          </div>
        }
        subTabs={<SubTabs tabs={activeSubTabs} activeSubTab={activeSubTab} onChange={handleSubTabChange} />}
        list={
          <OrderList
            orders={paginatedOrders}
            customers={CUSTOMERS}
            selectedOrderId={selectedOrderId}
            onSelectOrder={handleSelectOrder}
          />
        }
        pagination={
          <OrderPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
          />
        }
        detail={detailContent}
      />

      <DateRangeFilterModal
        open={isDateModalOpen}
        value={tempDateRange}
        onChange={setTempDateRange}
        onApply={applyDateFilter}
        onCancel={closeDateModal}
      />

      <RefundModal
        open={isRefundModalOpen}
        refundData={refundData}
        hasRefundSelection={hasRefundSelection}
        onClose={closeRefundModal}
        onChangeQty={setRefundQty}
        onSubmit={handleProcessRefund}
      />
    </div>
  );
}
