import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { downloadSaleOrderReport, downloadSaleOrderStatisticsReport } from "@/api/sale-orders/sale-order.api";
import type { PaymentStatus } from "@/api/sale-orders/sale-order.types";
import { useSaleOrderRefundRecords, useSaleOrderStatistics, useSingleSaleOrder } from "@/api/sale-orders/sale-order.query";
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
import { RefundRecordDetailsPanel } from "./_components/refund-record-details-panel";
import { RefundedRecordList } from "./_components/refunded-record-list";
import { SaleOrderLayout } from "./_components/sale-order-layout";
import { StatisticsPanel } from "./_components/statistics-panel";
import { SubTabs } from "./_components/sub-tabs";
import { TopTabs } from "./_components/top-tabs";
import { useDateRangeFilter } from "./hooks/use-date-range-filter";
import { useOrderFilters } from "./hooks/use-order-filters";
import { useOrderForm } from "./hooks/use-order-form";
import { mapSaleOrderRecord, useOrders } from "./hooks/use-orders";
import { useRefundHandler } from "./hooks/use-refund-handler";
import type { Order, OrderStatus, RefundRecordListItem, TopTab } from "./types";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";

type ViewMode = "empty" | "view" | "form";

function parseGroupBy(
  value: string | null,
): "day" | "week" | "month" | "year" {
  if (value === "day" || value === "week" || value === "month" || value === "year") {
    return value;
  }
  return "month";
}

export default function SaleOrdersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("empty");
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

  const selectedOrderDbId = Number(searchParams.get("sale_order_id") || 0) || null;
  const selectedRefundId = Number(searchParams.get("sale_order_refund_id") || 0) || null;
  const statsGroupBy = parseGroupBy(searchParams.get("stats_group_by"));
  const statsCustomerId = Number(searchParams.get("stats_customer_id") || 0) || undefined;
  const statsStatus = searchParams.get("stats_status") || undefined;

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

  const customerOptions = useMemo(
    () => customers.map(customer => ({ id: Number(customer.id), name: customer.name })),
    [customers],
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
    updateQueryParams,
    queryParams,
  } = useOrderFilters();

  const isRefundedTab = activeTopTab === "HISTORY" && activeSubTab === "REFUNDED";
  const isStatisticTab = activeTopTab === "STATISTIC";

  const { orders, orderMapByDbId, pagination, saveOrder, updateStatus, updatePayment, updateLatestInstallment, markRefunded, isLoading: isOrdersLoading, isFetching } =
    useOrders(queryParams);

  const fallbackOrderQuery = useSingleSaleOrder(
    selectedOrderDbId && !orderMapByDbId.has(selectedOrderDbId) ? selectedOrderDbId : 0,
  );

  const fallbackOrder = useMemo<Order | null>(() => {
    const record = fallbackOrderQuery.data?.data?.sale_order;
    if (!record) return null;
    return mapSaleOrderRecord(record);
  }, [fallbackOrderQuery.data]);

  const refundRecordsQuery = useSaleOrderRefundRecords(
    isRefundedTab
      ? {
          page,
          per_page: pagination.perPage,
          search: searchTerm || undefined,
          date_from: dateRange.start || undefined,
          date_to: dateRange.end || undefined,
        }
      : undefined,
  );

  const refundRecords = useMemo<RefundRecordListItem[]>(
    () =>
      (refundRecordsQuery.data?.data?.data ?? []).map(record => {
        const saleOrder = record.sale_order ?? record.saleOrder;
        return {
          id: Number(record.id),
          refundNo: record.refund_no,
          saleOrderDbId: Number(record.sale_order_id ?? saleOrder?.id ?? 0),
          saleOrderNo: saleOrder?.order_no ?? `SO#${record.sale_order_id}`,
          customerName: saleOrder?.customer?.fullname,
          amountUsd: Number(record.total_refund_amount_in_usd ?? 0),
          amountRiel: Number(record.total_refund_amount_in_riel ?? 0),
          reason: record.reason,
          refundedItemsCount: Array.isArray(record.items) ? record.items.length : 0,
          refundType: record.refund_type,
          refundMethod: record.refund_method,
          processedAt: record.processed_at,
        };
      }),
    [refundRecordsQuery.data],
  );

  const selectedRefundRecord = useMemo(
    () => refundRecords.find(item => item.id === selectedRefundId) ?? null,
    [refundRecords, selectedRefundId],
  );

  const statisticsQuery = useSaleOrderStatistics({
    date_from: dateRange.start || undefined,
    date_to: dateRange.end || undefined,
    group_by: statsGroupBy,
    customer_id: statsCustomerId,
    status: statsStatus,
  });
  const statisticsData = statisticsQuery.data?.data;

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
    if (!selectedOrderDbId) return null;
    return orderMapByDbId.get(selectedOrderDbId) ?? fallbackOrder ?? null;
  }, [fallbackOrder, orderMapByDbId, selectedOrderDbId]);

  const hasRefundListData = refundRecords.length > 0;
  const isRefundListLoading = isRefundedTab && refundRecordsQuery.isLoading && !hasRefundListData;
  const isDetailLoading =
    viewMode === "view" &&
    (
      (Boolean(selectedOrderDbId) && (isOrdersLoading || fallbackOrderQuery.isLoading) && !currentViewOrder) ||
      (Boolean(selectedRefundId) && isRefundListLoading && !selectedRefundRecord)
    );

  useEffect(() => {
    if (viewMode === "form") return;
    if (selectedOrderDbId || selectedRefundId) {
      setViewMode("view");
      return;
    }
    setViewMode("empty");
  }, [selectedOrderDbId, selectedRefundId, viewMode]);

  const setWorkspaceParams = (updates: Record<string, string | undefined>) => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (!value) {
            next.delete(key);
            return;
          }
          next.set(key, value);
        });
        return next;
      },
      { replace: true },
    );
  };

  const resetRightPanel = () => {
    setViewMode("empty");
    setWorkspaceParams({
      sale_order_id: undefined,
      sale_order_refund_id: undefined,
    });
  };

  const handleTopTabChange = (tab: TopTab) => {
    if (tab === "STATISTIC") {
      if (!isStatisticTab) {
        setWorkspaceParams({
          sale_order_prev_tab: activeTopTab.toLowerCase(),
          sale_order_prev_subtab: activeSubTab.toLowerCase(),
          sale_order_prev_order_id: selectedOrderDbId ? String(selectedOrderDbId) : undefined,
          sale_order_prev_refund_id: selectedRefundId ? String(selectedRefundId) : undefined,
        });
      }
      handleTabChange("STATISTIC");
      setViewMode("empty");
      return;
    }

    handleTabChange(tab);
    setViewMode("empty");
  };

  const handleBackToOrdersFromStatistics = () => {
    const prevTab = searchParams.get("sale_order_prev_tab");
    const prevSubtab = searchParams.get("sale_order_prev_subtab");

    const resolvedTopTab: TopTab = prevTab === "history" ? "HISTORY" : "ACTIVE";
    const resolvedSubtab = (prevSubtab || (resolvedTopTab === "HISTORY" ? "completed" : "draft")).toUpperCase() as OrderStatus;

    handleTabChange(resolvedTopTab, resolvedSubtab);
    setWorkspaceParams({
      sale_order_id: searchParams.get("sale_order_prev_order_id") || undefined,
      sale_order_refund_id: searchParams.get("sale_order_prev_refund_id") || undefined,
      sale_order_prev_tab: undefined,
      sale_order_prev_subtab: undefined,
      sale_order_prev_order_id: undefined,
      sale_order_prev_refund_id: undefined,
    });
  };

  const handleSubTabChange = (status: OrderStatus) => {
    handleTabChange(activeTopTab, status);
    setViewMode("empty");
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

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await updateStatus(orderId, status);

      if (["COMPLETED", "CANCELLED"].includes(status)) {
        handleTabChange("HISTORY", status);
        setViewMode("empty");
        return;
      }

      handleTabChange("ACTIVE", status);
      setViewMode("view");
    } catch {
      // Error toast handled by mutation hooks.
    }
  };

  const handleUpdatePayment = async (
    orderId: number,
    payload: {
      payment_status: PaymentStatus;
      payment_percentage?: number;
      installment_note?: string;
    },
  ) => {
    try {
      await updatePayment(orderId, payload);
    } catch {
      // Error toast handled by mutation hooks.
    }
  };

  const handleUpdateLatestInstallment = async (
    orderId: number,
    payload: {
      payment_percentage: number;
      note?: string;
      paid_at?: string;
    },
  ) => {
    try {
      await updateLatestInstallment(orderId, payload);
    } catch {
      // Error toast handled by mutation hooks.
    }
  };

  const handleSelectOrder = (order: Order) => {
    setWorkspaceParams({
      sale_order_id: String(order.dbId),
      sale_order_refund_id: undefined,
    });
    setViewMode("view");
  };

  const handleSelectRefundRecord = (record: RefundRecordListItem) => {
    setWorkspaceParams({
      sale_order_refund_id: String(record.id),
      sale_order_id: undefined,
    });
    setViewMode("view");
  };

  const handleOpenOrderFromRefund = (record: RefundRecordListItem) => {
    updateQueryParams({
      sale_order_tab: "history",
      sale_order_subtab: "completed",
      sale_order_id: String(record.saleOrderDbId),
      sale_order_refund_id: undefined,
    });
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
      setViewMode("empty");
    } catch {
      // Error toast handled by mutation hooks.
    }
  };

  const handleDownloadReport = async () => {
    try {
      setIsDownloadingReport(true);
      const blob = await downloadSaleOrderStatisticsReport({
        date_from: dateRange.start || undefined,
        date_to: dateRange.end || undefined,
        group_by: statsGroupBy,
        customer_id: statsCustomerId,
        status: statsStatus,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sale-order-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Report download started");
    } catch {
      toast.error("Failed to download report");
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const blob = await downloadSaleOrderReport(order.dbId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const isQuote = order.status === "DRAFT";
      const baseName = isQuote ? "quote" : "invoice";
      link.download = `${baseName}-${order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${isQuote ? "Quote" : "Invoice"} download started`);
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  const detailContent =
    isDetailLoading ? (
      <div className="flex flex-1 items-center justify-center bg-muted/25 p-4">
        <DataCardLoading text="Loading sale order data..." className="min-h-[260px]" />
      </div>
    ) : isRefundedTab && viewMode === "view" ? (
      <RefundRecordDetailsPanel record={selectedRefundRecord} onOpenOrder={handleOpenOrderFromRefund} />
    ) : viewMode === "view" && currentViewOrder ? (
      <OrderDetailsPanel
        order={currentViewOrder}
        customer={customers.find(customer => customer.id === currentViewOrder.customerId)}
        customers={customers}
        onEdit={handleOpenUpdateForm}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
        onUpdateLatestInstallment={handleUpdateLatestInstallment}
        onDownloadInvoice={handleDownloadInvoice}
        onOpenRefund={handleOpenRefundModal}
        onViewRefundDetail={refundId => {
          updateQueryParams({
            sale_order_tab: "history",
            sale_order_subtab: "refunded",
            sale_order_refund_id: String(refundId),
            sale_order_id: undefined,
          });
          setViewMode("view");
        }}
        onViewRefundRecords={() => {
          handleTabChange("HISTORY", "REFUNDED");
          setViewMode("empty");
        }}
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
      <div className="flex flex-1 flex-col items-center justify-center bg-muted/25 p-4 text-center animate-in fade-in duration-300">
        <EmptyState
          title={isRefundedTab ? "No refund selected" : "No order selected"}
          description={
            isRefundedTab
              ? "Select a refund record from the left to view refund detail and navigate back to its completed order."
              : "Select an order from the list to view details or start a new sale order."
          }
        />
        {!isRefundedTab && (
          <button
            type="button"
            onClick={handleOpenCreateForm}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <CirclePlus className="h-3.5 w-3.5" />
            Start New Order
          </button>
        )}
      </div>
    );

  const currentPage = isRefundedTab
    ? Number(refundRecordsQuery.data?.data?.current_page ?? page)
    : page;
  const totalPages = isRefundedTab
    ? Number(refundRecordsQuery.data?.data?.last_page ?? 1)
    : pagination.totalPages;
  const totalItems = isRefundedTab
    ? Number(refundRecordsQuery.data?.data?.total ?? 0)
    : pagination.totalItems;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  if (isStatisticTab) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-[calc(100vh-128px)] min-h-[700px] flex-col overflow-hidden rounded-xl border border-border bg-card/50">
          <div className="flex h-16 items-center border-b border-border bg-card px-4">
            <TopTabs
              activeTopTab={activeTopTab}
              onChange={handleTopTabChange}
              onCreateOrder={handleOpenCreateForm}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <StatisticsPanel
              stats={statisticsData}
              isLoading={statisticsQuery.isLoading && !statisticsData}
              groupBy={statsGroupBy}
              customerId={statsCustomerId}
              status={statsStatus}
              customerOptions={customerOptions}
              dateRange={dateRange}
              onGroupByChange={value => setWorkspaceParams({ stats_group_by: value })}
              onCustomerChange={value => setWorkspaceParams({ stats_customer_id: value ? String(value) : undefined })}
              onStatusChange={value => setWorkspaceParams({ stats_status: value || undefined })}
              onOpenDateFilter={openDateModal}
              onClearDateFilter={clearDateFilter}
              onDownloadReport={handleDownloadReport}
              onBackToOrders={handleBackToOrdersFromStatistics}
              onViewCustomer={customerId => navigate(`/customer/view/${customerId}`)}
              onViewProduct={productId => navigate(`/products/view/${productId}`)}
              isDownloading={isDownloadingReport}
            />
          </div>
        </div>

        <DateRangeFilterModal
          open={isDateModalOpen}
          value={tempDateRange}
          onChange={setTempDateRange}
          onApply={applyDateFilter}
          onCancel={closeDateModal}
        />
      </div>
    );
  }

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
          <HistoryFilters
            mode={activeTopTab}
            searchTerm={searchTerm}
            dateRange={dateRange}
            sort={sort}
            onSearchChange={setSearchTerm}
            onSortChange={setSortValue}
            onOpenDateFilter={openDateModal}
            onClearDateFilter={clearDateFilter}
          />
        }
        subTabs={<SubTabs tabs={activeSubTabs} activeSubTab={activeSubTab} onChange={handleSubTabChange} />}
        list={
          isRefundedTab ? (
            <RefundedRecordList
              records={refundRecords}
              selectedRefundId={selectedRefundId}
              onSelectRefund={handleSelectRefundRecord}
              onOpenOrder={handleOpenOrderFromRefund}
              isLoading={isRefundListLoading}
            />
          ) : (
            <OrderList
              orders={orders}
              customers={customers}
              selectedOrderDbId={selectedOrderDbId}
              onSelectOrder={handleSelectOrder}
              isLoading={isOrdersLoading && orders.length === 0}
            />
          )
        }
        pagination={
          <OrderPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onNextPage={() => setPage(currentPage + 1)}
            onPreviousPage={() => setPage(Math.max(1, currentPage - 1))}
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

      {isFetching && (
        <div className="pointer-events-none fixed inset-x-0 bottom-2 mx-auto w-fit rounded-md bg-card px-3 py-1 text-xs text-muted-foreground shadow">
          Refreshing orders...
        </div>
      )}
    </div>
  );
}
