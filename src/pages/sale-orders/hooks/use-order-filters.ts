import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import type { SaleOrderQueryParams } from "@/api/sale-orders/sale-order.types";
import { ACTIVE_SUB_TABS, HISTORY_SUB_TABS } from "../constants";
import type { DateRange, OrderStatus, TopTab } from "../types";

function parseTopTab(value: string | null): TopTab {
  const normalized = (value || "").toLowerCase();
  if (normalized === "history") return "HISTORY";
  if (normalized === "statistic" || normalized === "statistics") return "STATISTIC";
  return "ACTIVE";
}

function parseSubTab(value: string | null): OrderStatus | undefined {
  if (!value) return undefined;
  const normalized = value.toUpperCase().replace(/-/g, "_");
  const allTabs = [...ACTIVE_SUB_TABS, ...HISTORY_SUB_TABS];
  return allTabs.includes(normalized as OrderStatus) ? (normalized as OrderStatus) : undefined;
}

export function useOrderFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page,
    perPage,
    search,
    sort,
    setPage,
    setPerPage,
    setSearch,
    setSort,
  } = useTableQueryParams({
    defaultPage: 1,
    defaultPerPage: 12,
    defaultSort: "-created_at",
  });

  const activeTopTab = useMemo(
    () => parseTopTab(searchParams.get("sale_order_tab") || searchParams.get("tab")),
    [searchParams],
  );

  const activeSubTabs = activeTopTab === "ACTIVE" ? ACTIVE_SUB_TABS : HISTORY_SUB_TABS;
  const defaultSubTab = activeTopTab === "ACTIVE" ? "DRAFT" : "COMPLETED";
  const rawSubTab = parseSubTab(searchParams.get("sale_order_subtab") || searchParams.get("subtab"));
  const activeSubTab = (rawSubTab && activeSubTabs.includes(rawSubTab) ? rawSubTab : defaultSubTab) as OrderStatus;

  const dateRange = useMemo<DateRange>(
    () => ({
      start: searchParams.get("date_from") || searchParams.get("startDate") || "",
      end: searchParams.get("date_to") || searchParams.get("endDate") || "",
    }),
    [searchParams],
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
    setPage(1);

    if (topTab === "STATISTIC") {
      updateQueryParams({
        sale_order_tab: "statistic",
        sale_order_subtab: undefined,
        sale_order_id: undefined,
        sale_order_refund_id: undefined,
        page: "1",
      });
      return;
    }

    const nextDefaultSubTab: OrderStatus = topTab === "ACTIVE" ? "DRAFT" : "COMPLETED";
    const nextSubTab = subTab ?? nextDefaultSubTab;
    updateQueryParams({
      sale_order_tab: topTab.toLowerCase(),
      sale_order_subtab: nextSubTab.toLowerCase(),
      sale_order_id: undefined,
      sale_order_refund_id: undefined,
      page: "1",
    });
  };

  const setDateRange = (nextDateRange: DateRange) => {
    setPage(1);
    updateQueryParams({
      date_from: nextDateRange.start || undefined,
      date_to: nextDateRange.end || undefined,
      page: "1",
    });
  };

  const setSearchTerm = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const setSortValue = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const queryParams: SaleOrderQueryParams = useMemo(() => {
    const params: SaleOrderQueryParams = {
      page,
      per_page: perPage,
      sort: sort || "-created_at",
      "filter[search]": search || undefined,
      "filter[order_status]": activeTopTab === "STATISTIC" ? undefined : activeSubTab,
    };

    if (dateRange.start) {
      params["filter[date_from]"] = dateRange.start;
    }

    if (dateRange.end) {
      params["filter[date_to]"] = dateRange.end;
    }

    return params;
  }, [activeSubTab, activeTopTab, dateRange.end, dateRange.start, page, perPage, search, sort]);

  return {
    activeTopTab,
    activeSubTab,
    activeSubTabs,
    searchTerm: search,
    dateRange,
    page,
    perPage,
    sort: sort || "-created_at",
    setPerPage,
    setPage,
    setSearchTerm,
    setDateRange,
    setSortValue,
    handleTabChange,
    updateQueryParams,
    queryParams,
  };
}
