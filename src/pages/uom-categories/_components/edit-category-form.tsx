import { useUpdateUomCategory } from "@/api/uom/uom.mutation";
import { useSingleUomCategory } from "@/api/uom/uom.query";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UomCategoryValidationErrors } from "@/api/uom/uom.types";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";

export const EditCategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const { data: categoryData, isLoading, isFetching, isError } = useSingleUomCategory(Number(id));
  const category = categoryData?.data;
  const mutation = useUpdateUomCategory(Number(id));
  const error = mutation.error as AxiosError<UomCategoryValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name ?? "",
        description: category.description ?? "",
      });
    }
  }, [category]);

  if (isLoading) return <DataCardLoading text="Loading category..." />;
  if (isError && !isFetching) return <UnexpectedError kind="fetch" homeTo="/unit-of-measurement/categories" />;

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
        },
      }
    );
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <Text.TitleMedium className="mb-1">Edit Category</Text.TitleMedium>
      <p className="text-sm text-muted-foreground mb-6">
        Update the name or description of this UOM category.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <Text.TitleSmall>Category Details</Text.TitleSmall>
            <p className="text-xs text-muted-foreground">Update the name or description of this UOM category.</p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
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
          </CardContent>
        </Card>
        <FormFooterActions isSubmitting={mutation.isPending} />
      </form>
    </div>
  );
};
