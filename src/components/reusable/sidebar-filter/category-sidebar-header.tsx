import { Button } from "@/components/ui/button";
import { Archive, Folder, Plus } from "lucide-react";

interface CategorySidebarHeaderProps {
  title?: string;
  status: "active" | "deleted";
  onToggleStatus: () => void;
  onCreate: () => void;
}

export function CategorySidebarHeader({
  title = "Categories",
  status,
  onToggleStatus,
  onCreate,
}: CategorySidebarHeaderProps) {
  return (
    <div className="px-4 pt-4 pb-3 border-b space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleStatus}
            className="h-8 w-8 rounded-md border bg-background hover:bg-muted transition-colors inline-flex items-center justify-center"
            title={status === "active" ? "Show archived categories" : "Show active categories"}
          >
            {status === "active" ? (
              <Archive className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          <Button type="button" size="sm" className="h-8" onClick={onCreate}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        This sidebar filters the list by category and keeps state in the URL.
      </p>
    </div>
  );
}
