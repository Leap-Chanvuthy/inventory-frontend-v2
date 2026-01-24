import { useUpdateUOM } from "@/api/uom/uom.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateUOMValidationErrors, UOM } from "@/api/uom/uom.types";
import { UOMTypeSelect } from "./uom-type-select";

interface UpdateUOMFormProps {
  uom: UOM;
}

export const UpdateUOMForm = ({ uom }: UpdateUOMFormProps) => {
  const uomMutation = useUpdateUOM(uom.id);
  const error =
    uomMutation.error as AxiosError<CreateUOMValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    uom_type: "",
    description: "",
  });

  useEffect(() => {
    if (uom) {
      setForm({
        name: uom.name || "",
        symbol: uom.symbol || "",
        uom_type: uom.uom_type || "",
        description: uom.description || "",
      });
    }
  }, [uom]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleUOMTypeChange = (value: string) => {
    setForm(prev => ({ ...prev, uom_type: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    uomMutation.mutate(form, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/unit-of-measurement");
        }
      },
    });
  };

  return (
    <div>
      <div className="mx-6">
        <div className="rounded-2xl shadow-sm border p-8 mb-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Unit Name and Symbol - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <TextInput
                  id="name"
                  label="Unit Name"
                  placeholder="e.g., Kilogram"
                  value={form.name}
                  error={fieldErrors?.name ? fieldErrors.name[0] : undefined}
                  onChange={handleChange}
                  required
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
                onChange={handleChange}
              />
            </div>

            <FormFooterActions isSubmitting={uomMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
