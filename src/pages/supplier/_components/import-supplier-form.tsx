import { useImportSuppliers } from "@/api/suppliers/supplier.mutation";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { FileImport } from "@/components/reusable/partials/file-import";
import {
  csvHeaders,
  ImportInstructionsCard,
  requiredFields,
} from "@/pages/supplier/_components/import-instructions-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationErrors } from "@/api/suppliers/supplier.types";
import { downloadCSVTemplate } from "@/utils/download-csv-template";
import { Text } from "@/components/ui/text/app-text";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const ImportSupplierForm = () => {
  const importMutation = useImportSuppliers();
  const error = importMutation.error as AxiosError<ValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>(undefined);

  const handleDownloadTemplate = () => {
    downloadCSVTemplate(csvHeaders, "supplier_import_template");
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setFileError(undefined); // Clear error when file is selected
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    importMutation.mutate(file, {
      onSuccess: () => {
        setFileError(undefined); // Clear any errors on success
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
          <Text.TitleMedium className="mb-2">Import Suppliers</Text.TitleMedium>
          <p className="text-sm text-muted-foreground mb-6">
            Upload an Excel or CSV file to import multiple suppliers at once.
            Requires ADMIN role.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Instructions Card */}
            <ImportInstructionsCard
              requiredFields={requiredFields}
              onDownloadTemplate={handleDownloadTemplate}
            />

            {/* File Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>
                  Select or drag and drop your Excel/CSV file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileImport
                  file={file}
                  onFileChange={handleFileChange}
                  error={fileError || fieldErrors?.supplier_file?.[0]}
                />

                {fieldErrors && Object.keys(fieldErrors).length > 0 && (
                  <div className="mt-4">
                    <Alert variant="destructive">
                      <AlertTitle>Import validation failed</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc ml-5">
                          {Object.entries(fieldErrors).map(([k, v]) => (
                            <li key={k}>
                              <strong className="capitalize">{k.replace(/_/g, " ")}</strong>: {Array.isArray(v) ? v.join(', ') : v}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            <FormFooterActions isSubmitting={importMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
