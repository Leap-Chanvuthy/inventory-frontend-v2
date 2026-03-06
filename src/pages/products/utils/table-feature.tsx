import { Product } from "@/api/product/product.type";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import TableActions from "@/components/reusable/partials/table-actions";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import { Badge } from "@/components/ui/badge";
import { Package, Warehouse, User, Ruler, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteProduct } from "@/api/product/product.mutation";

// Category Badge with consistent sizing and truncation
const CategoryBadge = ({ product }: { product: Product }) => (
  <Badge
    className="min-w-[160px] max-w-[160px] h-6 inline-flex items-center justify-center truncate"
    style={
      product.category?.label_color
        ? { backgroundColor: product.category.label_color, color: "#fff" }
        : undefined
    }
    title={product.product_category_name}
  >
    <span className="truncate">{product.product_category_name}</span>
  </Badge>
);

// Actions Component
const ProductActions = ({ product }: { product: Product }) => {
  const deleteMutation = useDeleteProduct();

  return (
    <TableActions
      viewDetailPath={`/products/view/${product.id}`}
      editPath={`/products/update/${product.id}`}
      deleteHeading="Delete This Product"
      deleteSubheading="Are you sure you want to delete this product? This action cannot be undone."
      deleteTooltip="Delete Product"
      onDelete={() => deleteMutation.mutate(product.id)}
    />
  );
};

// Sort Options
export const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "product_name", label: "Name (A-Z)" },
  { value: "-product_name", label: "Name (Z-A)" },
];

// Table Columns
export const COLUMNS: DataTableColumn<Product>[] = [
  {
    key: "product_name",
    header: "Name",
    className: "whitespace-nowrap py-6",
    render: (product) => (
      <span className="font-medium whitespace-nowrap">{product.product_name}</span>
    ),
  },
  {
    key: "product_sku_code",
    header: "SKU",
    className: "whitespace-nowrap py-6",
    render: (product) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {product.product_sku_code}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    className: "whitespace-nowrap py-6",
    render: (product) => <CategoryBadge product={product} />,
  },
  {
    key: "supplier",
    header: "Supplier",
    className: "whitespace-nowrap py-6",
    render: (product) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {product.official_name || "—"}
      </span>
    ),
  },
  {
    key: "warehouse",
    header: "Warehouse",
    className: "whitespace-nowrap py-6",
    render: (product) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {product.warehouse_name || "—"}
      </span>
    ),
  },
  {
    key: "uom",
    header: "Unit",
    className: "whitespace-nowrap py-6",
    render: (product) => (
      <span className="text-muted-foreground">{product.uom_name || "—"}</span>
    ),
  },
  {
    key: "barcode",
    header: "Barcode",
    className: "whitespace-nowrap py-6",
    render: (product) => (
      <span className="text-muted-foreground">{product.barcode || "—"}</span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: (product) => <ProductActions product={product} />,
  },
];

// Card Component for Grid View
export function ProductCard({ product }: { product?: Product }) {
  if (!product) return null;

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <Link
          to={`/products/view/${product.id}`}
          className="flex items-center gap-3 min-w-0 hover:text-primary"
        >
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
              {product.product_name}
            </Text.Small>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-2.5 sm:space-y-3">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge product={product} />
        </div>

        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-blue-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {product.product_sku_code}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-green-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {product.uom_name || "—"}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-purple-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {product.official_name || "—"}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-orange-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {product.warehouse_name || "—"}
          </Text.Small>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-0 pb-4">
        <ProductActions product={product} />
      </CardFooter>
    </Card>
  );
}
