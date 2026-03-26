import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Package, ChevronRight } from "lucide-react";
import { useRawMaterials } from "@/api/raw-materials/raw-material.query";
import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { useRawMaterialCategories } from "@/api/categories/raw-material-categories/raw-material-catergory.query";

import {
  useCreateExternalPurchase,
  useCreateInternalManufacturing,
} from "@/api/product/product.mutation";
import {
  ProductValidationErrors,
  InsufficientStockError,
} from "@/api/product/product.type";
import { AxiosError } from "axios";

import {
  fetchProductCategories,
  fetchSuppliers,
  fetchWarehouses,
  fetchUomCategories,
} from "../utils/fetch-select-options";
import { DataSelectionModal } from "@/components/reusable/data-modal/data-selection-modal";
import { RM_COLUMNS } from "../utils/raw-material-table-feature";
import { useSingleProductCategory } from "@/api/categories/product-categories/product-category.query";
import { useSingleUomCategory } from "@/api/uom/uom.query";

import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";
import {
  TextInput,
  TextAreaInput,
  DatePickerInput,
  SelectInput,
} from "@/components/reusable/partials/input";
import { SearchableSelect } from "@/components/reusable/partials/searchable-select";
import { Text } from "@/components/ui/text/app-text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BOMEntry = { raw_material: RawMaterial; quantity: number };
type SourceType = "external" | "internal";

const PRODUCT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "WORK_IN_PROGRESS", label: "Work In Progress" },
  { value: "PARTIALLY_COMPLETED", label: "Partially Completed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "BLOCKED", label: "Blocked" },
];

const initialBaseForm = {
  product_name: "",
  barcode: "",
  product_description: "",
  product_category_id: "",
  uom_category_id: "",
  base_uom_id: "",
  supplier_id: "",
  warehouse_id: "",
  movement_date: "",
  note: "",
  images: [] as File[],
};

const initialExternalForm = {
  quantity: "",
  purchase_unit_price_in_usd: "",
  exchange_rate_from_usd_to_riel: "4100",
  selling_unit_price_in_usd: "",
  selling_exchange_rate_from_usd_to_riel: "4100",
};

const initialInternalForm = {
  product_status: "COMPLETED",
  quantity: "",
  selling_unit_price_in_usd: "",
  selling_exchange_rate_from_usd_to_riel: "4100",
};

/* ─── Section Header ─────────────────────────────────── */
function SectionHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <Text.TitleSmall>{title}</Text.TitleSmall>
        {badge}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export const CreateProductForm = () => {
  const navigate = useNavigate();
  const externalMutation = useCreateExternalPurchase();
  const internalMutation = useCreateInternalManufacturing();

  const [sourceType, setSourceType] = useState<SourceType>("internal");

  const activeMutation =
    sourceType === "external" ? externalMutation : internalMutation;
  const responseErrors = (
    activeMutation.error as AxiosError<ProductValidationErrors> | null
  )?.response?.data?.errors;
  const fieldErrors = Array.isArray(responseErrors)
    ? undefined
    : responseErrors;
  const stockErrors = Array.isArray(responseErrors)
    ? (responseErrors as InsufficientStockError[])
    : undefined;

  const [base, setBase] = useState(initialBaseForm);
  const [external, setExternal] = useState(initialExternalForm);
  const [internal, setInternal] = useState(initialInternalForm);
  const [bomEntries, setBomEntries] = useState<BOMEntry[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [rmSearch, setRmSearch] = useState("");
  const [rmPage, setRmPage] = useState(1);
  const [rmSort, setRmSort] = useState("-created_at");
  const [rmCategoryFilter, setRmCategoryFilter] = useState<string | undefined>(
    undefined,
  );

  const { data: rmCategoriesData } = useRawMaterialCategories({
    per_page: 100,
  });
  const rmFilterOptions =
    rmCategoriesData?.data?.data?.map(c => ({
      label: c.category_name,
      value: String(c.id),
    })) ?? [];

  const { data: rmData, isLoading: rmLoading } = useRawMaterials({
    page: rmPage,
    per_page: 5,
    "filter[search]": rmSearch || undefined,
    "filter[raw_material_category_id]": rmCategoryFilter
      ? Number(rmCategoryFilter)
      : undefined,
    sort: rmSort,
  });

  const { data: selectedCategoryData } = useSingleProductCategory(
    Number(base.product_category_id),
  );
  const selectedCategory = selectedCategoryData?.data ?? null;

  const { data: selectedUomCategoryData } = useSingleUomCategory(
    Number(base.uom_category_id),
  );
  useEffect(() => {
    const raw = selectedUomCategoryData?.data?.base_unit;
    const baseUnit = Array.isArray(raw) ? raw[0] : raw;
    if (baseUnit?.id) {
      setBase(prev => ({ ...prev, base_uom_id: String(baseUnit.id) }));
    }
  }, [selectedUomCategoryData]);

  const uomCatData = selectedUomCategoryData?.data;
  const rawBase = uomCatData?.base_unit;
  const uomBaseUnit = Array.isArray(rawBase) ? rawBase[0] : rawBase;
  const uomSelectedLabel = uomCatData
    ? uomBaseUnit
      ? `${uomCatData.name} | ${uomBaseUnit.name}${uomBaseUnit.symbol ? ` (${uomBaseUnit.symbol})` : ""} [Base Unit]`
      : uomCatData.name
    : undefined;

  const handleBaseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBase(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSourceChange =
    (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter((prev: any) => ({ ...prev, [e.target.id]: e.target.value }));
    };

  const handleBaseSelect = (field: string) => (value: string) => {
    setBase(prev => ({ ...prev, [field]: value }));
  };

  const updateBOMQty = (id: number, val: string) => {
    setBomEntries(prev =>
      prev.map(e =>
        e.raw_material.id === id ? { ...e, quantity: Number(val) || 0 } : e,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const action = (e.nativeEvent as any).submitter?.value;

    const commonBase = {
      product_name: base.product_name,
      barcode: base.barcode || undefined,
      product_description: base.product_description || undefined,
      product_category_id: Number(base.product_category_id),
      base_uom_id: Number(base.base_uom_id),
      warehouse_id: Number(base.warehouse_id),
      movement_date: base.movement_date || undefined,
      note: base.note || undefined,
      images: base.images.length > 0 ? base.images : undefined,
    };

    const onSuccess = () => {
      if (action === "save_and_close") {
        navigate("/products");
      } else {
        setBase(initialBaseForm);
        setExternal(initialExternalForm);
        setInternal(initialInternalForm);
        setBomEntries([]);
      }
    };

    if (sourceType === "external") {
      externalMutation.mutate(
        {
          ...commonBase,
          supplier_id: Number(base.supplier_id),
          quantity: Number(external.quantity),
          purchase_unit_price_in_usd: Number(
            external.purchase_unit_price_in_usd,
          ),
          exchange_rate_from_usd_to_riel: Number(
            external.exchange_rate_from_usd_to_riel,
          ),
          selling_unit_price_in_usd: Number(external.selling_unit_price_in_usd),
          selling_exchange_rate_from_usd_to_riel: Number(
            external.selling_exchange_rate_from_usd_to_riel,
          ),
        },
        { onSuccess },
      );
    } else {
      internalMutation.mutate(
        {
          ...commonBase,
          product_status: internal.product_status,
          quantity: Number(internal.quantity),
          selling_unit_price_in_usd: Number(internal.selling_unit_price_in_usd),
          selling_exchange_rate_from_usd_to_riel: Number(
            internal.selling_exchange_rate_from_usd_to_riel,
          ),
          raw_materials: bomEntries.map(e => ({
            raw_material_id: e.raw_material.id,
            quantity: e.quantity,
          })),
        },
        { onSuccess },
      );
    }
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      {/* ── Page Header ───────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <Text.TitleMedium>Create New Product</Text.TitleMedium>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── LEFT COLUMN ───────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            {/* General Information */}
            <Card>
              <CardHeader className="pb-4">
                <SectionHeader
                  title="General Information"
                  description="Basic identification and categorization"
                />
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-5">
                <TextInput
                  id="product_name"
                  label="Product Name"
                  placeholder="e.g., Bamboo Toothbrush"
                  value={base.product_name}
                  onChange={handleBaseChange}
                  error={fieldErrors?.product_name?.[0]}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SearchableSelect
                    id="product_category_id"
                    label="Category"
                    fetchFn={fetchProductCategories}
                    value={base.product_category_id}
                    onChange={handleBaseSelect("product_category_id")}
                    selectedLabel={selectedCategory?.category_name}
                    error={fieldErrors?.product_category_id?.[0]}
                    required
                  />
                  <SearchableSelect
                    id="uom_category_id"
                    label="Unit of Measurement"
                    placeholder="Search category or base unit…"
                    fetchFn={fetchUomCategories}
                    value={base.uom_category_id}
                    onChange={handleBaseSelect("uom_category_id")}
                    selectedLabel={uomSelectedLabel}
                    error={fieldErrors?.base_uom_id?.[0]}
                    required
                  />
                </div>
                <TextAreaInput
                  id="product_description"
                  label="Product Description"
                  placeholder="Enter a detailed description of this product..."
                  value={base.product_description}
                  onChange={handleBaseChange}
                  error={fieldErrors?.product_description?.[0]}
                />
              </CardContent>
            </Card>

            {/* Inventory Sourcing */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <SectionHeader
                    title="Inventory Sourcing"
                    description="Choose how this item enters stock"
                    badge={
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0 text-muted-foreground border-muted-foreground/30"
                      >
                        {sourceType === "internal"
                          ? "Manufacturing"
                          : "Purchase"}
                      </Badge>
                    }
                  />
                  <Tabs
                    value={sourceType}
                    onValueChange={v => setSourceType(v as SourceType)}
                    className="w-full sm:w-auto shrink-0"
                  >
                    <TabsList className="grid grid-cols-2 w-full sm:w-[280px] h-9 bg-muted border border-border">
                      <TabsTrigger value="internal" className="text-xs h-7">
                        Internal
                      </TabsTrigger>
                      <TabsTrigger value="external" className="text-xs h-7">
                        External
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <Separator />

              <CardContent className="pt-6">
                {sourceType === "external" ? (
                  <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="rounded-lg border border-dashed bg-muted/20 p-4 space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Purchase Details
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextInput
                          id="quantity"
                          label="Quantity"
                          placeholder="e.g., 10"
                          value={external.quantity}
                          onChange={handleSourceChange(setExternal)}
                          error={fieldErrors?.quantity?.[0]}
                          isNumberOnly
                          required
                        />
                        <TextInput
                          id="purchase_unit_price_in_usd"
                          label="Purchase Unit Price (USD)"
                          placeholder="e.g., 12.99 $"
                          value={external.purchase_unit_price_in_usd}
                          onChange={handleSourceChange(setExternal)}
                          error={fieldErrors?.purchase_unit_price_in_usd?.[0]}
                          required
                        />
                        <TextInput
                          id="exchange_rate_from_usd_to_riel"
                          label="Purchase Exchange Rate (USD→KHR)"
                          value={external.exchange_rate_from_usd_to_riel}
                          onChange={handleSourceChange(setExternal)}
                          error={
                            fieldErrors?.exchange_rate_from_usd_to_riel?.[0]
                          }
                          isNumberOnly
                        />
                      </div>
                    </div>
                    <div className="rounded-lg border border-dashed bg-muted/20 p-4 space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Selling Details
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextInput
                          id="selling_unit_price_in_usd"
                          label="Selling Unit Price (USD)"
                          value={external.selling_unit_price_in_usd}
                          onChange={handleSourceChange(setExternal)}
                          error={fieldErrors?.selling_unit_price_in_usd?.[0]}
                          required
                        />
                        <TextInput
                          id="selling_exchange_rate_from_usd_to_riel"
                          label="Selling Exchange Rate (USD→KHR)"
                          value={
                            external.selling_exchange_rate_from_usd_to_riel
                          }
                          onChange={handleSourceChange(setExternal)}
                          error={
                            fieldErrors
                              ?.selling_exchange_rate_from_usd_to_riel?.[0]
                          }
                          isNumberOnly
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="rounded-lg border border-dashed bg-muted/20 p-4 space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Production Details
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectInput
                          id="product_status"
                          label="Product Status"
                          options={PRODUCT_STATUS_OPTIONS}
                          value={internal.product_status}
                          onChange={v =>
                            setInternal(p => ({ ...p, product_status: v }))
                          }
                        />
                        <TextInput
                          id="quantity"
                          label="Quantity"
                          value={internal.quantity}
                          placeholder="e.g., 10"
                          onChange={handleSourceChange(setInternal)}
                          error={fieldErrors?.quantity?.[0]}
                          isNumberOnly
                          required
                        />
                        <TextInput
                          id="selling_unit_price_in_usd"
                          label="Selling Unit Price (USD)"
                          placeholder="e.g., 12.00"
                          value={internal.selling_unit_price_in_usd}
                          onChange={handleSourceChange(setInternal)}
                          error={fieldErrors?.selling_unit_price_in_usd?.[0]}
                          required
                        />
                        <TextInput
                          id="selling_exchange_rate_from_usd_to_riel"
                          label="Selling Exchange Rate (USD→KHR)"
                          placeholder="e.g., 4100"
                          value={
                            internal.selling_exchange_rate_from_usd_to_riel
                          }
                          onChange={handleSourceChange(setInternal)}
                          error={
                            fieldErrors
                              ?.selling_exchange_rate_from_usd_to_riel?.[0]
                          }
                          isNumberOnly
                          required
                        />
                      </div>
                    </div>

                    {/* BOM */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold">
                              Bill of Materials
                            </p>
                            {bomEntries.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {bomEntries.length} material
                                {bomEntries.length > 1 ? "s" : ""} linked
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 border-dashed hover:border-primary hover:text-primary"
                          onClick={() => setPickerOpen(true)}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Material
                        </Button>
                      </div>

                      {bomEntries.length === 0 ? (
                        <div
                          className={`flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed transition-colors ${
                            fieldErrors?.raw_materials
                              ? "border-destructive/50 bg-destructive/5"
                              : "border-border bg-muted/20 hover:border-muted-foreground/30"
                          }`}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                              No materials linked yet
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">
                              Click "Add Material" to build your BOM
                            </p>
                          </div>
                          {fieldErrors?.raw_materials && (
                            <Badge variant="destructive" className="text-xs">
                              {fieldErrors.raw_materials[0]}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Material
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-44">
                                  Required Qty
                                </th>
                                <th className="w-12 px-4 py-3" />
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {bomEntries.map((entry, idx) => {
                                const stockErr = stockErrors?.find(
                                  e =>
                                    e.raw_material_id === entry.raw_material.id,
                                );
                                return (
                                  <tr
                                    key={entry.raw_material.id}
                                    className={`group transition-colors ${
                                      stockErr
                                        ? "bg-destructive/5 hover:bg-destructive/10"
                                        : idx % 2 === 0
                                          ? "bg-background hover:bg-muted/30"
                                          : "bg-muted/10 hover:bg-muted/30"
                                    }`}
                                  >
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                                          {idx + 1}
                                        </div>
                                        <div>
                                          <p className="font-medium text-foreground text-sm">
                                            {entry.raw_material.material_name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {
                                              entry.raw_material
                                                .material_sku_code
                                            }
                                          </p>
                                          {stockErr && (
                                            <p className="text-xs text-destructive mt-0.5 font-medium">
                                              Need {stockErr.required_qty}, only{" "}
                                              {stockErr.available_qty} available
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <TextInput
                                        id={`qty_${entry.raw_material.id}`}
                                        label=""
                                        value={String(entry.quantity)}
                                        onChange={e =>
                                          updateBOMQty(
                                            entry.raw_material.id,
                                            e.target.value,
                                          )
                                        }
                                        error={stockErr ? " " : undefined}
                                        isNumberOnly
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                        onClick={() =>
                                          setBomEntries(p =>
                                            p.filter(
                                              e =>
                                                e.raw_material.id !==
                                                entry.raw_material.id,
                                            ),
                                          )
                                        }
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT COLUMN ──────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6 space-y-6">
              {/* Product Image */}
              <Card>
                <CardHeader className="pb-4">
                  <SectionHeader
                    title="Product Image"
                    description="Up to 4 images supported"
                  />
                </CardHeader>
                <Separator />
                <CardContent className="pt-5">
                  <MultiImageUpload
                    label=""
                    onChange={files => setBase(p => ({ ...p, images: files }))}
                    maxImages={4}
                  />
                </CardContent>
              </Card>

              {/* Stock Movement */}
              <Card>
                <CardHeader className="pb-4">
                  <SectionHeader
                    title="Stock Movement"
                    description="Logistics and warehouse assignment"
                  />
                </CardHeader>
                <Separator />
                <CardContent className="pt-5 space-y-4">
                  {sourceType === "external" && (
                    <SearchableSelect
                      id="supplier_id"
                      label="Supplier"
                      fetchFn={fetchSuppliers}
                      value={base.supplier_id}
                      onChange={handleBaseSelect("supplier_id")}
                      error={fieldErrors?.supplier_id?.[0]}
                      required
                    />
                  )}
                  <SearchableSelect
                    id="warehouse_id"
                    label="Warehouse"
                    fetchFn={fetchWarehouses}
                    value={base.warehouse_id}
                    onChange={handleBaseSelect("warehouse_id")}
                    error={fieldErrors?.warehouse_id?.[0]}
                    required
                  />
                  <DatePickerInput
                    id="movement_date"
                    label="Movement Date"
                    value={base.movement_date}
                    onChange={v => setBase(p => ({ ...p, movement_date: v }))}
                    error={fieldErrors?.movement_date?.[0]}
                  />
                </CardContent>
              </Card>

              {/* Live Summary */}
              {(base.product_name || bomEntries.length > 0) && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Summary
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2 text-xs">
                    {base.product_name && (
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">
                          Name
                        </span>
                        <span className="font-medium text-foreground truncate">
                          {base.product_name}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">
                        Source
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        {sourceType === "internal" ? "Internal" : "External"}
                      </Badge>
                    </div>
                    {sourceType === "internal" && bomEntries.length > 0 && (
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">
                          BOM items
                        </span>
                        <span className="font-medium text-foreground">
                          {bomEntries.length}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="lg:col-span-12">
            <FormFooterActions
              isSubmitting={
                externalMutation.isPending || internalMutation.isPending
              }
            />
          </div>
        </div>
      </form>

      <DataSelectionModal<RawMaterial>
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setRmSearch("");
          setRmPage(1);
        }}
        onConfirm={(selected: RawMaterial[]) => {
          setBomEntries(prev =>
            selected.map(rm => {
              const existing = prev.find(e => e.raw_material.id === rm.id);
              return existing ?? { raw_material: rm, quantity: 1 };
            }),
          );
        }}
        title="Select Raw Materials"
        scope="bom-raw-materials"
        defaultSelected={bomEntries.map(e => e.raw_material)}
        data={rmData?.data ?? []}
        isLoading={rmLoading}
        columns={RM_COLUMNS}
        getRowId={rm => rm.id}
        getRowLabel={rm => rm.material_name}
        onSearch={(v: string) => {
          setRmSearch(v);
          setRmPage(1);
        }}
        searchPlaceholder="Search raw materials..."
        sortOptions={[
          { label: "Newest First", value: "-created_at" },
          { label: "Oldest First", value: "created_at" },
          { label: "Name A–Z", value: "material_name" },
          { label: "Name Z–A", value: "-material_name" },
        ]}
        onSortChange={(v: string) => {
          setRmSort(v || "-created_at");
          setRmPage(1);
        }}
        filterOptions={rmFilterOptions}
        onFilterChange={(f: string | undefined) => {
          setRmCategoryFilter(f);
          setRmPage(1);
        }}
        currentPage={rmData?.current_page ?? 1}
        lastPage={rmData?.last_page ?? 1}
        onPageChange={setRmPage}
      />
    </div>
  );
};
