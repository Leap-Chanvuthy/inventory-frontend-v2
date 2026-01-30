import { Customer, CustomerStatus } from "@/api/customers/customer.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Badge } from "@/components/ui/badge";
import TableActions from "@/components/reusable/partials/table-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Mail, MapPin, Phone, ScanQrCode, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteCustomer } from "@/api/customers/customer.mutation";

const CustomerActions = ({ customer }: { customer: Customer }) => {
  const deleteMutation = useDeleteCustomer();

  return (
    <div className="flex items-center gap-2">
      <TableActions
        viewDetailPath={`/customer/view/${customer.id}`}
        editPath={`/customer/update/${customer.id}`}
        deleteHeading="Delete This Customer"
        deleteSubheading="Are you sure want to delete this customer? This action cannot be undone."
        deleteTooltip="Delete Customer"
        onDelete={() => {
          deleteMutation.mutate(customer.id);
        }}
      />
    </div>
  );
};

const StatusBadge = ({ status }: { status: CustomerStatus }) => {
  const statusMap: Record<
    CustomerStatus,
    { label: string; className: string }
  > = {
    [CustomerStatus.ACTIVE]: {
      label: "Active",
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    [CustomerStatus.INACTIVE]: {
      label: "Inactive",
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    [CustomerStatus.PROSPECTIVE]: {
      label: "Prospective",
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
  };

  const statusInfo = statusMap[status] || statusMap[CustomerStatus.ACTIVE];

  return (
    <Badge variant="secondary" className={statusInfo.className}>
      {statusInfo.label}
    </Badge>
  );
};

const CustomerCategoryBadge = ({ categoryName }: { categoryName: string }) => {
  return (
    <Badge
      variant="secondary"
      className="bg-purple-500/10 text-purple-600 dark:text-purple-400"
    >
      {categoryName}
    </Badge>
  );
};

export const FILTER_OPTIONS = [
  { value: " ", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PROSPECTIVE", label: "Prospective" },
];

export const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest" },
  { value: "fullname", label: "Name" },
];

export const COLUMNS: DataTableColumn<Customer>[] = [
  {
    key: "profile",
    header: "Profile",
    render: customer => (
      <img
        src={customer.image || "/placeholder-avatar.png"}
        alt={customer.fullname}
        className="h-10 w-10 rounded-full border"
      />
    ),
  },
  {
    key: "customer_code",
    header: "Customer Code",
    className: "whitespace-nowrap py-6",
    render: customer => (
      <span className="font-medium whitespace-nowrap">
        {customer.customer_code}
      </span>
    ),
  },
  {
    key: "fullname",
    header: "Name",
    className: "whitespace-nowrap py-6",
    render: customer => (
      <span className="font-medium whitespace-nowrap">{customer.fullname}</span>
    ),
  },
  {
    key: "email_address",
    header: "Email",
    className: "whitespace-nowrap py-6",
    render: customer => <span>{customer.email_address}</span>,
  },
  {
    key: "phone_number",
    header: "Phone",
    className: "whitespace-nowrap py-6",
    render: customer => <span>{customer.phone_number}</span>,
  },
  {
    key: "customer_category_name",
    header: "Category",
    className: "whitespace-nowrap py-6",
    render: customer => (
      <CustomerCategoryBadge categoryName={customer.customer_category_name} />
    ),
  },
  {
    key: "customer_status",
    header: "Status",
    className: "whitespace-nowrap py-6",
    render: customer => <StatusBadge status={customer.customer_status} />,
  },
  {
    key: "address",
    header: "Address",
    className: "whitespace-nowrap py-6",
    render: customer => (
      <span className="text-muted-foreground">
        {customer.customer_address || "-"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: customer => <CustomerActions customer={customer} />,
  },
];

interface CustomerCardProps {
  customer?: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  if (!customer) return null;

  return (
    <Card className="transition-transform hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <CardHeader className="flex items-start justify-between gap-4 pb-3">
        <Link to={`/customer/view/${customer.id}`} className="flex-1">
          <div className="flex items-center gap-4">
            <img
              src={customer.image || "/placeholder-avatar.png"}
              alt={customer.fullname}
              className="h-14 w-14 rounded-full border-2 border-indigo-300 object-cover"
            />
            <div className="font-semibold text-lg truncate text-wrap">
              {customer.fullname}
            </div>
          </div>
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 text-sm">
        {/* Customer Info */}
        <div className="flex flex-wrap gap-2 mt-1">
          <CustomerCategoryBadge
            categoryName={customer.customer_category_name}
          />
          <StatusBadge status={customer.customer_status} />
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1">
          {customer.customer_code && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <ScanQrCode className="h-4 w-4" />
              {customer.customer_code}
            </div>
          )}
          {customer.phone_number && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Phone className="h-4 w-4 text-blue-500" />
              {customer.phone_number}
            </div>
          )}
          {customer.email_address && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-green-500" />
              {customer.email_address}
            </div>
          )}
          {customer.social_media && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Globe className="h-4 w-4 text-purple-500" />
              {customer.social_media}
            </div>
          )}
        </div>

        {/* Address */}
        {customer.customer_address && (
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
              title={customer.customer_address}
            >
              {customer.customer_address}
            </div>
          </div>
        )}

        {/* Note */}
        {customer.customer_note && (
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
            Note: {customer.customer_note}
          </div>
        )}
      </CardContent>
 
      <CardFooter className="flex justify-end pt-0">
        <CustomerActions customer={customer} />
      </CardFooter>
    </Card>
  );
}
