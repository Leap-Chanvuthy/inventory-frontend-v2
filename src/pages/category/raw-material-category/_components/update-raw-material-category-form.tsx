import { useUpdateRawMaterialCategory } from "@/api/categories/raw-material-categories/raw-material-category.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { ColorPickerInput } from "@/components/reusable/partials/color-picker-input";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateCategoryValidationErrors } from "@/api/categories/types/category.type";
import { useSingleRawMaterialCategory } from "@/api/categories/raw-material-categories/raw-material-catergory.query";
import { Text } from "@/components/ui/text/app-text";
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
    isError,
    isFetching,
  } = useSingleRawMaterialCategory(categoryId);
  const categoryMutation = useUpdateRawMaterialCategory(categoryId);

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
          navigate("/categories?tab=raw-material-category");
        }
        // save → stay, data auto-refreshed
      },
    });
  };

  if (isLoading) return <DataCardLoading text="Loading category data..." />;
  if (isError && !isFetching)
    return (
      <UnexpectedError
        kind="fetch"
        homeTo="/categories?tab=raw-material-category"
      />
    );
  if (!categoryData?.data)
    return <DataCardEmpty emptyText="Category not found." />;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <Text.TitleMedium className="mb-2">
            Update Raw Material Category
          </Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Update the details for the selected product category.
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
