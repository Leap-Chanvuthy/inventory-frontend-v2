import { useSingleRawMaterial } from "@/api/raw-materials/raw-material.query";
import { useNavigate, useParams } from "react-router-dom";
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
import { UomHierarchyPreview } from "./uom-hierarchy-preview";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Warehouse,
  Scale,
  TrendingDown,
  CalendarClock,
  Factory,
  BoxesIcon,
  ImageIcon,
} from "lucide-react";
import {
  StockStatusBadge,
  StatCard,
  InfoField,
} from "../utils/raw-material-detail-utils";

export function ViewRawMaterialForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, isFetching } = useSingleRawMaterial(
    Number(id),
  );
  const deleteMutation = useDeleteRawMaterial();

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => navigate("/raw-materials"),
    });
  };

  if (isLoading) return <DataCardLoading text="Loading raw material..." />;
  if (isError && !isFetching)
    return <UnexpectedError kind="fetch" homeTo="/raw-materials" />;
  if (!data?.data) return <DataCardEmpty emptyText="Raw material not found." />;

  const { raw_material, current_qty_in_stock, total_count_by_movement_type } =
    data.data;

  const uomLabel = raw_material.uom?.symbol || raw_material.uom?.name || "";
  const totalMovements = total_count_by_movement_type
    ? Object.values(total_count_by_movement_type).reduce((a, b) => a + b, 0)
    : 0;
  const heroImage = raw_material.rm_images?.[0]?.image ?? null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* 1. Profile Hero */}
      <div className="relative rounded-2xl border bg-gradient-to-br from-primary/5 via-muted/20 to-background overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-start gap-5">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="h-20 w-20 md:h-[88px] md:w-[88px] rounded-2xl border-2 border-background shadow-md overflow-hidden bg-primary/10 flex items-center justify-center">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={raw_material.material_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <IconBadge label="image" size={36} />
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div>
              <Text.TitleLarge className="leading-tight truncate">
                {raw_material.material_name}
              </Text.TitleLarge>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground font-mono bg-muted/60 border px-2 py-0.5 rounded-md">
                  {raw_material.material_sku_code}
                </span>
                {raw_material.rm_category && (
                  <Badge
                    variant="outline"
                    className="shadow-none"
                    style={{
                      backgroundColor: raw_material.rm_category.label_color
                        ? `${raw_material.rm_category.label_color}20`
                        : undefined,
                      borderColor:
                        raw_material.rm_category.label_color || undefined,
                      color: raw_material.rm_category.label_color || undefined,
                    }}
                  >
                    {raw_material.rm_category.category_name}
                  </Badge>
                )}
                <StockStatusBadge
                  current={current_qty_in_stock}
                  minimum={raw_material.minimum_stock_level}
                />
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Quick-info row */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {raw_material.supplier?.official_name && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <IconBadge label="supplier" size={14} />
                  {raw_material.supplier.official_name}
                </span>
              )}
              {raw_material.warehouse?.warehouse_name && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Warehouse className="w-3.5 h-3.5 shrink-0" />
                  {raw_material.warehouse.warehouse_name}
                </span>
              )}
              {raw_material.uom && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Scale className="w-3.5 h-3.5 shrink-0" />
                  {raw_material.uom.name} ({raw_material.uom.symbol})
                </span>
              )}
              {raw_material.production_method && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Factory className="w-3.5 h-3.5 shrink-0" />
                  {raw_material.production_method}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ReorderDialog
              rawMaterialId={raw_material.id}
              materialName={raw_material.material_name}
            />
            <HeaderActionButtons
              editPath={`/raw-materials/update/${id}`}
              showEdit={true}
              showDelete={true}
              onDelete={handleDelete}
              deleteHeading="Delete Raw Material"
              deleteSubheading={`Are you sure you want to delete "${raw_material?.material_name}"? This action cannot be undone.`}
            />
          </div>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BoxesIcon className="w-4 h-4 text-emerald-500" />}
          iconBg="bg-emerald-500/10"
          label="Current Stock"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-lg">
              {current_qty_in_stock.toFixed(2)} {uomLabel}
            </Text.Small>
          }
          sub="quantity in stock"
        />
        <StatCard
          icon={<TrendingDown className="w-4 h-4 text-amber-500" />}
          iconBg="bg-amber-500/10"
          label="Minimum Stock"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-lg">
              {raw_material.minimum_stock_level} {uomLabel}
            </Text.Small>
          }
          sub="reorder threshold"
        />
        <StatCard
          icon={<Package className="w-4 h-4 text-blue-500" />}
          iconBg="bg-blue-500/10"
          label="Total Movements"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-lg">
              {totalMovements}
            </Text.Small>
          }
          sub="stock movements recorded"
        />
        <StatCard
          icon={<CalendarClock className="w-4 h-4 text-rose-500" />}
          iconBg="bg-rose-500/10"
          label="Expiry Date"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-base">
              {raw_material.expiry_date
                ? new Date(raw_material.expiry_date).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short", day: "numeric" },
                  )
                : "—"}
            </Text.Small>
          }
          sub={raw_material.expiry_date ? "expiration date" : "no expiry set"}
        />
      </div>

      {/* 3. Pie Chart + Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {total_count_by_movement_type &&
          Object.keys(total_count_by_movement_type).length > 0 && (
            <RawMaterialPiechart data={total_count_by_movement_type} />
          )}

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              Material Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalImageScroll
              images={raw_material.rm_images || []}
              imageWidth="450px"
              imageHeight="260px"
              gap="1.5rem"
              emptyMessage="No images available"
            />
          </CardContent>
        </Card>
      </div>

      {/* 4. Material Details + Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Material Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <InfoField
                icon="name"
                label="Material Name"
                value={raw_material.material_name}
                variant="info"
              />
              <InfoField
                icon="code"
                label="SKU Code"
                value={raw_material.material_sku_code}
                variant="primary"
              />
              <InfoField
                icon="barcode"
                label="Barcode"
                value={raw_material.barcode}
                variant="primary"
              />
              <InfoField
                icon="category"
                label="Category"
                value={raw_material.rm_category?.category_name}
                variant="warning"
              />
              <InfoField
                icon="supplier"
                label="Supplier"
                value={raw_material.supplier?.official_name}
              />
              <InfoField
                icon="warehouse"
                label="Warehouse"
                value={raw_material.warehouse?.warehouse_name}
                variant="indigo"
              />
            </div>
            {raw_material.description && (
              <div className="mt-6 pt-6 border-t space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <IconBadge label="description" variant="info" size={14} />
                  Description
                </p>
                <p className="text-sm font-medium leading-relaxed">
                  {raw_material.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <InfoField
              icon="unit"
              label="Unit of Measure"
              value={
                raw_material.uom
                  ? `${raw_material.uom.name} (${raw_material.uom.symbol})`
                  : undefined
              }
              variant="info"
            />
            {raw_material.production_method && (
              <InfoField
                icon="description"
                label="Production Method"
                value={raw_material.production_method}
              />
            )}
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Created
              </p>
              <p className="text-sm font-medium">
                {new Date(raw_material.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Last Updated
              </p>
              <p className="text-sm font-medium">
                {new Date(raw_material.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. UOM Hierarchy */}
      {raw_material.uom?.category_id && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              Unit of Measurement Hierarchy
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              All units in the{" "}
              <span className="font-medium">
                {raw_material.uom?.category?.name ?? "selected"}
              </span>{" "}
              category. The highlighted unit is assigned to this raw material.
            </p>
          </CardHeader>
          <CardContent>
            <UomHierarchyPreview
              categoryId={raw_material.uom.category_id}
              highlightUomId={raw_material.base_uom_id}
            />
          </CardContent>
        </Card>
      )}

      {/* 6. Stock Movements */}
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
