import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useRawMaterialStockLots } from "@/api/raw-materials/raw-material.query";
import { DataTable } from "@/components/reusable/data-table/data-table";
import {
  RAW_MATERIAL_STOCK_LOT_COLUMNS,
  renderRawMaterialStockLotHistory,
} from "../utils/stock-lot-table-feature";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { GlobalPagination } from "@/components/reusable/partials/pagination";

interface RawMaterialStockLotsTableProps {
  rawMaterialId: number;
  productionMethod?: string;
}

export function RawMaterialStockLotsTable({
  rawMaterialId,
  productionMethod,
}: RawMaterialStockLotsTableProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [movementTypeFilter, setMovementTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, isFetching, refetch } = useRawMaterialStockLots(rawMaterialId, {
    include_children: true,
    include_disabled: true,
  });

  const summary = data?.data?.stock_lot_summary;
  const lots = data?.data?.stock_lots ?? [];

  const totals = useMemo(() => {
    return {
      batches: lots.length,
      expiringSoon: lots.filter(l => (l.days_until_expiry ?? 9999) >= 0 && (l.days_until_expiry ?? 9999) <= 30).length,
      expired: lots.filter(l => l.is_expired).length,
    };
  }, [lots]);

  const filteredLots = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return lots.filter(lot => {
      const normalizedStatus = String(lot.status || "").toUpperCase();
      const normalizedMovementType = String(lot.movement_type || "").toUpperCase();
      const batchCode = String(lot.batch_code || `RM-${lot.id}`);
      const haystack = [
        batchCode,
        normalizedStatus,
        normalizedMovementType,
        lot.movement_date || "",
        lot.expiry_date || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = keyword === "" || haystack.includes(keyword);
      const matchesStatus = statusFilter === "ALL" || normalizedStatus === statusFilter;
      const matchesMovementType = movementTypeFilter === "ALL" || normalizedMovementType === movementTypeFilter;
      return matchesSearch && matchesStatus && matchesMovementType;
    });
  }, [lots, movementTypeFilter, search, statusFilter]);

  const movementTypeOptions = useMemo(() => {
    const set = new Set<string>();
    lots.forEach(lot => {
      const movementType = String(lot.movement_type || "").toUpperCase();
      if (movementType) {
        set.add(movementType);
      }
    });
    return Array.from(set.values()).sort();
  }, [lots]);

  const lastPage = Math.max(1, Math.ceil(filteredLots.length / perPage));
  const currentPage = Math.min(page, lastPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedLots = filteredLots.slice(startIndex, startIndex + perPage);

  const resetPageIfNeeded = () => {
    setPage(1);
  };

  const method = String(productionMethod || summary?.production_method || "FIFO").toUpperCase() === "LIFO" ? "LIFO" : "FIFO";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Raw Material Stock Batches</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {method === "LIFO"
                ? "LIFO: newest raw material batch is used first during production."
                : "FIFO: oldest raw material batch is used first during production."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Batches: {totals.batches}</Badge>
            <Badge variant="outline">Expiring Soon: {totals.expiringSoon}</Badge>
            <Badge variant="outline">Expired: {totals.expired}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Available Stock</p>
            <p className="text-lg font-semibold">{Number(summary?.available_quantity ?? 0).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Total Batches</p>
            <p className="text-lg font-semibold">{Number(summary?.total_batches ?? lots.length)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Used In Production</p>
            <p className="text-lg font-semibold">{Number(summary?.used_in_production_quantity ?? 0).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Scrapped Qty</p>
            <p className="text-lg font-semibold">{Number(summary?.scrapped_quantity ?? 0).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Expired Qty</p>
            <p className="text-lg font-semibold">{Number(summary?.expired_quantity ?? 0).toFixed(2)}</p>
          </div>
        </div>

        {isError && !isFetching ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 py-8 flex flex-col items-center gap-3 text-destructive">
            <p className="text-sm">Failed to load stock batches.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  resetPageIfNeeded();
                }}
                placeholder="Search batch, type, date, status..."
                className="w-full md:w-[280px]"
              />
              <Select
                value={statusFilter}
                onValueChange={value => {
                  setStatusFilter(value);
                  resetPageIfNeeded();
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="PARTIALLY_USED">Partially Used</SelectItem>
                  <SelectItem value="FULLY_USED">Fully Used</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={movementTypeFilter}
                onValueChange={value => {
                  setMovementTypeFilter(value);
                  resetPageIfNeeded();
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Movement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Movement Types</SelectItem>
                  {movementTypeOptions.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(perPage)}
                onValueChange={value => {
                  setPerPage(Number(value));
                  resetPageIfNeeded();
                }}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_PER_PAGE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DataTable
              columns={RAW_MATERIAL_STOCK_LOT_COLUMNS(
                expanded,
                lotId => setExpanded(prev => ({ ...prev, [lotId]: !prev[lotId] })),
              )}
              data={paginatedLots}
              isLoading={isLoading}
              loadingVariant="text"
              loadingText="Loading stock batches..."
              emptyText="No stock batches found."
              expandableRow={{
                isExpanded: lot => !!expanded[lot.id],
                render: lot => renderRawMaterialStockLotHistory(lot),
              }}
            />

            {!isLoading && filteredLots.length > 0 && (
              <div className="flex justify-center">
                <GlobalPagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
