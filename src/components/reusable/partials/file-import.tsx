import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet } from "lucide-react";

interface FileImportProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  acceptedTypes?: string[];
  acceptedExtensions?: string[];
  maxSizeMB?: number;
  error?: string;
}

export const FileImport = ({
  file,
  onFileChange,
  acceptedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ],
  acceptedExtensions = [".xlsx", ".csv"],
  maxSizeMB = 5,
  error,
}: FileImportProps) => {
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (selectedFile: File): boolean => {
    // Validate file type
    if (!acceptedTypes.includes(selectedFile.type)) {
      const extensions = acceptedExtensions.join(", ");
      alert(`Please upload a valid file (${extensions})`);
      return false;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      onFileChange(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      onFileChange(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  const getFileExtensions = () => {
    return acceptedExtensions.join(", ");
  };

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept={acceptedExtensions.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />

        {!file ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              {getFileExtensions()} file, max {maxSizeMB}MB
            </p>
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileSpreadsheet className="h-10 w-10 text-green-600" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};
