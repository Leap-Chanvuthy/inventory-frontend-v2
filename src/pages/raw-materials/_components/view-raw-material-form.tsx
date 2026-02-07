import { useSingleRawMaterial } from "@/api/raw-materials/raw-material.query";
import { useParams } from "react-router-dom";
import {
  Package,
  Calendar,
  Barcode,
  Warehouse,
  User,
  Ruler,
  Tag,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HorizontalImageScroll } from "@/components/reusable/partials/horizontal-image-scroll";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RawMaterialPiechart } from "./charts/raw-material-piechart";
import { StockMovementsTable } from "./stock-movements-table";
import { ReorderDialog } from "./reorder-dialog";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";

export function ViewRawMaterialForm() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSingleRawMaterial(Number(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">
            Loading raw material details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Failed to load raw material details</p>
        </div>
      </div>
    );
  }

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
                />
              </div>

      {/* Main Info Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Raw Material Information</CardTitle>
          <ReorderDialog
            rawMaterialId={raw_material.id}
            materialName={raw_material.material_name}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
            {/* Column 1 */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Material Name
                </p>
                <p className="font-medium">{raw_material.material_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Barcode className="h-4 w-4" />
                  SKU Code
                </p>
                <p className="font-medium">{raw_material.material_sku_code}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Barcode className="h-4 w-4" />
                  Barcode
                </p>
                <p className="font-medium">{raw_material.barcode || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
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
                  <TrendingUp className="h-4 w-4" />
                  Current Stock
                </p>
                <p className="font-medium text-lg">
                  {current_qty_in_stock.toFixed(2)}{" "}
                  {raw_material.uom?.symbol || ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Minimum Stock Level
                </p>
                <p className="font-medium">
                  {raw_material.minimum_stock_level}{" "}
                  {raw_material.uom?.symbol || ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Unit of Measure
                </p>
                <p className="font-medium">
                  {raw_material.uom?.name} ({raw_material.uom?.symbol})
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
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
                  <User className="h-4 w-4" />
                  Supplier
                </p>
                <p className="font-medium">
                  {raw_material.supplier?.official_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Warehouse className="h-4 w-4" />
                  Warehouse
                </p>
                <p className="font-medium">
                  {raw_material.warehouse?.warehouse_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
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
                <FileText className="h-4 w-4" />
                Description
              </p>
              <p className="font-medium">{raw_material.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Charts Section
      {raw_material.rm_stock_movements &&
        raw_material.rm_stock_movements.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <RawMaterialBarchart data={movementTypeData} />
              <RawMaterialAreachart data={stockMovementTimeData} />
            </div>
          </>
        )} */}
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
          <StockMovementsTable movements={raw_material.rm_stock_movements} />
        )}
    </div>
  );
}
