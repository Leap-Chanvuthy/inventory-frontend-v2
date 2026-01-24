import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Edit2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/date-format";

interface Category {
  id: number;
  category_name: string;
  label_color: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const COLUMNS: DataTableColumn<Category>[] = [
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
    render: category => <span className="font-medium">{category.category_name}</span>,
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
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: category => (
      <Link
        to={`/customer-categories/edit/${category.id}`}
        className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors"
      >
        <Edit2 className="w-4 h-4" />
        <span>Edit</span>
      </Link>
    ),
  },
];

export const SORT_OPTIONS = [
  { value: "category_name", label: "Category Name" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "-updated_at", label: "Recently Updated" },
];
