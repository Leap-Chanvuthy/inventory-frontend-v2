import { useSingleUomCategory } from "@/api/uom/uom.query";
import { useDeleteUomCategory } from "@/api/uom/uom.mutation";
import { useUOMs } from "@/api/uom/uom.query";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import { UomHierarchyView } from "../../uom/_components/uom-hierarchy-view";
import { formatDate } from "@/utils/date-format";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

interface ViewCategoryProps {
  id: number;
}

export const ViewCategory = ({ id }: ViewCategoryProps) => {
  const { data, isLoading, isError } = useSingleUomCategory(id);
  const deleteMutation = useDeleteUomCategory();

  // Load all UOMs in this category for hierarchy view
  const { data: uomsData } = useUOMs({
    "filter[category_id]": id,
    per_page: 200,
  });
  const uoms = uomsData?.data ?? [];

  if (isLoading) return <DataCardLoading text="Loading category details..." />;

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load category</p>
      </div>
    );
  }

  const category = data.data;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
            <Layers className="h-5 w-5 text-violet-600" />
          </div>
          <Text.TitleLarge>{category.name}</Text.TitleLarge>
        </div>
        <HeaderActionButtons
          editPath={`/unit-of-measurement/categories/edit/${category.id}`}
          onDelete={() => deleteMutation.mutate(category.id)}
          deleteHeading="Delete This Category"
          deleteSubheading="Are you sure you want to delete this category? All units in this category will lose their category association."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Details */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 space-y-5">
            <CardTitle className="mb-4">Category Info</CardTitle>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Name
              </p>
              <p className="text-sm font-medium">{category.name}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm text-muted-foreground">
                {category.description ?? (
                  <span className="italic">No description</span>
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Total Units
              </p>
              <Badge variant="outline" className="font-mono">
                {category.units_count ?? uoms.length}
              </Badge>
            </div>

            {category.base_unit && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Base Unit
                </p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {category.base_unit.name}
                  {category.base_unit.symbol
                    ? ` (${category.base_unit.symbol})`
                    : ""}
                </Badge>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Created
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(category.created_at)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right: Hierarchy */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <CardTitle className="mb-4">Unit Hierarchy</CardTitle>
            {uoms.length > 0 ? (
              <UomHierarchyView uoms={uoms} />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No units in this category yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
