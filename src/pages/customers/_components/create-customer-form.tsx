import { useCreateCustomer } from "@/api/customers/customer.mutation";
import { useCustomerCategories } from "@/api/categories/customer-categories/customer-category.query";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextInput, TextAreaInput, SelectInput } from "@/components/reusable/partials/input";
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
import {
  CreateCustomerFormPayload,
  ValidationErrors,
  CustomerStatus,
} from "@/api/customers/customer.types";
import { Text } from "@/components/ui/text/app-text";

export const CreateCustomerForm = () => {
  const customerMutation = useCreateCustomer();
  const { data: categoriesData, isLoading: categoriesLoading } = useCustomerCategories();
  const error = customerMutation.error as AxiosError<ValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_code: "",
    fullname: "",
    email_address: "",
    phone_number: "",
    social_media: "",
    customer_address: "",
    google_map_link: "",
    customer_status: CustomerStatus.ACTIVE,
    customer_category_id: "",
    customer_note: "",
  });

  const [image, setImage] = useState<File | null>(null);

  /* ---------- Handlers ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    // Create payload with proper typing
    const payload: CreateCustomerFormPayload = {
      ...form,
      customer_category_id: Number(form.customer_category_id),
      customer_status: form.customer_status as CustomerStatus,
      image,
    };

    customerMutation.mutate(payload, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/customers");
        }
      },
    });
  };

  // Customer status options
  const statusOptions = [
    { value: CustomerStatus.ACTIVE, label: "Active" },
    { value: CustomerStatus.INACTIVE, label: "Inactive" },
    { value: CustomerStatus.PROSPECTIVE, label: "Prospective" },
  ];

  // Customer category options
  const categoryOptions =
    categoriesData?.data.data.map(category => ({
      value: category.id.toString(),
      label: category.category_name,
    })) || [];

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <Text.TitleMedium className="mb-2">Create a new Customer</Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Manage customer details and information within the application.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Customer's basic details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Upload Section */}
                  <div className="lg:col-span-1">
                    <ImageUpload
                      label="Customer Image"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Form Fields */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <TextInput
                        id="customer_code"
                        label="Customer Code"
                        placeholder="Auto-generated if empty"
                        value={form.customer_code}
                        error={fieldErrors?.customer_code?.[0]}
                        onChange={handleChange}
                      />
                      <TextInput
                        required={true}
                        id="fullname"
                        label="Full Name"
                        placeholder="Enter full name"
                        value={form.fullname}
                        error={fieldErrors?.fullname?.[0]}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <TextInput
                        required={true}
                        id="phone_number"
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter phone number"
                        value={form.phone_number}
                        error={fieldErrors?.phone_number?.[0]}
                        onChange={handleChange}
                        isNumberOnly={true}
                        maxLength={10}
                      />
                      <TextInput
                        id="email_address"
                        label="Email Address"
                        type="email"
                        placeholder="Enter email address"
                        value={form.email_address}
                        error={fieldErrors?.email_address?.[0]}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <SelectInput
                        required={true}
                        id="customer_status"
                        label="Customer Status"
                        placeholder="Select status"
                        options={statusOptions}
                        value={form.customer_status}
                        error={fieldErrors?.customer_status?.[0]}
                        onChange={handleSelectChange("customer_status")}
                      />
                      <SelectInput
                        required={true}
                        id="customer_category_id"
                        label="Customer Category"
                        placeholder={categoriesLoading ? "Loading..." : "Select category"}
                        options={categoryOptions}
                        value={form.customer_category_id}
                        error={fieldErrors?.customer_category_id?.[0]}
                        onChange={handleSelectChange("customer_category_id")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Location Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Location Information</CardTitle>
                <CardDescription>Additional contact and location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextInput
                  id="social_media"
                  label="Social Media"
                  placeholder="e.g., https://facebook.com/username"
                  value={form.social_media}
                  error={fieldErrors?.social_media?.[0]}
                  onChange={handleChange}
                />

                <TextInput
                  required={true}
                  id="customer_address"
                  label="Customer Address"
                  placeholder="Enter customer address"
                  value={form.customer_address}
                  error={fieldErrors?.customer_address?.[0]}
                  onChange={handleChange}
                />

                <TextInput
                  id="google_map_link"
                  label="Google Map Link"
                  placeholder="e.g., https://maps.google.com/..."
                  value={form.google_map_link}
                  error={fieldErrors?.google_map_link?.[0]}
                  onChange={handleChange}
                />

                <TextAreaInput
                  id="customer_note"
                  label="Customer Note"
                  placeholder="Enter additional notes about the customer"
                  value={form.customer_note}
                  error={fieldErrors?.customer_note?.[0]}
                  onChange={handleTextAreaChange}
                />
              </CardContent>
            </Card>

            <FormFooterActions isSubmitting={customerMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
