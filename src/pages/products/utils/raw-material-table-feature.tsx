import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { Badge } from "@/components/ui/badge";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";

export const getRMStockStatus = (rm: RawMaterial) => {
  if (rm.minimum_stock_level === 0)
    return {
      label: "Out of Stock",
      className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    };
  if (rm.minimum_stock_level < 50)
    return {
      label: "Low Stock",
      className:
        "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    };
  return {
    label: "In Stock",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  };
};

export const RM_COLUMNS: DataTableColumn<RawMaterial>[] = [
  {
    key: "name",
    header: "Name",
    render: rm => <span className="font-medium">{rm.material_name}</span>,
  },
  {
    key: "code",
    header: "Code",
    render: rm => (
      <span className="text-muted-foreground text-xs">
        {rm.material_sku_code}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    render: rm => (
      <Badge
        className="text-[11px] min-w-[150px] max-w-[150px] truncate inline-block text-center"
        style={
          rm.rm_category?.label_color
            ? { backgroundColor: rm.rm_category.label_color, color: "#fff" }
            : undefined
        }
        title={rm.raw_material_category_name}
      >
        {rm.raw_material_category_name}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: rm => {
      const s = getRMStockStatus(rm);
      return (
        <span
          className={`text-xs min-w-[90px] inline-flex items-center justify-center py-0.5 rounded-full font-medium ${s.className}`}
        >
          {s.label}
        </span>
      );
    },
  },
  {
    key: "qty",
    header: "Qty",
    className: "text-right",
    render: rm => <span>{rm.minimum_stock_level}</span>,
  },
  {
    key: "unit",
    header: "Unit",
    render: rm => (
      <span className="text-muted-foreground text-xs">{rm.uom_name}</span>
    ),
  },
];
