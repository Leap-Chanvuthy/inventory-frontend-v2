import { formatDate } from "@/utils/date-format";
import { UOMStatusBadge } from "../utils/uom-status";
import { useSingleUOM } from "@/api/uom/uom.query";
import { useDeleteUOM } from "@/api/uom/uom.mutation";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { Text } from "@/components/ui/text/app-text";

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
    <div>
      {/* Title and Actions */}
      <div className="mx-6 mb-6 flex items-center justify-between">
        <Text.TitleLarge>
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

      {/* Main Content */}
      <div>
        <div className="rounded-2xl shadow-sm border p-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Unit Information */}
            <div>
              <Text.TitleMedium className="mb-6">
                Unit Information
              </Text.TitleMedium>

              <div className="space-y-8">
                {/* Unit Name, Symbol, and Status - Horizontal */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Unit Name
                    </p>
                    <p className="text-xl font-semibold">{uom.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Symbol</p>
                    <p className="text-xl font-semibold">{uom.symbol || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <UOMStatusBadge isActive={uom.is_active} />
                  </div>
                </div>

                {/* Created At and Updated At */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Created At
                    </p>
                    <p className="font-medium">
                      {formatDate(uom.created_at, "MMM dd, yyyy, h:mm a")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Updated At
                    </p>
                    <p className="font-medium">
                      {formatDate(uom.updated_at, "MMM dd, yyyy, h:mm a")}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Description
                  </p>
                  <p className="text-sm leading-relaxed">
                    {uom.description ||
                      "No description provided for this unit of measurement."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Distribution Chart */}
            <div>
              <Text.TitleMedium className="mb-6">
                Distribution of Unit of Measurement
              </Text.TitleMedium>

              {/* Placeholder for Pie Chart */}
              <div className="flex items-center justify-center h-[300px] bg-muted/30 rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground">Chart Placeholder</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Distribution chart will be displayed here
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-700"></div>
                  <span className="text-sm">Total Raw Material</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-400"></div>
                  <span className="text-sm">Total Of Final Product</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getUOMBreadcrumbLabel = (uom: {
  name: string;
  symbol?: string;
}) => {
  return `${uom.name}${uom.symbol ? ` | ${uom.symbol}` : ""}`;
};
