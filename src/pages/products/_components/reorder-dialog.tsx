import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";
import {
  useReorderExternalPurchase,
  useReorderInternalManufacturing,
} from "@/api/product/product.mutation";
import {
  ReorderExternalPurchasePayload,
  ReorderInternalManufacturingPayload,
  ProductRawMaterial,
  InsufficientStockError,
  ProductValidationErrors,
} from "@/api/product/product.type";
import { AxiosError } from "axios";
import {
  ReorderExternalFormState,
  ReorderInternalBomEntry,
  ReorderInternalFormState,
  ReorderProductForm,
} from "./reorder-product-form";

interface ReorderDialogProps {
  productId: number;
  productName: string;
  productType: "INTERNAL_PRODUCED" | "EXTERNAL_PURCHASED" | string;
  productRawMaterials?: ProductRawMaterial[];
}

export function ReorderDialog({
  productId,
  productName,
  productType,
  productRawMaterials = [],
}: ReorderDialogProps) {
  const isInternal = productType === "INTERNAL_PRODUCED";

  const externalMutation = useReorderExternalPurchase(productId);
  const internalMutation = useReorderInternalManufacturing(productId);
  const isPending = externalMutation.isPending || internalMutation.isPending;

  const internalErrors = (
    internalMutation.error as AxiosError<ProductValidationErrors> | null
  )?.response?.data?.errors;
  const stockErrors = Array.isArray(internalErrors)
    ? (internalErrors as InsufficientStockError[])
    : undefined;

  const INITIAL_EXTERNAL = useMemo<ReorderExternalFormState>(
    () => ({
      quantity: "",
      purchase_unit_price_in_usd: "",
      exchange_rate_from_usd_to_riel: "4100",
      selling_unit_price_in_usd: "",
      selling_exchange_rate_from_usd_to_riel: "4100",
      movement_date: "",
      note: "",
    }),
    [],
  );

  const INITIAL_INTERNAL = useMemo<ReorderInternalFormState>(
    () => ({
      quantity: "",
      selling_unit_price_in_usd: "",
      selling_exchange_rate_from_usd_to_riel: "4100",
      movement_date: "",
      note: "",
    }),
    [],
  );

  const [open, setOpen] = useState(false);
  const [external, setExternal] = useState<ReorderExternalFormState>(
    INITIAL_EXTERNAL,
  );
  const [internal, setInternal] = useState<ReorderInternalFormState>(
    INITIAL_INTERNAL,
  );
  const [bomEntries, setBomEntries] = useState<ReorderInternalBomEntry[]>([]);

  const resetForms = () => {
    setExternal(INITIAL_EXTERNAL);
    setInternal(INITIAL_INTERNAL);
    setBomEntries(
      productRawMaterials.map(rm => ({
        raw_material_id: rm.raw_material_id,
        name: rm.raw_material?.material_name ?? `#${rm.raw_material_id}`,
        quantity_per_unit: Number(rm.quantity_per_unit ?? rm.quantity ?? 0),
        scrap_percentage: Number(rm.scrap_percentage ?? 0),
        uom_label:
          rm.raw_material?.uom?.symbol ||
          rm.raw_material?.uom_name ||
          rm.raw_material?.uom?.name ||
          "",
        available_qty:
          (rm.raw_material as { current_qty_in_stock?: number } | undefined)
            ?.current_qty_in_stock ?? null,
      })),
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      resetForms();
      return;
    }
    setExternal(INITIAL_EXTERNAL);
    setInternal(INITIAL_INTERNAL);
  };

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

  const updateBomScrap = (rawMaterialId: number, value: string) => {
    setBomEntries(prev =>
      prev.map(entry =>
        entry.raw_material_id === rawMaterialId
          ? {
              ...entry,
              scrap_percentage: Math.max(0, Math.min(100, Number(value) || 0)),
            }
          : entry,
      ),
    );
  };

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
      bomEntries.length > 0,
    [internal, bomEntries],
  );

  const handleSubmit = () => {
    if (isPending) return;

    if (isInternal) {
      if (!isInternalValid) return;

      const payload: ReorderInternalManufacturingPayload = {
        movement_date: internal.movement_date,
        product_status: "COMPLETED",
        quantity: Number(internal.quantity),
        selling_unit_price_in_usd: Number(internal.selling_unit_price_in_usd),
        selling_exchange_rate_from_usd_to_riel: Number(
          internal.selling_exchange_rate_from_usd_to_riel,
        ),
        bom_override: bomEntries.map(entry => ({
          raw_material_id: entry.raw_material_id,
          scrap_percentage: entry.scrap_percentage,
        })),
        ...(internal.note.trim() ? { note: internal.note.trim() } : {}),
      };

      internalMutation.mutate(payload, {
        onSuccess: () => {
          resetForms();
          setOpen(false);
        },
      });
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

    externalMutation.mutate(payload, {
      onSuccess: () => {
        resetForms();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reorder Stock
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <DialogTitle>Reorder Product</DialogTitle>
          <DialogDescription>
            Create a reorder stock movement for <strong>{productName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <ReorderProductForm
          isInternal={isInternal}
          internal={internal}
          external={external}
          bomEntries={bomEntries}
          stockErrors={stockErrors}
          onInternalFieldChange={handleInternalFieldChange}
          onExternalFieldChange={handleExternalFieldChange}
          onInternalBomScrapChange={updateBomScrap}
        />

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || (isInternal ? !isInternalValid : !isExternalValid)}
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Reordering...
              </>
            ) : (
              "Confirm Reorder"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
