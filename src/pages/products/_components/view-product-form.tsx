import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductPnLDetailed, useSingleProduct } from "@/api/product/product.query";
import { useDeleteProduct } from "@/api/product/product.mutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconBadge } from "@/components/ui/icons-badge";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { Text } from "@/components/ui/text/app-text";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import UnexpectedError from "@/components/reusable/partials/error";
import { IconStatCard } from "@/components/reusable/partials/icon-stat-card";
import { formatDate } from "@/utils/date-format";
import {
  Package,
  Warehouse,
  Layers,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { ProductPnlCard } from "./product-pnl-card";
import { ProductMovementHistory } from "./movement/product-movement-history";
import { ReorderDialog } from "./reorder-dialog";
import { ScrapDialog } from "./scrap-dialog";
import { ProductBomCard } from "./product-bom-card";
import { ProductMovementChart } from "./movement/product-movement-chart";
import { ProductStockLotsTable } from "./stock-lots-table";

function Field({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

export function ViewProductForm() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();
  const { data, isLoading, isError, isFetching } = useSingleProduct(productId);
  const { data: pnlDetailResponse } = useProductPnLDetailed(productId);
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    deleteMutation.mutate(productId, {
      onSuccess: () => navigate("/products"),
    });
  };

  const detail = data?.data;
  const product = detail?.product;

  if (isLoading) {
    return <DataCardLoading text="Loading product..." />;
  }

  if (isError && !isFetching)
    return <UnexpectedError kind="fetch" homeTo="/products" />;

  if (!product) return <DataCardEmpty emptyText="Product not found." />;

  const isInternal = product.product_type === "INTERNAL_PRODUCED";
  const pricingLot = detail?.pricing_reference_lot ?? null;
  const stockStatus = detail?.product_stock_status;
  const pnl = pnlDetailResponse?.data;
  const totalCountByMovementType = detail?.total_count_by_movement_type;
  const saleMethod = String(product.sale_method || "FIFO").toUpperCase() === "LIFO" ? "LIFO" : "FIFO";

  const stockStatusStyle =
    stockStatus === "IN_STOCK"
      ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-950"
      : stockStatus === "LOW_STOCK"
        ? "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950"
        : "border-red-500 text-red-600 bg-red-50 dark:bg-red-950";

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Text.Medium bold>{product.product_name}</Text.Medium>
            <Badge
              variant="outline"
              className={
                isInternal
                  ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400"
                  : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400"
              }
            >
              {isInternal ? "Internal Produced" : "External Purchased"}
            </Badge>
            {stockStatus && (
              <Badge variant="outline" className={stockStatusStyle}>
                {stockStatus.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-mono tracking-wide">
            {product.product_sku_code}
          </p>
        </div>
        <HeaderActionButtons
          editPath={`/products/update/${id}`}
          showEdit
          showDelete
          onDelete={handleDelete}
          deleteHeading="Delete Product"
          deleteSubheading={`Are you sure you want to delete "${product.product_name}"? This action cannot be undone.`}
          customUI={
            <div className="flex items-center gap-2">
              <ReorderDialog
                productId={product.id}
                productName={product.product_name}
                productType={product.product_type}
                productRawMaterials={product.product_raw_materials}
                quantityType={product.base_uom?.category?.quantity_type}
              />
              <ScrapDialog
                productId={product.id}
                productName={product.product_name}
                quantityType={product.base_uom?.category?.quantity_type}
              />
            </div>
          }
        />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <IconStatCard
          icon={<Package className="h-5 w-5 text-blue-600" />}
          label="Current Stock"
          value={`${detail?.current_qty_in_stock ?? 0} ${product.base_uom?.symbol ?? ""}`}
          sub={
            product.base_uom?.category?.quantity_type
              ? `${product.base_uom?.name} (${product.base_uom.category.quantity_type} Type)`
              : product.base_uom?.name
          }
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
        <IconStatCard
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          label="Selling Price"
          value={
            pricingLot
              ? `$${Number(pricingLot.selling_unit_price_in_usd || 0).toLocaleString()}`
              : "—"
          }
          sub={
            pricingLot
              ? `៛${Number(pricingLot.selling_unit_price_in_riel || 0).toLocaleString()}`
              : undefined
          }
          iconBg="bg-green-50 dark:bg-green-950"
        />
        {isInternal ? (
          <IconStatCard
            icon={<Layers className="h-5 w-5 text-orange-600" />}
            label="BOM Materials"
            value={product.product_raw_materials?.length ?? 0}
            sub="raw materials used"
            iconBg="bg-orange-50 dark:bg-orange-950"
          />
        ) : (
          <IconStatCard
            icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
            label="Purchase Price"
            value={
              pricingLot?.purchase_unit_price_in_usd
                ? `$${Number(pricingLot.purchase_unit_price_in_usd).toLocaleString()}`
                : "—"
            }
            sub={
              pricingLot?.purchase_unit_price_in_riel
                ? `៛${Number(pricingLot.purchase_unit_price_in_riel).toLocaleString()}`
                : undefined
            }
            iconBg="bg-purple-50 dark:bg-purple-950"
          />
        )}
        <IconStatCard
          icon={<Warehouse className="h-5 w-5 text-indigo-600" />}
          label="Warehouse"
          value={product.warehouse?.warehouse_name ?? "—"}
          iconBg="bg-indigo-50 dark:bg-indigo-950"
        />
      </div>

      {product.base_uom?.category?.unit_of_measurements &&
        product.base_uom.category.unit_of_measurements.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">
                Product Quantity Based on UOM Conversion Factor
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Available stock is converted across all units in the{" "}
                <span className="font-medium">
                  {product.base_uom?.category?.name ?? "selected"}
                </span>{" "}
                category. The highlighted unit is the base UOM.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...product.base_uom.category.unit_of_measurements]
                  .sort((a, b) => {
                    const aIsBase = Number(a.id) === Number(product.base_uom?.id);
                    const bIsBase = Number(b.id) === Number(product.base_uom?.id);
                    if (aIsBase === bIsBase) {
                      return Number(b.conversion_factor || 0) - Number(a.conversion_factor || 0);
                    }
                    return aIsBase ? -1 : 1;
                  })
                  .map(unit => {
                    const conversionFactor = Number(unit.conversion_factor || 1);
                    const availableQty = Number(detail?.available_qty_in_stock ?? detail?.current_qty_in_stock ?? 0);
                    const equivalentQty = conversionFactor > 0 ? availableQty / conversionFactor : 0;
                    const isBase = Number(unit.id) === Number(product.base_uom?.id);

                    return (
                      <div key={unit.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">
                            {unit.name}
                            {unit.symbol ? ` (${unit.symbol})` : ""}
                          </p>
                          {isBase && (
                            <Badge variant="outline" className="border-blue-500 text-blue-600">
                              Base
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Conversion factor: {conversionFactor.toLocaleString()}
                        </p>
                        <p className="text-base font-semibold mt-2">
                          {equivalentQty.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 4,
                          })}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

      {/* ── Product Information ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-base">Product Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-5">
            <Field
              label={
                <>
                  <IconBadge label="name" variant="info" /> Product Name
                </>
              }
              value={product.product_name}
            />
            <Field
              label={
                <>
                  <IconBadge label="code" variant="primary" /> SKU Code
                </>
              }
              value={
                <span className="font-mono text-xs">
                  {product.product_sku_code}
                </span>
              }
            />
            <Field
              label={
                <>
                  <IconBadge label="barcode" variant="primary" /> Barcode
                </>
              }
              value={product.barcode || "—"}
            />
            <Field
              label={
                <>
                  <IconBadge label="category" variant="warning" /> Category
                </>
              }
              value={
                product.category ? (
                  <Link
                    to={`/categories/product-categories/view/${product.category.id}`}
                    className="inline-flex"
                  >
                    <Badge
                      variant="outline"
                      className="hover:underline"
                      style={
                        product.category?.label_color
                          ? {
                              backgroundColor: `${product.category.label_color}20`,
                              borderColor: product.category.label_color,
                              color: product.category.label_color,
                            }
                          : undefined
                      }
                    >
                      {product.category?.category_name || "—"}
                    </Badge>
                  </Link>
                ) : (
                  "—"
                )
              }
            />
            <Field
              label={
                <>
                  <IconBadge label="unit" variant="info" /> Base Unit
                </>
              }
              value={
                product.base_uom ? (
                  <Link
                    to={`/unit-of-measurement/view/${product.base_uom.id}`}
                    className="text-primary hover:underline"
                  >
                    {product.base_uom.name} ({product.base_uom.symbol})
                  </Link>
                ) : (
                  "—"
                )
              }
            />
            <Field
              label={
                <>
                  <IconBadge label="warehouse" variant="indigo" /> Warehouse
                </>
              }
              value={
                product.warehouse ? (
                  <Link
                    to={`/warehouses/view/${product.warehouse.id}`}
                    className="text-primary hover:underline"
                  >
                    {product.warehouse.warehouse_name}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
            {!isInternal && (
              <Field
                label={
                  <>
                    <IconBadge label="supplier" /> Supplier
                  </>
                }
                value={
                  product.supplier ? (
                    <Link
                      to={`/supplier/view/${product.supplier.id}`}
                      className="text-primary hover:underline"
                    >
                      {product.supplier.official_name}
                    </Link>
                  ) : (
                    "—"
                  )
                }
              />
            )}
            {pricingLot?.movement_date && (
              <Field
                label={
                  <>
                    <IconBadge label="expiry_date" variant="orange" /> Pricing
                    Lot Date
                  </>
                }
                value={formatDate(pricingLot.movement_date)}
              />
            )}
            <Field
              label={
                <>
                  <IconBadge label="created_date" /> Created At
                </>
              }
              value={formatDate(product.created_at)}
            />
          </div>

          {product.product_description && (
            <>
              <Separator />
              <Field
                label={
                  <>
                    <IconBadge label="description" variant="info" /> Description
                  </>
                }
                value={
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {product.product_description}
                  </p>
                }
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Chart & PnL row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductMovementChart data={totalCountByMovementType ?? {}} />
        {pnl && <ProductPnlCard pnl={pnl} />}
      </div>

      <ProductStockLotsTable productId={product.id} saleMethod={saleMethod} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Product Images</CardTitle>
            <Badge variant="outline">
              Total: {(product.product_images || []).length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {(product.product_images || []).length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
              No product images uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(product.product_images || []).map(image => (
                <div
                  key={image.id}
                  className="rounded-lg border overflow-hidden bg-card"
                >
                  <div className="relative h-40 bg-muted/30">
                    <img
                      src={image.image}
                      alt={`product-${image.id}`}
                      className="w-full h-full object-cover"
                    />
                    {image.is_primary && (
                      <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-500 text-white border-0">
                        Primary
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── BOM & Movement History row ── */}
      {/* <div
        className={isInternal ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}
      > */}
        {/* Bill of Materials (internal only) */}
        {isInternal && (
          <ProductBomCard
            productId={product.id}
            rawMaterials={product.product_raw_materials}
          />
        )}

        {/* Movement History */}
        <ProductMovementHistory
          productId={product.id}
          productType={product.product_type}
        />
      {/* </div> */}
    </div>
  );
}
