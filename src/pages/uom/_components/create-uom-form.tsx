import { useCreateUOM } from "@/api/uom/uom.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateUOMValidationErrors } from "@/api/uom/uom.types";
import { UOMTypeSelect } from "./uom-type-select";

export const CreateUOMForm = () => {
  const uomMutation = useCreateUOM();
  const error =
    uomMutation.error as AxiosError<CreateUOMValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    uom_type: "",
    description: "",
    is_active: true,
  });

  /* ---------- Handlers ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleUOMTypeChange = (value: string) => {
    setForm(prev => ({ ...prev, uom_type: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    uomMutation.mutate(form, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/unit-of-measurement");
        } else {
          // setForm({
          //   name: "",
          //   symbol: "",
          //   uom_type: "",
          //   description: "",
          //   is_active: true,
          // });
        }
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-2">Unit Details</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Manage the properties of this unit of measurement.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Unit Name and Symbol - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextInput
                  id="name"
                  label="Unit Name"
                  placeholder="e.g., Kilogram"
                  value={form.name}
                  error={fieldErrors?.name ? fieldErrors.name[0] : undefined}
                  required={true}
                  onChange={handleChange}
                />
              </div>

              <div>
                <TextInput
                  id="symbol"
                  label="Symbol"
                  placeholder="e.g., kg"
                  value={form.symbol}
                  error={
                    fieldErrors?.symbol ? fieldErrors.symbol[0] : undefined
                  }
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* UOM Type */}
            <UOMTypeSelect
              value={form.uom_type}
              onValueChange={handleUOMTypeChange}
              error={fieldErrors?.uom_type?.[0]}
              required={true}
            />

            {/* Description */}
            <div>
              <TextAreaInput
                id="description"
                label="Description"
                placeholder="Provide a brief description of the unit..."
                value={form.description}
                error={
                  fieldErrors?.description
                    ? fieldErrors.description[0]
                    : undefined
                }
                onChange={handleTextAreaChange}
              />
            </div>

            <FormFooterActions isSubmitting={uomMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
