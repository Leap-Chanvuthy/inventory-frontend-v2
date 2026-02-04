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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RawMaterialBarchart } from "./charts/raw-material-barchart";
import { RawMaterialAreachart } from "./charts/raw-material-areachart";

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

  const { raw_material, current_qty_in_stock, raw_material_status } = data.data;

  // Prepare bar chart data - group by movement type with in/out quantities
  const movementTypeData = (() => {
    const movements = raw_material.rm_stock_movements;
    if (!movements?.length) return [];

    const typeData: Record<string, { in: number; out: number }> = {};

    movements.forEach(movement => {
      const type = movement.movement_type.replace(/_/g, " ");
      if (!typeData[type]) {
        typeData[type] = { in: 0, out: 0 };
      }
      if (movement.direction === "IN") {
        typeData[type].in += movement.quantity;
      } else {
        typeData[type].out += movement.quantity;
      }
    });

    return Object.entries(typeData).map(([type, values]) => ({
      type,
      in: Number(values.in.toFixed(2)),
      out: Number(values.out.toFixed(2)),
    }));
  })();

  // Prepare area chart data - calculate running stock over time
  const stockMovementTimeData = (() => {
    const movements = raw_material.rm_stock_movements;
    if (!movements?.length) return [];

    const sortedMovements = [...movements].sort(
      (a, b) =>
        new Date(a.movement_date).getTime() -
        new Date(b.movement_date).getTime(),
    );

    // Calculate backwards from current stock
    const totalMovements = sortedMovements.reduce((sum, movement) => {
      return (
        sum +
        (movement.direction === "IN" ? movement.quantity : -movement.quantity)
      );
    }, 0);

    // Starting stock = current stock - all movements
    let runningStock = current_qty_in_stock - totalMovements;

    return sortedMovements.map(movement => {
      runningStock +=
        movement.direction === "IN" ? movement.quantity : -movement.quantity;
      return {
        date: new Date(movement.movement_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        quantity: Number(runningStock.toFixed(2)),
      };
    });
  })();

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      IN_STOCK: {
        label: "In Stock",
        className: "bg-green-500/10 text-green-600 dark:text-green-400",
      },
      LOW_STOCK: {
        label: "Low Stock",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      OUT_OF_STOCK: {
        label: "Out of Stock",
        className: "bg-red-500/10 text-red-600 dark:text-red-400",
      },
    };
    return statusMap[status] || statusMap["IN_STOCK"];
  };

  const statusInfo = getStatusBadge(raw_material_status);

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Text.TitleLarge className="mb-2">
            {raw_material.material_name}
          </Text.TitleLarge>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{raw_material.material_sku_code}</Badge>
            <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Raw Material Information</CardTitle>
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

      {/* Charts Section */}
      {raw_material.rm_stock_movements &&
        raw_material.rm_stock_movements.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RawMaterialBarchart data={movementTypeData} />
            <RawMaterialAreachart data={stockMovementTimeData} />
          </div>
        )}

      {/* Images Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Raw Material Images</CardTitle>
        </CardHeader>
        <CardContent>
          <HorizontalImageScroll
            images={raw_material.rm_images || []}
            imageWidth="150px"
            imageHeight="100px"
            gap="1.5rem"
            emptyMessage="No images available"
          />
        </CardContent>
      </Card>

      {/* Stock Movements Card */}
      {raw_material.rm_stock_movements &&
        raw_material.rm_stock_movements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">
                      Unit Price (USD)
                    </TableHead>
                    <TableHead className="text-right">Total (USD)</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {raw_material.rm_stock_movements.map(movement => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.movement_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {movement.movement_type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            movement.direction === "IN"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }
                        >
                          {movement.direction}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {movement.quantity.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${movement.unit_price_in_usd.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${movement.total_value_in_usd.toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {movement.note || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
