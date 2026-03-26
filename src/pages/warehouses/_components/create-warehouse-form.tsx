import { useCreateWarehouse } from "@/api/warehouses/warehouses.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState } from "react";
import { CreateWarehouseValidationErrors } from "@/api/warehouses/warehouses.types";
import MapPicker from "@/components/reusable/map-picker/map-picker";
import { useNavigate } from "react-router-dom";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const CreateWarehouseForm = () => {
  const warehouseMutation = useCreateWarehouse();
  const error =
    warehouseMutation.error as AxiosError<CreateWarehouseValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();
  const initialForm = {
    warehouse_name: "",
    warehouse_manager: "",
    warehouse_manager_contact: "",
    warehouse_manager_email: "",
    warehouse_address: "",
    latitude: "",
    longitude: "",
    warehouse_description: "",
    images: [] as File[],
  };

  const [form, setForm] = useState(initialForm);
  const [formKey, setFormKey] = useState(0);

  /* ---------- Handlers ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setForm(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    const payload = {
      ...form,
      latitude: form.latitude || undefined,
      longitude: form.longitude || undefined,
    };

    warehouseMutation.mutate(payload, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/warehouses");
        } else {
          setForm(initialForm);
          setFormKey(prev => prev + 1);
        }
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <Text.TitleMedium className="mb-2">Create a new Warehouse</Text.TitleMedium>
      <p className="text-sm text-muted-foreground mb-6">
        Fill in the details to add a new warehouse to the system.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <Text.TitleSmall>Warehouse Information</Text.TitleSmall>
            <p className="text-xs text-muted-foreground">Basic details and manager contact.</p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            <TextInput
              id="warehouse_name"
              label="Warehouse Name"
              placeholder="Enter warehouse name"
              value={form.warehouse_name}
              error={fieldErrors?.warehouse_name?.[0]}
              onChange={handleChange}
              required={true}
            />

            <TextAreaInput
              id="warehouse_address"
              label="Warehouse Address"
              required={true}
              placeholder="Enter warehouse address"
              value={form.warehouse_address}
              error={fieldErrors?.warehouse_address?.[0]}
              onChange={handleTextAreaChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <TextInput
                id="warehouse_manager"
                label="Warehouse Manager"
                placeholder="Enter manager name"
                value={form.warehouse_manager}
                error={fieldErrors?.warehouse_manager?.[0]}
                onChange={handleChange}
              />
              <TextInput
                id="warehouse_manager_contact"
                label="Manager Contact"
                placeholder="Enter contact number"
                value={form.warehouse_manager_contact}
                error={fieldErrors?.warehouse_manager_contact?.[0]}
                onChange={handleChange}
              />
              <TextInput
                id="warehouse_manager_email"
                type="email"
                label="Manager Email"
                placeholder="Enter email address"
                value={form.warehouse_manager_email}
                error={fieldErrors?.warehouse_manager_email?.[0]}
                onChange={handleChange}
              />
            </div>

            <TextAreaInput
              id="warehouse_description"
              label="Description"
              placeholder="Enter warehouse description"
              value={form.warehouse_description}
              error={fieldErrors?.warehouse_description?.[0]}
              onChange={handleTextAreaChange}
            />

            <div className="flex flex-col lg:flex-row w-full gap-4 items-stretch">
              <div className="w-full lg:w-1/2 h-full">
                <MultiImageUpload
                  key={formKey}
                  label="Warehouse Images"
                  onChange={handleImagesChange}
                  maxImages={3}
                />
              </div>
              <div className="w-full lg:w-1/2 h-full">
                <MapPicker
                  label="Warehouse Location"
                  onChange={(lat, lng) =>
                    setForm(prev => ({
                      ...prev,
                      latitude: lat.toString(),
                      longitude: lng.toString(),
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <FormFooterActions isSubmitting={warehouseMutation.isPending} />
      </form>
    </div>
  );
};
