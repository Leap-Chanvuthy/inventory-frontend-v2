import { useCreateWarehouse } from "@/api/warehouses/warehouses.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { MultiImageUpload } from "@/components/reusable/partials/multiple-image-upload";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { useState } from "react";
import {
  CreateWarehouseValidationErrors,
  SubWarehousePayload,
} from "@/api/warehouses/warehouses.types";
import MapPicker from "@/components/reusable/map-picker/map-picker";
import { useNavigate } from "react-router-dom";
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

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
  const [subWarehouses, setSubWarehouses] = useState<SubWarehousePayload[]>([]);
  const [showSubWarehouseSection, setShowSubWarehouseSection] = useState(false);

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

  const handleSubWarehouseChange = (
    index: number,
    field: keyof SubWarehousePayload,
    value: string,
  ) => {
    setSubWarehouses((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addSubWarehouse = () => {
    setShowSubWarehouseSection(true);
    setSubWarehouses((prev) => [...prev, createEmptySubWarehouse()]);
  };

  const removeSubWarehouse = (index: number) => {
    setSubWarehouses((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const getSubWarehouseError = (index: number, field: keyof SubWarehousePayload) =>
    fieldErrors?.[`sub_warehouses.${index}.${field}`]?.[0];

  const hasAnySubWarehouseValue = (subWarehouse: SubWarehousePayload) =>
    Object.values(subWarehouse).some((value) => String(value ?? "").trim() !== "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    const payload = {
      ...form,
      latitude: form.latitude || undefined,
      longitude: form.longitude || undefined,
      sub_warehouses: subWarehouses
        .filter(hasAnySubWarehouseValue)
        .map((item) => ({
          warehouse_name: item.warehouse_name,
          warehouse_address: item.warehouse_address,
          warehouse_manager: item.warehouse_manager || undefined,
          warehouse_manager_contact: item.warehouse_manager_contact || undefined,
          warehouse_manager_email: item.warehouse_manager_email || undefined,
          latitude: item.latitude || undefined,
          longitude: item.longitude || undefined,
          warehouse_description: item.warehouse_description || undefined,
        })),
    };

    warehouseMutation.mutate(payload, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/warehouses");
        } else {
          setForm(initialForm);
          setFormKey(prev => prev + 1);
          setSubWarehouses([]);
          setShowSubWarehouseSection(false);
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

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Text.TitleSmall>Sub Warehouses</Text.TitleSmall>
                <p className="text-xs text-muted-foreground mt-1">
                  Optionally add one or more sub warehouses.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={addSubWarehouse}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sub Warehouse
              </Button>
            </div>
          </CardHeader>
          {(showSubWarehouseSection || subWarehouses.length > 0) && (
            <>
              <Separator />
              <CardContent className="pt-6 space-y-4">
                {subWarehouses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No sub warehouse added yet.
                  </p>
                ) : (
                  subWarehouses.map((subWarehouse, index) => (
                    <div key={`sub-warehouse-${index}`} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Text.TitleSmall>Sub Warehouse {index + 1}</Text.TitleSmall>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubWarehouse(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <TextInput
                        id={`sub_warehouse_name_${index}`}
                        label="Warehouse Name"
                        placeholder="Enter sub warehouse name"
                        value={subWarehouse.warehouse_name || ""}
                        error={getSubWarehouseError(index, "warehouse_name")}
                        onChange={(e) =>
                          handleSubWarehouseChange(index, "warehouse_name", e.target.value)
                        }
                      />

                      <TextAreaInput
                        id={`sub_warehouse_address_${index}`}
                        label="Warehouse Address"
                        placeholder="Enter sub warehouse address"
                        value={subWarehouse.warehouse_address || ""}
                        error={getSubWarehouseError(index, "warehouse_address")}
                        onChange={(e) =>
                          handleSubWarehouseChange(index, "warehouse_address", e.target.value)
                        }
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <TextInput
                          id={`sub_warehouse_manager_${index}`}
                          label="Warehouse Manager"
                          placeholder="Enter manager name"
                          value={subWarehouse.warehouse_manager || ""}
                          error={getSubWarehouseError(index, "warehouse_manager")}
                          onChange={(e) =>
                            handleSubWarehouseChange(index, "warehouse_manager", e.target.value)
                          }
                        />
                        <TextInput
                          id={`sub_warehouse_manager_contact_${index}`}
                          label="Manager Contact"
                          placeholder="Enter contact number"
                          value={subWarehouse.warehouse_manager_contact || ""}
                          error={getSubWarehouseError(index, "warehouse_manager_contact")}
                          onChange={(e) =>
                            handleSubWarehouseChange(
                              index,
                              "warehouse_manager_contact",
                              e.target.value,
                            )
                          }
                          isNumberOnly={true}
                        />
                        <TextInput
                          id={`sub_warehouse_manager_email_${index}`}
                          label="Manager Email"
                          type="email"
                          placeholder="Enter email address"
                          value={subWarehouse.warehouse_manager_email || ""}
                          error={getSubWarehouseError(index, "warehouse_manager_email")}
                          onChange={(e) =>
                            handleSubWarehouseChange(
                              index,
                              "warehouse_manager_email",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TextInput
                          id={`sub_warehouse_latitude_${index}`}
                          label="Latitude"
                          placeholder="Optional latitude"
                          value={subWarehouse.latitude || ""}
                          error={getSubWarehouseError(index, "latitude")}
                          onChange={(e) =>
                            handleSubWarehouseChange(index, "latitude", e.target.value)
                          }
                        />
                        <TextInput
                          id={`sub_warehouse_longitude_${index}`}
                          label="Longitude"
                          placeholder="Optional longitude"
                          value={subWarehouse.longitude || ""}
                          error={getSubWarehouseError(index, "longitude")}
                          onChange={(e) =>
                            handleSubWarehouseChange(index, "longitude", e.target.value)
                          }
                        />
                      </div>

                      <TextAreaInput
                        id={`sub_warehouse_description_${index}`}
                        label="Description"
                        placeholder="Enter sub warehouse description"
                        value={subWarehouse.warehouse_description || ""}
                        error={getSubWarehouseError(index, "warehouse_description")}
                        onChange={(e) =>
                          handleSubWarehouseChange(
                            index,
                            "warehouse_description",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </>
          )}
        </Card>

        <FormFooterActions isSubmitting={warehouseMutation.isPending} />
      </form>
    </div>
  );
};
