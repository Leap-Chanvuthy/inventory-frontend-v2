import { useCreateRawMaterial } from "@/api/raw-materials/raw-material.mutation";
import { useSingleRawMaterialCategory } from "@/api/categories/raw-material-categories/raw-material-catergory.query";
import {
  fetchCategories,
  fetchSuppliers,
  fetchWarehouses,
  fetchUomCategories,
} from "../utils/fetch-select-options";
import { useSingleSupplier } from "@/api/suppliers/supplier.query";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";
import { useSingleUomCategory } from "@/api/uom/uom.query";
import UnexpectedError from "@/components/reusable/partials/error";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";
import {
  TextInput,
  TextAreaInput,
  DatePickerInput,
  SelectInput,
} from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RawMaterialValidationErrors } from "@/api/raw-materials/raw-material.types";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SearchableSelect } from "@/components/reusable/partials/searchable-select";
import { toNumberOrNull } from "../utils/check_num_null";
import { validateUomCategoryConfiguration } from "../utils/uom-category-validation";
import { SupplierCard } from "@/pages/supplier/utils/table-feature";
import { WarehouseCard } from "@/pages/warehouses/utils/table-feature";
import CategorySingleCard from "@/pages/category/_components/category-single-card";
import { UomHierarchyPreview } from "./uom-hierarchy-preview";
import { PRODCUTION_METHOD } from "../utils/const";

export const CreateRawMaterialForm = () => {
  const rawMaterialMutation = useCreateRawMaterial();
  const error =
    rawMaterialMutation.error as AxiosError<RawMaterialValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const initialForm = {
    material_name: "",
    minimum_stock_level: "",
    expiry_date: "",
    description: "",
    raw_material_category_id: "",
    uom_category_id: "",
    base_uom_id: "",
    supplier_id: "",
    warehouse_id: "",
    quantity: "",
    unit_price_in_usd: "",
    exchange_rate_from_usd_to_riel: "4100",
    note: "",
    production_method: "",
    images: [] as File[],
  };

  const [form, setForm] = useState(initialForm);
  const [dropdownError, setDropdownError] = useState(false);
  const [uomValidationError, setUomValidationError] = useState<string>("");
  const handleDropdownError = useCallback(() => setDropdownError(true), []);

  const INVALID_UOM_MESSAGE =
    "This UOM category does not have a Base Unit or conversion units configured yet. Please configure the units before selecting this UOM.";

  // Fetch selected items for preview cards
  const { data: selectedCategoryData } = useSingleRawMaterialCategory(
    Number(form.raw_material_category_id),
  );
  const { data: selectedSupplierData } = useSingleSupplier(
    Number(form.supplier_id),
  );
  const { data: selectedWarehouseData } = useSingleWarehouse(
    Number(form.warehouse_id),
  );
  // Fetch UOM category to get its base unit — auto-populate uom_id
  const { data: selectedUomCategoryData } = useSingleUomCategory(
    Number(form.uom_category_id),
  );

  const uomValidation = validateUomCategoryConfiguration(
    selectedUomCategoryData?.data,
  );

  // Auto-set base_uom_id to the category's base unit when category changes.
  // Normalise array-vs-object shape for base_unit.
  useEffect(() => {
    if (!form.uom_category_id) {
      setUomValidationError("");
      setForm(prev =>
        prev.base_uom_id === "" ? prev : { ...prev, base_uom_id: "" },
      );
      return;
    }

    if (uomValidation.isValid && uomValidation.baseUnitId) {
      setUomValidationError("");
      const nextBaseId = String(uomValidation.baseUnitId);
      setForm(prev =>
        prev.base_uom_id === nextBaseId
          ? prev
          : { ...prev, base_uom_id: nextBaseId },
      );
      return;
    }

    setUomValidationError(INVALID_UOM_MESSAGE);
    setForm(prev =>
      prev.base_uom_id === "" ? prev : { ...prev, base_uom_id: "" },
    );
  }, [
    INVALID_UOM_MESSAGE,
    form.uom_category_id,
    uomValidation.baseUnitId,
    uomValidation.isValid,
  ]);

  const selectedCategory = selectedCategoryData?.data ?? null;
  const selectedSupplier = selectedSupplierData?.data?.supplier ?? null;
  const selectedWarehouse = selectedWarehouseData ?? null;

  // Build the selectedLabel for the UOM SearchableSelect trigger.
  // Normalise array-vs-object shape for base_unit.
  const uomCategoryData = selectedUomCategoryData?.data;
  const rawBase = uomCategoryData?.base_unit;
  const uomBaseUnit = Array.isArray(rawBase) ? rawBase[0] : rawBase;
  const uomSelectedLabel = uomCategoryData
    ? uomBaseUnit
      ? `${uomCategoryData.name} | ${uomBaseUnit.name}${uomBaseUnit.symbol ? ` (${uomBaseUnit.symbol})` : ""} [Base Unit]`
      : uomCategoryData.name
    : undefined;

  if (dropdownError) {
    return <UnexpectedError kind="fetch" homeTo="/raw-materials" />;
  }

  /* ---------- Handlers ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: value } as typeof prev;
      if (field === "uom_category_id") {
        next.base_uom_id = "";
      }
      return next;
    });

    if (field === "uom_category_id") {
      setUomValidationError("");
    }
  };

  const handleDateChange = (value: string) => {
    setForm(prev => ({ ...prev, expiry_date: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setForm(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    const payload = {
      material_name: form.material_name,
      minimum_stock_level: Number(form.minimum_stock_level),
      expiry_date: form.expiry_date,
      description: form.description || undefined,
      raw_material_category_id: Number(form.raw_material_category_id),
      base_uom_id: Number(form.base_uom_id),
      supplier_id: Number(form.supplier_id),
      warehouse_id: Number(form.warehouse_id),
      unit_price_in_usd: toNumberOrNull(form.unit_price_in_usd),
      quantity: toNumberOrNull(form.quantity),
      exchange_rate_from_usd_to_riel: toNumberOrNull(
        form.exchange_rate_from_usd_to_riel,
      ),
      note: form.note || undefined,
      production_method: form.production_method,
      images: form.images.length > 0 ? form.images : undefined,
    };

    if (!uomValidation.isValid || !payload.base_uom_id) {
      setUomValidationError(INVALID_UOM_MESSAGE);
      return;
    }

    rawMaterialMutation.mutate(payload, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/raw-materials");
        } else {
          setForm(initialForm);
        }
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <Text.TitleMedium className="mb-2">
        Create a new Raw Material
      </Text.TitleMedium>
      <p className="text-sm text-muted-foreground mb-6">
        Fill in the details to add a new raw material to the inventory.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-4">
                <Text.TitleSmall>Basic Information</Text.TitleSmall>
                <p className="text-xs text-muted-foreground">
                  General details and storage setup for this raw material.
                </p>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    id="material_name"
                    label="Material Name"
                    placeholder="e.g., Steel Sheet"
                    value={form.material_name}
                    error={fieldErrors?.material_name?.[0]}
                    onChange={handleChange}
                    required
                  />

                  <SelectInput
                    id="production_method"
                    label="Production Method (Default FIFO)"
                    placeholder="Select production method"
                    error={fieldErrors?.production_method?.[0]}
                    options={PRODCUTION_METHOD}
                    value={form.production_method}
                    onChange={handleSelectChange("production_method")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SearchableSelect
                    id="raw_material_category_id"
                    label="Category"
                    placeholder="Select category"
                    fetchFn={fetchCategories}
                    value={form.raw_material_category_id}
                    onChange={handleSelectChange("raw_material_category_id")}
                    error={fieldErrors?.raw_material_category_id?.[0]}
                    selectedLabel={selectedCategory?.category_name}
                    onFetchError={handleDropdownError}
                    required
                  />
                  <SearchableSelect
                    id="uom_category_id"
                    label="Unit of Measurement"
                    placeholder="Search category or base unit…"
                    fetchFn={fetchUomCategories}
                    value={form.uom_category_id}
                    onChange={handleSelectChange("uom_category_id")}
                    error={fieldErrors?.base_uom_id?.[0]}
                    selectedLabel={uomSelectedLabel}
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
                    value={form.supplier_id}
                    onChange={handleSelectChange("supplier_id")}
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
                    value={form.warehouse_id}
                    onChange={handleSelectChange("warehouse_id")}
                    error={fieldErrors?.warehouse_id?.[0]}
                    selectedLabel={selectedWarehouse?.warehouse_name}
                    onFetchError={handleDropdownError}
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
                    value={form.expiry_date}
                    onChange={handleDateChange}
                    error={fieldErrors?.expiry_date?.[0]}
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
              </CardContent>
            </Card>

            {/* Initial Stock Movement */}
            <Card>
              <CardHeader className="pb-4">
                <Text.TitleSmall>
                  Initial Stock Movement (Purchase)
                </Text.TitleSmall>
                <p className="text-xs text-muted-foreground">
                  Sets the opening stock and valuation for this raw material.
                </p>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TextInput
                    id="quantity"
                    label="Initial Quantity"
                    placeholder="e.g., 50"
                    value={form.quantity}
                    onChange={handleChange}
                    isNumberOnly
                    required
                    error={fieldErrors?.quantity?.[0]}
                  />
                  <TextInput
                    id="unit_price_in_usd"
                    label="Unit Price (USD)"
                    placeholder="e.g., 2.50"
                    value={form.unit_price_in_usd}
                    onChange={handleChange}
                    required
                    error={fieldErrors?.unit_price_in_usd?.[0]}
                  />
                </div>
                <TextInput
                  id="exchange_rate_from_usd_to_riel"
                  label="Exchange Rate (USD - KHR)"
                  placeholder="e.g., 4100"
                  value={form.exchange_rate_from_usd_to_riel}
                  onChange={handleChange}
                  isNumberOnly
                  required
                  error={fieldErrors?.exchange_rate_from_usd_to_riel?.[0]}
                />
                <div className="w-full">
                  <TextAreaInput
                    id="note"
                    label="Note"
                    placeholder="e.g., Purchased from supplier A"
                    value={form.note}
                    onChange={handleTextAreaChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Selected cards + images */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-6 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <Text.TitleSmall>Selected Data Preview</Text.TitleSmall>
                  <p className="text-xs text-muted-foreground">
                    Review the full details of what you selected.
                  </p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 h-[30rem] overflow-y-scroll">
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

                    {form.uom_category_id ? (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Unit of Measurement Preview
                        </p>
                        <div className="rounded-lg border bg-card p-3">
                          <UomHierarchyPreview
                            categoryId={Number(form.uom_category_id)}
                            quantity={
                              Number(form.quantity) > 0
                                ? Number(form.quantity)
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        Select a unit of measurement category to see hierarchy
                        and card preview.
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <Text.TitleSmall>Images</Text.TitleSmall>
                  <p className="text-xs text-muted-foreground">
                    Upload up to 4 images for this raw material.
                  </p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <MultiImageUpload
                    onChange={handleImagesChange}
                    maxImages={3}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <FormFooterActions isSubmitting={rawMaterialMutation.isPending} />
      </form>
    </div>
  );
};
