import { useSingleRawMaterial } from "@/api/raw-materials/raw-material.query";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { HorizontalImageScroll } from "@/components/reusable/partials/horizontal-image-scroll";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RawMaterialPiechart } from "./charts/raw-material-piechart";
import { StockMovementsTable } from "./stock-movements-table";
import { ReorderDialog } from "./reorder-dialog";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { IconBadge } from "@/components/ui/icons-badge";
import { useDeleteRawMaterial } from "@/api/raw-materials/raw-material.mutation";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import UnexpectedError from "@/components/reusable/partials/error";

export function ViewRawMaterialForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSingleRawMaterial(Number(id));
  const deleteMutation = useDeleteRawMaterial();

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => navigate("/raw-materials"),
    });
  };

  if (isLoading) {
    return <DataCardLoading text="Loading raw material..." />;
  }

  if (isError) return <UnexpectedError kind="fetch" homeTo="/raw-materials" />;
  if (!data?.data) return <DataCardEmpty emptyText="Raw material not found." />;

  const { raw_material, current_qty_in_stock, total_count_by_movement_type } =
    data.data;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Text.TitleLarge className="truncate">
          {raw_material?.material_name} - {raw_material?.material_sku_code}
        </Text.TitleLarge>
        <HeaderActionButtons
          editPath={`/raw-materials/update/${id}`}
          showEdit={true}
          showDelete={true}
          onDelete={handleDelete}
          deleteHeading="Delete Raw Material"
          deleteSubheading={`Are you sure you want to delete "${raw_material?.material_name}"? This action cannot be undone.`}
          customUI={
            <ReorderDialog
              rawMaterialId={raw_material.id}
              materialName={raw_material.material_name}
            />
          }
        />
      </div>

      {/* Main Info Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Raw Material Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
            {/* Column 1 */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="name" variant="info" />
                  Material Name
                </p>
                <p className="font-medium">{raw_material.material_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="code" variant="primary" />
                  SKU Code
                </p>
                <p className="font-medium">{raw_material.material_sku_code}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="barcode" variant="primary" />
                  Barcode
                </p>
                <p className="font-medium">{raw_material.barcode || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="category" variant="warning" />
                  Category
                </p>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: raw_material.rm_category?.label_color
                      ? `${raw_material.rm_category.label_color}20`
                      : undefined,
                    borderColor:
                      raw_material.rm_category?.label_color || undefined,
                    color: raw_material.rm_category?.label_color || undefined,
                  }}
                >
                  {raw_material.rm_category?.category_name || "-"}
                </Badge>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="stock_up" variant="success" />
                  Current Stock
                </p>
                <p className="font-medium text-lg">
                  {current_qty_in_stock.toFixed(2)}{" "}
                  {raw_material.uom?.symbol || ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="stock_down" variant="warning" />
                  Minimum Stock Level
                </p>
                <p className="font-medium">
                  {raw_material.minimum_stock_level}{" "}
                  {raw_material.uom?.symbol || ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="unit" variant="info" />
                  Unit of Measure
                </p>
                <p className="font-medium">
                  {raw_material.uom?.name} ({raw_material.uom?.symbol})
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="expiry_date" variant="orange" />
                  Expiry Date
                </p>
                <p className="font-medium">
                  {raw_material.expiry_date
                    ? new Date(raw_material.expiry_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "-"}
                </p>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="supplier" />
                  Supplier
                </p>
                <p className="font-medium">
                  {raw_material.supplier?.official_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="warehouse" variant="indigo" />
                  Warehouse
                </p>
                <p className="font-medium">
                  {raw_material.warehouse?.warehouse_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="created_date" />
                  Created At
                </p>
                <p className="font-medium">
                  {new Date(raw_material.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {raw_material.description && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <IconBadge label="description" variant="info" />
                Description
              </p>
              <p className="font-medium">{raw_material.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart + Images - same row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {total_count_by_movement_type &&
          Object.keys(total_count_by_movement_type).length > 0 && (
            <RawMaterialPiechart data={total_count_by_movement_type} />
          )}

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <Text.TitleMedium className="mb-2">
            Raw Material Images
          </Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-4">
            {raw_material.material_name}
          </p>
          <HorizontalImageScroll
            images={raw_material.rm_images || []}
            imageWidth="450px"
            imageHeight="300px"
            gap="1.5rem"
            emptyMessage="No images available"
          />
        </div>
      </div>

      {/* Stock Movements Card */}
      {raw_material.rm_stock_movements &&
        raw_material.rm_stock_movements.length > 0 && (
          <StockMovementsTable
            movements={raw_material.rm_stock_movements}
            rawMaterialId={raw_material.id}
            materialName={raw_material.material_name}
            uom={raw_material.uom || null}
          />
        )}
    </div>
  );
}
