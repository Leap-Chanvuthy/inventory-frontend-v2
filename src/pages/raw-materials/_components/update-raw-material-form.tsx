import { useDeleteRawMaterialImages, useUpdateRawMaterial } from "@/api/raw-materials/raw-material.mutation";
import { useSingleRawMaterial } from "@/api/raw-materials/raw-material.query";
import { useRawMaterialCategories } from "@/api/categories/raw-material-categories/raw-material-catergory.query";
import { useSuppliers } from "@/api/suppliers/supplier.query";
import { useWarehouses } from "@/api/warehouses/warehouses.query";
import { useUOMs } from "@/api/uom/uom.query";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput, DatePickerInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RawMaterialValidationErrors } from "@/api/raw-materials/raw-material.types";
import { Text } from "@/components/ui/text/app-text";
import { SearchableSelect } from "@/components/reusable/partials/searchable-select";
import { toNumberOrNull } from "../utils/check_num_null";
import { SupplierCard } from "@/pages/supplier/utils/table-feature";
import { WarehouseCard } from "@/pages/warehouses/utils/table-feature";
import { UOMCard } from "@/pages/uom/utils/table-feature";
import CategorySingleCard from "@/pages/category/_components/category-single-card";
import SelectableImageDelete from "@/components/reusable/partials/selectable-image-delete";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";

export const UpdateRawMaterialForm = () => {
  const { id } = useParams<{ id: string }>();
  const rawMaterialId = Number(id);

  const { data: rawMaterialData, isLoading: rmLoading, isError: rmError } = useSingleRawMaterial(rawMaterialId);

  const updateMutation = useUpdateRawMaterial(rawMaterialId);
  const deleteImagesMutation = useDeleteRawMaterialImages(rawMaterialId);
  const error = updateMutation.error as AxiosError<RawMaterialValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  const navigate = useNavigate();

  // Raw Material Image
  const rawMaterialImage = rawMaterialData?.data?.raw_material?.rm_images || [];
  const remainingImageSlots = Math.max(0, 4 - rawMaterialImage.length);

  const handleDeleteImages = useCallback(
    async (imageIds: number[]) => {
      await deleteImagesMutation.mutateAsync(imageIds);
    },
    [deleteImagesMutation]
  );

  // Fetch dropdown options
  const {
    data: categoriesData,
    isPending: categoriesLoading,
    isError: categoriesError,
  } = useRawMaterialCategories({ per_page: 100 });
  const {
    data: suppliersData,
    isPending: suppliersLoading,
    isError: suppliersError,
  } = useSuppliers({ per_page: 100 });
  const {
    data: warehousesData,
    isPending: warehousesLoading,
    isError: warehousesError,
  } = useWarehouses({ per_page: 100 });
  const {
    data: uomsData,
    isPending: uomsLoading,
    isError: uomsError,
  } = useUOMs({ per_page: 100 });

  const isLoading =
    rmLoading || categoriesLoading || suppliersLoading || warehousesLoading || uomsLoading;
  const hasError = rmError || categoriesError || suppliersError || warehousesError || uomsError;

  const rawMaterial = rawMaterialData?.data?.raw_material;

  const purchaseMovement = useMemo(() => {
    const movements = rawMaterial?.rm_stock_movements ?? [];
    return movements.find(m => m.movement_type === "PURCHASE") ?? null;
  }, [rawMaterial?.rm_stock_movements]);

  const [form, setForm] = useState({
    material_name: "",
    material_sku_code: "",
    barcode: "",
    minimum_stock_level: "",
    expiry_date: "",
    description: "",
    raw_material_category_id: "",
    uom_id: "",
    supplier_id: "",
    warehouse_id: "",
    quantity: "",
    unit_price_in_usd: "",
    exchange_rate_from_usd_to_riel: "4100",
    note: "",
    images: [] as File[],
  });

  useEffect(() => {
    if (!rawMaterial) return;

    setForm(prev => ({
      ...prev,
      material_name: rawMaterial.material_name ?? "",
      material_sku_code: rawMaterial.material_sku_code ?? "",
      barcode: rawMaterial.barcode ?? "",
      minimum_stock_level: String(rawMaterial.minimum_stock_level ?? ""),
      expiry_date: rawMaterial.expiry_date ?? "",
      description: rawMaterial.description ?? "",
      raw_material_category_id: rawMaterial.raw_material_category_id
        ? String(rawMaterial.raw_material_category_id)
        : "",
      uom_id: rawMaterial.uom_id ? String(rawMaterial.uom_id) : "",
      supplier_id: rawMaterial.supplier_id ? String(rawMaterial.supplier_id) : "",
      warehouse_id: rawMaterial.warehouse_id ? String(rawMaterial.warehouse_id) : "",
      quantity: purchaseMovement?.quantity != null ? String(purchaseMovement.quantity) : "",
      unit_price_in_usd:
        purchaseMovement?.unit_price_in_usd != null ? String(purchaseMovement.unit_price_in_usd) : "",
      exchange_rate_from_usd_to_riel:
        purchaseMovement?.exchange_rate_from_usd_to_riel != null
          ? String(purchaseMovement.exchange_rate_from_usd_to_riel)
          : prev.exchange_rate_from_usd_to_riel,
      note: purchaseMovement?.note ?? "",
    }));
  }, [rawMaterial, purchaseMovement]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading Raw Material...</p>
      </div>
    );
  }

  if (hasError || !rawMaterial) {
    return (
      <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
        <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-red-500 text-center">
              <p className="text-lg font-medium">Failed to load form data</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please refresh the page or try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for select options
  const categoryOptions =
    categoriesData?.data?.data.map(cat => ({
      value: cat.id.toString(),
      label: cat.category_name,
    })) || [];

  const supplierOptions =
    suppliersData?.data?.data.map(sup => ({
      value: sup.id.toString(),
      label: sup.official_name,
    })) || [];

  const warehouseOptions =
    warehousesData?.data?.map(wh => ({
      value: wh.id.toString(),
      label: wh.warehouse_name,
    })) || [];

  const uomOptions =
    uomsData?.data?.map(uom => ({
      value: uom.id.toString(),
      label: `${uom.name} (${uom.symbol})`,
    })) || [];

  const selectedCategory =
    categoriesData?.data?.data?.find(
      cat => String(cat.id) === form.raw_material_category_id,
    ) || null;

  const selectedSupplier =
    suppliersData?.data?.data?.find(sup => String(sup.id) === form.supplier_id) ||
    null;

  const selectedWarehouse =
    warehousesData?.data?.find(wh => String(wh.id) === form.warehouse_id) || null;

  const selectedUOM =
    uomsData?.data?.find(uom => String(uom.id) === form.uom_id) || null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setForm(prev => ({ ...prev, images: files }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (value: string) => {
    setForm(prev => ({ ...prev, expiry_date: value }));
  };

  // Update Raw Material
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    const fd = new FormData();

    // Raw material fields
    fd.append("material_name", form.material_name);
    fd.append("material_sku_code", form.material_sku_code);
    fd.append("barcode", form.barcode ?? "");
    fd.append("minimum_stock_level", String(Number(form.minimum_stock_level)));
    fd.append("expiry_date", form.expiry_date);
    fd.append("description", form.description ?? "");
    fd.append("raw_material_category_id", String(Number(form.raw_material_category_id)));
    fd.append("uom_id", String(Number(form.uom_id)));
    fd.append("supplier_id", String(Number(form.supplier_id)));
    fd.append("warehouse_id", String(Number(form.warehouse_id)));

    // PURCHASE movement fields
    const quantity = toNumberOrNull(form.quantity);
    const unitPriceUsd = toNumberOrNull(form.unit_price_in_usd);
    const exchangeRate = toNumberOrNull(form.exchange_rate_from_usd_to_riel);
    fd.append("quantity", quantity == null ? "" : String(quantity));
    fd.append("unit_price_in_usd", unitPriceUsd == null ? "" : String(unitPriceUsd));
    fd.append("exchange_rate_from_usd_to_riel", exchangeRate == null ? "" : String(exchangeRate));
    fd.append("note", form.note ?? "");

    // Append images (add-one / append mode)
    for (const file of form.images) {
      fd.append("images[]", file);
    }

    updateMutation.mutate(fd, {
      onSuccess: () => {
        setForm(prev => ({ ...prev, images: [] }));
        if (action === "save_and_close") {
          navigate("/raw-materials");
        }
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-5">
          <Text.TitleMedium className="mb-2">Update Raw Material</Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Update raw material info and its initial PURCHASE stock movement (qty/unit price/exchange rate).
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Form inputs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-xl border bg-card p-5 space-y-5">
                  <div>
                    <Text.TitleSmall>Basic Information</Text.TitleSmall>
                    <p className="text-sm text-muted-foreground mt-1">
                      General details and storage setup for this raw material.
                    </p>
                  </div>

                  <TextInput
                    id="material_name"
                    label="Material Name"
                    placeholder="e.g., Steel Sheet"
                    value={form.material_name}
                    error={fieldErrors?.material_name?.[0]}
                    onChange={handleChange}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SearchableSelect
                      id="raw_material_category_id"
                      label="Category"
                      placeholder="Select category"
                      options={categoryOptions}
                      value={form.raw_material_category_id}
                      onChange={handleSelectChange("raw_material_category_id")}
                      error={fieldErrors?.raw_material_category_id?.[0]}
                      required
                    />
                    <SearchableSelect
                      id="uom_id"
                      label="Unit of Measurement"
                      placeholder="Select UOM"
                      options={uomOptions}
                      value={form.uom_id}
                      onChange={handleSelectChange("uom_id")}
                      error={fieldErrors?.uom_id?.[0]}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SearchableSelect
                      id="supplier_id"
                      label="Supplier"
                      placeholder="Select supplier"
                      options={supplierOptions}
                      value={form.supplier_id}
                      onChange={handleSelectChange("supplier_id")}
                      error={fieldErrors?.supplier_id?.[0]}
                      required
                    />
                    <SearchableSelect
                      id="warehouse_id"
                      label="Warehouse"
                      placeholder="Select warehouse"
                      options={warehouseOptions}
                      value={form.warehouse_id}
                      onChange={handleSelectChange("warehouse_id")}
                      error={fieldErrors?.warehouse_id?.[0]}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                      id="minimum_stock_level"
                      label="Minimum Stock Level"
                      placeholder="e.g., 10"
                      value={form.minimum_stock_level}
                      error={fieldErrors?.minimum_stock_level?.[0]}
                      onChange={handleChange}
                      isNumberOnly
                      required
                    />

                    <DatePickerInput
                      id="expiry_date"
                      label="Expiry Date"
                      placeholder="Pick a date"
                      error={fieldErrors?.expiry_date?.[0]}
                      value={form.expiry_date}
                      onChange={handleDateChange}
                      required
                    />
                  </div>

                  <TextAreaInput
                    id="description"
                    label="Description"
                    placeholder="Enter description..."
                    value={form.description}
                    error={fieldErrors?.description?.[0]}
                    onChange={handleTextAreaChange}
                  />
                </div>

                <div className="rounded-xl border bg-card p-5 space-y-5">
                  <div>
                    <Text.TitleSmall>Purchase Stock Movement</Text.TitleSmall>
                    <p className="text-sm text-muted-foreground mt-1">
                      Purchase movement type is locked to PURCHASE, but you can update quantity and pricing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <TextInput
                      id="quantity"
                      label="Quantity"
                      placeholder="e.g., 50"
                      value={form.quantity}
                      error={fieldErrors?.quantity?.[0]}
                      onChange={handleChange}
                      isNumberOnly
                      required
                    />
                    <TextInput
                      id="unit_price_in_usd"
                      label="Unit Price (USD)"
                      placeholder="e.g., 2.5"
                      value={form.unit_price_in_usd}
                      error={fieldErrors?.unit_price_in_usd?.[0]}
                      onChange={handleChange}
                      required
                    />
                    <TextInput
                      id="exchange_rate_from_usd_to_riel"
                      label="Exchange Rate (USD → Riel)"
                      placeholder="e.g., 4100"
                      value={form.exchange_rate_from_usd_to_riel}
                      error={fieldErrors?.exchange_rate_from_usd_to_riel?.[0]}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <TextAreaInput
                    id="note"
                    label="Note"
                    placeholder="Optional note..."
                    value={form.note}
                    error={fieldErrors?.note?.[0]}
                    onChange={handleTextAreaChange}
                  />
                </div>
              </div>

              {/* Right: Selected cards preview */}
              <div className="flex flex-col gap-5 lg:col-span-5">
                <div className="lg:sticky lg:top-6 space-y-6">
                  <div className="rounded-xl border bg-card p-5 h-[30rem] overflow-y-scroll">
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
                            viewRoute="/raw-material-categories/view"
                            editRoute="/raw-material-categories/edit"
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
                          <UOMCard uom={selectedUOM} hideActions={false} interactive={false} />
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
                                  <div className="rounded-xl border bg-card p-6">
                                    <Text.TitleSmall className="mb-2">Images</Text.TitleSmall>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Upload up to {remainingImageSlots} more image{remainingImageSlots === 1 ? "" : "s"} (max 4 total).
                                    </p>
                                    <MultiImageUpload
                                      label="Raw Material Images"
                                      onChange={handleImagesChange}
                                        maxImages={remainingImageSlots}
                                    />
                                  </div>

                <SelectableImageDelete 
                  title="Delete Raw Material Image"
                  images={rawMaterialImage}
                  onDelete={handleDeleteImages}
                  isDeleting={deleteImagesMutation.isPending}
                />
              </div>
            </div>

            <FormFooterActions
              isSubmitting={updateMutation.isPending || deleteImagesMutation.isPending}
              saveAndCloseLabel="Save & Close"
              saveLabel="Save"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
