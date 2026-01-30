import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquarePen, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text/app-text";
import { useCompanyInfo } from "@/api/company/company.query";

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

// Address Info Detail Card //
type AddressInfoCardProps = {
  onEditClick: () => void;
};

export const AddressInfoCard = ({ onEditClick }: AddressInfoCardProps) => {
  const { data, isLoading, error } = useCompanyInfo();
  const company = data?.data;
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Address Details</CardTitle>
            <Button variant="ghost" size="icon" disabled>
              <SquarePen className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
          <CardTitle>Address Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <Text.TitleSmall className="mb-2">
              Failed to load address information
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
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Address Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <Text.TitleSmall className="mb-2">
              No address information available
            </Text.TitleSmall>
            <p className="text-sm text-muted-foreground mb-4">
              Add your address details to get started
            </p>
            <Button variant="outline" onClick={onEditClick}>
              <SquarePen className="h-4 w-4 mr-2" />
              Add Address Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Address Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onEditClick}>
            <SquarePen className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem
            label="Full Address"
            value={company.full_address || "-"}
            className="md:col-span-2"
          />
          <DetailItem
            label="House Number"
            value={company.house_number || "-"}
          />
          <DetailItem label="Street" value={company.street || "-"} />
          <DetailItem label="Commune" value={company.commune || "-"} />
          <DetailItem label="District" value={company.district || "-"} />
          <DetailItem label="City" value={company.city || "-"} />
        </div>
      </CardContent>
    </Card>
  );
};
