import { useUpdateUOM } from "@/api/uom/uom.mutation";
import { useUomCategories, useUOMs } from "@/api/uom/uom.query";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { SearchableSelect } from "@/components/reusable/partials/searchable-select";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateUOMValidationErrors, UOM } from "@/api/uom/uom.types";
import { Text } from "@/components/ui/text/app-text";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickCreateUomModal } from "./quick-create-uom-modal";

interface UpdateUOMFormProps {
  uom: UOM;
}

export const UpdateUOMForm = ({ uom }: UpdateUOMFormProps) => {
  const uomMutation = useUpdateUOM(uom.id);
  const error = uomMutation.error as AxiosError<CreateUOMValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    uom_code: "",
    symbol: "",
    description: "",
    is_active: true,
    category_id: "",
    is_base_unit: false,
    base_uom_id: "",
    conversion_factor: "1",
  });

  // Populate form from loaded UOM
  useEffect(() => {
    if (uom) {
      setForm({
        name: uom.name ?? "",
        uom_code: uom.uom_code ?? "",
        symbol: uom.symbol ?? "",
        description: uom.description ?? "",
        is_active: !!uom.is_active,
        category_id: uom.category_id ? String(uom.category_id) : "",
        is_base_unit: !!uom.is_base_unit,
        base_uom_id: uom.base_uom_id ? String(uom.base_uom_id) : "",
        conversion_factor: uom.conversion_factor ? String(uom.conversion_factor) : "1",
      });
    }
  }, [uom]);

  // Lock conversion_factor to 1 when switching to base unit
  useEffect(() => {
    if (form.is_base_unit) {
      setForm(prev => ({ ...prev, conversion_factor: "1", base_uom_id: "" }));
    }
  }, [form.is_base_unit]);

  // Category options
  const { data: categoriesData } = useUomCategories({ per_page: 100 });
  const categoryOptions = (categoriesData?.data ?? []).map(c => ({
    value: String(c.id),
    label: c.name,
  }));

  // Base unit options (filtered by category)
  const { data: baseUnitsData } = useUOMs(
    form.category_id
      ? {
          "filter[category_id]": Number(form.category_id),
          "filter[is_base_unit]": true,
          per_page: 100,
        }
      : undefined
  );
  const baseUnitOptions = (baseUnitsData?.data ?? []).map(u => ({
    value: String(u.id),
    label: `${u.name}${u.symbol ? ` (${u.symbol})` : ""}`,
  }));

  // Base UOM is auto-linked from category and cannot be changed manually.
  useEffect(() => {
    if (form.is_base_unit || !form.category_id) return;

    const autoBase = baseUnitOptions[0]?.value ?? "";
    if (form.base_uom_id !== autoBase) {
      setForm(prev => ({ ...prev, base_uom_id: autoBase }));
    }
  }, [baseUnitOptions, form.category_id, form.base_uom_id, form.is_base_unit]);

  const selectedBaseUom = (baseUnitsData?.data ?? []).find(
    u => String(u.id) === form.base_uom_id
  ) as UOM | undefined;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const action = submitter?.value;

    uomMutation.mutate(
      {
        name: form.name,
        symbol: form.symbol || undefined,
        description: form.description || undefined,
        is_active: form.is_active,
        category_id: form.category_id ? Number(form.category_id) : null,
        is_base_unit: form.is_base_unit,
        base_uom_id:
          form.is_base_unit || !form.base_uom_id
            ? null
            : Number(form.base_uom_id),
        conversion_factor: form.is_base_unit
          ? 1
          : parseFloat(form.conversion_factor) || 1,
      },
      {
        onSuccess: () => {
          if (action === "save_and_close") navigate("/unit-of-measurement");
        },
      }
    );
  };

  return (
    <div className="mx-6 space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Section 1: General Information ────────────────────────────── */}
        <div className="rounded-2xl shadow-sm border p-8">
          <Text.TitleMedium className="mb-1">General Information</Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Basic identification details for this unit of measurement.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TextInput
                id="name"
                label="Unit Name"
                placeholder="e.g., Kilogram"
                value={form.name}
                error={fieldErrors?.name?.[0]}
                required
                onChange={handleChange}
              />
              {/* Code is immutable after creation — shown read-only */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">UOM Code</label>
                <div className="h-9 px-3 flex items-center rounded-md border bg-muted/40 text-sm font-mono text-muted-foreground select-none">
                  {form.uom_code || <span className="italic">—</span>}
                </div>
                <p className="text-xs text-muted-foreground">Auto-generated &mdash; cannot be changed.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TextInput
                id="symbol"
                label="Symbol"
                placeholder="e.g., kg"
                value={form.symbol}
                error={fieldErrors?.symbol?.[0]}
                onChange={handleChange}
              />
              <SearchableSelect
                id="category_id"
                label="Category"
                placeholder="Select a category"
                value={form.category_id}
                options={categoryOptions}
                onChange={val =>
                  setForm(prev => ({ ...prev, category_id: val, base_uom_id: "" }))
                }
                error={fieldErrors?.category_id?.[0]}
              />
            </div>

            <TextAreaInput
              id="description"
              label="Description"
              placeholder="Provide a brief description..."
              value={form.description}
              error={fieldErrors?.description?.[0]}
              onChange={handleChange}
            />

            <div className="flex items-center justify-between py-3 px-4 rounded-lg border bg-muted/20">
              <div>
                <Label className="text-sm font-medium">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inactive units cannot be assigned to products or raw materials.
                </p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={val =>
                  setForm(prev => ({ ...prev, is_active: val }))
                }
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Conversion Configuration ────────────────────────── */}
        <div className="rounded-2xl shadow-sm border p-8 bg-indigo-50/30 dark:bg-indigo-950/10">
          <Text.TitleMedium className="mb-1">Conversion Configuration</Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Define how this unit relates to others in the same category.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 px-4 rounded-lg border bg-background">
              <div>
                <Label className="text-sm font-medium">Is Base Unit</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The base unit is the smallest reference unit in this category.
                </p>
              </div>
              <Switch
                checked={form.is_base_unit}
                onCheckedChange={val =>
                  setForm(prev => ({ ...prev, is_base_unit: val }))
                }
              />
            </div>

            {form.is_base_unit && (
              <div className="flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-3.5">
                <Info className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 dark:text-green-400">
                  Base units represent the smallest measurement unit in this
                  category. The conversion factor is automatically{" "}
                  <strong>1</strong>.
                </p>
              </div>
            )}

            {!form.is_base_unit && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Base Unit</Label>
                      <div className="mt-1 h-9 px-3 flex items-center gap-2 rounded-md border bg-muted/40 text-sm text-muted-foreground select-none">
                        <span>
                          {selectedBaseUom
                            ? `${selectedBaseUom.name}${selectedBaseUom.symbol ? ` (${selectedBaseUom.symbol})` : ""}`
                            : form.category_id
                              ? "No base unit found for selected category"
                              : "Select a category first"}
                        </span>
                        {selectedBaseUom && (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px] font-semibold uppercase tracking-wide border border-emerald-300">
                            Base Unit
                          </Badge>
                        )}
                      </div>
                      {fieldErrors?.base_uom_id?.[0] && (
                        <p className="mt-1 text-xs text-destructive">{fieldErrors.base_uom_id[0]}</p>
                      )}
                    </div>
                    {selectedBaseUom && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 mb-0.5"
                        title="Quickly create a child unit linked to this base"
                        onClick={() => setQuickCreateOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This UOM is automatically linked to the base unit of the category and cannot be changed.
                  </p>
                </div>

                <div>
                  <TextInput
                    id="conversion_factor"
                    type="number"
                    label="Conversion Factor"
                    placeholder="e.g., 1000"
                    value={form.conversion_factor}
                    error={fieldErrors?.conversion_factor?.[0]}
                    required
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    How many base units are contained in one of this unit.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <FormFooterActions isSubmitting={uomMutation.isPending} />
      </form>

      {selectedBaseUom && (
        <QuickCreateUomModal
          open={quickCreateOpen}
          onClose={() => setQuickCreateOpen(false)}
          baseUnit={selectedBaseUom}
          onCreated={_newUom => {
            // The new derived unit refreshes in place
          }}
        />
      )}
    </div>
  );
};
