import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useProductStockLots } from "@/api/product/product.query";
import { ProductStockLot } from "@/api/product/product.type";
import { formatDate } from "@/utils/date-format";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search } from "lucide-react";

const LOT_STATUS_OPTIONS = [
  { value: "ALL", label: "All Lot Status" },
  { value: "AVAILABLE", label: "Available" },
  { value: "PARTIALLY_CONSUMED", label: "Partially Consumed" },
  { value: "CONSUMED", label: "Consumed" },
];

const PRODUCT_STATUS_OPTIONS = [
  { value: "ALL", label: "All Product Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "WORK_IN_PROGRESS", label: "Work In Progress" },
  { value: "PARTIALLY_COMPLETED", label: "Partially Completed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "BLOCKED", label: "Blocked" },
];

const MOVEMENT_TYPE_OPTIONS = [
  { value: "ALL", label: "All Movement Types" },
  { value: "EXTERNAL_PURCHASED", label: "External Purchased" },
  { value: "INTERNAL_PRODUCED", label: "Internal Produced" },
  { value: "RE_ORDER", label: "Re Order" },
  { value: "ADJUSTMENT_IN", label: "Adjustment In" },
];

const SORT_OPTIONS = [
  { value: "-movement_date", label: "Date: Newest First" },
  { value: "movement_date", label: "Date: Oldest First" },
  { value: "-remaining_quantity", label: "Remaining: High to Low" },
  { value: "remaining_quantity", label: "Remaining: Low to High" },
  { value: "-quantity", label: "Original Qty: High to Low" },
  { value: "quantity", label: "Original Qty: Low to High" },
  { value: "-selling_unit_price_in_usd", label: "Selling Price: High to Low" },
  { value: "selling_unit_price_in_usd", label: "Selling Price: Low to High" },
  {
    value: "-purchase_unit_price_in_usd",
    label: "Purchase Price: High to Low",
  },
  {
    value: "purchase_unit_price_in_usd",
    label: "Purchase Price: Low to High",
  },
];

interface ProductStockLotsTableProps {
  productId: number;
  saleMethod: "FIFO" | "LIFO";
}

function getLotStatus(lot: ProductStockLot): ProductStockLot["lot_status"] {
  if (lot.lot_status) return lot.lot_status;
  const quantity = Number(lot.quantity ?? 0);
  const remaining = Number(lot.remaining_quantity ?? 0);

  if (remaining <= 0) return "CONSUMED";
  if (remaining < quantity) return "PARTIALLY_CONSUMED";
  return "AVAILABLE";
}

export function ProductStockLotsTable({
  productId,
  saleMethod,
}: ProductStockLotsTableProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState("-movement_date");
  const [search, setSearch] = useState("");
  const [movementType, setMovementType] = useState("ALL");
  const [productStatus, setProductStatus] = useState("ALL");
  const [lotStatus, setLotStatus] = useState("ALL");

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, isFetching, refetch } = useProductStockLots(
    productId,
    {
      page,
      per_page: perPage,
      sort,
      "filter[search]": debouncedSearch || undefined,
      ...(movementType !== "ALL" && {
        "filter[movement_type]": movementType,
      }),
      ...(productStatus !== "ALL" && {
        "filter[product_status]": productStatus,
      }),
      ...(lotStatus !== "ALL" && { "filter[lot_status]": lotStatus }),
    },
  );

  const lots = data?.data ?? [];
  const currentPage = data?.current_page ?? 1;
  const lastPage = data?.last_page ?? 1;
  const total = data?.total ?? 0;

  const noFilterApplied = useMemo(
    () =>
      !search.trim() &&
      movementType === "ALL" &&
      productStatus === "ALL" &&
      lotStatus === "ALL",
    [search, movementType, productStatus, lotStatus],
  );

  const resetFilters = () => {
    setSearch("");
    setMovementType("ALL");
    setProductStatus("ALL");
    setLotStatus("ALL");
    setSort("-movement_date");
    setPage(1);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Stock Lots</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {saleMethod === "LIFO"
                ? "LIFO product: newest lot is consumed first."
                : "FIFO product: oldest lot is consumed first."}
            </p>
          </div>
          <Badge variant="outline">{total.toLocaleString()} Lots</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 max-w-[340px]">
            <Search className="h-4 w-4 text-muted-foreground absolute left-2.5 top-2.5" />
            <Input
              className="pl-8 h-9"
              placeholder="Search lot, type, status, user..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Select
            value={movementType}
            onValueChange={v => {
              setMovementType(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[170px] h-9 text-sm">
              <SelectValue placeholder="Movement Type" />
            </SelectTrigger>
            <SelectContent>
              {MOVEMENT_TYPE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={productStatus}
            onValueChange={v => {
              setProductStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Product Status" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={lotStatus}
            onValueChange={v => {
              setLotStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Lot Status" />
            </SelectTrigger>
            <SelectContent>
              {LOT_STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={v => {
              setSort(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[210px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(perPage)}
            onValueChange={v => {
              setPerPage(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[100px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REQUEST_PER_PAGE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!noFilterApplied && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear
            </Button>
          )}
        </div>

        {isError && !isFetching ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 py-8 flex flex-col items-center gap-3 text-destructive">
            <p className="text-sm">Failed to load stock lots.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Product Status</th>
                  <th className="px-3 py-2.5 text-right">Original Qty</th>
                  <th className="px-3 py-2.5 text-right">Sold Qty</th>
                  <th className="px-3 py-2.5 text-right">Remaining</th>
                  <th className="px-3 py-2.5 text-right">Sell (USD)</th>
                  <th className="px-3 py-2.5 text-right">Buy (USD)</th>
                  <th className="px-3 py-2.5">Lot Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      className="px-3 py-8 text-center text-sm text-muted-foreground"
                      colSpan={9}
                    >
                      Loading stock lots...
                    </td>
                  </tr>
                ) : lots.length === 0 ? (
                  <tr>
                    <td
                      className="px-3 py-8 text-center text-sm text-muted-foreground"
                      colSpan={9}
                    >
                      No stock lots found.
                    </td>
                  </tr>
                ) : (
                  lots.map(lot => {
                    const status = getLotStatus(lot);
                    return (
                      <tr key={lot.id} className="bg-card">
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {lot.movement_date ? formatDate(lot.movement_date) : "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          {String(lot.movement_type || "").replace(/_/g, " ")}
                        </td>
                        <td className="px-3 py-2.5">
                          {String(lot.product_status || "—").replace(/_/g, " ")}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          {Number(lot.quantity || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          {Number(lot.allocated_quantity || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold">
                          {Number(lot.remaining_quantity || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          $
                          {Number(
                            lot.selling_unit_price_in_usd || 0,
                          ).toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          $
                          {Number(
                            lot.purchase_unit_price_in_usd || 0,
                          ).toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant="outline"
                            className={
                              status === "CONSUMED"
                                ? "border-red-500 text-red-600"
                                : status === "PARTIALLY_CONSUMED"
                                  ? "border-amber-500 text-amber-600"
                                  : "border-green-500 text-green-600"
                            }
                          >
                            {status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !isError && lastPage > 1 && (
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              <GlobalPagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

