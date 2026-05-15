import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hash, List, RefreshCw } from "lucide-react";
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
import { buildProductMovementColumns } from "./table-feature";

interface ProductMovementHistoryProps {
  productId: number;
  productType: string;
}

export function ProductMovementHistory({
  productId,
  productType,
}: ProductMovementHistoryProps) {
  const isInternal = productType === "INTERNAL_PRODUCED";
  const deleteInternalReorderMutation = useDeleteInternalReorderMovement(productId);
  const deleteExternalReorderMutation = useDeleteExternalReorderMovement(productId);
  const deleteMutation = isInternal
    ? deleteInternalReorderMutation
    : deleteExternalReorderMutation;

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

  const columns = buildProductMovementColumns({
    onViewMovement: mv => setViewingMovement(mv),
    onEditMovement: mv => setEditingMovement(mv),
    onDeleteMovement: movementId => deleteMutation.mutate(movementId),
    onViewScrap: mv => setViewingScrap(mv),
    onEditScrap: mv => setEditingScrap(mv),
  });

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
