import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";

export interface RawMaterialSpendRow {
  raw_material_id: number;
  material_name?: string | null;
  material_sku_code?: string | null;
  consumed_qty: number;
  total_usd: number;
  reorder_usd: number;
}

const money = (value?: number | null) =>
  typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";

const qty = (value?: number | null) =>
  typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—";

export const PRODUCT_PNL_RAW_MATERIAL_SPEND_COLUMNS: DataTableColumn<RawMaterialSpendRow>[] = [
  {
    key: "raw_material",
    header: "Raw Material",
    render: item => (
      <div>
        <div className="font-medium">{item.material_name || `#${item.raw_material_id}`}</div>
        <div className="text-muted-foreground">{item.material_sku_code || "—"}</div>
      </div>
    ),
  },
  {
    key: "consumed_qty",
    header: "Consumed Qty",
    className: "text-right",
    render: item => qty(item.consumed_qty),
  },
  {
    key: "total_usd",
    header: "Total USD",
    className: "text-right",
    render: item => `$${money(item.total_usd)}`,
  },
  {
    key: "reorder_usd",
    header: "Reorder USD",
    className: "text-right",
    render: item => `$${money(item.reorder_usd)}`,
  },
];
