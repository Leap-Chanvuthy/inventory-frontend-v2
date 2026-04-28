import { useMemo, useState } from "react";
import { CirclePlus } from "lucide-react";
import { useSaleOrderStatistics } from "@/api/sale-orders/sale-order.query";
import { useCustomers } from "@/api/customers/customer.query";
import { useProducts } from "@/api/product/product.query";
import { DateRangeFilterModal } from "./_components/date-range-filter-modal";
import { EmptyState } from "./_components/empty-state";
import { HistoryFilters } from "./_components/history-filters";
import { OrderDetailsPanel } from "./_components/order-details-panel";
import { OrderForm } from "./_components/order-form";
import { OrderList } from "./_components/order-list";
import { OrderPagination } from "./_components/order-pagination";
import { RefundModal } from "./_components/refund-modal";
import { SaleOrderLayout } from "./_components/sale-order-layout";
import { SaleOrderStatsCards } from "./_components/sale-order-stats-cards";
import { SubTabs } from "./_components/sub-tabs";
import { TopTabs } from "./_components/top-tabs";
import { useDateRangeFilter } from "./hooks/use-date-range-filter";
import { useOrderFilters } from "./hooks/use-order-filters";
import { useOrderForm } from "./hooks/use-order-form";
import { useOrders } from "./hooks/use-orders";
import { useRefundHandler } from "./hooks/use-refund-handler";
import type { OrderStatus, TopTab } from "./types";

type ViewMode = "empty" | "view" | "form";

export default function SaleOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("empty");

  const customersQuery = useCustomers({ page: 1, per_page: 500, sort: "fullname" });
  const productsQuery = useProducts({ page: 1, per_page: 500, sort: "product_name" });

  const customers = useMemo(
    () =>
      (customersQuery.data?.data?.data ?? []).map(customer => ({
        id: String(customer.id),
        name: customer.fullname,
        category: customer.customer_category?.category_name || "Uncategorized",
        discount: Number(customer.customer_category?.discount_percentage ?? 0),
        phone: customer.phone_number,
        email: customer.email_address,
        avatar: customer.image,
      })),
    [customersQuery.data],
  );

  const products = useMemo(
    () =>
      (productsQuery.data?.data ?? []).map(product => ({
        id: String(product.id),
        dbId: Number(product.id),
        name: product.product_name,
        price: Number(product.latest_selling_unit_price_in_usd ?? 0),
        priceInRiel: Number(product.latest_selling_unit_price_in_riel ?? 0),
        exchangeRateUsdToRiel: Number(product.latest_selling_exchange_rate_from_usd_to_riel ?? 0),
        exchangeRateRielToUsd: Number(product.latest_selling_exchange_rate_from_riel_to_usd ?? 0),
        sku: product.product_sku_code,
        category: product.product_category_name || product.category?.category_name || "Uncategorized",
      })),
    [productsQuery.data],
  );

  const {
    activeTopTab,
    activeSubTab,
    searchTerm,
    sort,
    dateRange,
    activeSubTabs,
    page,
    setPage,
    setSearchTerm,
    setDateRange,
    setSortValue,
    handleTabChange,
    queryParams,
  } = useOrderFilters();

  const { orders, orderMap, pagination, saveOrder, updateStatus, updatePayment, markRefunded, isFetching } =
    useOrders(queryParams);

  const statisticsQuery = useSaleOrderStatistics(
    dateRange.start || dateRange.end
      ? {
          date_from: dateRange.start || undefined,
          date_to: dateRange.end || undefined,
        }
      : undefined,
  );

  const {
    formState,
    formProductSelect,
    activeCustomer,
    totals,
    openCreateForm,
    openUpdateForm,
    resetForm,
    setField,
    setFormProductSelect,
    removeItem,
    setItemQty,
  } = useOrderForm(customers, products);

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
    setRefundAction,
    setProcessReturn,
    setProcessRefund,
    setIsResellable,
    setRefundPercentage,
    setRefundReason,
    setRefundNote,
    setRefundType,
    setRefundMethod,
    setReasonType,
    setReason,
  } = useRefundHandler();

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

  const handleSaveOrder = async (shouldProcess: boolean) => {
    if (!formState) return;

    if (formState.items.length === 0) {
      window.alert("Please add at least one item.");
      return;
    }

    try {
      await saveOrder(formState, shouldProcess);
      resetForm();
      resetRightPanel();
      handleTabChange("ACTIVE", shouldProcess ? "PROCESSING" : "DRAFT");
    } catch {
      // Error toast handled by mutation hooks.
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus(orderId, status);

      if (["COMPLETED", "CANCELLED", "REFUNDED"].includes(status)) {
        handleTabChange("HISTORY", status);
        resetRightPanel();
        return;
      }

      handleTabChange("ACTIVE", status);
      setViewMode("view");
    } catch {
      // Error toast handled by mutation hooks.
    }
  };

  const handleUpdatePayment = async (
    orderId: string,
    payload: { payment_status: "PAID" | "UNPAID" | "DEBT"; paid_amount_in_usd?: number; paid_amount_in_riel?: number },
  ) => {
    try {
      await updatePayment(orderId, payload);
    } catch {
      // Error toast handled by mutation hooks.
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setViewMode("view");
  };

  const handleOpenRefundModal = (order?: typeof currentViewOrder) => {
    const targetOrder = order ?? currentViewOrder;
    if (!targetOrder) return;
    openRefundModal(targetOrder);
  };

  const handleProcessRefund = async () => {
    if (!refundData.orderId || !hasRefundSelection) {
      return;
    }

    try {
      await markRefunded(refundData);
      closeRefundModal();
      handleTabChange("HISTORY", "REFUNDED");
      resetRightPanel();
    } catch {
      // Error toast handled by mutation hooks.
    }
  };

  const handleDownloadReport = () => {
    window.alert("Download report started (mock).");
  };

  const detailContent =
    viewMode === "view" && currentViewOrder ? (
      <OrderDetailsPanel
        order={currentViewOrder}
        customer={customers.find(customer => customer.id === currentViewOrder.customerId)}
        customers={customers}
        onEdit={handleOpenUpdateForm}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
        onOpenRefund={handleOpenRefundModal}
      />
    ) : viewMode === "form" && formState ? (
      <OrderForm
        formState={formState}
        customers={customers}
        products={products}
        activeCustomer={activeCustomer}
        formTotals={totals}
        formProductSelect={formProductSelect}
        onCancel={() => {
          resetForm();
          resetRightPanel();
        }}
        onSetField={setField}
        onSetProductSelect={setFormProductSelect}
        onRemoveItem={removeItem}
        onUpdateItemQty={setItemQty}
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
          <CirclePlus className="h-4 w-4" />
          Start New Order
        </button>
      </div>
    );

  const hasNextPage = page < pagination.totalPages;
  const hasPreviousPage = page > 1;

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
            {activeTopTab === "ACTIVE" && (
              <SaleOrderStatsCards stats={statisticsQuery.data?.data} />
            )}
            <HistoryFilters
              mode={activeTopTab}
              searchTerm={searchTerm}
              dateRange={dateRange}
              sort={sort}
              onSearchChange={setSearchTerm}
              onSortChange={setSortValue}
              onOpenDateFilter={openDateModal}
              onClearDateFilter={clearDateFilter}
              onDownloadReport={handleDownloadReport}
            />
          </div>
        }
        subTabs={<SubTabs tabs={activeSubTabs} activeSubTab={activeSubTab} onChange={handleSubTabChange} />}
        list={
          <OrderList
            orders={orders}
            customers={customers}
            selectedOrderId={selectedOrderId}
            onSelectOrder={handleSelectOrder}
          />
        }
        pagination={
          <OrderPagination
            page={page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onNextPage={() => setPage(page + 1)}
            onPreviousPage={() => setPage(Math.max(1, page - 1))}
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
        onChangeAction={setRefundAction}
        onChangeProcessReturn={setProcessReturn}
        onChangeProcessRefund={setProcessRefund}
        onChangeResellable={setIsResellable}
        onChangeRefundPercentage={setRefundPercentage}
        onChangeItemReason={setRefundReason}
        onChangeNote={setRefundNote}
        onChangeRefundType={setRefundType}
        onChangeRefundMethod={setRefundMethod}
        onChangeReasonType={setReasonType}
        onChangeReason={setReason}
        onSubmit={handleProcessRefund}
      />

      {isFetching && <div className="pointer-events-none fixed inset-x-0 bottom-2 mx-auto w-fit rounded-md bg-card px-3 py-1 text-xs text-muted-foreground shadow">Refreshing orders...</div>}
    </div>
  );
}
