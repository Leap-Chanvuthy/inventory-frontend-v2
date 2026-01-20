import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TextInput } from "@/components/reusable/partials/input";
import { useUpdateAddressInfo } from "@/api/company/company.mutation";
import {
  UpdateAddressRequest,
  UpdateCompanyValidationErrors,
} from "@/api/company/company.type";
import { AxiosError } from "axios";

type AddressInfoFormProps = {
  onCancel: () => void;
};

export const AddressInfoForm = ({ onCancel }: AddressInfoFormProps) => {
  const updateAddressMutation = useUpdateAddressInfo();

  const [form, setForm] = React.useState<UpdateAddressRequest>({
    full_address: "",
    house_number: "",
    street: "",
    commune: "",
    district: "",
    city: "",
  });

  const error =
    updateAddressMutation.error as AxiosError<UpdateCompanyValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  const handleChange =
    (field: keyof UpdateAddressRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateAddressMutation.mutate(form, {
      onSuccess: () => {
        onCancel();
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Address Info Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Full Address */}
          <TextInput
            id="fullAddress"
            label="Full Address"
            value={form.full_address}
            onChange={handleChange("full_address")}
            placeholder="Enter full address"
            error={
              fieldErrors?.full_address
                ? fieldErrors.full_address[0]
                : undefined
            }
            required={true}
          />

          {/* House Number & Street */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              id="houseNumber"
              label="House Number"
              value={form.house_number}
              onChange={handleChange("house_number")}
              placeholder="Enter house number"
              error={
                fieldErrors?.house_number
                  ? fieldErrors.house_number[0]
                  : undefined
              }
              required={true}
            />
            <TextInput
              id="street"
              label="Street"
              value={form.street}
              onChange={handleChange("street")}
              placeholder="Enter street"
              error={fieldErrors?.street ? fieldErrors.street[0] : undefined}
              required={true}
            />
          </div>

          {/* Commune & District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              id="commune"
              label="Commune"
              value={form.commune}
              onChange={handleChange("commune")}
              placeholder="Enter commune"
              error={fieldErrors?.commune ? fieldErrors.commune[0] : undefined}
              required={true}
            />
            <TextInput
              id="district"
              label="District"
              value={form.district}
              onChange={handleChange("district")}
              placeholder="Enter district"
              error={
                fieldErrors?.district ? fieldErrors.district[0] : undefined
              }
              required={true}
            />
          </div>

          {/* City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              id="city"
              label="City"
              value={form.city}
              onChange={handleChange("city")}
              placeholder="Enter city"
              error={fieldErrors?.city ? fieldErrors.city[0] : undefined}
              required={true}
            />
          </div>

          {/* Form Footer Buttons */}
          <CardFooter className="flex justify-end gap-2 p-0 pt-6">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={updateAddressMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateAddressMutation.isPending}>
              {updateAddressMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
