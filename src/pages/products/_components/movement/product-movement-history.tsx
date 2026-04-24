import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Hash,
  ArrowDownToLine,
  ArrowUpFromLine,
  Inbox,
  Pencil,
  Eye,
  List,
} from "lucide-react";
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
import { MovementHistoryModal } from "./movement-history-modal";

interface ProductMovementHistoryProps {
  productId: number;
  productType: string;
}

export function ProductMovementHistory({
  productId,
  productType,
}: ProductMovementHistoryProps) {
  const isInternal = productType === "INTERNAL_PRODUCED";
  const deleteMutation = isInternal
    ? useDeleteInternalReorderMovement(productId)
    : useDeleteExternalReorderMovement(productId);

  const { data, isLoading } = useProductMovements(productId, {
    per_page: 10,
    sort: "-created_at",
  });

  const movements: ProductMovement[] = data?.data ?? [];

  const [viewingMovement, setViewingMovement] =
    useState<ProductMovement | null>(null);
  const [editingMovement, setEditingMovement] =
    useState<ProductMovement | null>(null);
  const [viewingScrap, setViewingScrap] =
    useState<ProductMovement | null>(null);
  const [editingScrap, setEditingScrap] =
    useState<ProductMovement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950">
          <Hash className="h-4 w-4 text-teal-600" />
        </div>
        <div>
          <CardTitle className="text-base">Movement History</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Recent 10 records
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
        <List className="w-4 h-4 mr-1.5" />
        See All
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">{header}</CardHeader>
        <CardContent>
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (movements.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">{header}</CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">No movement history found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-4">{header}</CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
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
                {movements.map(mv => (
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <MovementHistoryModal
        productId={productId}
        productType={productType}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

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
