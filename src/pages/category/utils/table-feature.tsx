import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import TableActions from "@/components/reusable/partials/table-actions";
import { formatDate } from "@/utils/date-format";

export interface Category {
  id: number;
  category_name: string;
  label_color: string;
  description: string;
  created_at: string;
  updated_at: string;
}

function CategoryActions({
  category,
  viewRoute,
  editRoute,
  onDelete,
}: {
  category: Category;
  viewRoute: string;
  editRoute: string;
  onDelete: (id: number) => void;
}) {
  return (
    <TableActions
      viewDetailPath={`${viewRoute}/${category.id}`}
      editPath={`${editRoute}/${category.id}`}
      deleteHeading="Delete This Category"
      deleteSubheading="Are you sure want to delete this category? This action cannot be undone."
      deleteTooltip="Delete Category"
      onDelete={() => onDelete(category.id)}
    />
  );
}

const BASE_COLUMNS: DataTableColumn<Category>[] = [
  {
    key: "label_color",
    header: "Color",
    className: "whitespace-nowrap py-6",
    render: category => (
      <div
        className="w-10 h-10 rounded-full border"
        style={{ backgroundColor: category.label_color }}
      />
    ),
  },
  {
    key: "category_name",
    header: "Category Name",
    className: "whitespace-nowrap py-6",
    render: category => (
      <span className="font-medium">{category.category_name}</span>
    ),
  },
  {
    key: "description",
    header: "Description",
    className: "whitespace-nowrap py-6 max-w-md",
    render: category => (
      <span className="line-clamp-2">{category.description}</span>
    ),
  },
  {
    key: "created_at",
    header: "Created At",
    className: "whitespace-nowrap py-6",
    render: category => (
      <span className="text-muted-foreground text-sm">
        {formatDate(category.created_at)}
      </span>
    ),
  },
];

export const createColumns = ({
  viewRoute,
  editRoute,
  onDelete,
}: {
  viewRoute: string;
  editRoute: string;
  onDelete: (id: number) => void;
}): DataTableColumn<Category>[] => [
  ...BASE_COLUMNS,
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: category => (
      <CategoryActions
        category={category}
        viewRoute={viewRoute}
        editRoute={editRoute}
        onDelete={onDelete}
      />
    ),
  },
];

export const SORT_OPTIONS = [
  { value: "category_name", label: "Category Name" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "-updated_at", label: "Recently Updated" },
];
