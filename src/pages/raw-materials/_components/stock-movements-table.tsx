import { useRawMaterialMovements } from "@/api/raw-materials/raw-material.query";
import { UOM } from "@/api/uom/uom.types";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RM_STOCK_MOVEMENT_COLUMNS,
  RM_STOCK_MOVEMENT_SORT_OPTIONS,
} from "../utils/table-feature";
import { useState } from "react";

interface StockMovementsTableProps {
  rawMaterialId: number;
  materialName: string;
  uom: UOM | null;
}

const MOVEMENT_TYPE_OPTIONS = [
  { value: "ALL", label: "All Types" },
  { value: "PURCHASE", label: "Purchase" },
  { value: "RE_ORDER", label: "Re Order" },
  { value: "ADJUSTMENT_IN", label: "Adjustment In" },
  { value: "ADJUSTMENT_OUT", label: "Adjustment Out" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "PRODUCTION_RECEIPT", label: "Production Receipt" },
  { value: "PRODUCTION_SCRAP", label: "Production Scrap" },
  { value: "SCRAP", label: "Scrap" },
];

const DIRECTION_OPTIONS = [
  { value: "ALL", label: "All Directions" },
  { value: "IN", label: "IN" },
  { value: "OUT", label: "OUT" },
];

export function StockMovementsTable({
  rawMaterialId,
  materialName,
  uom,
}: StockMovementsTableProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState("-movement_date");
  const [movementType, setMovementType] = useState("ALL");
  const [direction, setDirection] = useState("ALL");

  const { data, isLoading, isError, isFetching, refetch } =
    useRawMaterialMovements(rawMaterialId, {
      page,
      per_page: perPage,
      sort,
      ...(movementType !== "ALL" && { "filter[movement_type]": movementType }),
      ...(direction !== "ALL" && { "filter[direction]": direction }),
    });

  const movements = data?.data ?? [];
  const total = data?.total ?? 0;
  const currentPage = data?.current_page ?? 1;
  const lastPage = data?.last_page ?? 1;

  const uomLabel = uom
    ? uom.symbol
      ? `${uom.name} (${uom.symbol})`
      : uom.name
    : undefined;

  const handleFilterChange =
    (setter: (v: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <History className="w-4 h-4 text-primary" />
              </div>
              Stock Movements
            </CardTitle>
            <CardDescription className="mt-1">
              Recent inventory activity and price logs
            </CardDescription>
            <CardDescription>
              <span className="font-bold text-red-500">*</span> Reorder stock
              quantity which is not already in use for production are allowed to
              update to ensure stock quantity consistency.
            </CardDescription>
          </div>
          {!isLoading && (
            <Badge variant="secondary" className="font-mono shrink-0">
              {total.toLocaleString()} Entries
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Filter / Sort bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Movement type filter */}
          <Select
            value={movementType}
            onValueChange={handleFilterChange(setMovementType)}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm">
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

          {/* Direction filter */}
          <Select
            value={direction}
            onValueChange={handleFilterChange(setDirection)}
          >
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Direction" />
            </SelectTrigger>
            <SelectContent>
              {DIRECTION_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={sort}
            onValueChange={v => {
              setSort(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {RM_STOCK_MOVEMENT_SORT_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Per page */}
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
        </div>

        {isError && !isFetching ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 py-8 flex flex-col items-center gap-3 text-destructive">
            <p className="text-sm">Failed to load stock movements.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        ) : (
          <DataTable
            columns={RM_STOCK_MOVEMENT_COLUMNS(
              materialName,
              rawMaterialId,
              uomLabel,
            )}
            data={movements}
            isLoading={isLoading}
            loadingVariant="text"
            emptyText="No stock movements found."
          />
        )}

        {!isLoading && !isError && lastPage > 1 && (
          <div className="flex justify-center mt-6">
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
