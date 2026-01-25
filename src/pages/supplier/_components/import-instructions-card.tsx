import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";
import { Text } from "@/components/ui/text/app-text";

interface ImportInstructionsCardProps {
  requiredFields: string[];
  onDownloadTemplate: () => void;
  fileFormats?: string;
  maxFileSize?: string;
}
export const csvHeaders = [
  "official_name",
  "contact_person",
  "phone",
  "email",
  "legal_business_name",
  "tax_identification_number",
  "business_registration_number",
  "supplier_category",
  "business_description",
  "address_line1",
  "address_line2",
  "village",
  "commune",
  "district",
  "city",
  "province",
  "postal_code",
  "latitude",
  "longitude",
];

// Required fields
export const requiredFields = [
  "Official Name",
  "Address Line 1",
  "Village",
  "Commune",
  "District",
  "City",
  "Province",
];

export const ImportInstructionsCard = ({
  requiredFields,
  onDownloadTemplate,
  fileFormats = "Excel (.xlsx) or CSV (.csv)",
  maxFileSize = "5MB",
}: ImportInstructionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Instructions</CardTitle>
        <CardDescription>
          Follow these guidelines to ensure successful import
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Text.TitleSmall>File Requirements:</Text.TitleSmall>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>File format: {fileFormats}</li>
            <li>Maximum file size: {maxFileSize}</li>
            <li>File must contain valid data with required fields</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Text.TitleSmall>Required Fields:</Text.TitleSmall>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {requiredFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onDownloadTemplate}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
