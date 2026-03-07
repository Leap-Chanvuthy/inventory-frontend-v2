import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Trash2, Plus } from "lucide-react";
import { useRawMaterials } from "@/api/raw-materials/raw-material.query";
import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { useRawMaterialCategories } from "@/api/categories/raw-material-categories/raw-material-catergory.query";

import {
  useCreateExternalPurchase,
  useCreateInternalManufacturing,
} from "@/api/product/product.mutation";
import { ProductValidationErrors } from "@/api/product/product.type";
import { useSingleProductCategory } from "@/api/categories/product-categories/product-category.query";
import { useSingleSupplier } from "@/api/suppliers/supplier.query";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";
import { useSingleUOM } from "@/api/uom/uom.query";

import {
  fetchProductCategories,
  fetchSuppliers,
  fetchWarehouses,
  fetchUOMs,
} from "../utils/fetch-select-options";
import { PickerDialog } from "../../../components/ui/picker-dialog";
import { RM_COLUMNS } from "../utils/raw-material-table-feature";

import UnexpectedError from "@/components/reusable/partials/error";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplierCard } from "@/pages/supplier/utils/table-feature";
import { WarehouseCard } from "@/pages/warehouses/utils/table-feature";
import { UOMCard } from "@/pages/uom/utils/table-feature";
import CategorySingleCard from "@/pages/category/_components/category-single-card";
import type { UOM } from "@/api/uom/uom.types";

type BOMEntry = { raw_material: RawMaterial; quantity: number };

const PRODUCT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "WORK_IN_PROGRESS", label: "Work In Progress" },
  { value: "PARTIALLY_COMPLETED", label: "Partially Completed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "BLOCKED", label: "Blocked" },
];

type SourceType = "external" | "internal";

const initialBaseForm = {
  product_name: "",
  barcode: "",
  product_description: "",
  product_category_id: "",
  uom_id: "",
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

export const CreateProductForm = () => {
  const navigate = useNavigate();
  const externalMutation = useCreateExternalPurchase();
  const internalMutation = useCreateInternalManufacturing();

  const [sourceType, setSourceType] = useState<SourceType>("external");
  const [base, setBase] = useState(initialBaseForm);
  const [external, setExternal] = useState(initialExternalForm);
  const [internal, setInternal] = useState(initialInternalForm);
  const [bomEntries, setBomEntries] = useState<BOMEntry[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [rmSearch, setRmSearch] = useState("");
  const [rmPage, setRmPage] = useState(1);
  const [rmSort, setRmSort] = useState("-created_at");
  const [rmFilters, setRmFilters] = useState<Record<string, string>>({});
  const [dropdownError, setDropdownError] = useState(false);

  const { data: rmCategoriesData } = useRawMaterialCategories({
    per_page: 100,
  });
  const { data: rmData, isLoading: rmLoading } = useRawMaterials({
    page: rmPage,
    per_page: 5,
    "filter[search]": rmSearch || undefined,
    "filter[raw_material_category_id]": rmFilters[
      "filter[raw_material_category_id]"
    ]
      ? Number(rmFilters["filter[raw_material_category_id]"])
      : undefined,
    sort: rmSort,
  });

  const rmFilterGroups = [
    {
      key: "filter[raw_material_category_id]",
      label: "Category",
      options: (rmCategoriesData?.data?.data ?? []).map(cat => ({
        label: cat.category_name,
        value: String(cat.id),
      })),
    },
  ];
  const handleDropdownError = useCallback(() => setDropdownError(true), []);

  const isPending =
    sourceType === "external"
      ? externalMutation.isPending
      : internalMutation.isPending;

  const error =
    sourceType === "external"
      ? (externalMutation.error as AxiosError<ProductValidationErrors> | null)
      : (internalMutation.error as AxiosError<ProductValidationErrors> | null);

  const fieldErrors = error?.response?.data?.errors;

  // Preview cards
  const { data: selectedCategoryData } = useSingleProductCategory(
    Number(base.product_category_id),
  );
  const { data: selectedSupplierData } = useSingleSupplier(
    Number(base.supplier_id),
  );
  const { data: selectedWarehouseData } = useSingleWarehouse(
    Number(base.warehouse_id),
  );
  const { data: selectedUOMData } = useSingleUOM(Number(base.uom_id));

  const selectedCategory = selectedCategoryData?.data ?? null;
  const selectedSupplier = selectedSupplierData?.data?.supplier ?? null;
  const selectedWarehouse = selectedWarehouseData ?? null;
  const selectedUOM = (selectedUOMData?.data ??
    selectedUOMData ??
    null) as UOM | null;

  if (dropdownError) {
    return <UnexpectedError kind="fetch" homeTo="/products" />;
  }

  /* ---------- Handlers ---------- */
  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBase(prev => ({ ...prev, [id]: value }));
  };

  const handleBaseTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setBase(prev => ({ ...prev, [id]: value }));
  };

  const handleExternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setExternal(prev => ({ ...prev, [id]: value }));
  };

  const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInternal(prev => ({ ...prev, [id]: value }));
  };

  const handleBaseSelect = (field: string) => (value: string) => {
    setBase(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setBase(prev => ({ ...prev, images: files }));
  };

  // Raw material BOM handlers
  const handlePickerConfirm = (selected: RawMaterial[]) => {
    setBomEntries(prev => {
      const existingIds = new Set(prev.map(e => e.raw_material.id));
      const newEntries = selected
        .filter(rm => !existingIds.has(rm.id))
        .map(rm => ({ raw_material: rm, quantity: 1 }));
      return [...prev, ...newEntries];
    });
  };

  const removeBOMEntry = (id: number) => {
    setBomEntries(prev => prev.filter(e => e.raw_material.id !== id));
  };

  const updateBOMQty = (id: number, qty: number) => {
    setBomEntries(prev =>
      prev.map(e => (e.raw_material.id === id ? { ...e, quantity: qty } : e)),
    );
  };

  /* ---------- Submit ---------- */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const action = submitter?.value;

    const basePayload = {
      product_name: base.product_name,
      barcode: base.barcode || undefined,
      product_description: base.product_description || undefined,
      product_category_id: Number(base.product_category_id),
      uom_id: Number(base.uom_id),
      supplier_id: Number(base.supplier_id),
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
          ...basePayload,
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
          ...basePayload,
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
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <Text.TitleMedium className="mb-1">
            Create a new Product
          </Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Fill in the details to add a new product to the inventory.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left */}
              <div className="lg:col-span-7 space-y-6">
                {/* Product Details */}
                <div className="rounded-xl border bg-card p-6 space-y-5">
                  <div>
                    <Text.TitleSmall>Product Details</Text.TitleSmall>
                    <p className="text-sm text-muted-foreground mt-1">
                      Basic information about this product.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                      id="product_name"
                      label="Product Name"
                      placeholder="e.g., Bamboo Toothbrush"
                      value={base.product_name}
                      error={fieldErrors?.product_name?.[0]}
                      onChange={handleBaseChange}
                      required
                    />
                    <TextInput
                      id="barcode"
                      label="Barcode"
                      placeholder="e.g., 8740960166072"
                      value={base.barcode}
                      error={fieldErrors?.barcode?.[0]}
                      onChange={handleBaseChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SearchableSelect
                      id="product_category_id"
                      label="Category"
                      placeholder="Select category"
                      fetchFn={fetchProductCategories}
                      value={base.product_category_id}
                      onChange={handleBaseSelect("product_category_id")}
                      error={fieldErrors?.product_category_id?.[0]}
                      selectedLabel={selectedCategory?.category_name}
                      onFetchError={handleDropdownError}
                      required
                    />
                    <SearchableSelect
                      id="uom_id"
                      label="Unit of Measurement"
                      placeholder="Select UOM"
                      fetchFn={fetchUOMs}
                      value={base.uom_id}
                      onChange={handleBaseSelect("uom_id")}
                      error={fieldErrors?.uom_id?.[0]}
                      selectedLabel={
                        selectedUOM
                          ? `${selectedUOM.name} (${selectedUOM.symbol})`
                          : undefined
                      }
                      onFetchError={handleDropdownError}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SearchableSelect
                      id="supplier_id"
                      label="Supplier"
                      placeholder="Select supplier"
                      fetchFn={fetchSuppliers}
                      value={base.supplier_id}
                      onChange={handleBaseSelect("supplier_id")}
                      error={fieldErrors?.supplier_id?.[0]}
                      selectedLabel={selectedSupplier?.official_name}
                      onFetchError={handleDropdownError}
                      required
                    />
                    <SearchableSelect
                      id="warehouse_id"
                      label="Warehouse"
                      placeholder="Select warehouse"
                      fetchFn={fetchWarehouses}
                      value={base.warehouse_id}
                      onChange={handleBaseSelect("warehouse_id")}
                      error={fieldErrors?.warehouse_id?.[0]}
                      selectedLabel={selectedWarehouse?.warehouse_name}
                      onFetchError={handleDropdownError}
                      required
                    />
                  </div>

                  <TextAreaInput
                    id="product_description"
                    label="Product Description"
                    placeholder="Enter description..."
                    value={base.product_description}
                    error={fieldErrors?.product_description?.[0]}
                    onChange={handleBaseTextAreaChange}
                  />
                </div>
              </div>

              {/* Product Source - Full Width */}
              <div className="lg:col-span-12 rounded-xl border bg-card p-6 space-y-5">
                <div>
                  <Text.TitleSmall>Product Source</Text.TitleSmall>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select how this product will be sourced.
                  </p>
                </div>

                <Tabs
                  value={sourceType}
                  onValueChange={v => setSourceType(v as SourceType)}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="internal" className="flex-1">
                      Internal Manufacturing
                    </TabsTrigger>
                    <TabsTrigger value="external" className="flex-1">
                      External Purchase
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* External Purchase Fields */}
                {sourceType === "external" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        id="quantity"
                        label="Quantity"
                        placeholder="e.g., 100"
                        value={external.quantity}
                        error={fieldErrors?.quantity?.[0]}
                        onChange={handleExternalChange}
                        isNumberOnly
                        required
                      />
                      <TextInput
                        id="purchase_unit_price_in_usd"
                        label="Purchase Unit Price (USD)"
                        placeholder="e.g., 5.00"
                        value={external.purchase_unit_price_in_usd}
                        error={fieldErrors?.purchase_unit_price_in_usd?.[0]}
                        onChange={handleExternalChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        id="selling_unit_price_in_usd"
                        label="Selling Unit Price (USD)"
                        placeholder="e.g., 8.00"
                        value={external.selling_unit_price_in_usd}
                        error={fieldErrors?.selling_unit_price_in_usd?.[0]}
                        onChange={handleExternalChange}
                        required
                      />
                      <TextInput
                        id="exchange_rate_from_usd_to_riel"
                        label="Purchase Exchange Rate (USD→KHR)"
                        placeholder="e.g., 4100"
                        value={external.exchange_rate_from_usd_to_riel}
                        error={fieldErrors?.exchange_rate_from_usd_to_riel?.[0]}
                        onChange={handleExternalChange}
                        isNumberOnly
                        required
                      />
                    </div>
                    <TextInput
                      id="selling_exchange_rate_from_usd_to_riel"
                      label="Selling Exchange Rate (USD→KHR)"
                      placeholder="e.g., 4100"
                      value={external.selling_exchange_rate_from_usd_to_riel}
                      error={
                        fieldErrors?.selling_exchange_rate_from_usd_to_riel?.[0]
                      }
                      onChange={handleExternalChange}
                      isNumberOnly
                      required
                    />
                  </div>
                )}

                {/* Internal Manufacturing Fields */}
                {sourceType === "internal" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectInput
                        id="product_status"
                        label="Product Status"
                        placeholder="Select status"
                        options={PRODUCT_STATUS_OPTIONS}
                        value={internal.product_status}
                        onChange={val =>
                          setInternal(prev => ({
                            ...prev,
                            product_status: val,
                          }))
                        }
                        error={fieldErrors?.product_status?.[0]}
                      />
                      <TextInput
                        id="quantity"
                        label="Quantity"
                        placeholder="e.g., 50"
                        value={internal.quantity}
                        error={fieldErrors?.quantity?.[0]}
                        onChange={handleInternalChange}
                        isNumberOnly
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        id="selling_unit_price_in_usd"
                        label="Selling Unit Price (USD)"
                        placeholder="e.g., 12.00"
                        value={internal.selling_unit_price_in_usd}
                        error={fieldErrors?.selling_unit_price_in_usd?.[0]}
                        onChange={handleInternalChange}
                        required
                      />
                      <TextInput
                        id="selling_exchange_rate_from_usd_to_riel"
                        label="Selling Exchange Rate (USD→KHR)"
                        placeholder="e.g., 4100"
                        value={internal.selling_exchange_rate_from_usd_to_riel}
                        error={
                          fieldErrors
                            ?.selling_exchange_rate_from_usd_to_riel?.[0]
                        }
                        onChange={handleInternalChange}
                        isNumberOnly
                        required
                      />
                    </div>

                    {/* Raw Materials BOM */}
                    <div className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Text.TitleSmall>Raw Materials (BOM)</Text.TitleSmall>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPickerOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Raw Material
                        </Button>
                      </div>

                      {bomEntries.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                          No raw materials added. Click "Add Raw Material" to
                          start.
                        </p>
                      ) : (
                        <div className="rounded-lg border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                                  Name
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                                  SKU
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-muted-foreground w-28">
                                  Quantity
                                </th>
                                <th className="w-10" />
                              </tr>
                            </thead>
                            <tbody>
                              {bomEntries.map(entry => (
                                <tr
                                  key={entry.raw_material.id}
                                  className="border-t"
                                >
                                  <td className="px-3 py-2 font-medium">
                                    {entry.raw_material.material_name}
                                  </td>
                                  <td className="px-3 py-2 text-muted-foreground text-xs">
                                    {entry.raw_material.material_sku_code}
                                  </td>
                                  <td className="px-3 py-2">
                                    <TextInput
                                      id={`bom_qty_${entry.raw_material.id}`}
                                      label=""
                                      placeholder="Qty"
                                      value={String(entry.quantity)}
                                      onChange={e =>
                                        updateBOMQty(
                                          entry.raw_material.id,
                                          Number(e.target.value),
                                        )
                                      }
                                      isNumberOnly
                                    />
                                  </td>
                                  <td className="px-2 py-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeBOMEntry(entry.raw_material.id)
                                      }
                                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-md"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Common: Movement Date + Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePickerInput
                    id="movement_date"
                    label="Movement Date"
                    placeholder="Pick a date"
                    value={base.movement_date}
                    onChange={val =>
                      setBase(prev => ({ ...prev, movement_date: val }))
                    }
                  />
                  <div />
                </div>
                <TextAreaInput
                  id="note"
                  label="Note"
                  placeholder="e.g., Purchased from supplier A"
                  value={base.note}
                  onChange={handleBaseTextAreaChange}
                />
              </div>

              {/* Right: Preview + Images */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-6 space-y-6">
                  <div className="rounded-xl border bg-card p-6 h-[30rem] overflow-y-scroll">
                    <Text.TitleSmall className="mb-2">
                      Selected Data Preview
                    </Text.TitleSmall>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review the full details of what you selected.
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedCategory ? (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Category
                          </p>
                          <CategorySingleCard
                            category={selectedCategory}
                            viewRoute="/product-categories/view"
                            editRoute="/product-categories/edit"
                            hideActions={false}
                            disableLink
                            interactive={false}
                            variant="compact"
                          />
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                          Select a category to preview details.
                        </div>
                      )}

                      {selectedUOM ? (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Unit of Measurement
                          </p>
                          <UOMCard
                            uom={selectedUOM}
                            hideActions={true}
                            interactive={true}
                          />
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                          Select a UOM to preview details.
                        </div>
                      )}

                      {selectedSupplier ? (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Supplier
                          </p>
                          <SupplierCard
                            supplier={selectedSupplier}
                            hideActions={false}
                            disableLink
                            interactive={false}
                          />
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                          Select a supplier to preview details.
                        </div>
                      )}

                      {selectedWarehouse ? (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Warehouse
                          </p>
                          <WarehouseCard
                            warehouse={selectedWarehouse}
                            hideActions={false}
                            disableLink
                            interactive={false}
                          />
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                          Select a warehouse to preview details.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <Text.TitleSmall className="mb-2">Images</Text.TitleSmall>
              <p className="text-sm text-muted-foreground mb-4">
                Upload images for this product.
              </p>
              <MultiImageUpload
                label="Product Images"
                onChange={handleImagesChange}
                maxImages={4}
              />
            </div>
            <FormFooterActions isSubmitting={isPending} />
          </form>
        </div>
      </div>

      <PickerDialog<RawMaterial>
        open={pickerOpen}
        onOpenChange={open => {
          setPickerOpen(open);
          if (!open) {
            setRmSearch("");
            setRmPage(1);
          }
        }}
        onConfirm={handlePickerConfirm}
        alreadySelectedIds={bomEntries.map(e => e.raw_material.id)}
        title="Select Raw Material for Manufacturing"
        description="Select one or more raw materials to include in the Bill of Materials (BOM)."
        items={rmData?.data ?? []}
        isLoading={rmLoading}
        columns={RM_COLUMNS}
        search={rmSearch}
        onSearchChange={v => {
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
        currentSort={rmSort}
        onSortChange={v => {
          setRmSort(v);
          setRmPage(1);
        }}
        filterGroups={rmFilterGroups}
        currentFilters={rmFilters}
        onFilterChange={f => {
          setRmFilters(f);
          setRmPage(1);
        }}
        currentPage={rmData?.current_page ?? 1}
        lastPage={rmData?.last_page ?? 1}
        onPageChange={setRmPage}
        confirmLabel={n => `+ Select This Material (${n})`}
        emptyText="No raw materials found."
      />
    </div>
  );
};
