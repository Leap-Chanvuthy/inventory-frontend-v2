import { useCreateProductCategory } from "@/api/categories/product-categories/product-category.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { ColorPickerInput } from "@/components/reusable/partials/color-picker-input";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateProductCategoryValidationErrors } from "@/api/categories/types/category.type";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <Text.TitleMedium className="mb-2">
        Create Product Category
      </Text.TitleMedium>
      <p className="text-sm text-muted-foreground mb-6">
        Create a new product category with name, description and label color.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <Text.TitleSmall>Category Details</Text.TitleSmall>
            <p className="text-xs text-muted-foreground">Name, description and label colour for this category.</p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            <TextInput
              id="category_name"
              label="Category Name"
              placeholder="Enter category name"
              value={form.category_name}
              error={fieldErrors?.category_name?.[0]}
              required={true}
              onChange={handleChange}
            />
            <TextAreaInput
              id="description"
              label="Description"
              placeholder="Enter category description"
              value={form.description}
              error={fieldErrors?.description?.[0]}
              onChange={handleTextAreaChange}
            />
            <ColorPickerInput
              id="label_color"
              label="Label Colour"
              value={form.label_color}
              error={fieldErrors?.label_color?.[0]}
              onChange={handleColorChange}
            />
          </CardContent>
        </Card>

        <FormFooterActions isSubmitting={categoryMutation.isPending} />
      </form>
    </div>
  );
};
