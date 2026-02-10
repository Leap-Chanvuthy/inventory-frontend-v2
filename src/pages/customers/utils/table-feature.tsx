import { Customer } from "@/api/customers/customer.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import TableActions from "@/components/reusable/partials/table-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Mail, MapPin, Phone, ScanQrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteCustomer } from "@/api/customers/customer.mutation";
import { Text } from "@/components/ui/text/app-text";
import {
  CustomerCategoryBadge,
  CustomerStatusBadge,
} from "./customer-status";

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
    render: customer => <CustomerStatusBadge status={customer.customer_status} />,
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
  hideActions?: boolean;
  disableLink?: boolean;
  interactive?: boolean;
}

export function CustomerCard({
  customer,
  hideActions = false,
  disableLink = false,
  interactive = true,
}: CustomerCardProps) {
  if (!customer) return null;

  return (
    <Card className={`h-full flex flex-col transition-shadow ${interactive ? "hover:shadow-md" : ""}`}>
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-3 sm:gap-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {disableLink ? (
            <>
              <img
                src={customer.image || "/placeholder-avatar.png"}
                alt={customer.fullname}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
                  {customer.fullname}
                </Text.Small>
                <div className="flex items-center gap-1">
                  <ScanQrCode className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <Text.Small color="muted" overflow="ellipsis">
                    {customer.customer_code}
                  </Text.Small>
                </div>
              </div>
            </>
          ) : (
            <Link to={`/customer/view/${customer.id}`} className="flex items-center gap-3 min-w-0 hover:text-primary">
              <img
                src={customer.image || "/placeholder-avatar.png"}
                alt={customer.fullname}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
                  {customer.fullname}
                </Text.Small>
                <div className="flex items-center gap-1">
                  <ScanQrCode className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <Text.Small color="muted" overflow="ellipsis">
                    {customer.customer_code}
                  </Text.Small>
                </div>
              </div>
            </Link>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 space-y-2.5 sm:space-y-3">
        <div className="flex flex-wrap gap-2">
          <CustomerCategoryBadge categoryName={customer.customer_category_name} />
          <CustomerStatusBadge status={customer.customer_status} />
        </div>

        {customer.phone_number && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-500 shrink-0" />
            <Text.Small color="muted" overflow="ellipsis">
              {customer.phone_number}
            </Text.Small>
          </div>
        )}

        {customer.email_address && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-500 shrink-0" />
            <Text.Small color="muted" overflow="ellipsis">
              {customer.email_address}
            </Text.Small>
          </div>
        )}

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <Text.Small color="muted" maxLines={2}>
            {customer.customer_address || "-"}
          </Text.Small>
        </div>
      </CardContent>

      {!hideActions && (
        <CardFooter className="flex justify-end pt-0 pb-4">
          <CustomerActions customer={customer} />
        </CardFooter>
      )}
    </Card>
  );
}
