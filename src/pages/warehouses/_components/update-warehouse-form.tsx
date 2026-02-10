import {
  useUpdateWarehouse,
  useDeleteWarehouseImage,
} from "@/api/warehouses/warehouses.mutation";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Text } from "@/components/ui/text/app-text";
import MapPicker from "@/components/reusable/map-picker/map-picker";

interface UpdateWarehouseValidationErrors {
  errors?: {
    warehouse_name?: string[];
    warehouse_manager?: string[];
    warehouse_manager_contact?: string[];
    warehouse_manager_email?: string[];
    warehouse_address?: string[];
    latitude?: string[];
    longitude?: string[];
    warehouse_description?: string[];
    images?: string[];
  };
}

export const UpdateWarehouseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const warehouseId = String(id);
  // const navigate = useNavigate();
  const { data: warehouse, isLoading } = useSingleWarehouse(warehouseId);
  const warehouseMutation = useUpdateWarehouse(warehouseId);
  const deleteImageMutation = useDeleteWarehouseImage(warehouseId);
  const error =
    warehouseMutation.error as AxiosError<UpdateWarehouseValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

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

  // Track existing images and images to delete
  const [existingImages, setExistingImages] = useState<
    { id: number; url: string }[]
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [isDeletingImages, setIsDeletingImages] = useState(false);

  // Pre-fill form
  useEffect(() => {
    if (warehouse) {
      setForm({
        warehouse_name: warehouse.warehouse_name || "",
        warehouse_manager: warehouse.warehouse_manager || "",
        warehouse_manager_contact: warehouse.warehouse_manager_contact || "",
        warehouse_manager_email: warehouse.warehouse_manager_email || "",
        warehouse_address: warehouse.warehouse_address || "",
        latitude: warehouse.latitude || "",
        longitude: warehouse.longitude || "",
        warehouse_description: warehouse.warehouse_description || "",
        images: [],
      });

      // Set existing images
      setExistingImages(
        warehouse.images?.map(img => ({ id: img.id, url: img.image })) || [],
      );
    }
  }, [warehouse]);

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

  const handleDeleteExistingImage = (imageId: number) => {
    // Remove from existing images
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    // Add to delete list
    setImagesToDelete(prev => [...prev, imageId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    if (imagesToDelete.length > 0) {
      setIsDeletingImages(true);
      try {
        for (const imageId of imagesToDelete) {
          // Give the image ID to delete the image first
          await deleteImageMutation.mutateAsync(imageId);
        }
      } finally {
        setIsDeletingImages(false);
      }
    }

    // Then update the warehouse
    const payload = {
      ...form,
      latitude: form.latitude || undefined,
      longitude: form.longitude || undefined,
    };

    warehouseMutation.mutate(payload, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/warehouses");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="animate-in slide-in-from-right-8 duration-300 my-5">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading warehouse data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <Text.TitleMedium className="mb-2">Update Warehouse</Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Update warehouse information and images.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
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
                required={true}
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
                required={true}
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
                isNumberOnly={true}
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

            {/* Warehouse Images & Map */}
            <div className="flex flex-col lg:flex-row w-full gap-4">
              <div className="w-full lg:w-1/2">
                <MultiImageUpload
                  label="Warehouse Images"
                  defaultImages={existingImages.map(img => img.url)}
                  defaultImageIds={existingImages.map(img => img.id)}
                  onChange={handleImagesChange}
                  onDeleteExisting={handleDeleteExistingImage}
                  maxImages={3}
                />
              </div>

              <div className="w-full lg:w-1/2">
                <MapPicker
                  label="Warehouse Location"
                  defaultPosition={
                    form.latitude && form.longitude
                      ? [parseFloat(form.latitude), parseFloat(form.longitude)]
                      : undefined
                  }
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

            <FormFooterActions
              isSubmitting={isDeletingImages || warehouseMutation.isPending}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
