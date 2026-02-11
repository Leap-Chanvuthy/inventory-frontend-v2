import { useCreateRawMaterial } from "@/api/raw-materials/raw-material.mutation";
import { useRawMaterialCategories } from "@/api/categories/raw-material-categories/raw-material-catergory.query";
import { useSuppliers } from "@/api/suppliers/supplier.query";
import { useWarehouses } from "@/api/warehouses/warehouses.query";
import { useUOMs } from "@/api/uom/uom.query";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";
import {
  TextInput,
  TextAreaInput,
  DatePickerInput,
  SelectInput,
} from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RawMaterialValidationErrors } from "@/api/raw-materials/raw-material.types";
import { Text } from "@/components/ui/text/app-text";
import { SearchableSelect } from "@/components/reusable/partials/searchable-select";
import { toNumberOrNull } from "../utils/check_num_null";
import { SupplierCard } from "@/pages/supplier/utils/table-feature";
import { WarehouseCard } from "@/pages/warehouses/utils/table-feature";
import { UOMCard } from "@/pages/uom/utils/table-feature";
import CategorySingleCard from "@/pages/category/_components/category-single-card";
import { PRODCUTION_METHOD } from "../utils/const";

export const CreateRawMaterialForm = () => {
  const rawMaterialMutation = useCreateRawMaterial();
  const error =
    rawMaterialMutation.error as AxiosError<RawMaterialValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

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

  const [form, setForm] = useState({
    material_name: "",
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
    production_method : "",
    images: [] as File[],
  });

  // Combined loading and error states
  const isLoading =
    categoriesLoading || suppliersLoading || warehousesLoading || uomsLoading;
  const hasError =
    categoriesError || suppliersError || warehousesError || uomsError;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading Raw Material...</p>
      </div>
    );
  }

  // Error state
  if (hasError) {
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
    suppliersData?.data?.data?.find(
      sup => String(sup.id) === form.supplier_id,
    ) || null;

  const selectedWarehouse =
    warehousesData?.data?.find(wh => String(wh.id) === form.warehouse_id) ||
    null;

  const selectedUOM =
    uomsData?.data?.find(uom => String(uom.id) === form.uom_id) || null;

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
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (value: string) => {
    setForm(prev => ({ ...prev, expiry_date: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setForm(prev => ({ ...prev, images: files }));
  };

  const clearForm = () => {
    setForm({
          material_name: "",
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
    production_method : "",
    images: [] as File[],
    });
  }

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
      uom_id: Number(form.uom_id),
      supplier_id: Number(form.supplier_id),
      warehouse_id: Number(form.warehouse_id),
      unit_price_in_usd: toNumberOrNull(form.unit_price_in_usd),
      quantity: toNumberOrNull(form.quantity),
      exchange_rate_from_usd_to_riel: toNumberOrNull(
        form.exchange_rate_from_usd_to_riel,
      ),
      note: form.note || undefined,
      production_method : form.production_method,
      images: form.images.length > 0 ? form.images : undefined,
    };

    rawMaterialMutation.mutate(payload, {
      onSuccess: () => {
        clearForm();
        if (action === "save_and_close") {
          navigate("/raw-materials");
        }
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
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
                <div className="rounded-xl border bg-card p-6 space-y-5">
                  <div>
                    <Text.TitleSmall>Basic Information</Text.TitleSmall>
                    <p className="text-sm text-muted-foreground mt-1">
                      General details and storage setup for this raw material.
                    </p>
                  </div>

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
                </div>

                {/* Initial Stock Movement */}
                <div className="rounded-xl border bg-card p-6 space-y-5">
                  <div>
                    <Text.TitleSmall>
                      Initial Stock Movement (Purchase)
                    </Text.TitleSmall>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sets the opening stock and valuation for this raw
                      material.
                    </p>
                  </div>

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
                </div>
              </div>

              {/* Right: Selected cards + images */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-6 space-y-6">
                  <div className="rounded-xl border bg-card p-6  h-[30rem] overflow-y-scroll">
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
                          <UOMCard
                            uom={selectedUOM}
                            hideActions={false}
                            interactive={false}
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

                  <div className="rounded-xl border bg-card p-6">
                    <Text.TitleSmall className="mb-2">Images</Text.TitleSmall>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload up to 4 images for this raw material.
                    </p>
                    <MultiImageUpload
                      label="Raw Material Images"
                      onChange={handleImagesChange}
                      maxImages={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            <FormFooterActions isSubmitting={rawMaterialMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
