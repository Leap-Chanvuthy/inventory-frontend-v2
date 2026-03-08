import { useCreateUomCategory } from "@/api/uom/uom.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UomCategoryValidationErrors } from "@/api/uom/uom.types";
import { Text } from "@/components/ui/text/app-text";

export const CreateCategoryForm = () => {
  const mutation = useCreateUomCategory();
  const error = mutation.error as AxiosError<UomCategoryValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const action = submitter?.value;

    mutation.mutate(
      { name: form.name, description: form.description || undefined },
      {
        onSuccess: () => {
          if (action === "save_and_close")
            navigate("/unit-of-measurement/categories");
          else setForm({ name: "", description: "" });
        },
      }
    );
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <div className="rounded-2xl shadow-sm border max-w-2xl p-8">
        <Text.TitleMedium className="mb-1">Category Details</Text.TitleMedium>
        <p className="text-sm text-muted-foreground mb-6">
          Categories group related units so conversions stay within the same
          domain (e.g. Weight, Volume, Count).
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            id="name"
            label="Category Name"
            placeholder="e.g., Weight"
            value={form.name}
            error={fieldErrors?.name?.[0]}
            required
            onChange={handleChange}
          />
          <TextAreaInput
            id="description"
            label="Description"
            placeholder="Describe what units belong in this category..."
            value={form.description}
            error={fieldErrors?.description?.[0]}
            onChange={handleChange}
          />
          <FormFooterActions isSubmitting={mutation.isPending} />
        </form>
      </div>
    </div>
  );
};
