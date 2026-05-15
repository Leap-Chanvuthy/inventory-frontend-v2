import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ProductBomMaterialSummary, ProductRawMaterial } from "@/api/product/product.type";

export const PRODUCT_BOM_SUMMARY_COLUMNS: DataTableColumn<ProductBomMaterialSummary>[] = [
  {
    key: "raw_material_name",
    header: "Raw Material",
    className: "min-w-[220px]",
    render: material => (
      <div className="space-y-1">
        <Link
          to={`/raw-materials/view/${material.raw_material_id}`}
          className="text-primary hover:underline flex items-center gap-2"
        >
          {material.raw_material_name}
          <Badge variant="outline">{String(material.production_method || "FIFO").toUpperCase()}</Badge>
        </Link>
        {material.stock_lots_used.length > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            Lots used: {material.stock_lots_used.map(l => `#${l.source_movement_id}`).join(", ")}
          </p>
        ) : null}
      </div>
    ),
  },
  {
    key: "required_qty_per_unit",
    header: "Required / Unit",
    className: "text-right",
    render: material => Number(material.required_qty_per_unit || 0).toFixed(4),
  },
  {
    key: "planned_total_qty",
    header: "Planned Total",
    className: "text-right",
    render: material => Number(material.planned_total_qty || 0).toFixed(4),
  },
  {
    key: "actual_consumed_qty",
    header: "Actual Used",
    className: "text-right",
    render: material => Number(material.actual_consumed_qty || 0).toFixed(4),
  },
  {
    key: "scrap_qty",
    header: "Scrap Qty",
    className: "text-right",
    render: material => Number(material.scrap_qty || 0).toFixed(4),
  },
  {
    key: "scrap_percentage",
    header: "Scrap %",
    className: "text-right",
    render: material => `${Number(material.scrap_percentage || 0).toFixed(2)}%`,
  },
  {
    key: "unit_cost_usd",
    header: "Unit Cost",
    className: "text-right",
    render: material => `$${Number(material.unit_cost_usd || 0).toFixed(4)}`,
  },
  {
    key: "total_spend_usd",
    header: "Total Spend",
    className: "text-right",
    render: material => <span className="font-semibold">${Number(material.total_spend_usd || 0).toFixed(2)}</span>,
  },
];

export const PRODUCT_BOM_FALLBACK_COLUMNS: DataTableColumn<ProductRawMaterial>[] = [
  {
    key: "raw_material",
    header: "Material Name",
    render: rm =>
      rm.raw_material?.id ? (
        <Link to={`/raw-materials/view/${rm.raw_material.id}`} className="text-primary hover:underline">
          {rm.raw_material.material_name || "—"}
        </Link>
      ) : (
        rm.raw_material?.material_name || "—"
      ),
  },
  {
    key: "material_sku_code",
    header: "SKU Code",
    render: rm => <span className="font-mono text-xs text-muted-foreground">{rm.raw_material?.material_sku_code || "—"}</span>,
  },
  {
    key: "quantity_per_unit",
    header: "Qty / Unit",
    className: "text-right",
    render: rm => <span className="font-semibold">{Number(rm.quantity_per_unit ?? rm.quantity ?? 0).toFixed(2)}</span>,
  },
  {
    key: "scrap_percentage",
    header: "Scrap %",
    className: "text-right",
    render: rm => <span className="font-semibold">{Number(rm.scrap_percentage ?? 0).toFixed(2)}%</span>,
  },
];
