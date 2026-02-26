import { PackageSearch } from "lucide-react";

interface DataCardEmptyProps {
  emptyText?: string;
  minHeight?: string;
}

export default function DataCardEmpty({
  emptyText,
  minHeight = "calc(100vh - 200px)",
}: DataCardEmptyProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      style={{ minHeight }}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <PackageSearch className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">No data found</p>
        <p className="text-sm text-muted-foreground">
          {emptyText ||
            "The item you're looking for doesn't exist or has been removed."}
        </p>
      </div>
    </div>
  );
}
