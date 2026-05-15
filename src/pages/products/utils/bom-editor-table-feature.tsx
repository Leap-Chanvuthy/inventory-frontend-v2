import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { TextInput } from "@/components/reusable/partials/input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface BomEditorRow {
  raw_material_id: number;
  index: number;
  material_name: string;
  material_sku_code?: string;
  quantity_type?: "INTEGER" | "DECIMAL";
  unit_label?: string;
  quantity_per_unit: string;
  scrap_percentage: string;
  required_qty: number;
  scrap_qty: number;
  total_use: number;
  available_qty: number | null;
  quantity_errors: string[];
  scrap_errors: string[];
  general_errors: string[];
  stock_error?: string;
  can_edit: boolean;
}

interface BuildBomEditorColumnsParams {
  onQtyChange: (rawMaterialId: number, value: string) => void;
  onScrapChange: (rawMaterialId: number, value: string) => void;
  onRemove?: (rawMaterialId: number) => void;
}

export const buildBomEditorColumns = ({
  onQtyChange,
  onScrapChange,
  onRemove,
}: BuildBomEditorColumnsParams): DataTableColumn<BomEditorRow>[] => [
  {
    key: "material",
    header: "Material",
    className: "min-w-[260px]",
    render: row => (
      <div>
        <p className="font-medium text-foreground text-sm">{row.material_name}</p>
        <p className="text-xs text-muted-foreground">{row.material_sku_code || "—"}</p>
        {row.unit_label ? <p className="text-xs text-muted-foreground">UOM: {row.unit_label}</p> : null}
        {row.quantity_type === "INTEGER" ? <p className="text-xs text-muted-foreground">UOM type: INTEGER</p> : null}
        {row.quantity_errors.map(message => (
          <p key={`qty-${row.raw_material_id}-${message}`} className="mt-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
            {message}
          </p>
        ))}
        {row.scrap_errors.map(message => (
          <p key={`scrap-${row.raw_material_id}-${message}`} className="mt-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
            {message}
          </p>
        ))}
        {row.general_errors.map(message => (
          <p key={`general-${row.raw_material_id}-${message}`} className="mt-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
            {message}
          </p>
        ))}
        {row.stock_error ? (
          <p className="mt-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">{row.stock_error}</p>
        ) : null}
      </div>
    ),
  },
  {
    key: "quantity_per_unit",
    header: "Qty / Unit",
    className: "min-w-[180px]",
    render: row =>
      row.can_edit ? (
        <TextInput
          id={`qty_${row.raw_material_id}`}
          label=""
          value={row.quantity_per_unit}
          onChange={e => onQtyChange(row.raw_material_id, e.target.value)}
          error={row.quantity_errors[0] ?? (row.stock_error ? " " : undefined)}
          isNumberOnly
        />
      ) : (
        <span className="text-right text-sm font-medium">{Number(row.quantity_per_unit || 0).toFixed(2)} {row.unit_label}</span>
      ),
  },
  {
    key: "scrap_percentage",
    header: "Scrap %",
    className: "min-w-[140px]",
    render: row =>
      row.can_edit ? (
        <TextInput
          id={`scrap_${row.raw_material_id}`}
          label=""
          value={row.scrap_percentage}
          onChange={e => onScrapChange(row.raw_material_id, e.target.value)}
          error={row.scrap_errors[0]}
          isNumberOnly
        />
      ) : (
        <span className="text-right text-sm">{Number(row.scrap_percentage || 0).toFixed(2)}%</span>
      ),
  },
  {
    key: "required_qty",
    header: "Required",
    className: "text-right",
    render: row => (
      <span className="text-sm font-medium">{row.required_qty.toFixed(2)} {row.unit_label}</span>
    ),
  },
  {
    key: "scrap_qty",
    header: "Scrap Qty",
    className: "text-right",
    render: row => (
      <span className="text-sm font-medium">{row.scrap_qty.toFixed(2)} {row.unit_label}</span>
    ),
  },
  {
    key: "total_use",
    header: "Total Use",
    className: "text-right",
    render: row => (
      <span className="text-sm font-semibold">{row.total_use.toFixed(2)} {row.unit_label}</span>
    ),
  },
  {
    key: "available",
    header: "Available",
    className: "text-right",
    render: row =>
      row.available_qty != null ? `${Number(row.available_qty).toString()} ${row.unit_label || ""}` : "-",
  },
  {
    key: "action",
    header: "",
    render: row =>
      row.can_edit && onRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(row.raw_material_id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      ) : null,
  },
];

export interface ReorderBomRow {
  raw_material_id: number;
  material_name: string;
  uom_label?: string;
  quantity_per_unit: number;
  scrap_percentage: number;
  required_qty: number;
  scrap_qty: number;
  total_consumption: number;
  available_qty: number | null;
  stock_error?: string;
}

export const buildReorderBomColumns = (
  onScrapChange: (rawMaterialId: number, value: string) => void,
): DataTableColumn<ReorderBomRow>[] => [
  {
    key: "material_name",
    header: "Raw Material",
    render: row => (
      <div>
        <p className="text-sm font-medium">{row.material_name}</p>
        {row.uom_label ? <p className="text-xs text-muted-foreground">UOM: {row.uom_label}</p> : null}
        {row.stock_error ? (
          <p className="text-xs text-destructive mt-1">{row.stock_error}</p>
        ) : null}
      </div>
    ),
  },
  {
    key: "quantity_per_unit",
    header: "Qty per Unit",
    className: "text-right",
    render: row => <span className="font-medium">{row.quantity_per_unit.toFixed(2)} {row.uom_label}</span>,
  },
  {
    key: "scrap_percentage",
    header: "Scrap %",
    className: "min-w-[120px]",
    render: row => (
      <Input
        type="number"
        min={0}
        max={100}
        step="0.01"
        value={String(row.scrap_percentage)}
        onChange={e => onScrapChange(row.raw_material_id, e.target.value)}
        className="text-right"
      />
    ),
  },
  {
    key: "required_qty",
    header: "Required Qty",
    className: "text-right",
    render: row => <span className="font-medium">{row.required_qty.toFixed(2)} {row.uom_label}</span>,
  },
  {
    key: "scrap_qty",
    header: "Scrap Qty",
    className: "text-right",
    render: row => <span className="font-medium text-amber-700">{row.scrap_qty.toFixed(2)} {row.uom_label}</span>,
  },
  {
    key: "total_consumption",
    header: "Total Consumption",
    className: "text-right",
    render: row => <span className="text-sm font-semibold">{row.total_consumption.toFixed(2)} {row.uom_label}</span>,
  },
  {
    key: "available_qty",
    header: "Available",
    className: "text-right",
    render: row => (row.available_qty == null ? "-" : `${Number(row.available_qty).toFixed(2)} ${row.uom_label}`),
  },
];
