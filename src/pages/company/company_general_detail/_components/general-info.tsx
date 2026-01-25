import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { Company } from "@/api/company/company.type";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Text } from "@/components/ui/text/app-text";

type DetailItemProps = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
};

const DetailItem = ({ label, value, className }: DetailItemProps) => {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-muted-foreground pb-2">{label}</p>
      <p className="text-base text-foreground">{value}</p>
    </div>
  );
};

// General Info Detail Card //
type GeneralInfoCardProps = {
  onEditClick: () => void;
  company: Company | undefined;
  isLoading: boolean;
  error: Error | null;
};

export const GeneralInfoCard = ({
  onEditClick,
  company,
  isLoading,
  error,
}: GeneralInfoCardProps) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Company Details</CardTitle>
            <Button variant="ghost" size="icon" disabled>
              <SquarePen className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <Text.TitleSmall className="mb-2">
              Failed to load company information
            </Text.TitleSmall>
            <p className="text-sm text-muted-foreground">
              {error.message || "An error occurred while fetching data"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Company Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onEditClick}>
            <SquarePen className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem
            label="Company Name"
            value={company.company_name || "-"}
          />
          <DetailItem label="Company Email" value={company.email || "-"} />
          <DetailItem
            label="Contact Person"
            value={company.contact_person || "-"}
          />
          <DetailItem
            label="Phone Number"
            value={company.phone_number || "-"}
          />
          <DetailItem label="Industry" value={company.industry_type || "-"} />
          <DetailItem label="Website URL" value={company.website_url || "-"} />

          <DetailItem
            label="Company Description"
            value={company.description || "-"}
            className="md:col-span-2"
          />

          <DetailItem
            label="Date Established"
            value={company.date_established || "-"}
          />
          <DetailItem
            label="Tax ID / VAT Number"
            value={company.vat_number || "-"}
          />
        </div>
      </CardContent>
    </Card>
  );
};
