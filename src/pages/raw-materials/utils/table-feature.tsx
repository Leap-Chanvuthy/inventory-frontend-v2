import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Badge } from "@/components/ui/badge";
import TableActions from "@/components/reusable/partials/table-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Package, Warehouse, User, Ruler } from "lucide-react";
import { Link } from "react-router-dom";

// Category Badge Component
export const CategoryBadge = ({
  category,
  color,
}: {
  category: string;
  color?: string;
}) => {
  return (
    <Badge
      variant="outline"
      className="whitespace-nowrap"
      style={{
        backgroundColor: color ? `${color}20` : undefined,
        borderColor: color || undefined,
        color: color || undefined,
      }}
    >
      {category}
    </Badge>
  );
};

// Status Badge Component based on stock level
export const StockStatusBadge = ({
  quantity,
  minimumStock,
}: {
  quantity: number;
  minimumStock: number;
}) => {
  let status: { label: string; className: string };

  if (quantity === 0) {
    status = {
      label: "Out of Stock",
      className:
        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    };
  } else if (quantity <= minimumStock) {
    status = {
      label: "Low Stock",
      className:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };
  } else {
    status = {
      label: "Available",
      className:
        "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    };
  }

  return (
    <Badge variant="outline" className={status.className}>
      {status.label}
    </Badge>
  );
};

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
    <Card className="transition-transform hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <CardHeader className="flex items-start justify-between gap-4 pb-3">
        <Link to={`/raw-materials/view/${rawMaterial.id}`} className="flex-1">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full border-2 border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Package className="h-7 w-7 text-indigo-500" />
            </div>
            <div className="font-semibold text-lg truncate text-wrap">
              {rawMaterial.material_name}
            </div>
          </div>
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 text-sm">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-1">
          <CategoryBadge
            category={rawMaterial.raw_material_category_name}
            color={rawMaterial.rm_category?.label_color}
          />
          <StockStatusBadge
            quantity={rawMaterial.minimum_stock_level}
            minimumStock={50}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Package className="h-4 w-4 text-blue-500" />
            <span className="text-xs">{rawMaterial.material_sku_code}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Ruler className="h-4 w-4 text-green-500" />
            <span className="text-xs">
              {rawMaterial.minimum_stock_level}{" "}
              {rawMaterial.uom?.symbol || rawMaterial.uom_name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4 text-purple-500" />
            <span className="text-xs truncate">
              {rawMaterial.official_name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Warehouse className="h-4 w-4 text-orange-500" />
            <span className="text-xs truncate">
              {rawMaterial.warehouse_name}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-0">
        <RawMaterialActions rawMaterial={rawMaterial} />
      </CardFooter>
    </Card>
  );
}
