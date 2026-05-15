import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { ProductMovement } from "@/api/product/product.type";
import { useProductMovements } from "@/api/product/product.query";
import {
  useDeleteExternalReorderMovement,
  useDeleteInternalReorderMovement,
} from "@/api/product/product.mutation";
import { ViewMovementDialog } from "./view-movement-dialog";
import { EditMovementDialog } from "./edit-movement-dialog";
import { ViewScrapDialog } from "./view-scrap-dialog";
import { EditScrapDialog } from "./edit-scrap-dialog";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { buildProductMovementColumns } from "./table-feature";

const MOVEMENT_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "EXTERNAL_PURCHASE", label: "External Purchase" },
  { value: "INTERNAL_MANUFACTURING", label: "Internal Manufacturing" },
  { value: "RE_ORDER", label: "Re Order" },
  { value: "SALE_ORDER", label: "Sale Order" },
];

const DIRECTION_OPTIONS = [
  { value: "", label: "All Directions" },
  { value: "IN", label: "IN" },
  { value: "OUT", label: "OUT" },
];

const PER_PAGE_OPTIONS = [10, 20, 50];

interface MovementHistoryModalProps {
  productId: number;
  productType: string;
  open: boolean;
  onClose: () => void;
}

export function MovementHistoryModal({
  productId,
  productType,
  open,
  onClose,
}: MovementHistoryModalProps) {
  const isInternal = productType === "INTERNAL_PRODUCED";
  const deleteInternalReorderMutation = useDeleteInternalReorderMovement(productId);
  const deleteExternalReorderMutation = useDeleteExternalReorderMovement(productId);
  const deleteMutation = isInternal
    ? deleteInternalReorderMutation
    : deleteExternalReorderMutation;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [movementType, setMovementType] = useState("");
  const [direction, setDirection] = useState("");

  const [viewingMovement, setViewingMovement] =
    useState<ProductMovement | null>(null);
  const [editingMovement, setEditingMovement] =
    useState<ProductMovement | null>(null);
  const [viewingScrap, setViewingScrap] =
    useState<ProductMovement | null>(null);
  const [editingScrap, setEditingScrap] =
    useState<ProductMovement | null>(null);

  const { data, isLoading } = useProductMovements(productId, {
    page,
    per_page: perPage,
    sort: "-created_at",
    "filter[movement_type]": movementType || undefined,
    "filter[direction]": direction || undefined,
  });

  const movements: ProductMovement[] = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const columns = buildProductMovementColumns({
    onViewMovement: mv => setViewingMovement(mv),
    onEditMovement: mv => setEditingMovement(mv),
    onDeleteMovement: movementId => deleteMutation.mutate(movementId),
    onViewScrap: mv => setViewingScrap(mv),
    onEditScrap: mv => setEditingScrap(mv),
  });

  const handleClose = () => {
    setPage(1);
    setMovementType("");
    setDirection("");
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={v => !v && handleClose()}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Movement History</DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select
              value={movementType}
              onValueChange={v => {
                setMovementType(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {MOVEMENT_TYPE_OPTIONS.map(o => (
                  <SelectItem key={o.value || "all"} value={o.value || "all"}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={direction}
              onValueChange={v => {
                setDirection(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Directions" />
              </SelectTrigger>
              <SelectContent>
                {DIRECTION_OPTIONS.map(o => (
                  <SelectItem key={o.value || "all"} value={o.value || "all"}>
                    {o.label}
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
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map(n => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(movementType || direction) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMovementType("");
                  setDirection("");
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto rounded-lg border">
            <DataTable
              columns={columns}
              data={movements}
              isLoading={isLoading}
              loadingVariant="text"
              loadingText="Loading..."
              emptyText="No movements found"
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-1 text-sm text-muted-foreground">
            <GlobalPagination
              currentPage={page}
              lastPage={lastPage}
              onPageChange={setPage}
            />
          </div>
        </DialogContent>
      </Dialog>

      {viewingMovement && (
        <ViewMovementDialog
          movement={viewingMovement}
          productId={productId}
          productType={productType}
          open={!!viewingMovement}
          onClose={() => setViewingMovement(null)}
        />
      )}

      {editingMovement && (
        <EditMovementDialog
          movement={editingMovement}
          productId={productId}
          productType={productType}
          open={!!editingMovement}
          onClose={() => setEditingMovement(null)}
        />
      )}

      {viewingScrap && (
        <ViewScrapDialog
          movement={viewingScrap}
          productId={productId}
          open={!!viewingScrap}
          onClose={() => setViewingScrap(null)}
        />
      )}

      {editingScrap && (
        <EditScrapDialog
          movement={editingScrap}
          productId={productId}
          open={!!editingScrap}
          onClose={() => setEditingScrap(null)}
        />
      )}
    </>
  );
}
