import { useUpdateProductCategory } from "@/api/categories/product-categories/product-category.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { ColorPickerInput } from "@/components/reusable/partials/color-picker-input";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSingleProductCategory } from "@/api/categories/product-categories/product-category.query";
import { CreateCategoryValidationErrors } from "@/api/categories/types/category.type";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";

export const UpdateCategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const navigate = useNavigate();
  const {
    data: categoryData,
    isLoading,
    isFetching,
    isError,
  } = useSingleProductCategory(categoryId);
  const categoryMutation = useUpdateProductCategory(categoryId);

  const error =
    categoryMutation.error as AxiosError<CreateCategoryValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  const [form, setForm] = useState({
    category_name: "",
    label_color: "#6366F1",
    description: "",
  });

  //  data is fetched
  useEffect(() => {
    if (categoryData?.data) {
      setForm({
        category_name: categoryData.data.category_name,
        label_color: categoryData.data.label_color,
        description: categoryData.data.description,
      });
    }
  }, [categoryData]);

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
        }
      },
    });
  };

  if (isLoading) return <DataCardLoading text="Loading category data..." />;
  if (isError && !isFetching)
    return (
      <UnexpectedError kind="fetch" homeTo="/categories?tab=product-category" />
    );
  if (!categoryData?.data)
    return <DataCardEmpty emptyText="Category not found." />;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
          <Text.TitleMedium className="mb-2">
            Update Product Category
          </Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Update the details for the selected product category.
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
