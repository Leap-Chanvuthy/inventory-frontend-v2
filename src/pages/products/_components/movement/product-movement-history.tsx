import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Hash,
  ArrowDownToLine,
  ArrowUpFromLine,
  Pencil,
  Eye,
  List,
  RefreshCw,
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
import { DataTable } from "@/components/reusable/data-table/data-table";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";

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

  const { data, isLoading, isError, refetch, isFetching } = useProductMovements(
    productId,
    {
      per_page: 10,
      sort: "-created_at",
    },
  );

  const movements: ProductMovement[] = data?.data ?? [];

  const [viewingMovement, setViewingMovement] =
    useState<ProductMovement | null>(null);
  const [editingMovement, setEditingMovement] =
    useState<ProductMovement | null>(null);
  const [viewingScrap, setViewingScrap] = useState<ProductMovement | null>(null);
  const [editingScrap, setEditingScrap] = useState<ProductMovement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const columns: DataTableColumn<ProductMovement>[] = [
    {
      key: "movement_type",
      header: "Type",
      className: "whitespace-nowrap py-3",
      render: mv => (
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {mv.movement_type.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "direction",
      header: "Dir",
      className: "whitespace-nowrap py-3",
      render: mv => (
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
      ),
    },
    {
      key: "quantity",
      header: "Qty",
      className: "whitespace-nowrap py-3",
      render: mv => (
        <span className="font-semibold">{parseFloat(mv.quantity).toFixed(2)}</span>
      ),
    },
    {
      key: "selling_unit_price_in_usd",
      header: "Sell (USD)",
      className: "whitespace-nowrap py-3",
      render: mv => <span>${mv.selling_unit_price_in_usd.toLocaleString()}</span>,
    },
    {
      key: "product_status",
      header: "Status",
      className: "whitespace-nowrap py-3",
      render: mv => (
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
      ),
    },
    {
      key: "movement_date",
      header: "Date",
      className: "whitespace-nowrap py-3",
      render: mv => (
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatDate(mv.movement_date)}
        </span>
      ),
    },
    {
      key: "created_by",
      header: "By",
      className: "whitespace-nowrap py-3",
      render: mv => (
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {mv.created_by?.name || "—"}
        </span>
      ),
    },
    {
      key: "id",
      header: "Action",
      className: "whitespace-nowrap py-3",
      render: mv => (
        <div className="flex items-center gap-1">
          {mv.movement_type.replace(/_/g, "").includes("REORDER") && (
            <>
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
            </>
          )}
          {mv.movement_type === "SCRAP" && (
            <>
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
            </>
          )}
        </div>
      ),
    },
  ];

  const renderContent = () => {
    if (isError && !isFetching) {
      return (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 py-8 flex flex-col items-center gap-3 text-destructive">
          <p className="text-sm">Failed to load movement history.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </Button>
        </div>
      );
    }
    return (
      <DataTable
        columns={columns}
        data={movements}
        isLoading={isLoading}
        loadingVariant="text"
        emptyText="No movement history found."
      />
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
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
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
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
