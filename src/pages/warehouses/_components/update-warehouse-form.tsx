import {
  useUpdateWarehouse,
  useDeleteWarehouseImage,
  useDeleteSubWarehouse,
  useUpdateSubWarehouse,
} from "@/api/warehouses/warehouses.mutation";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";
import {
  SubWarehouse,
  SubWarehousePayload,
  UpdateWarehouseValidationErrors,
} from "@/api/warehouses/warehouses.types";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Text } from "@/components/ui/text/app-text";
import MapPicker from "@/components/reusable/map-picker/map-picker";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/reusable/partials/delete-modal";
import { Plus, SquarePen, Trash2, X } from "lucide-react";

const createEmptySubWarehouse = (): SubWarehousePayload => ({
  warehouse_name: "",
  warehouse_manager: "",
  warehouse_manager_contact: "",
  warehouse_manager_email: "",
  warehouse_address: "",
  latitude: "",
  longitude: "",
  warehouse_description: "",
});

const normalizeSubWarehousePayload = (
  subWarehouse: SubWarehousePayload,
): SubWarehousePayload => ({
  warehouse_name: subWarehouse.warehouse_name,
  warehouse_address: subWarehouse.warehouse_address,
  warehouse_manager: subWarehouse.warehouse_manager || undefined,
  warehouse_manager_contact: subWarehouse.warehouse_manager_contact || undefined,
  warehouse_manager_email: subWarehouse.warehouse_manager_email || undefined,
  latitude: subWarehouse.latitude || undefined,
  longitude: subWarehouse.longitude || undefined,
  warehouse_description: subWarehouse.warehouse_description || undefined,
});

export const UpdateWarehouseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const warehouseId = String(id);
  const {
    data: warehouse,
    isLoading,
    isFetching,
    isError,
  } = useSingleWarehouse(warehouseId);

  const warehouseMutation = useUpdateWarehouse(warehouseId);
  const deleteImageMutation = useDeleteWarehouseImage(warehouseId);
  const deleteSubWarehouseMutation = useDeleteSubWarehouse(warehouseId);
  const updateSubWarehouseMutation = useUpdateSubWarehouse(warehouseId);

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

  const [existingImages, setExistingImages] = useState<
    { id: number; url: string }[]
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [isDeletingImages, setIsDeletingImages] = useState(false);

  const [subWarehouses, setSubWarehouses] = useState<SubWarehouse[]>([]);
  const [editingSubWarehouseId, setEditingSubWarehouseId] = useState<number | null>(
    null,
  );
  const [editingSubWarehouseForm, setEditingSubWarehouseForm] =
    useState<SubWarehousePayload>(createEmptySubWarehouse());

  const [addMoreSubWarehouses, setAddMoreSubWarehouses] = useState<
    SubWarehousePayload[]
  >([]);

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

      setExistingImages(
        warehouse.images?.map((img) => ({ id: img.id, url: img.image })) || [],
      );
      setSubWarehouses(warehouse.sub_warehouses || []);
    }
  }, [warehouse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id: fieldId, value } = e.target;
    setForm((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id: fieldId, value } = e.target;
    setForm((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setForm((prev) => ({ ...prev, images: files }));
  };

  const handleDeleteExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  const handleEditSubWarehouse = (subWarehouse: SubWarehouse) => {
    setEditingSubWarehouseId(subWarehouse.id);
    setEditingSubWarehouseForm({
      warehouse_name: subWarehouse.warehouse_name || "",
      warehouse_manager: subWarehouse.warehouse_manager || "",
      warehouse_manager_contact: subWarehouse.warehouse_manager_contact || "",
      warehouse_manager_email: subWarehouse.warehouse_manager_email || "",
      warehouse_address: subWarehouse.warehouse_address || "",
      latitude: subWarehouse.latitude || "",
      longitude: subWarehouse.longitude || "",
      warehouse_description: subWarehouse.warehouse_description || "",
    });
  };

  const handleUpdateSubWarehouse = async () => {
    if (!editingSubWarehouseId) return;

    await updateSubWarehouseMutation.mutateAsync({
      subWarehouseId: editingSubWarehouseId,
      payload: normalizeSubWarehousePayload(editingSubWarehouseForm),
    });

    setSubWarehouses((prev) =>
      prev.map((item) =>
        item.id === editingSubWarehouseId
          ? {
              ...item,
              ...editingSubWarehouseForm,
              warehouse_manager: editingSubWarehouseForm.warehouse_manager || null,
              warehouse_manager_contact:
                editingSubWarehouseForm.warehouse_manager_contact || null,
              warehouse_manager_email:
                editingSubWarehouseForm.warehouse_manager_email || null,
              latitude: editingSubWarehouseForm.latitude || null,
              longitude: editingSubWarehouseForm.longitude || null,
              warehouse_description:
                editingSubWarehouseForm.warehouse_description || null,
            }
          : item,
      ),
    );

    setEditingSubWarehouseId(null);
    setEditingSubWarehouseForm(createEmptySubWarehouse());
  };

  const handleDeleteSubWarehouse = (subWarehouseId: number) => {
    deleteSubWarehouseMutation.mutate(subWarehouseId, {
      onSuccess: () => {
        setSubWarehouses((prev) => prev.filter((item) => item.id !== subWarehouseId));
      },
    });
  };

  const handleAddMoreSubWarehouseChange = (
    index: number,
    field: keyof SubWarehousePayload,
    value: string,
  ) => {
    setAddMoreSubWarehouses((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const appendMoreSubWarehouseForm = () => {
    setAddMoreSubWarehouses((prev) => [...prev, createEmptySubWarehouse()]);
  };

  const removeMoreSubWarehouseForm = (index: number) => {
    setAddMoreSubWarehouses((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const hasAnySubWarehouseValue = (subWarehouse: SubWarehousePayload) =>
    Object.values(subWarehouse).some((value) => String(value ?? "").trim() !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    if (imagesToDelete.length > 0) {
      setIsDeletingImages(true);
      try {
        for (const imageId of imagesToDelete) {
          await deleteImageMutation.mutateAsync(imageId);
        }
      } finally {
        setIsDeletingImages(false);
      }
    }

    const payload = {
      ...form,
      latitude: form.latitude || undefined,
      longitude: form.longitude || undefined,
      sub_warehouses: addMoreSubWarehouses
        .filter(hasAnySubWarehouseValue)
        .map((item) => normalizeSubWarehousePayload(item)),
    };

    warehouseMutation.mutate(payload, {
      onSuccess: () => {
        setAddMoreSubWarehouses([]);
        if (action === "save_and_close") {
          navigate("/warehouses");
        }
      },
    });
  };

  if (isLoading) {
    return <DataCardLoading text="Loading warehouse details data..." />;
  }

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" homeTo="/warehouses" />;
  }

  if (!warehouse) return <DataCardEmpty emptyText="Warehouse not found." />;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <Text.TitleMedium className="mb-2">Update Warehouse</Text.TitleMedium>
      <p className="text-sm text-muted-foreground mb-6">
        Update warehouse information, manage sub warehouses, and append new sub warehouses.
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
              placeholder="Enter warehouse address"
              value={form.warehouse_address}
              error={fieldErrors?.warehouse_address?.[0]}
              onChange={handleTextAreaChange}
              required={true}
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
                isNumberOnly={true}
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
                  label="Warehouse Images"
                  defaultImages={existingImages.map((img) => img.url)}
                  defaultImageIds={existingImages.map((img) => img.id)}
                  onChange={handleImagesChange}
                  onDeleteExisting={handleDeleteExistingImage}
                  maxImages={3}
                />
              </div>
              <div className="w-full lg:w-1/2 h-full">
                <MapPicker
                  label="Warehouse Location"
                  defaultPosition={
                    form.latitude && form.longitude
                      ? [parseFloat(form.latitude), parseFloat(form.longitude)]
                      : undefined
                  }
                  onChange={(lat, lng) =>
                    setForm((prev) => ({
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

        <Card>
          <CardHeader className="pb-4">
            <Text.TitleSmall>Existing Sub Warehouses</Text.TitleSmall>
            <p className="text-xs text-muted-foreground">
              Update or delete each sub warehouse directly from this list.
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            {subWarehouses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sub warehouses found.</p>
            ) : (
              subWarehouses.map((subWarehouse) => (
                <div
                  key={subWarehouse.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{subWarehouse.warehouse_name}</p>
                    <p className="text-sm text-muted-foreground">{subWarehouse.warehouse_address}</p>
                    <p className="text-xs text-muted-foreground">
                      Manager: {subWarehouse.warehouse_manager || "-"} | Contact: {subWarehouse.warehouse_manager_contact || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Email: {subWarehouse.warehouse_manager_email || "-"}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <SquarePen className="h-4 w-4 mr-2" onClick={() => handleEditSubWarehouse(subWarehouse)}/>
                    <DeleteModal
                      heading="Delete Sub Warehouse"
                      subheading={`Are you sure you want to delete "${subWarehouse.warehouse_name}"? This action cannot be undone.`}
                      tooltipText="Delete Sub Warehouse"
                      onDelete={() => handleDeleteSubWarehouse(subWarehouse.id)}
                    />
                  </div>
                </div>
              ))
            )}

            {editingSubWarehouseId && (
              <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <Text.TitleSmall>Update Sub Warehouse</Text.TitleSmall>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingSubWarehouseId(null);
                      setEditingSubWarehouseForm(createEmptySubWarehouse());
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <TextInput
                    id="edit_sub_warehouse_name"
                    label="Warehouse Name"
                    value={editingSubWarehouseForm.warehouse_name || ""}
                    onChange={(e) =>
                      setEditingSubWarehouseForm((prev) => ({
                        ...prev,
                        warehouse_name: e.target.value,
                      }))
                    }
                    required={true}
                  />

                  <TextAreaInput
                    id="edit_sub_warehouse_address"
                    label="Warehouse Address"
                    value={editingSubWarehouseForm.warehouse_address || ""}
                    onChange={(e) =>
                      setEditingSubWarehouseForm((prev) => ({
                        ...prev,
                        warehouse_address: e.target.value,
                      }))
                    }
                    required={true}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <TextInput
                      id="edit_sub_warehouse_manager"
                      label="Warehouse Manager"
                      value={editingSubWarehouseForm.warehouse_manager || ""}
                      onChange={(e) =>
                        setEditingSubWarehouseForm((prev) => ({
                          ...prev,
                          warehouse_manager: e.target.value,
                        }))
                      }
                    />
                    <TextInput
                      id="edit_sub_warehouse_manager_contact"
                      label="Manager Contact"
                      value={editingSubWarehouseForm.warehouse_manager_contact || ""}
                      onChange={(e) =>
                        setEditingSubWarehouseForm((prev) => ({
                          ...prev,
                          warehouse_manager_contact: e.target.value,
                        }))
                      }
                      isNumberOnly={true}
                    />
                    <TextInput
                      id="edit_sub_warehouse_manager_email"
                      type="email"
                      label="Manager Email"
                      value={editingSubWarehouseForm.warehouse_manager_email || ""}
                      onChange={(e) =>
                        setEditingSubWarehouseForm((prev) => ({
                          ...prev,
                          warehouse_manager_email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TextInput
                      id="edit_sub_warehouse_latitude"
                      label="Latitude"
                      value={editingSubWarehouseForm.latitude || ""}
                      onChange={(e) =>
                        setEditingSubWarehouseForm((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                    />
                    <TextInput
                      id="edit_sub_warehouse_longitude"
                      label="Longitude"
                      value={editingSubWarehouseForm.longitude || ""}
                      onChange={(e) =>
                        setEditingSubWarehouseForm((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <TextAreaInput
                    id="edit_sub_warehouse_description"
                    label="Description"
                    value={editingSubWarehouseForm.warehouse_description || ""}
                    onChange={(e) =>
                      setEditingSubWarehouseForm((prev) => ({
                        ...prev,
                        warehouse_description: e.target.value,
                      }))
                    }
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleUpdateSubWarehouse}
                      disabled={updateSubWarehouseMutation.isPending}
                    >
                      {updateSubWarehouseMutation.isPending ? "Updating..." : "Update Sub Warehouse"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Text.TitleSmall>Add More Sub Warehouses</Text.TitleSmall>
                <p className="text-xs text-muted-foreground mt-1">
                  Add new sub warehouses while updating this warehouse.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={appendMoreSubWarehouseForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sub Warehouse
              </Button>
            </div>
          </CardHeader>

          {addMoreSubWarehouses.length > 0 && (
            <>
              <Separator />
              <CardContent className="pt-6 space-y-4">
                {addMoreSubWarehouses.map((subWarehouse, index) => (
                  <div key={`new-sub-warehouse-${index}`} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Text.TitleSmall>New Sub Warehouse {index + 1}</Text.TitleSmall>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMoreSubWarehouseForm(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <TextInput
                      id={`new_sub_warehouse_name_${index}`}
                      label="Warehouse Name"
                      value={subWarehouse.warehouse_name || ""}
                      onChange={(e) =>
                        handleAddMoreSubWarehouseChange(index, "warehouse_name", e.target.value)
                      }
                      error={fieldErrors?.[`sub_warehouses.${index}.warehouse_name`]?.[0]}
                    />

                    <TextAreaInput
                      id={`new_sub_warehouse_address_${index}`}
                      label="Warehouse Address"
                      value={subWarehouse.warehouse_address || ""}
                      onChange={(e) =>
                        handleAddMoreSubWarehouseChange(index, "warehouse_address", e.target.value)
                      }
                      error={fieldErrors?.[`sub_warehouses.${index}.warehouse_address`]?.[0]}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <TextInput
                        id={`new_sub_warehouse_manager_${index}`}
                        label="Warehouse Manager"
                        value={subWarehouse.warehouse_manager || ""}
                        onChange={(e) =>
                          handleAddMoreSubWarehouseChange(index, "warehouse_manager", e.target.value)
                        }
                      />
                      <TextInput
                        id={`new_sub_warehouse_manager_contact_${index}`}
                        label="Manager Contact"
                        value={subWarehouse.warehouse_manager_contact || ""}
                        onChange={(e) =>
                          handleAddMoreSubWarehouseChange(
                            index,
                            "warehouse_manager_contact",
                            e.target.value,
                          )
                        }
                        isNumberOnly={true}
                      />
                      <TextInput
                        id={`new_sub_warehouse_manager_email_${index}`}
                        type="email"
                        label="Manager Email"
                        value={subWarehouse.warehouse_manager_email || ""}
                        onChange={(e) =>
                          handleAddMoreSubWarehouseChange(
                            index,
                            "warehouse_manager_email",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <TextInput
                        id={`new_sub_warehouse_latitude_${index}`}
                        label="Latitude"
                        value={subWarehouse.latitude || ""}
                        onChange={(e) =>
                          handleAddMoreSubWarehouseChange(index, "latitude", e.target.value)
                        }
                      />
                      <TextInput
                        id={`new_sub_warehouse_longitude_${index}`}
                        label="Longitude"
                        value={subWarehouse.longitude || ""}
                        onChange={(e) =>
                          handleAddMoreSubWarehouseChange(index, "longitude", e.target.value)
                        }
                      />
                    </div>

                    <TextAreaInput
                      id={`new_sub_warehouse_description_${index}`}
                      label="Description"
                      value={subWarehouse.warehouse_description || ""}
                      onChange={(e) =>
                        handleAddMoreSubWarehouseChange(
                          index,
                          "warehouse_description",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </>
          )}
        </Card>

        <FormFooterActions
          isSubmitting={
            isDeletingImages ||
            warehouseMutation.isPending ||
            deleteSubWarehouseMutation.isPending ||
            updateSubWarehouseMutation.isPending
          }
        />
      </form>
    </div>
  );
};
