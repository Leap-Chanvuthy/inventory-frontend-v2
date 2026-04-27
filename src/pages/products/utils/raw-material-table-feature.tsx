import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { CategoryBadge, StockStatusBadge } from "@/pages/raw-materials/utils/raw-material-status";

export const RM_COLUMNS: DataTableColumn<RawMaterial>[] = [
  {
    key: "name",
    header: "Name",
    className: "py-6",
    render: rm => <span className="font-medium">{rm.material_name}</span>,
  },
  {
    key: "code",
    header: "Code",
    className: "py-6",
    render: rm => (
      <span className="text-muted-foreground text-xs">{rm.material_sku_code}</span>
    ),
  },
  {
    key: "category",
    header: "Category",
    className: "whitespace-nowrap py-6",
    render: rm => (
      <CategoryBadge
        category={rm.raw_material_category_name}
        color={rm.rm_category?.label_color}
      />
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "whitespace-nowrap py-6",
    render: rm => (
      <StockStatusBadge
        quantity={rm.stock_availability || 0}
        minimumStock={50}
      />
    ),
  },
  {
    key: "qty",
    header: "Qty",
    className: "text-right py-6",
    render: rm => <span>{rm.stock_availability}</span>,
  },
  {
    key: "unit",
    header: "Unit",
    className: "py-6",
    render: rm => (
      <span className="text-muted-foreground text-xs">{rm.uom_name}</span>
    ),
  },
];
