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
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BankDetails {
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  payment_link: string;
  qr_code_image: File | null;
}

interface ValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

const BANK_OPTIONS = ["ACLEDA", "ABA", "WING", "BAKONG"];

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

  const handleBankChange = (
    index: number,
    field: keyof BankDetails,
    value: string | File | null
  ) => {
    const updatedBanks = [...banks];
    updatedBanks[index] = { ...updatedBanks[index], [field]: value };
    setBanks(updatedBanks);
  };

  const addBank = () => {
    if (banks.length < 4) {
      setBanks([
        ...banks,
        {
          bank_name: "",
          account_number: "",
          account_holder_name: "",
          payment_link: "",
          qr_code_image: null,
        },
      ]);
    }
  };

  const removeBank = (index: number) => {
    if (banks.length > 1) {
      setBanks(banks.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Append basic fields (always append all fields, even empty ones)
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append image
    if (image) {
      formData.append("image", image);
    }

    // Append banks data
    banks.forEach((bank, index) => {
      if (bank.bank_name) {
        formData.append(`banks[${index}][bank_name]`, bank.bank_name);
      }
      if (bank.account_number) {
        formData.append(`banks[${index}][account_number]`, bank.account_number);
      }
      if (bank.account_holder_name) {
        formData.append(
          `banks[${index}][account_holder_name]`,
          bank.account_holder_name
        );
      }
      if (bank.payment_link) {
        formData.append(`banks[${index}][payment_link]`, bank.payment_link);
      }
      if (bank.qr_code_image) {
        formData.append(`banks[${index}][qr_code_image]`, bank.qr_code_image);
      }
    });

    supplierMutation.mutate(formData, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/suppliers");
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TextInput
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

                <ImageUpload
                  label="Supplier Image"
                  onChange={handleImageChange}
                />
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
                    id="village"
                    label="Village"
                    placeholder="Enter village"
                    value={form.village}
                    error={fieldErrors?.village?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
                    id="commune"
                    label="Commune"
                    placeholder="Enter commune"
                    value={form.commune}
                    error={fieldErrors?.commune?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
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
                    id="city"
                    label="City"
                    placeholder="Enter city"
                    value={form.city}
                    error={fieldErrors?.city?.[0]}
                    onChange={handleChange}
                  />
                  <TextInput
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
            <Card>
              <CardHeader>
                <CardTitle>Bank Information</CardTitle>
                <CardDescription>
                  Payment methods (up to 4 banks)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {banks.map((bank, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Bank {index + 1}</h4>
                      {banks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBank(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Select
                          onValueChange={value =>
                            handleBankChange(index, "bank_name", value)
                          }
                          value={bank.bank_name}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                          <SelectContent>
                            {BANK_OPTIONS.map(bankName => (
                              <SelectItem key={bankName} value={bankName}>
                                {bankName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <TextInput
                        id={`account_number_${index}`}
                        label="Account Number"
                        type="number"
                        placeholder="Enter account number"
                        value={bank.account_number}
                        onChange={e =>
                          handleBankChange(
                            index,
                            "account_number",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <TextInput
                        id={`account_holder_name_${index}`}
                        label="Account Holder Name"
                        placeholder="Enter account holder name"
                        value={bank.account_holder_name}
                        onChange={e =>
                          handleBankChange(
                            index,
                            "account_holder_name",
                            e.target.value
                          )
                        }
                      />

                      <TextInput
                        id={`payment_link_${index}`}
                        label="Payment Link"
                        placeholder="Enter payment link (optional)"
                        value={bank.payment_link}
                        onChange={e =>
                          handleBankChange(
                            index,
                            "payment_link",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <ImageUpload
                      label="QR Code Image (Optional)"
                      onChange={file => handleBankChange(index, "qr_code_image", file)}
                    />
                  </div>
                ))}

                {banks.length < 4 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBank}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Bank
                  </Button>
                )}
              </CardContent>
            </Card>

            <FormFooterActions
              isSubmitting={supplierMutation.isPending}
              onCancel={() => navigate("/suppliers")}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
