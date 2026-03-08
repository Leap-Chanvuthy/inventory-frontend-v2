import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { UomCategory } from "@/api/uom/uom.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Layers, FileText, Package } from "lucide-react";
import TableActions from "@/components/reusable/partials/table-actions";
import { useDeleteUomCategory } from "@/api/uom/uom.mutation";
import { Text } from "@/components/ui/text/app-text";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// ── Sort Options ────────────────────────────────────────────────────────────

export const CATEGORY_SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "-updated_at", label: "Recently Updated" },
];

// ── Table Columns ───────────────────────────────────────────────────────────

export const CATEGORY_COLUMNS: DataTableColumn<UomCategory>[] = [
  {
    key: "name",
    header: "Category Name",
    className: "whitespace-nowrap py-6",
    render: cat => (
      <Link
        to={`/unit-of-measurement/categories/view/${cat.id}`}
        className="font-medium hover:text-primary hover:underline"
      >
        {cat.name}
      </Link>
    ),
  },
  {
    key: "description",
    header: "Description",
    className: "py-6 max-w-xs",
    render: cat => (
      <span className="text-sm text-muted-foreground line-clamp-2">
        {cat.description ?? <span className="italic opacity-50">No description</span>}
      </span>
    ),
  },
  {
    key: "units_count",
    header: "Total Units",
    className: "whitespace-nowrap py-6",
    render: cat => (
      <Badge variant="outline" className="font-mono">
        {cat.units_count ?? 0}
      </Badge>
    ),
  },
  {
    key: "base_unit",
    header: "Base Unit",
    className: "whitespace-nowrap py-6",
    render: cat =>
      cat.base_unit ? (
        <div className="flex items-center gap-1.5">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
            {cat.base_unit.name}
          </Badge>
          {cat.base_unit.symbol && (
            <span className="text-xs text-muted-foreground">({cat.base_unit.symbol})</span>
          )}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground italic">Not set</span>
      ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: cat => <CategoryActions category={cat} />,
  },
];

function CategoryActions({ category }: { category: UomCategory }) {
  const deleteMutation = useDeleteUomCategory();
  return (
    <TableActions
      viewDetailPath={`/unit-of-measurement/categories/view/${category.id}`}
      editPath={`/unit-of-measurement/categories/edit/${category.id}`}
      deleteHeading="Delete This Category"
      deleteSubheading="Are you sure you want to delete this category? Units in this category will lose their category association."
      deleteTooltip="Delete Category"
      onDelete={() => deleteMutation.mutate(category.id)}
    />
  );
}

// ── Category Card ────────────────────────────────────────────────────────────

export function CategoryCard({ category }: { category: UomCategory }) {
  const deleteMutation = useDeleteUomCategory();

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-violet-50 dark:bg-violet-950 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="min-w-0">
            <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
              {category.name}
            </Text.Small>
            <div className="flex items-center gap-1 mt-0.5">
              <Package className="h-3 w-3 text-muted-foreground" />
              <Text.Small color="muted">
                {category.units_count ?? 0} units
              </Text.Small>
            </div>
          </div>
        </div>
        {category.base_unit && (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs shrink-0">
            {category.base_unit.name}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        {category.description && (
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <Text.Small color="muted" maxLines={2}>
              {category.description}
            </Text.Small>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-0 pb-4">
        <Link
          to={`/unit-of-measurement?category=${category.id}`}
          className="text-xs text-primary hover:underline"
        >
          View units →
        </Link>
        <TableActions
          editPath={`/unit-of-measurement/categories/edit/${category.id}`}
          deleteHeading="Delete This Category"
          deleteSubheading="Are you sure you want to delete this category?"
          deleteTooltip="Delete Category"
          onDelete={() => deleteMutation.mutate(category.id)}
          showView={false}
        />
      </CardFooter>
    </Card>
  );
}
