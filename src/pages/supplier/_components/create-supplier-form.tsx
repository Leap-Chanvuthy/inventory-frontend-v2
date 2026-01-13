import { useCreateSupplier } from "@/api/suppliers/supplier.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BankPaymentSection } from "./bank-payment-section";
import {
  BankDetails,
  CreateSupplierFormPayload,
  ValidationErrors,
} from "@/api/suppliers/supplier.types";

export const CreateSupplierForm = () => {
  const supplierMutation = useCreateSupplier();
  const error = supplierMutation.error as AxiosError<ValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    official_name: "",
    contact_person: "",
    phone: "",
    email: "",
    legal_business_name: "",
    tax_identification_number: "",
    business_registration_number: "",
    supplier_category: "SERVICES",
    business_description: "",
    address_line1: "",
    address_line2: "",
    village: "",
    commune: "",
    district: "",
    city: "",
    province: "",
    postal_code: "",
    latitude: "",
    longitude: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [banks, setBanks] = useState<BankDetails[]>([
    {
      bank_name: "",
      account_number: "",
      account_holder_name: "",
      payment_link: "",
      qr_code_image: null,
    },
  ]);

  /* ---------- Handlers ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    const filledBanks = banks.filter(bank => {
      return (
        bank.bank_name ||
        bank.account_number ||
        bank.account_holder_name ||
        bank.payment_link ||
        bank.qr_code_image
      );
    });

    // Create payload with proper typing
    const payload: CreateSupplierFormPayload = {
      ...form,
      image,
      banks: filledBanks,
    };

    supplierMutation.mutate(payload, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/supplier");
        }
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-2">Create a new Supplier</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Manage supplier details and roles within the application.{" "}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Supplier's basic details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Upload Section */}
                  <div className="lg:col-span-1">
                    <ImageUpload
                      label="Supplier Image"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Form Fields */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <TextInput
                        required={true}
                        id="official_name"
                        label="Official Name"
                        placeholder="Enter official name"
                        value={form.official_name}
                        error={fieldErrors?.official_name?.[0]}
                        onChange={handleChange}
                      />
                      <TextInput
                        id="contact_person"
                        label="Contact Person"
                        placeholder="Enter contact person"
                        value={form.contact_person}
                        error={fieldErrors?.contact_person?.[0]}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <TextInput
                        id="phone"
                        label="Phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={form.phone}
                        error={fieldErrors?.phone?.[0]}
                        onChange={handleChange}
                      />
                      <TextInput
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="Enter email address"
                        value={form.email}
                        error={fieldErrors?.email?.[0]}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Legal and business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextInput
                  id="legal_business_name"
                  label="Legal Business Name"
                  placeholder="Enter legal business name"
                  value={form.legal_business_name}
                  error={fieldErrors?.legal_business_name?.[0]}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TextInput
                    id="tax_identification_number"
                    label="Tax Identification Number"
                    type="number"
                    placeholder="Enter TIN"
                    value={form.tax_identification_number}
                    error={fieldErrors?.tax_identification_number?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
                    id="business_registration_number"
                    label="Business Registration Number"
                    type="number"
                    placeholder="Enter BRN"
                    value={form.business_registration_number}
                    error={fieldErrors?.business_registration_number?.[0]}
                    onChange={handleChange}
                  />
                </div>

                <TextAreaInput
                  id="business_description"
                  label="Business Description"
                  placeholder="Enter business description"
                  value={form.business_description}
                  error={fieldErrors?.business_description?.[0]}
                  onChange={handleTextAreaChange}
                />
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Supplier's location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextInput
                  required={true}
                  id="address_line1"
                  label="Address Line 1"
                  placeholder="Enter address"
                  value={form.address_line1}
                  error={fieldErrors?.address_line1?.[0]}
                  onChange={handleChange}
                />
                <TextInput
                  id="address_line2"
                  label="Address Line 2"
                  placeholder="Enter address (optional)"
                  value={form.address_line2}
                  error={fieldErrors?.address_line2?.[0]}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <TextInput
                    required={true}
                    id="village"
                    label="Village"
                    placeholder="Enter village"
                    value={form.village}
                    error={fieldErrors?.village?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
                    required={true}
                    id="commune"
                    label="Commune"
                    placeholder="Enter commune"
                    value={form.commune}
                    error={fieldErrors?.commune?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
                    required={true}
                    id="district"
                    label="District"
                    placeholder="Enter district"
                    value={form.district}
                    error={fieldErrors?.district?.[0]}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <TextInput
                    required={true}
                    id="city"
                    label="City"
                    placeholder="Enter city"
                    value={form.city}
                    error={fieldErrors?.city?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
                    required={true}
                    id="province"
                    label="Province"
                    placeholder="Enter province"
                    value={form.province}
                    error={fieldErrors?.province?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
                    id="postal_code"
                    label="Postal Code"
                    type="number"
                    placeholder="Enter postal code"
                    value={form.postal_code}
                    error={fieldErrors?.postal_code?.[0]}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TextInput
                    id="latitude"
                    label="Latitude"
                    type="number"
                    placeholder="e.g., 11.562108"
                    value={form.latitude}
                    error={fieldErrors?.latitude?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
                    id="longitude"
                    label="Longitude"
                    type="number"
                    placeholder="e.g., 104.927734"
                    value={form.longitude}
                    error={fieldErrors?.longitude?.[0]}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bank Information */}
            <BankPaymentSection
              banks={banks}
              setBanks={setBanks}
              fieldErrors={fieldErrors}
            />

            <FormFooterActions
              isSubmitting={supplierMutation.isPending}
              onCancel={() => navigate("/supplier")}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
