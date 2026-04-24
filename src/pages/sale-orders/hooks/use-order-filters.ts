import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { ACTIVE_SUB_TABS, HISTORY_SUB_TABS } from "../constants";
import type { Customer, DateRange, Order, OrderStatus, TopTab } from "../types";
import { filterOrdersByDate } from "../utils/order-utils";

function parseTopTab(value: string | null): TopTab {
  return value?.toLowerCase() === "history" ? "HISTORY" : "ACTIVE";
}

function parseSubTab(value: string | null): OrderStatus | undefined {
  if (!value) return undefined;
  const normalized = value.toUpperCase().replace(/-/g, "_");
  const allTabs = [...ACTIVE_SUB_TABS, ...HISTORY_SUB_TABS];
  return allTabs.includes(normalized as OrderStatus) ? (normalized as OrderStatus) : undefined;
}

export function useOrderFilters(orders: Order[], customers: Customer[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { page, perPage, search, setPage, setSearch } = useTableQueryParams({
    defaultPage: 1,
    defaultPerPage: 12,
  });

  const activeTopTab = useMemo(
    () => parseTopTab(searchParams.get("tab")),
    [searchParamsString],
  );

  const activeSubTabs = activeTopTab === "ACTIVE" ? ACTIVE_SUB_TABS : HISTORY_SUB_TABS;
  const defaultSubTab = activeTopTab === "ACTIVE" ? "DRAFT" : "COMPLETED";
  const rawSubTab = parseSubTab(searchParams.get("subtab"));
  const activeSubTab = (rawSubTab && activeSubTabs.includes(rawSubTab) ? rawSubTab : defaultSubTab) as OrderStatus;
  const dateRange = useMemo<DateRange>(
    () => ({
      start: searchParams.get("startDate") || "",
      end: searchParams.get("endDate") || "",
    }),
    [searchParamsString],
  );

  const updateQueryParams = useCallback(
    (updates: Record<string, string | undefined>) => {
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
          return next.toString() === prev.toString() ? prev : next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleTabChange = (topTab: TopTab, subTab?: OrderStatus) => {
    const nextDefaultSubTab: OrderStatus = topTab === "ACTIVE" ? "DRAFT" : "COMPLETED";
    const nextSubTab = subTab ?? nextDefaultSubTab;
    setPage(1);
    updateQueryParams({
      tab: topTab.toLowerCase(),
      subtab: nextSubTab.toLowerCase(),
      page: "1",
    });
  };

  const setDateRange = (nextDateRange: DateRange) => {
    setPage(1);
    updateQueryParams({
      startDate: nextDateRange.start || undefined,
      endDate: nextDateRange.end || undefined,
      page: "1",
    });
  };

  const setSearchTerm = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const filteredOrders = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    const scopedOrders = activeTopTab === "HISTORY" ? filterOrdersByDate(orders, dateRange) : orders;

    return scopedOrders
      .filter(order => {
        const searchMatch =
          order.id.toLowerCase().includes(lowerSearch) ||
          (customers.find(customer => customer.id === order.customerId)?.name.toLowerCase() ?? "").includes(lowerSearch);

        const isHistoryStatus = HISTORY_SUB_TABS.includes(order.status);
        const topTabMatch = activeTopTab === "ACTIVE" ? !isHistoryStatus : isHistoryStatus;

        return searchMatch && topTabMatch && order.status === activeSubTab;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activeSubTab, activeTopTab, customers, dateRange, orders, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));

  useEffect(() => {
    const normalizedTab = activeTopTab.toLowerCase();
    const normalizedSubTab = activeSubTab.toLowerCase();
    const tab = searchParams.get("tab");
    const subtab = searchParams.get("subtab");

    if (tab !== normalizedTab || subtab !== normalizedSubTab) {
      updateQueryParams({
        tab: normalizedTab,
        subtab: normalizedSubTab,
      });
    }
  }, [activeSubTab, activeTopTab, searchParamsString, updateQueryParams]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, setPage, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredOrders.slice(start, start + perPage);
  }, [filteredOrders, page, perPage]);

  return {
    activeTopTab,
    activeSubTab,
    searchTerm: search,
    dateRange,
    activeSubTabs,
    filteredOrders,
    paginatedOrders,
    page,
    totalPages,
    totalItems: filteredOrders.length,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    setSearchTerm,
    setDateRange,
    setPage,
    goToNextPage: () => setPage(Math.min(page + 1, totalPages)),
    goToPreviousPage: () => setPage(Math.max(page - 1, 1)),
    handleTabChange,
  };
}
