import { useCreateWarehouse } from "@/api/warehouses/warehouses.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState } from "react";
import { CreateWarehouseValidationErrors } from "@/api/warehouses/warehouses.types";
import MapPicker from "@/components/reusable/map-picker/map-picker";
import { useNavigate } from "react-router-dom";

export const CreateWarehouseForm = () => {
  const warehouseMutation = useCreateWarehouse();
  const error =
    warehouseMutation.error as AxiosError<CreateWarehouseValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    warehouse_name: "",
    warehouse_manager: "",
    warehouse_manager_contact: "",
    warehouse_manager_email: "",
    warehouse_address: "",
    latitude: "",
    longitude: "",
    warehouse_description: "",
    images: [] as File[],
  });

  console.log("Form State: ", form);

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

    warehouseMutation.mutate(form, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/warehouses");
        }
        // save → stay, data auto-refreshed
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-2">
            Create a new Warehouse
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Below the inputs, there is an interactive map preview with.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Warehouse Name, Latitude, Longitude */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <TextInput
                id="warehouse_name"
                label="Warehouse Name"
                placeholder="Enter warehouse name"
                value={form.warehouse_name}
                error={
                  fieldErrors?.warehouse_name
                    ? fieldErrors.warehouse_name[0]
                    : undefined
                }
                onChange={handleChange}
              />
              <TextInput
                id="latitude"
                label="Latitude"
                placeholder="e.g., 11.562108"
                value={form.latitude}
                error={
                  fieldErrors?.latitude ? fieldErrors.latitude[0] : undefined
                }
                onChange={handleChange}
              />
              <TextInput
                id="longitude"
                label="Longitude"
                placeholder="e.g., 104.888535"
                value={form.longitude}
                error={
                  fieldErrors?.longitude ? fieldErrors.longitude[0] : undefined
                }
                onChange={handleChange}
              />
            </div>

            {/* Row 2: Warehouse Address (Full Width Textarea) */}
            <div>
              <TextAreaInput
                id="warehouse_address"
                label="Warehouse Address"
                placeholder="Enter warehouse address"
                value={form.warehouse_address}
                error={
                  fieldErrors?.warehouse_address
                    ? fieldErrors.warehouse_address[0]
                    : undefined
                }
                onChange={handleTextAreaChange}
              />
            </div>

            {/* Row 3: Warehouse Manager, Manager Contact, Manager Email */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <TextInput
                id="warehouse_manager"
                label="Warehouse Manager"
                placeholder="Enter manager name"
                value={form.warehouse_manager}
                error={
                  fieldErrors?.warehouse_manager
                    ? fieldErrors.warehouse_manager[0]
                    : undefined
                }
                onChange={handleChange}
              />
              <TextInput
                id="warehouse_manager_contact"
                label="Manager Contact"
                placeholder="Enter contact number"
                value={form.warehouse_manager_contact}
                error={
                  fieldErrors?.warehouse_manager_contact
                    ? fieldErrors.warehouse_manager_contact[0]
                    : undefined
                }
                onChange={handleChange}
              />
              <TextInput
                id="warehouse_manager_email"
                type="email"
                label="Manager Email"
                placeholder="Enter email address"
                value={form.warehouse_manager_email}
                error={
                  fieldErrors?.warehouse_manager_email
                    ? fieldErrors.warehouse_manager_email[0]
                    : undefined
                }
                onChange={handleChange}
              />
            </div>

            {/* Row 4: Description (Full Width Textarea) */}
            <div>
              <TextAreaInput
                id="warehouse_description"
                label="Description"
                placeholder="Enter warehouse description"
                value={form.warehouse_description}
                error={
                  fieldErrors?.warehouse_description
                    ? fieldErrors.warehouse_description[0]
                    : undefined
                }
                onChange={handleTextAreaChange}
              />
            </div>
            {/* Warehouse Images */}
            <div className="flex flex-col lg:flex-row w-full gap-4">
              <div className="w-full lg:w-1/2">
                <MultiImageUpload
                  label="Warehouse Images"
                  onChange={handleImagesChange}
                  maxImages={3}
                />
              </div>

              <div className="w-full lg:w-1/2">
                <MapPicker label="Warehouse Location" />
              </div>
            </div>

            <FormFooterActions isSubmitting={warehouseMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
