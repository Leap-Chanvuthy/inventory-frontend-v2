import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { UOM } from "@/api/uom/uom.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import TableActions from "@/components/reusable/partials/table-actions";
import { useDeleteUOM } from "@/api/uom/uom.mutation";
import { UOMStatusBadge } from "./uom-status";
import { Text } from "@/components/ui/text/app-text";

// Sort Options
export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "uom_code", label: "UOM Code" },
  { value: "symbol", label: "Symbol" },
  { value: "uom_type", label: "UOM Type" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "-updated_at", label: "Recently Updated" },
];

// Define table columns
export const COLUMNS: DataTableColumn<UOM>[] = [
  {
    key: "uom_id",
    header: "Unit ID",
    className: "whitespace-nowrap py-6",
    render: uom => <span className="font-medium">{uom.id}</span>,
  },
    {
    key: "uom_code",
    header: "UOM Code",
    className: "whitespace-nowrap py-6",
    render: uom => <span className="font-medium">{uom.uom_code}</span>,
  },
  {
    key: "name",
    header: "Unit Of Measure",
    className: "whitespace-nowrap py-6",
    render: uom => <span className="font-medium">{uom.name}</span>,
  },
  {
    key: "symbol",
    header: "Symbol",
    className: "whitespace-nowrap py-6",
    render: uom => <span>{uom.symbol}</span>,
  },
  {
    key: "description",
    header: "Description",
    className: "whitespace-nowrap py-6 max-w-md",
    render: uom => <span className="line-clamp-2">{uom.description}</span>,
  },
  {
    key: "is_active",
    header: "Active Status",
    className: "whitespace-nowrap py-6",
    render: uom => <UOMStatusBadge isActive={uom.is_active} />,
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: uom => <UOMActions uom={uom} />,
  },
];

function UOMActions({ uom }: { uom: UOM }) {
  const deleteMutation = useDeleteUOM();

  return (
    <TableActions
      viewDetailPath={`/uom/view/${uom.id}`}
      editPath={`/uom/edit/${uom.id}`}
      deleteHeading="Delete This UOM"
      deleteSubheading="Are you sure want to delete this unit of measurement? This action cannot be undone."
      deleteTooltip="Delete UOM"
      onDelete={() => deleteMutation.mutate(uom.id)}
    />
  );
}

// UOM Card Component
interface UOMCardProps {
  uom?: UOM;
}

export function UOMCard({ uom }: UOMCardProps) {
  const deleteMutation = useDeleteUOM();

  if (!uom) return null;

  return (
    <Card className="transition-transform hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="h-16 w-16 rounded-xl border-2 border-indigo-200 bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
              <Package className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0 flex-1">
              <Text.TitleSmall className="truncate">{uom.name}</Text.TitleSmall>
              <p className="text-sm text-muted-foreground mt-1">
                {uom.symbol} - {uom.uom_type}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <UOMStatusBadge isActive={uom.is_active} />
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 text-sm pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
              UOM Code:
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {uom.uom_code}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
              Type:
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {uom.uom_type}
            </span>
          </div>
        </div>

        {/* Description */}
        {uom.description && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {uom.description}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-0 pb-4">
        <TableActions
          viewDetailPath={`/uom/view/${uom.id}`}
          editPath={`/uom/edit/${uom.id}`}
          deleteHeading="Delete This Unit of Measurement"
          deleteSubheading="Are you sure want to delete this Unit of Measurement? This action cannot be undone."
          deleteTooltip="Delete UOM"
          onDelete={() => deleteMutation.mutate(uom.id)}
        />
      </CardFooter>
    </Card>
  );
}
