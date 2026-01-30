import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { TextInput } from "@/components/reusable/partials/input";
import { BankSelect } from "@/components/reusable/partials/bank-select";
import { Plus, Trash2 } from "lucide-react";
import { BankDetails, ValidationErrors } from "@/api/suppliers/supplier.types";
import { Text } from "@/components/ui/text/app-text";

export interface BankPaymentSectionProps {
  banks: BankDetails[];
  setBanks: React.Dispatch<React.SetStateAction<BankDetails[]>>;
  fieldErrors?: ValidationErrors["errors"];
}

export const BankPaymentSection = ({
  banks,
  setBanks,
  fieldErrors,
}: BankPaymentSectionProps) => {
  const handleBankChange = (
    index: number,
    field: keyof BankDetails,
    value: string | File | null,
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

  // Get already selected banks to exclude
  const getExcludedBanks = (currentIndex: number) => {
    return banks
      .map((bank, idx) => (idx !== currentIndex ? bank.bank_name : null))
      .filter((bankName): bankName is string => Boolean(bankName));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Information (Optional)</CardTitle>
        <CardDescription>
          Add payment methods if needed (up to 4 banks). If you add a bank, all
          fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {banks.map((bank, index) => (
          <div key={`bank_${index}`} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <Text.TitleSmall>Bank {index + 1}</Text.TitleSmall>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Section */}
              <div className="lg:col-span-1">
                <ImageUpload
                  label="QR Code Image (Optional)"
                  onChange={file =>
                    handleBankChange(index, "qr_code_image", file)
                  }
                  defaultImage={bank.existing_qr_code}
                />
                {fieldErrors?.[`banks.${index}.qr_code_image`]?.[0] && (
                  <p className="text-sm text-red-500 mt-2">
                    {fieldErrors[`banks.${index}.qr_code_image`][0]}
                  </p>
                )}
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <BankSelect
                    id={`bank_name_${index}`}
                    label="Bank Name"
                    placeholder="Select bank"
                    excludeBanks={getExcludedBanks(index)}
                    value={bank.bank_name}
                    onChange={value =>
                      handleBankChange(index, "bank_name", value)
                    }
                    error={fieldErrors?.[`banks.${index}.bank_name`]?.[0]}
                    required={true}
                  />

                  <TextInput
                    id={`account_number_${index}`}
                    label="Account Number"
                    type="tel"
                    placeholder="Enter account number"
                    value={bank.account_number}
                    onChange={e =>
                      handleBankChange(index, "account_number", e.target.value)
                    }
                    error={fieldErrors?.[`banks.${index}.account_number`]?.[0]}
                    isNumberOnly={true}
                    required={true}
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
                        e.target.value,
                      )
                    }
                    error={
                      fieldErrors?.[`banks.${index}.account_holder_name`]?.[0]
                    }
                    required={true}
                  />

                  <TextInput
                    id={`payment_link_${index}`}
                    label="Payment Link"
                    placeholder="Enter payment link"
                    value={bank.payment_link}
                    onChange={e =>
                      handleBankChange(index, "payment_link", e.target.value)
                    }
                    error={fieldErrors?.[`banks.${index}.payment_link`]?.[0]}
                  />
                </div>
              </div>
            </div>
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
  );
};
