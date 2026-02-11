import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import TableActions from "@/components/reusable/partials/table-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Package, Warehouse, User, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import { Text } from "@/components/ui/text/app-text";
import { CategoryBadge, StockStatusBadge } from "./raw-material-status";

// Actions Component
const RawMaterialActions = ({ rawMaterial }: { rawMaterial: RawMaterial }) => {
  // const deleteMutation = useDeleteRawMaterial();

  return (
    <div className="flex items-center gap-2">
      <TableActions
        viewDetailPath={`/raw-materials/view/${rawMaterial.id}`}
        editPath={`/raw-materials/update/${rawMaterial.id}`}
        deleteHeading="Delete This Raw Material"
        deleteSubheading="Are you sure you want to delete this raw material? This action cannot be undone."
        deleteTooltip="Delete Raw Material"
        onDelete={() => {
          // deleteMutation.mutate(rawMaterial.id);
          console.log("Delete raw material:", rawMaterial.id);
        }}
      />
    </div>
  );
};

// Filter Options
export const FILTER_OPTIONS = [{ value: " ", label: "All" }];

// Sort Options
export const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "material_name", label: "Name (A-Z)" },
  { value: "-material_name", label: "Name (Z-A)" },
  // { value: "material_sku_code", label: "SKU Code" },
  // { value: "-minimum_stock_level", label: "Stock Level (High)" },
  // { value: "minimum_stock_level", label: "Stock Level (Low)" },
];

// Table Columns
export const COLUMNS: DataTableColumn<RawMaterial>[] = [
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
        minimumStock={50} // You might want to make this configurable
      />
    ),
  },
  {
    key: "quantity",
    header: "Quantity",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => <span>{rawMaterial.minimum_stock_level}</span>,
  },
  {
    key: "uom",
    header: "Unit of Measure",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => (
      <span className="text-muted-foreground">{rawMaterial.uom_name}</span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: rawMaterial => <RawMaterialActions rawMaterial={rawMaterial} />,
  },
];

// Card Component for Grid View
interface RawMaterialCardProps {
  rawMaterial?: RawMaterial;
}

export function RawMaterialCard({ rawMaterial }: RawMaterialCardProps) {
  if (!rawMaterial) return null;

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md">
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-3 sm:gap-4 pb-3">
        <Link to={`/raw-materials/view/${rawMaterial.id}`} className="flex items-center gap-3 min-w-0 hover:text-primary">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
              {rawMaterial.material_name}
            </Text.Small>
          </div>
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 space-y-2.5 sm:space-y-3">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge
            category={rawMaterial.raw_material_category_name}
            color={rawMaterial.rm_category?.label_color}
          />
          <StockStatusBadge
            quantity={rawMaterial.minimum_stock_level}
            minimumStock={50}
          />
        </div>

        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {rawMaterial.material_sku_code}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-green-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {rawMaterial.minimum_stock_level}{" "}
            {rawMaterial.uom?.symbol || rawMaterial.uom_name}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-purple-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {rawMaterial.official_name}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-orange-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {rawMaterial.warehouse_name}
          </Text.Small>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-0 pb-4">
        <RawMaterialActions rawMaterial={rawMaterial} />
      </CardFooter>
    </Card>
  );
}
