import { formatDate } from "@/utils/date-format";
import { UOMStatusBadge } from "../utils/uom-status";
import { useSingleUOM } from "@/api/uom/uom.query";
import { useDeleteUOM } from "@/api/uom/uom.mutation";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { Text } from "@/components/ui/text/app-text";
import { PieChart, BoxIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icons-badge";

interface ViewUOMProps {
  id: number;
}

export const ViewUOM = ({ id }: ViewUOMProps) => {
  const { data, isLoading, isError, error } = useSingleUOM(id);
  const deleteMutation = useDeleteUOM();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading UOM details...</p>
      </div>
    );
  }

  if (isError || !data) {
    console.error("Error loading UOM:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load UOM details</p>
          <p className="text-sm text-muted-foreground">
            {error?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Handle different response structures
  const uom = data?.data || data;

  if (!uom || !uom.id) {
    console.error("Invalid UOM data:", data);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Invalid UOM data</p>
          <p className="text-sm text-muted-foreground">
            The UOM data is not in the expected format
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Text.TitleLarge className="truncate">
          {uom.name}
          {uom.symbol ? ` | ${uom.symbol}` : ""}
        </Text.TitleLarge>
        <HeaderActionButtons
          editPath={`/uom/edit/${uom.id}`}
          onDelete={() => deleteMutation.mutate(uom.id)}
          deleteHeading="Delete This UOM"
          deleteSubheading="Are you sure you want to delete this unit of measurement? This action cannot be undone."
        />
      </div>

      {/* Main Content - Side by Side */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Section - Unit Information */}
            <div className="p-6 sm:p-8">
              <CardTitle className="mb-6">Unit Information</CardTitle>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <IconBadge label="name" variant="info" />
                    Unit Name
                  </p>
                  <p className="font-medium">{uom.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <IconBadge label="symbol" variant="primary" />
                    Symbol
                  </p>
                  <p className="font-medium">{uom.symbol || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <IconBadge label="status" variant="success" />
                    Status
                  </p>
                  <UOMStatusBadge isActive={uom.is_active} />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <IconBadge label="code" variant="warning" />
                    UOM Code
                  </p>
                  <p className="font-medium">{uom.uom_code || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <IconBadge label="type" variant="cyan" />
                    UOM Type
                  </p>
                  <p className="font-medium">{uom.uom_type || "-"}</p>
                </div>
              </div>

              {/* Created At and Updated At - Same Row */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-5 mt-5">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <IconBadge label="created_date" />
                    Created At
                  </p>
                  <p className="font-medium">
                    {formatDate(uom.created_at, "MMM dd, yyyy, h:mm a")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <IconBadge label="updated_date" />
                    Updated At
                  </p>
                  <p className="font-medium">
                    {formatDate(uom.updated_at, "MMM dd, yyyy, h:mm a")}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="description" variant="info" />
                  Description
                </p>
                <p className="font-medium leading-relaxed">
                  {uom.description ||
                    "No description provided for this unit of measurement."}
                </p>
              </div>
            </div>

            {/* Right Section - Distribution Chart */}
            <div className="p-6 sm:p-8 border-t lg:border-t-0 lg:border-l">
              <CardTitle className="mb-6 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-muted-foreground" />
                Distribution of Unit of Measurement
              </CardTitle>

              <div className="flex items-center justify-center h-[280px] bg-muted/20 rounded-lg border border-dashed border-muted-foreground/25">
                <div className="text-center">
                  <BoxIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Chart Placeholder
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Distribution chart will be displayed here
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                  <span className="text-sm text-muted-foreground">
                    Total Raw Material
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                  <span className="text-sm text-muted-foreground">
                    Total Of Final Product
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const getUOMBreadcrumbLabel = (uom: {
  name: string;
  symbol?: string;
}) => {
  return `${uom.name}${uom.symbol ? ` | ${uom.symbol}` : ""}`;
};
