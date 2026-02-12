import { useCreateProductCategory } from "@/api/categories/product-categories/product-category.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { ColorPickerInput } from "@/components/reusable/partials/color-picker-input";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateProductCategoryValidationErrors } from "@/api/categories/types/category.type";
import { Text } from "@/components/ui/text/app-text";

export const CreateCategoryForm = () => {
  const categoryMutation = useCreateProductCategory();
  const error =
    categoryMutation.error as AxiosError<CreateProductCategoryValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();
  const initialForm = {
    category_name: "",
    label_color: "#6366F1",
    description: "",
  };

  const [form, setForm] = useState(initialForm);

  /* ---------- Handlers ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleColorChange = (color: string) => {
    setForm(prev => ({ ...prev, label_color: color }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    categoryMutation.mutate(form, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/categories?tab=product-category");
        } else {
          setForm(initialForm);
        }
      },
    });
  };
  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <Text.TitleMedium className="mb-2">
            Create Product Category
          </Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Create a new product category with name, description and label
            color.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <TextInput
                id="category_name"
                label="Category Name"
                placeholder="Enter category name"
                value={form.category_name}
                error={
                  fieldErrors?.category_name
                    ? fieldErrors.category_name[0]
                    : undefined
                }
                required={true}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <TextAreaInput
                id="description"
                label="Description"
                placeholder="Enter category description"
                value={form.description}
                error={
                  fieldErrors?.description
                    ? fieldErrors.description[0]
                    : undefined
                }
                onChange={handleTextAreaChange}
              />
            </div>

            {/* Label Colour */}
            <div>
              <ColorPickerInput
                id="label_color"
                label="Label Colour"
                value={form.label_color}
                error={
                  fieldErrors?.label_color
                    ? fieldErrors.label_color[0]
                    : undefined
                }
                onChange={handleColorChange}
              />
            </div>

            <FormFooterActions isSubmitting={categoryMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
