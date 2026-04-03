import { useNavigate, useParams } from "react-router-dom";
import { useSingleProduct } from "@/api/product/product.query";
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
import { HorizontalImageScroll } from "@/components/reusable/partials/horizontal-image-scroll";
import { IconStatCard } from "@/components/reusable/partials/icon-stat-card";
import { formatDate } from "@/utils/date-format";
import {
  Package,
  Warehouse,
  Layers,
  DollarSign,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Hash,
} from "lucide-react";

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
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSingleProduct(Number(id));
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => navigate("/products"),
    });
  };

  if (isLoading) return <DataCardLoading text="Loading product..." />;
  if (isError) return <UnexpectedError kind="fetch" homeTo="/products" />;

  const detail = data?.data;
  const product = detail?.product;
  if (!product) return <DataCardEmpty emptyText="Product not found." />;

  const isInternal = product.product_type === "INTERNAL_PRODUCED";
  const movement = product.product_movements?.[0];
  const stockStatus = detail?.product_stock_status;

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
            <Badge variant={isInternal ? "default" : "secondary"}>
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
        />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <IconStatCard
          icon={<Package className="h-5 w-5 text-blue-600" />}
          label="Current Stock"
          value={`${detail?.current_qty_in_stock ?? 0} ${product.base_uom?.symbol ?? ""}`}
          sub={product.base_uom?.name}
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
        <IconStatCard
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          label="Selling Price"
          value={
            movement
              ? `$${movement.selling_unit_price_in_usd.toLocaleString()}`
              : "—"
          }
          sub={
            movement
              ? `៛${movement.selling_unit_price_in_riel.toLocaleString()}`
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
              movement?.purchase_unit_price_in_usd
                ? `$${movement.purchase_unit_price_in_usd.toLocaleString()}`
                : "—"
            }
            sub={
              movement?.purchase_unit_price_in_riel
                ? `៛${movement.purchase_unit_price_in_riel.toLocaleString()}`
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

      {/* ── Product Information & Images row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
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
                  <Badge
                    variant="outline"
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
                }
              />
              <Field
                label={
                  <>
                    <IconBadge label="unit" variant="info" /> Base Unit
                  </>
                }
                value={
                  product.base_uom
                    ? `${product.base_uom.name} (${product.base_uom.symbol})`
                    : "—"
                }
              />
              <Field
                label={
                  <>
                    <IconBadge label="warehouse" variant="indigo" /> Warehouse
                  </>
                }
                value={product.warehouse?.warehouse_name || "—"}
              />
              {!isInternal && (
                <Field
                  label={
                    <>
                      <IconBadge label="supplier" /> Supplier
                    </>
                  }
                  value={product.supplier?.official_name || "—"}
                />
              )}
              {movement && (
                <Field
                  label={
                    <>
                      <IconBadge label="expiry_date" variant="orange" />{" "}
                      Movement Date
                    </>
                  }
                  value={formatDate(movement.movement_date)}
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
                      <IconBadge label="description" variant="info" />{" "}
                      Description
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

        {/* ── Images ── */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950">
                <Package className="h-4 w-4 text-pink-600" />
              </div>
              <CardTitle className="text-base">Product Images</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <HorizontalImageScroll
              images={product.product_images || []}
              imageWidth="380px"
              imageHeight="240px"
              gap="1rem"
              emptyMessage="No images available"
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Warehouse & Supplier detail row ── */}

      {/* ── BOM & Movements row ── */}
      <div
        className={isInternal ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}
      >
        {/* Bill of Materials */}
        {isInternal && (product.product_raw_materials?.length ?? 0) > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <Layers className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Bill of Materials</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Raw materials used to produce this product
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-10">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                        Material Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                        SKU Code
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                        Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.product_raw_materials!.map((rm, idx) => (
                      <tr
                        key={rm.id}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {rm.raw_material?.material_name || "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {rm.raw_material?.material_sku_code || "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {parseFloat(rm.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Movement History */}
        {(product.product_movements?.length ?? 0) > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950">
                  <Hash className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Movement History</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Stock in/out records
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {[
                        "Type",
                        "Dir",
                        "Qty",
                        "Sell (USD)",
                        "Status",
                        "Date",
                        "By",
                      ].map(h => (
                        <th
                          key={h}
                          className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.product_movements!.map(mv => (
                      <tr
                        key={mv.id}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-3 py-3">
                          <Badge
                            variant="outline"
                            className="text-xs whitespace-nowrap"
                          >
                            {mv.movement_type.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${mv.direction === "IN" ? "text-green-600" : "text-red-600"}`}
                          >
                            {mv.direction === "IN" ? (
                              <ArrowDownToLine className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpFromLine className="h-3.5 w-3.5" />
                            )}
                            {mv.direction}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-semibold">
                          {parseFloat(mv.quantity).toFixed(2)}
                        </td>
                        <td className="px-3 py-3">
                          ${mv.selling_unit_price_in_usd.toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          <Badge
                            variant="outline"
                            className={
                              mv.product_status === "COMPLETED"
                                ? "border-green-500 text-green-600 text-xs"
                                : "text-xs"
                            }
                          >
                            {mv.product_status}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(mv.movement_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {mv.created_by?.name || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
