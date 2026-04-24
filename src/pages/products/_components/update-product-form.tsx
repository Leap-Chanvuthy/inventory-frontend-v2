import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Plus, Package, Layers, ShoppingCart } from "lucide-react";
import { useRawMaterials } from "@/api/raw-materials/raw-material.query";
import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import {
  useUpdateExternalPurchase,
  useUpdateInternalManufacturing,
} from "@/api/product/product.mutation";
import { useSingleProduct } from "@/api/product/product.query";
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
  fetchRawMaterials,
} from "../utils/fetch-select-options";
import { DataSelectionModal } from "@/components/reusable/data-modal/data-selection-modal";
import { RM_COLUMNS } from "../utils/raw-material-table-feature";
import { useSingleProductCategory } from "@/api/categories/product-categories/product-category.query";
import { useSingleUomCategory } from "@/api/uom/uom.query";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import {
  TextInput,
  TextAreaInput,
  DatePickerInput,
  SelectInput,
} from "@/components/reusable/partials/input";
import { SearchableSelect } from "@/components/reusable/partials/searchable-select";
import { Text } from "@/components/ui/text/app-text";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import { formatDate } from "@/utils/date-format";

type BOMEntry = { raw_material: RawMaterial; quantity: number };

const PRODUCT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "WORK_IN_PROGRESS", label: "Work In Progress" },
  { value: "PARTIALLY_COMPLETED", label: "Partially Completed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "BLOCKED", label: "Blocked" },
];

const SALE_METHOD_OPTIONS = [
  { value: "FIFO", label: "FIFO (First In, First Out)" },
  { value: "LIFO", label: "LIFO (Last In, First Out)" },
];

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <Text.TitleSmall>{title}</Text.TitleSmall>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export const UpdateProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);

  const { data, isLoading, isError, isFetching } = useSingleProduct(productId);
  const externalMutation = useUpdateExternalPurchase(productId);
  const internalMutation = useUpdateInternalManufacturing(productId);

  const product = data?.data?.product;
  const isInternal = product?.product_type === "INTERNAL_PRODUCED";
  const isSold = data?.data?.is_sold ?? false;
  const activeMutation = isInternal ? internalMutation : externalMutation;
  const responseErrors = (
    activeMutation.error as AxiosError<ProductValidationErrors> | null
  )?.response?.data?.errors;
  const fieldErrors = Array.isArray(responseErrors)
    ? undefined
    : responseErrors;
  const stockErrors = Array.isArray(responseErrors)
    ? (responseErrors as InsufficientStockError[])
    : undefined;

  // Form state
  const [base, setBase] = useState({
    product_name: "",
    barcode: "",
    product_description: "",
    product_category_id: "",
    uom_category_id: "",
    base_uom_id: "",
    supplier_id: "",
    warehouse_id: "",
    sale_method: "",
    movement_date: "",
    note: "",
  });

  const [external, setExternal] = useState({
    quantity: "",
    purchase_unit_price_in_usd: "",
    exchange_rate_from_usd_to_riel: "4100",
    selling_unit_price_in_usd: "",
    selling_exchange_rate_from_usd_to_riel: "4100",
  });

  const [internal, setInternal] = useState({
    product_status: "COMPLETED",
    quantity: "",
    selling_unit_price_in_usd: "",
    selling_exchange_rate_from_usd_to_riel: "4100",
  });

  const [bomEntries, setBomEntries] = useState<BOMEntry[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Pre-fill form when data loads
  useEffect(() => {
    if (!product || initialized) return;

    const mv = product.product_movements?.[0];

    setBase({
      product_name: product.product_name ?? "",
      barcode: product.barcode ?? "",
      product_description: product.product_description ?? "",
      product_category_id: String(product.product_category_id ?? ""),
      uom_category_id: String(product.base_uom?.category_id ?? ""),
      base_uom_id: String(product.base_uom_id ?? ""),
      supplier_id: String(product.supplier_id ?? ""),
      warehouse_id: String(product.warehouse_id ?? ""),
      sale_method: product.sale_method ?? "FIFO",
      movement_date: mv?.movement_date ? mv.movement_date.substring(0, 10) : "",
      note: mv?.note ?? "",
    });

    const currentQty = String(data?.data?.current_qty_in_stock ?? "");

    if (!isInternal && mv) {
      setExternal({
        quantity: currentQty,
        purchase_unit_price_in_usd: String(mv.purchase_unit_price_in_usd ?? ""),
        exchange_rate_from_usd_to_riel: String(
          mv.exchange_rate_from_usd_to_riel ?? "4100",
        ),
        selling_unit_price_in_usd: String(mv.selling_unit_price_in_usd ?? ""),
        selling_exchange_rate_from_usd_to_riel: String(
          mv.selling_exchange_rate_from_usd_to_riel ?? "4100",
        ),
      });
    }

    if (isInternal && mv) {
      setInternal({
        product_status: mv.product_status ?? "COMPLETED",
        quantity: currentQty,
        selling_unit_price_in_usd: String(mv.selling_unit_price_in_usd ?? ""),
        selling_exchange_rate_from_usd_to_riel: String(
          mv.selling_exchange_rate_from_usd_to_riel ?? "4100",
        ),
      });

      if (product.product_raw_materials?.length) {
        setBomEntries(
          product.product_raw_materials
            .filter(rm => rm.raw_material)
            .map(rm => ({
              raw_material: rm.raw_material as unknown as RawMaterial,
              quantity: parseFloat(rm.quantity),
            })),
        );
      }
    }

    setInitialized(true);
  }, [product, isInternal, initialized]);

  // UOM category selection
  const { data: selectedCategoryData } = useSingleProductCategory(
    Number(base.product_category_id),
  );
  const selectedCategory = selectedCategoryData?.data ?? null;

  const { data: selectedUomCategoryData } = useSingleUomCategory(
    Number(base.uom_category_id),
  );

  const uomCatData = selectedUomCategoryData?.data;
  const rawBase = uomCatData?.base_unit;
  const uomBaseUnit = Array.isArray(rawBase) ? rawBase[0] : rawBase;
  const uomSelectedLabel = uomCatData
    ? uomBaseUnit
      ? `${uomCatData.name} | ${uomBaseUnit.name}${uomBaseUnit.symbol ? ` (${uomBaseUnit.symbol})` : ""} [Base Unit]`
      : uomCatData.name
    : product?.base_uom?.category
      ? `${product.base_uom.category.name} | ${product.base_uom.name} (${product.base_uom.symbol}) [Base Unit]`
      : undefined;

  // Raw material picker
  const [rmSearch, setRmSearch] = useState("");
  const [rmPage, setRmPage] = useState(1);
  const rmLastPageRef = useRef(1);
  const [rmSort, setRmSort] = useState("-created_at");
  const [rmCategoryFilter, setRmCategoryFilter] = useState<string | undefined>(
    undefined,
  );

  const { data: rmData, isLoading: rmLoading } = useRawMaterials({
    page: rmPage,
    per_page: 5,
    "filter[search]": rmSearch || undefined,
    "filter[raw_material_category_id]": rmCategoryFilter
      ? Number(rmCategoryFilter)
      : undefined,
    sort: rmSort,
  });

  const handleBaseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setBase(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSourceChange =
    (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setter((prev: any) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleBaseSelect = (field: string) => (value: string) =>
    setBase(prev => ({ ...prev, [field]: value }));

  const updateBOMQty = (id: number, val: string) =>
    setBomEntries(prev =>
      prev.map(e =>
        e.raw_material.id === id ? { ...e, quantity: Number(val) || 0 } : e,
      ),
    );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    const commonBase = {
      product_name: base.product_name,
      barcode: base.barcode || undefined,
      product_description: base.product_description || undefined,
      product_category_id: Number(base.product_category_id),
      base_uom_id: Number(base.base_uom_id),
      warehouse_id: Number(base.warehouse_id),
      sale_method: base.sale_method,
      movement_date: base.movement_date || undefined,
      note: base.note || undefined,
    };

    // const onSuccess = () => navigate(`/products/view/${productId}`);

    if (!isInternal) {
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
        { onSuccess : () => {
            if (action === "save_and_close") {
            navigate("/products");
        }
        } },
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
        { onSuccess : () => {
          if (action === "save_and_close") {
              navigate("/products");
          }
        }},
      );
    }
  };

  if (isLoading) return <DataCardLoading text="Loading product..." />;
  if (isError && !isFetching)
    return <UnexpectedError kind="fetch" homeTo="/products" />;
  if (!product) return null;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <Text.TitleMedium>Update Product</Text.TitleMedium>
          <p className="text-sm text-muted-foreground">
            {isInternal ? "Internal Produced" : "External Purchased"} ·{" "}
            <span className="font-mono text-xs">
              {product.product_sku_code}
            </span>
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated: {formatDate(product.updated_at)}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── LEFT COLUMN ── */}
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
                    selectedLabel={
                      selectedCategory?.category_name ??
                      product.category?.category_name
                    }
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SelectInput
                    id="sale_method"
                    label="Sale Method (Default FIFO)"
                    placeholder="Select sale method"
                    options={SALE_METHOD_OPTIONS}
                    value={base.sale_method}
                    onChange={v =>
                      setBase(prev => ({ ...prev, sale_method: v }))
                    }
                    error={fieldErrors?.sale_method?.[0]}
                  />
                  <div />
                </div>
                <TextAreaInput
                  id="product_description"
                  label="Product Description"
                  value={base.product_description}
                  onChange={handleBaseChange}
                  error={fieldErrors?.product_description?.[0]}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SelectInput
                    id="sale_method"
                    label="Sale Method (Default FIFO)"
                    placeholder="Select sale method"
                    options={SALE_METHOD_OPTIONS}
                    value={base.sale_method}
                    onChange={v =>
                      setBase(prev => ({ ...prev, sale_method: v }))
                    }
                    error={fieldErrors?.sale_method?.[0]}
                  />
                  <div />
                </div>
              </CardContent>
            </Card>

            {/* Sourcing Details */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <SectionHeader
                    title={
                      isInternal ? "Production Details" : "Purchase Details"
                    }
                    description={
                      isInternal
                        ? "Quantity, selling price and bill of materials"
                        : "Quantity, purchase price and selling price"
                    }
                  />
                  <div
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      isInternal
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                    }`}
                  >
                    {isInternal ? (
                      <Layers className="h-3.5 w-3.5" />
                    ) : (
                      <ShoppingCart className="h-3.5 w-3.5" />
                    )}
                    {isInternal ? "Internal Produced" : "External Purchased"}
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {!isInternal ? (
                  <div className="space-y-5">
                    <div className="rounded-lg border border-dashed bg-muted/20 p-4 space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Purchase Details
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <TextInput
                            id="quantity"
                            label="Quantity"
                            value={external.quantity}
                            onChange={handleSourceChange(setExternal)}
                            error={fieldErrors?.quantity?.[0]}
                            isNumberOnly
                            required
                            // disabled={isSold}
                          />
                          {isSold && (
                            <p className="text-xs text-yellow-500 mt-1">
                              Quantity cannot be changed after the product has been sold.
                            </p>
                          )}
                        </div>
                        <TextInput
                          id="purchase_unit_price_in_usd"
                          label="Purchase Unit Price (USD)"
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
                  <div className="space-y-6">
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
                        <div>
                          <TextInput
                            id="quantity"
                            label="Quantity"
                            value={internal.quantity}
                            onChange={handleSourceChange(setInternal)}
                            error={fieldErrors?.quantity?.[0]}
                            isNumberOnly
                            required
                            // disabled={isSold}
                          />
                          {isSold && (
                            <p className="text-xs text-yellow-500 mt-1">
                              Quantity cannot be changed after the product has been sold.
                            </p>
                          )}
                        </div>
                        <TextInput
                          id="selling_unit_price_in_usd"
                          label="Selling Unit Price (USD)"
                          value={internal.selling_unit_price_in_usd}
                          onChange={handleSourceChange(setInternal)}
                          error={fieldErrors?.selling_unit_price_in_usd?.[0]}
                          required
                        />
                        <TextInput
                          id="selling_exchange_rate_from_usd_to_riel"
                          label="Selling Exchange Rate (USD→KHR)"
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
                        <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed border-border bg-muted/20">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">
                            No materials linked yet
                          </p>
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
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-36">
                                  Available
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
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1">
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
                                        </div>
                                        <div className="text-xs text-muted-foreground min-w-[56px] text-right">
                                          {entry.raw_material.uom?.symbol ||
                                            entry.raw_material.uom_name ||
                                            ""}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="text-sm font-medium">
                                        {(entry.raw_material as any)
                                          .current_qty_in_stock != null
                                          ? `${Number((entry.raw_material as any).current_qty_in_stock)} ${entry.raw_material.uom?.symbol || ""}`
                                          : "—"}
                                      </div>
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

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <SectionHeader
                    title="Stock Movement"
                    description="Logistics and warehouse assignment"
                  />
                </CardHeader>
                <Separator />
                <CardContent className="pt-5 space-y-4">
                  {!isInternal && (
                    <SearchableSelect
                      id="supplier_id"
                      label="Supplier"
                      fetchFn={fetchSuppliers}
                      value={base.supplier_id}
                      onChange={handleBaseSelect("supplier_id")}
                      selectedLabel={product.supplier?.official_name}
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
                    selectedLabel={product.warehouse?.warehouse_name}
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
                  <TextAreaInput
                    id="note"
                    label="Note"
                    value={base.note}
                    onChange={handleBaseChange}
                  />
                </CardContent>
              </Card>
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
        scope="bom-raw-materials-update"
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
        filterFetchFn={fetchRawMaterials}
        onFilterChange={(f: string | undefined) => {
          setRmCategoryFilter(f);
          setRmPage(1);
        }}
        currentPage={rmPage}
        lastPage={(() => {
          if (rmData?.last_page) rmLastPageRef.current = rmData.last_page;
          return rmLastPageRef.current;
        })()}
        onPageChange={setRmPage}
      />
    </div>
  );
};
