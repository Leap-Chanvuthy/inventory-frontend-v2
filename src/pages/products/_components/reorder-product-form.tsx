import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerInput } from "@/components/reusable/partials/input";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { InsufficientStockError } from "@/api/product/product.type";
import { RawMaterialAllocationPreviewResponse } from "@/api/raw-materials/raw-material.types";
import {
  ArrowRightLeft,
  DollarSign,
  FileText,
  FlaskConical,
  Package,
} from "lucide-react";
import { buildReorderBomColumns } from "../utils/bom-editor-table-feature";

export type ReorderExternalFormState = {
  quantity: string;
  purchase_unit_price_in_usd: string;
  exchange_rate_from_usd_to_riel: string;
  selling_unit_price_in_usd: string;
  selling_exchange_rate_from_usd_to_riel: string;
  movement_date: string;
  expiry_date: string;
  note: string;
};

export type ReorderInternalFormState = {
  quantity: string;
  selling_unit_price_in_usd: string;
  selling_exchange_rate_from_usd_to_riel: string;
  movement_date: string;
  expiry_date: string;
  note: string;
};

export type ReorderInternalBomEntry = {
  raw_material_id: number;
  name: string;
  quantity_per_unit: number;
  scrap_percentage: number;
  uom_label: string;
  available_qty?: number | null;
};

export type ReorderInternalAllocationPreviewRow = {
  raw_material_id: number;
  raw_material_name: string;
  requested_quantity: number;
  is_loading: boolean;
  error_message: string | null;
  preview?: RawMaterialAllocationPreviewResponse["data"];
};

interface ReorderProductFormProps {
  isInternal: boolean;
  internal: ReorderInternalFormState;
  external: ReorderExternalFormState;
  bomEntries: ReorderInternalBomEntry[];
  stockErrors?: InsufficientStockError[];
  quantityError?: string;
  quantityTypeError?: string;
  allocationPreviewRows?: ReorderInternalAllocationPreviewRow[];
  onInternalFieldChange: (
    field: keyof ReorderInternalFormState,
    value: string,
  ) => void;
  onExternalFieldChange: (
    field: keyof ReorderExternalFormState,
    value: string,
  ) => void;
  onInternalBomScrapChange: (rawMaterialId: number, value: string) => void;
}

export function ReorderProductForm({
  isInternal,
  internal,
  external,
  bomEntries,
  stockErrors,
  quantityError,
  quantityTypeError,
  allocationPreviewRows = [],
  onInternalFieldChange,
  onExternalFieldChange,
  onInternalBomScrapChange,
}: ReorderProductFormProps) {
  const productionQuantity = Number(internal.quantity) || 0;

  const internalSummary = useMemo(
    () =>
      bomEntries.reduce(
        (acc, entry) => {
          const requiredQty = entry.quantity_per_unit * productionQuantity;
          const scrapQty = (requiredQty * entry.scrap_percentage) / 100;
          return {
            required: acc.required + requiredQty,
            scrap: acc.scrap + scrapQty,
            total: acc.total + requiredQty + scrapQty,
          };
        },
        { required: 0, scrap: 0, total: 0 },
      ),
    [bomEntries, productionQuantity],
  );

  const reorderBomRows = useMemo(
    () =>
      bomEntries.map(entry => {
        const requiredQty = entry.quantity_per_unit * productionQuantity;
        const scrapQty = (requiredQty * entry.scrap_percentage) / 100;
        const totalConsumption = requiredQty + scrapQty;
        const stockErr = stockErrors?.find(
          e => e.raw_material_id === entry.raw_material_id,
        );

        return {
          raw_material_id: entry.raw_material_id,
          material_name: entry.name,
          uom_label: entry.uom_label,
          quantity_per_unit: entry.quantity_per_unit,
          scrap_percentage: entry.scrap_percentage,
          required_qty: requiredQty,
          scrap_qty: scrapQty,
          total_consumption: totalConsumption,
          available_qty:
            entry.available_qty == null ? null : Number(entry.available_qty),
          stock_error: stockErr
            ? `Need ${stockErr.required_qty}, available ${stockErr.available_qty} (short by ${stockErr.shortfall_qty})`
            : undefined,
        };
      }),
    [bomEntries, productionQuantity, stockErrors],
  );

  return (
    <div className="max-h-[72vh] overflow-y-auto px-6 py-5 space-y-5">
      {isInternal ? (
        <>
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Production Qty</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="How many units to produce"
                  value={internal.quantity}
                  onChange={e =>
                    onInternalFieldChange("quantity", e.target.value)
                  }
                />
                {quantityError && (
                  <p className="text-xs text-destructive">{quantityError}</p>
                )}
                {quantityTypeError && (
                  <p className="text-xs text-destructive">{quantityTypeError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Selling Price (USD)</Label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="pl-8"
                    value={internal.selling_unit_price_in_usd}
                    onChange={e =>
                      onInternalFieldChange(
                        "selling_unit_price_in_usd",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Exchange Rate (USD to KHR)
                </Label>
                <div className="relative">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="number"
                    min={0}
                    className="pl-8"
                    value={internal.selling_exchange_rate_from_usd_to_riel}
                    onChange={e =>
                      onInternalFieldChange(
                        "selling_exchange_rate_from_usd_to_riel",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <DatePickerInput
                id="movement_date_internal"
                required
                label="Reorder Date"
                value={internal.movement_date}
                onChange={value => onInternalFieldChange("movement_date", value)}
              />
              <DatePickerInput
                id="expiry_date_internal"
                label="Stock Expiry Date"
                value={internal.expiry_date}
                onChange={value => onInternalFieldChange("expiry_date", value)}
              />
            </div>
          </div>

          {bomEntries.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    Bill of Materials (Locked Structure)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Raw materials and Qty per Unit are locked for reorder. You
                    can adjust Scrap % for this transaction.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                  <FlaskConical className="w-3 h-3" />
                  Scrap Override Enabled
                </div>
              </div>

              <div className="rounded-xl border bg-background overflow-hidden">
                <DataTable
                  columns={buildReorderBomColumns(onInternalBomScrapChange)}
                  data={reorderBomRows}
                  emptyText="No BOM materials."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border bg-muted/30 p-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Required Total
                  </p>
                  <p className="font-semibold">
                    {internalSummary.required.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Scrap Total
                  </p>
                  <p className="font-semibold text-amber-700">
                    {internalSummary.scrap.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Deduction Total
                  </p>
                  <p className="font-semibold">
                    {internalSummary.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {productionQuantity > 0 && (
                <div className="space-y-2 rounded-xl border bg-background p-3">
                  <p className="text-sm font-semibold">
                    Stock Lots Used In Production (Preview)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Preview of FIFO/LIFO lot consumption for each raw material before reorder submission.
                  </p>

                  <div className="space-y-3">
                    {allocationPreviewRows.length === 0 && (
                      <p className="text-xs text-muted-foreground">No allocation preview available.</p>
                    )}

                    {allocationPreviewRows.map(row => (
                      <div key={row.raw_material_id} className="rounded-lg border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium">{row.raw_material_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Requested: {row.requested_quantity.toFixed(4)}
                          </p>
                        </div>

                        {row.is_loading ? (
                          <p className="text-xs text-muted-foreground mt-2">Loading lot preview...</p>
                        ) : row.error_message ? (
                          <p className="text-xs text-destructive mt-2">{row.error_message}</p>
                        ) : !row.preview ? (
                          <p className="text-xs text-muted-foreground mt-2">No preview data.</p>
                        ) : (
                          <div className="mt-2 space-y-2">
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span>Method: {String(row.preview.production_method || "FIFO").toUpperCase()}</span>
                              <span>Available: {Number(row.preview.available_quantity || 0).toFixed(4)}</span>
                              <span>
                                Fulfillable: {row.preview.can_fulfill ? "Yes" : "No"}
                              </span>
                            </div>

                            {row.preview.message && (
                              <p className="text-xs text-destructive">{row.preview.message}</p>
                            )}

                            {(row.preview.lots || []).length > 0 ? (
                              <div className="space-y-1">
                                {row.preview.lots.map(lot => (
                                  <div key={`${row.raw_material_id}-${lot.source_movement_id}`} className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground mr-2">RM-{lot.source_movement_id}</span>
                                    <span>{String(lot.movement_type || "").replace(/_/g, " ")}</span>
                                    <span className="mx-2">·</span>
                                    <span>{lot.movement_date ? lot.movement_date.slice(0, 10) : "—"}</span>
                                    <span className="mx-2">·</span>
                                    <span>Allocated: {Number(lot.allocated_quantity || 0).toFixed(4)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">No lot allocations.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={external.quantity}
                onChange={e => onExternalFieldChange("quantity", e.target.value)}
                min={0}
              />
              {quantityError && (
                <p className="text-xs text-destructive">{quantityError}</p>
              )}
              {quantityTypeError && (
                <p className="text-xs text-destructive">{quantityTypeError}</p>
              )}
            </div>
            <DatePickerInput
              id="movement_date_external"
              required
              label="Reorder Date"
              value={external.movement_date}
              onChange={value => onExternalFieldChange("movement_date", value)}
            />
            <DatePickerInput
              id="expiry_date_external"
              label="Stock Expiry Date"
              value={external.expiry_date}
              onChange={value => onExternalFieldChange("expiry_date", value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                Purchase Price (USD) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={external.purchase_unit_price_in_usd}
                  onChange={e =>
                    onExternalFieldChange(
                      "purchase_unit_price_in_usd",
                      e.target.value,
                    )
                  }
                  min={0}
                  step="0.01"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                Exchange Rate <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="e.g. 4100"
                value={external.exchange_rate_from_usd_to_riel}
                onChange={e =>
                  onExternalFieldChange(
                    "exchange_rate_from_usd_to_riel",
                    e.target.value,
                  )
                }
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selling Price (USD) *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={external.selling_unit_price_in_usd}
                onChange={e =>
                  onExternalFieldChange(
                    "selling_unit_price_in_usd",
                    e.target.value,
                  )
                }
                min={0}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Selling Exchange Rate (USD to KHR) *
              </Label>
              <Input
                type="number"
                placeholder="e.g. 4100"
                value={external.selling_exchange_rate_from_usd_to_riel}
                onChange={e =>
                  onExternalFieldChange(
                    "selling_exchange_rate_from_usd_to_riel",
                    e.target.value,
                  )
                }
                min={0}
              />
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          Note <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          placeholder="e.g. Reorder due to low stock"
          value={isInternal ? internal.note : external.note}
          onChange={e =>
            isInternal
              ? onInternalFieldChange("note", e.target.value)
              : onExternalFieldChange("note", e.target.value)
          }
          rows={2}
        />
      </div>
    </div>
  );
}
