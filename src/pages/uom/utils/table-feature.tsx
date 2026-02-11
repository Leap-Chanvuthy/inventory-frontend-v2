import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { UOM } from "@/api/uom/uom.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Package, Hash, Layers, FileText } from "lucide-react";
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
      viewDetailPath={`/unit-of-measurement/view/${uom.id}`}
      editPath={`/unit-of-measurement/edit/${uom.id}`}
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
  hideActions?: boolean;
  interactive?: boolean;
}

export function UOMCard({
  uom,
  hideActions = false,
  interactive = true,
}: UOMCardProps) {
  const deleteMutation = useDeleteUOM();

  if (!uom) return null;

  return (
    <Card
      className={`h-full flex flex-col transition-shadow ${interactive ? "hover:shadow-md" : ""}`}
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-3 sm:gap-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="min-w-0 flex-1">
            <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
              {uom.name}
            </Text.Small>
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3 shrink-0 text-muted-foreground" />
              <Text.Small color="muted" overflow="ellipsis">
                {uom.uom_code}
              </Text.Small>
            </div>
          </div>
        </div>

        <UOMStatusBadge isActive={uom.is_active} />
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 space-y-2.5 sm:space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {uom.uom_type} ({uom.symbol})
          </Text.Small>
        </div>

        {uom.description && (
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <Text.Small color="muted" maxLines={2}>
              {uom.description}
            </Text.Small>
          </div>
        )}
      </CardContent>

      {!hideActions && (
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
      )}
    </Card>
  );
}
