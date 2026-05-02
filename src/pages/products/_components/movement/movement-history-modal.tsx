import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Pencil,
  Eye,
} from "lucide-react";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import DeleteModal from "@/components/reusable/partials/delete-modal";
import { formatDate } from "@/utils/date-format";
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
  const deleteMutation = isInternal
    ? useDeleteInternalReorderMovement(productId)
    : useDeleteExternalReorderMovement(productId);

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
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  {[
                    "Type",
                    "Dir",
                    "Qty",
                    "Sell (USD)",
                    "Status",
                    "Date",
                    "By",
                    "Action",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-sm text-muted-foreground"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : movements.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-sm text-muted-foreground"
                    >
                      No movements found
                    </td>
                  </tr>
                ) : (
                  movements.map(mv => (
                    <tr
                      key={mv.id}
                      className="border-t hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-3 py-3">
                        <Badge
                          variant="outline"
                          className="text-xs whitespace-nowrap"
                        >
                          {mv.movement_type.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${mv.direction === "IN" ? "text-green-600" : "text-red-600"}`}
                        >
                          {mv.direction === "IN" ? (
                            <ArrowDownToLine className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpFromLine className="h-3.5 w-3.5" />
                          )}
                          {mv.direction}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold">
                        {parseFloat(mv.quantity).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">
                        ${mv.selling_unit_price_in_usd.toLocaleString()}
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          variant="outline"
                          className={
                            mv.product_status === "COMPLETED"
                              ? "border-green-500 text-green-600 text-xs"
                              : "text-xs"
                          }
                        >
                          {mv.product_status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(mv.movement_date)}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {mv.created_by?.name || "—"}
                      </td>
                      <td className="px-3 py-3">
                        {mv.movement_type.replace(/_/g, "").includes("REORDER") && (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-teal-600 hover:bg-teal-50"
                              onClick={() => setViewingMovement(mv)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {!mv.is_sold && (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                  onClick={() => setEditingMovement(mv)}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <DeleteModal
                                  heading="Delete Movement"
                                  subheading="Are you sure you want to delete this reorder movement? This action cannot be undone."
                                  onDelete={() => deleteMutation.mutate(mv.id)}
                                />
                              </>
                            )}
                          </div>
                        )}
                        {mv.movement_type === "SCRAP" && (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-teal-600 hover:bg-teal-50"
                              onClick={() => setViewingScrap(mv)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {!mv.is_sold && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => setEditingScrap(mv)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
