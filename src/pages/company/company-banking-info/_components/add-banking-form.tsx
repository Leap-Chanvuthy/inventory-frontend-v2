import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TextInput } from "@/components/reusable/partials/input";
import { BankSelect } from "@/components/reusable/partials/bank-select";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { useSetupBankingPayment } from "@/api/company/company.mutation";
import {
  SetupBankingPaymentRequest,
  UpdateCompanyValidationErrors,
} from "@/api/company/company.type";
import { AxiosError } from "axios";

type AddBankingFormProps = {
  onCancel: () => void;
};

export const AddBankingForm = ({ onCancel }: AddBankingFormProps) => {
  const setupBankingMutation = useSetupBankingPayment();

  const [form, setForm] = useState({
    bank_name: "",
    payment_link: "",
    bank_account_holder_name: "",
    bank_account_number: "",
    set_as_default: 0,
  });

  const [khqrFile, setKhqrFile] = useState<File | null>(null);

  const error =
    setupBankingMutation.error as AxiosError<UpdateCompanyValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleImageChange = (file: File | null) => {
    setKhqrFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: SetupBankingPaymentRequest = {
      ...form,
      khqr_code: khqrFile || undefined,
    };

    setupBankingMutation.mutate(payload, {
      onSuccess: () => {
        onCancel();
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Bank Account</CardTitle>
        <p className="text-sm text-gray-500">
          Fill in the details for the new bank account.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Bank Name & Account Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BankSelect
              id="bankName"
              label="Bank Name"
              placeholder="Select bank"
              value={form.bank_name}
              onChange={value => setForm({ ...form, bank_name: value })}
              error={
                fieldErrors?.bank_name ? fieldErrors.bank_name[0] : undefined
              }
              required={true}
            />
            <TextInput
              id="accountNumber"
              label="Account Number"
              value={form.bank_account_number}
              onChange={handleChange("bank_account_number")}
              placeholder="002 071 337"
              isNumberOnly={true}
              error={
                fieldErrors?.bank_account_number
                  ? fieldErrors.bank_account_number[0]
                  : undefined
              }
              required={true}
            />
          </div>
          {/* KHQR Link & Upload KHQR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: KHQR Link and Account Holder Name */}
            <div className="space-y-6">
              <TextInput
                id="khqrLink"
                label="KHQR Link"
                value={form.payment_link}
                onChange={handleChange("payment_link")}
                placeholder="https://example.com/qr/newbank"
                error={
                  fieldErrors?.payment_link
                    ? fieldErrors.payment_link[0]
                    : undefined
                }
                required={true}
              />

              <TextInput
                id="accountHolderName"
                label="Account Holder Name"
                value={form.bank_account_holder_name}
                onChange={handleChange("bank_account_holder_name")}
                placeholder="CHANVUTHY Leap"
                error={
                  fieldErrors?.bank_account_holder_name
                    ? fieldErrors.bank_account_holder_name[0]
                    : undefined
                }
                required={true}
              />
            </div>

            {/* Right Column: Upload KHQR */}
            <ImageUpload label="Upload KHQR" onChange={handleImageChange} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="setAsDefault"
              checked={form.set_as_default === 1}
              onCheckedChange={checked =>
                setForm({ ...form, set_as_default: checked === true ? 1 : 0 })
              }
            />
            <label
              htmlFor="setAsDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default payment method
            </label>
          </div>
          {/* Form Footer Buttons */}
          <CardFooter className="flex justify-end gap-2 p-0 pt-6">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={setupBankingMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={setupBankingMutation.isPending}>
              {setupBankingMutation.isPending ? "Saving..." : "Save Account"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
