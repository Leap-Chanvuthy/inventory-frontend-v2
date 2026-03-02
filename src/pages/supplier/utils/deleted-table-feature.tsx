import { Supplier } from "@/api/suppliers/supplier.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { SupplierCategoryBadge } from "./supplier-status";
import { RecoverSupplierAction } from "./table-feature";
import { formatDate } from "@/utils/date-format";

export const DELETED_SORT_OPTIONS = [
  { value: "-deleted_at", label: "Recently Deleted" },
  { value: "deleted_at", label: "Oldest Deleted" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
];

export const DELETED_COLUMNS: DataTableColumn<Supplier>[] = [
  {
    key: "profile",
    header: "Profile",
    render: supplier => (
      <img
        src={supplier.image || "/supplier-placeholder.png"}
        alt={supplier.official_name}
        className="h-10 w-10 rounded-full border object-cover"
      />
    ),
  },
  {
    key: "supplier_code",
    header: "Supplier Code",
    className: "whitespace-nowrap py-6",
    render: supplier => (
      <span className="font-medium whitespace-nowrap">{supplier.supplier_code}</span>
    ),
  },
  {
    key: "official_name",
    header: "Name",
    className: "whitespace-nowrap py-6",
    render: supplier => (
      <span className="font-medium whitespace-nowrap">{supplier.official_name}</span>
    ),
  },
  {
    key: "contact_person",
    header: "Contact Person",
    className: "whitespace-nowrap py-6",
    render: supplier => <span>{supplier.contact_person}</span>,
  },
  {
    key: "supplier_category",
    header: "Category",
    className: "whitespace-nowrap py-6",
    render: supplier => (
      <SupplierCategoryBadge category={supplier.supplier_category} />
    ),
  },
  {
    key: "deleted_at",
    header: "Deleted At",
    className: "whitespace-nowrap py-6",
    render: supplier => (
      <span className="text-muted-foreground whitespace-nowrap">
        {supplier.deleted_at ? formatDate(supplier.deleted_at) : "—"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: supplier => <RecoverSupplierAction supplier={supplier} />,
  },
];
