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
  SelectInput,
} from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RawMaterialValidationErrors } from "@/api/raw-materials/raw-material.types";
import { Text } from "@/components/ui/text/app-text";
import { SearchableSelect } from "@/components/reusable/partials/searchable-select";
import { toNumberOrNull } from "../utils/check_num_null";

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
      uom_id: Number(form.uom_id),
      supplier_id: Number(form.supplier_id),
      warehouse_id: Number(form.warehouse_id),
      unit_price_in_usd: toNumberOrNull(form.unit_price_in_usd),
      quantity: toNumberOrNull(form.quantity),
      exchange_rate_from_usd_to_riel: toNumberOrNull(
        form.exchange_rate_from_usd_to_riel,
      ),
      note: form.note || undefined,
      images: form.images.length > 0 ? form.images : undefined,
    };

    rawMaterialMutation.mutate(payload, {
      onSuccess: () => {
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
            {/* Basic Information */}
            {/* Row 1: Material Name (alone) */}
            <div>
              <TextInput
                id="material_name"
                label="Material Name"
                placeholder="e.g., Steel Sheet"
                value={form.material_name}
                error={fieldErrors?.material_name?.[0]}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 2: Category, Unit of Measurement */}
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

            {/* Row 3: Supplier, Warehouse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
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

            {/* Row 4: Minimum Stock Level, Expiry Date */}
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
              <TextInput
                id="expiry_date"
                type="text"
                label="Expiry Date"
                placeholder="YYYY-MM-DD"
                value={form.expiry_date}
                error={fieldErrors?.expiry_date?.[0]}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 5: Description (alone) */}
            <div>
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
            <div className="border-t pt-6">
              <Text.TitleSmall className="mb-4">
                Initial Stock Movement (Purchase)
              </Text.TitleSmall>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <TextInput
                  id="exchange_rate_from_usd_to_riel"
                  label="Exchange Rate (USD to KHR)"
                  placeholder="e.g., 4100"
                  value={form.exchange_rate_from_usd_to_riel}
                  onChange={handleChange}
                  isNumberOnly
                  required
                  error={fieldErrors?.exchange_rate_from_usd_to_riel?.[0]}
                />
                <TextInput
                  id="note"
                  label="Note"
                  placeholder="e.g., Purchased from supplier A"
                  value={form.note}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Images */}
            <div className="border-t pt-6">
              <MultiImageUpload
                label="Raw Material Images"
                onChange={handleImagesChange}
                maxImages={4}
              />
            </div>

            <FormFooterActions isSubmitting={rawMaterialMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
