import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCompanyInfo } from "@/api/company/company.query";
import { useUpdateCompanyInfo } from "@/api/company/company.mutation";
import {
  UpdateCompanyRequest,
  UpdateCompanyValidationErrors,
} from "@/api/company/company.type";
import { Skeleton } from "@/components/ui/skeleton";
import { TextInput, TextAreaInput } from "@/components/reusable/partials/input";
import { Label } from "@/components/ui/label";
import { AxiosError } from "axios";

type GeneralInfoFormProps = {
  onCancel: () => void;
};

export const GeneralInfoForm = ({ onCancel }: GeneralInfoFormProps) => {
  const { data, isLoading } = useCompanyInfo();
  const updateCompanyMutation = useUpdateCompanyInfo();
  const company = data?.data;

  const [form, setForm] = React.useState<UpdateCompanyRequest>({
    company_name: company?.company_name || "",
    email: company?.email || "",
    phone_number: company?.phone_number || "",
    contact_person: company?.contact_person || "",
    industry_type: company?.industry_type || "",
    website_url: company?.website_url || "",
    date_established: company?.date_established || "",
    vat_number: company?.vat_number || "",
    description: company?.description || "",
    company_logo: company?.company_logo || "",
  });

  const [dateEstablished, setDateEstablished] = React.useState<
    Date | undefined
  >(company?.date_established ? new Date(company.date_established) : undefined);

  const error =
    updateCompanyMutation.error as AxiosError<UpdateCompanyValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  React.useEffect(() => {
    if (company) {
      setForm({
        company_name: company.company_name,
        email: company.email,
        phone_number: company.phone_number,
        contact_person: company.contact_person,
        industry_type: company.industry_type,
        website_url: company.website_url || "",
        date_established: company.date_established,
        vat_number: company.vat_number || "",
        description: company.description || "",
        company_logo: company.company_logo || "",
      });
      setDateEstablished(
        company.date_established
          ? new Date(company.date_established)
          : undefined
      );
    }
  }, [company]);

  const handleChange =
    (field: keyof UpdateCompanyRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDate = dateEstablished
      ? format(dateEstablished, "yyyy-MM-dd")
      : form.date_established;

    updateCompanyMutation.mutate(
      {
        ...form,
        date_established: formattedDate,
      },
      {
        onSuccess: () => {
          onCancel();
        },
      }
    );
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const submitter = (e.nativeEvent as SubmitEvent)
  //     .submitter as HTMLButtonElement | null;

  //   const action = submitter?.value;

  //   updateMutation.mutate(form, {
  //     onSuccess: () => {
  //       if (action === "save_and_close") {
  //         navigate("/users");
  //       }
  //       // save → stay, data auto-refreshed
  //     },
  //   });
  // };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Company Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              id="companyName"
              label="Company Name"
              value={form.company_name}
              onChange={handleChange("company_name")}
              placeholder="Enter company name"
              error={
                fieldErrors?.company_name
                  ? fieldErrors.company_name[0]
                  : undefined
              }
              required={true}
            />
            <TextInput
              id="companyEmail"
              label="Company Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="Enter company email"
              error={fieldErrors?.email ? fieldErrors.email[0] : undefined}
              required={true}
            />
          </div>

          {/* Contact Person & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              id="contactPerson"
              label="Contact Person"
              value={form.contact_person}
              onChange={handleChange("contact_person")}
              placeholder="Enter contact person"
              error={
                fieldErrors?.contact_person
                  ? fieldErrors.contact_person[0]
                  : undefined
              }
              required={true}
            />
            <TextInput
              id="phoneNumber"
              label="Phone Number"
              value={form.phone_number}
              onChange={handleChange("phone_number")}
              placeholder="Enter phone number"
              error={
                fieldErrors?.phone_number
                  ? fieldErrors.phone_number[0]
                  : undefined
              }
              required={true}
              isNumberOnly={true}
            />
          </div>

          {/* Industry & Website URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              id="industry"
              label="Industry"
              value={form.industry_type}
              onChange={handleChange("industry_type")}
              placeholder="Enter industry"
              error={
                fieldErrors?.industry_type
                  ? fieldErrors.industry_type[0]
                  : undefined
              }
              required={true}
            />
            <TextInput
              id="websiteUrl"
              label="Website URL"
              type="text"
              value={form.website_url}
              onChange={handleChange("website_url")}
              placeholder="Enter website URL"
              error={
                fieldErrors?.website_url
                  ? fieldErrors.website_url[0]
                  : undefined
              }
            />
          </div>

          {/* Company Description */}
          <TextAreaInput
            id="companyDescription"
            label="Company Description"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Enter company description"
            error={
              fieldErrors?.description ? fieldErrors.description[0] : undefined
            }
          />

          {/* Date Established & Tax ID / VAT Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateEstablished">Date Established</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateEstablished && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateEstablished ? (
                      format(dateEstablished, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateEstablished}
                    onSelect={setDateEstablished}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <TextInput
              id="taxId"
              label="Tax ID / VAT Number"
              value={form.vat_number}
              onChange={handleChange("vat_number")}
              placeholder="Enter Tax ID or VAT Number"
              error={
                fieldErrors?.vat_number ? fieldErrors.vat_number[0] : undefined
              }
            />
          </div>

          {/* Form Footer Buttons */}
          <CardFooter className="flex justify-end gap-2 p-0 pt-6">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={updateCompanyMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateCompanyMutation.isPending}>
              {updateCompanyMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
          {/* <FormFooterActions isSubmitting={updateCompanyMutation.isPending} /> */}
        </form>
      </CardContent>
    </Card>
  );
};
