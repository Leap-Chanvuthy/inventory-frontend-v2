import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { CategoryBadge, StockStatusBadge } from "./raw-material-status";
import { RecoverAction } from "./table-feature";
import { formatDate } from "@/utils/date-format";

export const DELETED_SORT_OPTIONS = [
  { value: "-deleted_at", label: "Recently Deleted" },
  { value: "deleted_at", label: "Oldest Deleted" },
  { value: "material_name", label: "Name (A-Z)" },
  { value: "-material_name", label: "Name (Z-A)" },
];

export const DELETED_COLUMNS: DataTableColumn<RawMaterial>[] = [
  {
    key: "material_name",
    header: "Name",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => (
      <span className="font-medium whitespace-nowrap">
        {rawMaterial.material_name}
      </span>
    ),
  },
  {
    key: "material_sku_code",
    header: "Code",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => (
      <span className="text-muted-foreground whitespace-nowrap">
        {rawMaterial.material_sku_code}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => (
      <CategoryBadge
        category={rawMaterial.raw_material_category_name}
        color={rawMaterial.rm_category?.label_color}
      />
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => (
      <StockStatusBadge
        quantity={rawMaterial.minimum_stock_level}
        minimumStock={50}
      />
    ),
  },
  {
    key: "deleted_at",
    header: "Deleted At",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => (
      <span className="text-muted-foreground whitespace-nowrap">
        {rawMaterial.deleted_at ? formatDate(rawMaterial.deleted_at) : "—"}
      </span>
    ),
  },
  {
    key: "supplier",
    header: "Supplier",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => (
      <span className="text-muted-foreground">
        {rawMaterial.official_name || "—"}
      </span>
    ),
  },
  {
    key: "warehouse",
    header: "Warehouse",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => (
      <span className="text-muted-foreground">
        {rawMaterial.warehouse_name || "—"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => <RecoverAction rawMaterial={rawMaterial} />,
  },
];
