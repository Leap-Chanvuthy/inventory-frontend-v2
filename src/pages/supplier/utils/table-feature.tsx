import { Supplier, SupplierTransactionItem } from "@/api/suppliers/supplier.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { SupplierCategoryBadge } from "./supplier-status";
import TableActions from "@/components/reusable/partials/table-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Banknote, Mail, MapPin, Phone, ScanQrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteSupplier } from "@/api/suppliers/supplier.mutation";
import { Text } from "@/components/ui/text/app-text";
import { formatDate } from "@/utils/date-format";
import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SupplierActions = ({ supplier }: { supplier: Supplier }) => {
  const deleteMutation = useDeleteSupplier();

  return (
    <div className="flex items-center gap-2">
      <TableActions
        viewDetailPath={`/supplier/view/${supplier.id}`}
        editPath={`/supplier/update/${supplier.id}`}
        deleteHeading="Delete This Supplier"
        deleteSubheading="Are you sure want to delete this supplier? This action cannot be undone."
        deleteTooltip="Delete Supplier"
        onDelete={() => {
          deleteMutation.mutate(supplier.id);
        }}
      />
    </div>
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
  // {
  //   key: "active_status",
  //   header: "Active Status",
  //   className: "whitespace-nowrap py-6",
  //   render: () => <StatusBadge status="active" />,
  // },
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
    render: supplier => <SupplierActions supplier={supplier} />,
  },
];

interface SupplierCardProps {
  supplier?: Supplier;
  hideActions?: boolean;
  disableLink?: boolean;
  interactive?: boolean;
}

export function SupplierCard({
  supplier,
  hideActions = false,
  disableLink = false,
  interactive = true,
}: SupplierCardProps) {
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
    <Card
      className={`h-full flex flex-col transition-shadow ${interactive ? "hover:shadow-md" : ""}`}
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-3 sm:gap-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {disableLink ? (
            <>
              <img
                src={supplier.image || "/supplier-placeholder.png"}
                alt={supplier.official_name}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Text.Small
                  color="default"
                  fontWeight="medium"
                  overflow="ellipsis"
                >
                  {supplier.official_name}
                </Text.Small>
              </div>
            </>
          ) : (
            <Link
              to={`/supplier/view/${supplier.id}`}
              className="flex items-center gap-3 min-w-0 hover:text-primary"
            >
              <img
                src={supplier.image || "/supplier-placeholder.png"}
                alt={supplier.official_name}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Text.Small
                  color="default"
                  fontWeight="medium"
                  overflow="ellipsis"
                >
                  {supplier.official_name}
                </Text.Small>
              </div>
            </Link>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 space-y-2.5 sm:space-y-3">
        <div className="flex flex-wrap gap-2">
          <SupplierCategoryBadge category={supplier.supplier_category} />
        </div>

        {supplier.supplier_code && (
          <div className="flex items-center gap-2">
            <ScanQrCode className="h-4 w-4 text-indigo-500 shrink-0" />
            <Text.Small color="muted" overflow="ellipsis">
              {supplier.supplier_code}
            </Text.Small>
          </div>
        )}

        {supplier.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-500 shrink-0" />
            <Text.Small color="muted" overflow="ellipsis">
              {supplier.phone}
            </Text.Small>
          </div>
        )}

        {supplier.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-500 shrink-0" />
            <Text.Small color="muted" overflow="ellipsis">
              {supplier.email}
            </Text.Small>
          </div>
        )}

        {supplier.banks && supplier.banks.length > 0 && (
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-purple-500 shrink-0" />
            <div className="flex items-center gap-1 flex-wrap">
              {supplier.banks
                .filter(bank => Boolean(bank.bank_label))
                .map(bank => (
                  <img
                    key={bank.id}
                    src={bank.bank_label}
                    alt={`${bank.bank_name} label`}
                    title={bank.bank_name}
                    className="h-4 w-4 shrink-0 rounded-full"
                  />
                ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <Text.Small color="muted" maxLines={2}>
            {addressText || "-"}
          </Text.Small>
        </div>
      </CardContent>

      {!hideActions && (
        <CardFooter className="flex justify-end pt-0 pb-4">
          <SupplierActions supplier={supplier} />
        </CardFooter>
      )}
    </Card>
  );
}




/// Table feature for supplier transactions
export const TRANSACTION_SORT_OPTIONS = [
  { value: "-movement_date", label: "Newest First" },
  { value: "movement_date", label: "Oldest First" },
  { value: "direction", label: "Direction" },
  { value: "movement_type", label: "Movement Type" },
];

export const TRANSACTION_COLUMNS: DataTableColumn<SupplierTransactionItem>[] = [
  {
    key: "raw_material_id",
    header: "Material",
    className: "whitespace-nowrap py-4",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <Text.Small fontWeight="semibold" color="default" className="whitespace-nowrap">
          {item.raw_material?.material_name ?? "—"}
        </Text.Small>
        <Text.Small color="muted" className="text-xs font-mono whitespace-nowrap">
          {item.raw_material?.material_sku_code ?? "—"}
        </Text.Small>
      </div>
    ),
  },
  {
    key: "movement_date",
    header: "Movement Date",
    className: "whitespace-nowrap py-4",
    render: (item) => (
      <Text.Small color="muted" fontWeight="medium" className="whitespace-nowrap">
        {formatDate(item.movement_date)}
      </Text.Small>
    ),
  },
  {
    key: "movement_type",
    header: "Type",
    className: "whitespace-nowrap py-4",
    render: (item) => (
      <Badge variant="secondary" className="whitespace-nowrap font-mono text-xs">
        {item.movement_type.replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    key: "direction",
    header: "Direction",
    className: "whitespace-nowrap py-4",
    render: (item) => {
      const isIn = item.direction === "IN";
      return (
        <div
          className={`flex items-center gap-1.5 font-bold ${
            isIn ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isIn ? (
            <ArrowDownLeft className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5" />
          )}
          <Text.Small fontWeight="bold" letterSpacing="wide" className="uppercase">
            {item.direction}
          </Text.Small>
        </div>
      );
    },
  },
  {
    key: "quantity",
    header: "Quantity",
    className: "whitespace-nowrap py-4 text-right",
    render: (item) => {
      const isIn = item.direction === "IN";
      const uomLabel = item.raw_material?.uom?.symbol ?? item.raw_material?.uom?.name ?? "";
      return (
        <Text.Small color="default" fontWeight="medium">
          {isIn ? "+" : "-"}
          {item.quantity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          {uomLabel ? ` ${uomLabel}` : ""}
        </Text.Small>
      );
    },
  },
  {
    key: "unit_price_in_usd",
    header: "Unit Price",
    className: "whitespace-nowrap py-4 text-right",
    render: (item) => (
      <Text.Small color="muted">
        ${item.unit_price_in_usd.toFixed(2)}
      </Text.Small>
    ),
  },
  {
    key: "total_value_in_usd",
    header: "Total Value",
    className: "whitespace-nowrap py-4 text-right",
    render: (item) => (
      <Text.Small color="default" fontWeight="semibold">
        $
        {item.total_value_in_usd.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}
      </Text.Small>
    ),
  },
  {
    key: "note",
    header: "Notes",
    className: "whitespace-nowrap py-4",
    render: (item) => (
      <Text.Small color="muted" fontStyle="italic" maxLines={1}>
        {item.note || "No notes"}
      </Text.Small>
    ),
  },
];