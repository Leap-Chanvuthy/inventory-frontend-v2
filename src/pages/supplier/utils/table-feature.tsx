import { Supplier } from "@/api/suppliers/supplier.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Badge } from "@/components/ui/badge";
import { SquarePen, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SupplierCategoryBadge } from "./supplier-status";

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    active: {
      label: "Active",
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    inactive: {
      label: "Inactive",
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    suspended: {
      label: "Suspended",
      className: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  };

  const statusInfo = statusMap[status.toLowerCase()] || statusMap["active"];

  return (
    <Badge variant="secondary" className={statusInfo.className}>
      {statusInfo.label}
    </Badge>
  );
};

// export const FILTER_OPTIONS = [
//   { value: " ", label: "All" },
//   { value: "PRODUCTS", label: "Products" },
//   { value: "FOOD", label: "Food" },
//   { value: "CLOTHING", label: "Clothing" },
//   { value: "LOGISTICS", label: "Logistics" },
//   { value: "OTHERS", label: "Others" },
// ];

export const SORT_OPTIONS = [
  // { value: "official_name", label: "Name" },
  { value: "supplier_code", label: "Supplier Code" },
  { value: "supplier_category", label: "Supplier Category" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
];

export const COLUMNS: DataTableColumn<Supplier>[] = [
  {
    key: "profile",
    header: "Profile",

    render: supplier => (
      <img
        src={supplier.image || ""}
        alt={supplier.official_name}
        className="h-10 w-10 rounded-full border"
      />
    ),
  },
  {
    key: "supplier_code",
    header: "Supplier Code",
    className: "whitespace-nowrap py-6",
    render: supplier => (
      <span className="font-medium whitespace-nowrap">
        {supplier.supplier_code}
      </span>
    ),
  },
  {
    key: "official_name",
    header: "Name",
    className: "whitespace-nowrap py-6",
    render: supplier => (
      <span className="font-medium whitespace-nowrap">
        {supplier.official_name}
      </span>
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
    key: "active_status",
    header: "Active Status",
    className: "whitespace-nowrap py-6",
    render: () => <StatusBadge status="active" />,
  },
  {
    key: "address",
    header: "Address",
    className: "whitespace-nowrap py-6",
    render: supplier => (
      <span className="text-muted-foreground">
        {supplier.address_line1 && supplier.city
          ? `${supplier.address_line1}, ${supplier.city}, ${supplier.province}.`
          : "-"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: supplier => (
      <div className="flex items-center gap-3">
        <Link
          to={`/supplier/view/${supplier.id}`}
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          <Eye className="h-5 w-5" />
        </Link>
        <Link
          to={`/supplier/update/${supplier.id}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <SquarePen className="h-5 w-5" />
        </Link>
        <button className="text-red-500 hover:text-red-700 transition-colors">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    ),
  },
];
