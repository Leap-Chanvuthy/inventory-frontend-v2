import { Supplier } from "@/api/suppliers/supplier.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Badge } from "@/components/ui/badge";
import { SupplierCategoryBadge } from "./supplier-status";
import TableActions from "@/components/reusable/partials/table-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Mail, MapPin, Phone, ScanQrCode } from "lucide-react";
import { Link } from "react-router-dom";

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

export const FILTER_OPTIONS = [
  { value: " ", label: "All" },
  { value: "PRODUCTS", label: "Products" },
  { value: "FOOD", label: "Food" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "OTHERS", label: "Others" },
];

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
      <TableActions
        viewDetailPath={`/supplier/view/${supplier.id}`}
        editPath={`/supplier/update/${supplier.id}`}
        deleteHeading="Delete This Supplier"
        deleteSubheading="Are you sure want to delete this supplier? This action cannot be undone."
        deleteTooltip="Delete Supplier"
        onDelete={() => {
          console.log("delete");
        }}
      />
    ),
  },
];

interface SupplierCardProps {
  supplier?: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  if (!supplier) return null;

  const addressText = [
    [supplier.address_line1, supplier.address_line2].filter(Boolean).join(" "),
    [supplier.village, supplier.commune, supplier.district]
      .filter(Boolean)
      .join(", "),
    [supplier.city, supplier.province, supplier.postal_code]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <Card className="transition-transform hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <CardHeader className="flex items-start justify-between gap-4 pb-3">
        <Link to={`/supplier/view/${supplier.id}`} className="flex-1">
          <div className="flex items-center gap-4">
            <img
              src={supplier.image || "/supplier-placeholder.png"}
              alt={supplier.official_name}
              className="h-14 w-14 rounded-full border-2 border-indigo-300 object-cover"
            />
            {/* <div className="min-w-0 flex flex-col gap-1"> */}
            <div className="font-semibold text-lg truncate text-wrap">
              {supplier.official_name}
            </div>

            {/* </div> */}
          </div>
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 text-sm">
        {/* Supplier Info */}
        <div className="flex flex-wrap gap-2 mt-1">
          <SupplierCategoryBadge category={supplier.supplier_category} />
          <StatusBadge status="active" />
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1">
          {supplier.supplier_code && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <ScanQrCode className="h-4 w-4" />
              {supplier.supplier_code}
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Phone className="h-4 w-4 text-blue-500" />
              {supplier.phone}
            </div>
          )}
          {supplier.email && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-green-500" />
              {supplier.email}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
          <div
            className="text-xs leading-snug break-words"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              whiteSpace: "pre-line",
            }}
            title={addressText || "-"}
          >
            {addressText || "-"}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-0">
        <TableActions
          viewDetailPath={`/supplier/view/${supplier.id}`}
          editPath={`/supplier/update/${supplier.id}`}
          deleteHeading="Delete This Supplier"
          deleteSubheading="Are you sure want to delete this supplier? This action cannot be undone."
          deleteTooltip="Delete Supplier"
          onDelete={() => {
            console.log("delete");
          }}
        />
      </CardFooter>
    </Card>
  );
}
