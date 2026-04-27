import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";
import {
  ProductMovement,
  ReorderExternalPurchasePayload,
  ReorderInternalManufacturingPayload,
} from "@/api/product/product.type";
import {
  useUpdateExternalReorderMovement,
  useUpdateInternalReorderMovement,
} from "@/api/product/product.mutation";
import { useInternalReorderMovement } from "@/api/product/product.query";
import {
  ReorderExternalFormState,
  ReorderInternalBomEntry,
  ReorderInternalFormState,
  ReorderProductForm,
} from "../reorder-product-form";

interface EditMovementDialogProps {
  movement: ProductMovement;
  productId: number;
  productType: string;
  open: boolean;
  onClose: () => void;
}

type EditInternalReorderFormState = ReorderInternalFormState & {
  product_status: string;
};

const buildExternalFormState = (
  movement: ProductMovement,
): ReorderExternalFormState => ({
  quantity: String(movement.quantity ?? ""),
  purchase_unit_price_in_usd: String(movement.purchase_unit_price_in_usd ?? ""),
  exchange_rate_from_usd_to_riel: String(
    movement.exchange_rate_from_usd_to_riel ?? "4100",
  ),
  selling_unit_price_in_usd: String(movement.selling_unit_price_in_usd ?? ""),
  selling_exchange_rate_from_usd_to_riel: String(
    movement.selling_exchange_rate_from_usd_to_riel ?? "4100",
  ),
  movement_date: movement.movement_date
    ? movement.movement_date.substring(0, 10)
    : "",
  note: movement.note ?? "",
});

const buildInternalFormState = (
  movement: ProductMovement,
): EditInternalReorderFormState => ({
  quantity: String(movement.quantity ?? ""),
  product_status: movement.product_status ?? "COMPLETED",
  selling_unit_price_in_usd: String(movement.selling_unit_price_in_usd ?? ""),
  selling_exchange_rate_from_usd_to_riel: String(
    movement.selling_exchange_rate_from_usd_to_riel ?? "4100",
  ),
  movement_date: movement.movement_date
    ? movement.movement_date.substring(0, 10)
    : "",
  note: movement.note ?? "",
});

export function EditMovementDialog({
  movement,
  productId,
  productType,
  open,
  onClose,
}: EditMovementDialogProps) {
  const isInternal = productType === "INTERNAL_PRODUCED";

  const externalMutation = useUpdateExternalReorderMovement(
    productId,
    movement.id,
  );
  const internalMutation = useUpdateInternalReorderMovement(
    productId,
    movement.id,
  );
  const isPending = externalMutation.isPending || internalMutation.isPending;

  const { data: internalDetail } = useInternalReorderMovement(
    isInternal ? productId : 0,
    isInternal ? movement.id : 0,
  );

  const [external, setExternal] = useState<ReorderExternalFormState>(() =>
    buildExternalFormState(movement),
  );
  const [internal, setInternal] = useState<EditInternalReorderFormState>(() =>
    buildInternalFormState(movement),
  );
  const [internalBomEntries, setInternalBomEntries] = useState<
    ReorderInternalBomEntry[]
  >([]);

  useEffect(() => {
    setExternal(buildExternalFormState(movement));
    setInternal(buildInternalFormState(movement));
    setInternalBomEntries([]);
  }, [movement]);

  useEffect(() => {
    if (!isInternal || !open) {
      setInternalBomEntries([]);
      return;
    }

    const bomItems = internalDetail?.data?.product_reorder?.bom_items ?? [];
    if (!Array.isArray(bomItems) || bomItems.length === 0) {
      setInternalBomEntries([]);
      return;
    }

    setInternalBomEntries(
      bomItems.map(item => ({
        raw_material_id: Number(item.raw_material_id),
        name:
          item.raw_material?.material_name ??
          `#${Number(item.raw_material_id ?? 0)}`,
        quantity_per_unit: Number(item.quantity_per_unit ?? item.quantity ?? 0),
        scrap_percentage: Number(item.scrap_percentage ?? 0),
        uom_label:
          item.raw_material?.uom?.symbol ||
          item.raw_material?.uom?.name ||
          item.raw_material?.uom_name ||
          "",
      })),
    );
  }, [internalDetail, isInternal, movement.id, open]);

  const isExternalValid = useMemo(
    () =>
      Number(external.quantity) > 0 &&
      Number(external.purchase_unit_price_in_usd) > 0 &&
      Number(external.exchange_rate_from_usd_to_riel) > 0 &&
      Number(external.selling_unit_price_in_usd) > 0 &&
      Number(external.selling_exchange_rate_from_usd_to_riel) > 0 &&
      external.movement_date !== "",
    [external],
  );

  const isInternalValid = useMemo(
    () =>
      Number(internal.quantity) > 0 &&
      Number(internal.selling_unit_price_in_usd) > 0 &&
      Number(internal.selling_exchange_rate_from_usd_to_riel) > 0 &&
      internal.movement_date !== "" &&
      internalBomEntries.length > 0,
    [internal, internalBomEntries],
  );

  const handleInternalFieldChange = (
    field: keyof ReorderInternalFormState,
    value: string,
  ) => {
    setInternal(prev => ({ ...prev, [field]: value }));
  };

  const handleExternalFieldChange = (
    field: keyof ReorderExternalFormState,
    value: string,
  ) => {
    setExternal(prev => ({ ...prev, [field]: value }));
  };

  const updateInternalBomScrap = (rawMaterialId: number, value: string) => {
    setInternalBomEntries(prev =>
      prev.map(item =>
        item.raw_material_id === rawMaterialId
          ? {
              ...item,
              scrap_percentage: Math.max(0, Math.min(100, Number(value) || 0)),
            }
          : item,
      ),
    );
  };

  const handleSubmit = () => {
    if (isPending) return;

    if (isInternal) {
      if (!isInternalValid) return;

      const payload: ReorderInternalManufacturingPayload = {
        movement_date: internal.movement_date,
        product_status: internal.product_status,
        quantity: Number(internal.quantity),
        selling_unit_price_in_usd: Number(internal.selling_unit_price_in_usd),
        selling_exchange_rate_from_usd_to_riel: Number(
          internal.selling_exchange_rate_from_usd_to_riel,
        ),
        ...(internalBomEntries.length > 0
          ? {
              bom_override: internalBomEntries.map(item => ({
                raw_material_id: item.raw_material_id,
                scrap_percentage: item.scrap_percentage,
              })),
            }
          : {}),
        ...(internal.note.trim() ? { note: internal.note.trim() } : {}),
      };

      internalMutation.mutate(payload, { onSuccess: onClose });
      return;
    }

    if (!isExternalValid) return;

    const payload: ReorderExternalPurchasePayload = {
      movement_date: external.movement_date,
      quantity: Number(external.quantity),
      purchase_unit_price_in_usd: Number(external.purchase_unit_price_in_usd),
      exchange_rate_from_usd_to_riel: Number(
        external.exchange_rate_from_usd_to_riel,
      ),
      selling_unit_price_in_usd: Number(external.selling_unit_price_in_usd),
      selling_exchange_rate_from_usd_to_riel: Number(
        external.selling_exchange_rate_from_usd_to_riel,
      ),
      ...(external.note.trim() ? { note: external.note.trim() } : {}),
    };

    externalMutation.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <DialogTitle>Edit Reorder Movement</DialogTitle>
          <DialogDescription>
            Update this reorder movement record.
          </DialogDescription>
        </DialogHeader>

        <ReorderProductForm
          isInternal={isInternal}
          internal={internal}
          external={external}
          bomEntries={internalBomEntries}
          onInternalFieldChange={handleInternalFieldChange}
          onExternalFieldChange={handleExternalFieldChange}
          onInternalBomScrapChange={updateInternalBomScrap}
        />

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isPending || (isInternal ? !isInternalValid : !isExternalValid)
            }
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
