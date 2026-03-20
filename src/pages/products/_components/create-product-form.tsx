import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Package, Factory, ShoppingCart } from "lucide-react";
import { useRawMaterials } from "@/api/raw-materials/raw-material.query";
import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { useRawMaterialCategories } from "@/api/categories/raw-material-categories/raw-material-catergory.query";

import {
  useCreateExternalPurchase,
  useCreateInternalManufacturing,
} from "@/api/product/product.mutation";

import {
  fetchProductCategories,
  fetchSuppliers,
  fetchWarehouses,
  fetchUOMs,
} from "../utils/fetch-select-options";
import { DataSelectionModal } from "@/components/reusable/data-modal/data-selection-modal";
import { RM_COLUMNS } from "../utils/raw-material-table-feature";
import { useSingleProductCategory } from "@/api/categories/product-categories/product-category.query";

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
import { Badge } from "@/components/ui/badge";

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

export const CreateProductForm = () => {
  const navigate = useNavigate();
  const externalMutation = useCreateExternalPurchase();
  const internalMutation = useCreateInternalManufacturing();

  const [sourceType, setSourceType] = useState<SourceType>("internal");
  const [base, setBase] = useState(initialBaseForm);
  const [external, setExternal] = useState(initialExternalForm);
  const [internal, setInternal] = useState(initialInternalForm);
  const [bomEntries, setBomEntries] = useState<BOMEntry[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // API Query States
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

    const basePayload = {
      product_name: base.product_name,
      barcode: base.barcode || undefined,
      product_description: base.product_description || undefined,
      product_category_id: Number(base.product_category_id),
      base_uom_id: Number(base.base_uom_id),
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
          {/* Header Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Text.TitleMedium className="mb-2">
                  Create a new Product
                </Text.TitleMedium>
              </div>
              <p className="text-slate-500 text-sm">
                Define your product specifications and manufacturing
                requirements.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Main Content (Left) */}
            <div className="lg:col-span-8 space-y-8">
              {/* General Info Card */}
              <section className="bg-white dark:bg-card rounded-2xl border shadow-sm p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div>
                    <Text.TitleSmall>General Information</Text.TitleSmall>
                    <p className="text-xs text-slate-400">
                      Basic identification and categorization.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <TextInput
                    id="product_name"
                    label="Product Name"
                    placeholder="e.g., Bamboo Toothbrush"
                    value={base.product_name}
                    onChange={handleBaseChange}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SearchableSelect
                      id="product_category_id"
                      label="Category"
                      fetchFn={fetchProductCategories}
                      value={base.product_category_id}
                      onChange={handleBaseSelect("product_category_id")}
                      selectedLabel={selectedCategory?.category_name}
                      required
                    />
                    <SearchableSelect
                      id="base_uom_id"
                      label="Unit of Measurement"
                      fetchFn={fetchUOMs}
                      value={base.base_uom_id}
                      onChange={handleBaseSelect("base_uom_id")}
                      required
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <TextAreaInput
                    id="product_description"
                    label="Product Description"
                    placeholder="Enter description..."
                    value={base.product_description}
                    onChange={handleBaseChange}
                  />
                </div>
              </section>

              {/* Sourcing & Logic Card */}
              <section className="bg-white dark:bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-8 border-b bg-slate-50/50 dark:bg-muted/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <Text.TitleSmall>Inventory Sourcing</Text.TitleSmall>
                        <p className="text-xs text-slate-400">
                          Choose how this item enters stock.
                        </p>
                      </div>
                    </div>
                    <Tabs
                      value={sourceType}
                      onValueChange={v => setSourceType(v as SourceType)}
                      className="w-full md:w-auto"
                    >
                      <TabsList className="grid grid-cols-2 w-full md:w-[320px] bg-white border">
                        <TabsTrigger value="internal" className="gap-2">
                          <Factory className="w-4 h-4" />
                          Internal
                        </TabsTrigger>
                        <TabsTrigger value="external" className="gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          External
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {sourceType === "external" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2">
                      <TextInput
                        id="quantity"
                        label="Quantity"
                        value={external.quantity}
                        onChange={handleSourceChange(setExternal)}
                        isNumberOnly
                        required
                      />
                      <TextInput
                        id="purchase_unit_price_in_usd"
                        label="Purchase Unit Price (USD)"
                        value={external.purchase_unit_price_in_usd}
                        onChange={handleSourceChange(setExternal)}
                        required
                      />
                      <TextInput
                        id="selling_unit_price_in_usd"
                        label="Selling Unit Price (USD)"
                        value={external.selling_unit_price_in_usd}
                        onChange={handleSourceChange(setExternal)}
                        required
                      />
                      <TextInput
                        id="exchange_rate_from_usd_to_riel"
                        label="Purchase Exchange Rate (USD→KHR)"
                        value={external.exchange_rate_from_usd_to_riel}
                        onChange={handleSourceChange(setExternal)}
                        isNumberOnly
                      />
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in slide-in-from-bottom-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          onChange={handleSourceChange(setInternal)}
                          isNumberOnly
                          required
                        />
                        <TextInput
                          id="selling_unit_price_in_usd"
                          label="Selling Unit Price (USD)"
                          placeholder="e.g., 12.00"
                          value={internal.selling_unit_price_in_usd}
                          onChange={handleSourceChange(setInternal)}
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
                          isNumberOnly
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            Bill of Materials (BOM)
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 border-dashed"
                            onClick={() => setPickerOpen(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Raw Material
                          </Button>
                        </div>

                        {bomEntries.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-2xl bg-slate-50/50">
                            <Package className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="text-sm text-slate-400">
                              No raw materials linked yet.
                            </p>
                          </div>
                        ) : (
                          <div className="border rounded-xl bg-white overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50 border-b">
                                <tr>
                                  <th className="text-left p-4 font-semibold text-slate-600">
                                    Material
                                  </th>
                                  <th className="text-left p-4 font-semibold text-slate-600">
                                    Required Qty
                                  </th>
                                  <th className="w-12"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {bomEntries.map(entry => (
                                  <tr
                                    key={entry.raw_material.id}
                                    className="border-b last:border-0 hover:bg-slate-50/50 transition-colors"
                                  >
                                    <td className="p-4">
                                      <div className="font-medium text-slate-900">
                                        {entry.raw_material.material_name}
                                      </div>
                                      <div className="text-xs text-slate-400">
                                        {entry.raw_material.material_sku_code}
                                      </div>
                                    </td>
                                    <td className="p-4 w-40">
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
                                        isNumberOnly
                                      />
                                    </td>
                                    <td className="p-4">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
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
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
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
                </div>
              </section>
            </div>
            {/* Sidebar (Right) */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-8 space-y-6">
                {/* Media Card */}
                <section className="bg-white dark:bg-card rounded-2xl border shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Text.TitleSmall>Product Media</Text.TitleSmall>
                  </div>
                  <MultiImageUpload
                    label=""
                    onChange={files => setBase(p => ({ ...p, images: files }))}
                    maxImages={4}
                  />
                </section>

                {/* Logistics Card */}
                <section className="bg-white dark:bg-card rounded-2xl border shadow-sm p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <Text.TitleSmall>Logistics</Text.TitleSmall>
                  </div>
                  <div className="space-y-4">
                    <SearchableSelect
                      id="supplier_id"
                      label="Supplier"
                      fetchFn={fetchSuppliers}
                      value={base.supplier_id}
                      onChange={handleBaseSelect("supplier_id")}
                      required
                    />
                    <SearchableSelect
                      id="warehouse_id"
                      label="Warehouse"
                      fetchFn={fetchWarehouses}
                      value={base.warehouse_id}
                      onChange={handleBaseSelect("warehouse_id")}
                      required
                    />
                    <DatePickerInput
                      id="movement_date"
                      label="Movement Date"
                      value={base.movement_date}
                      onChange={v => setBase(p => ({ ...p, movement_date: v }))}
                    />
                  </div>
                </section>
              </div>
            </div>
            <div className="lg:col-span-12">
              <FormFooterActions
                isSubmitting={
                  externalMutation.isPending || internalMutation.isPending
                }
              />
            </div>
          </form>
        </div>
      </div>

      <DataSelectionModal<RawMaterial>
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setRmSearch("");
          setRmPage(1);
        }}
        onConfirm={(selected: RawMaterial[]) => {
          const newEntries = selected
            .filter(
              (rm: RawMaterial) =>
                !bomEntries.some(e => e.raw_material.id === rm.id),
            )
            .map((rm: RawMaterial) => ({ raw_material: rm, quantity: 1 }));
          setBomEntries(prev => [...prev, ...newEntries]);
        }}
        title="Select Raw Materials"
        scope="bom-raw-materials"
        data={rmData?.data ?? []}
        isLoading={rmLoading}
        columns={RM_COLUMNS}
        getRowId={rm => rm.id}
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
