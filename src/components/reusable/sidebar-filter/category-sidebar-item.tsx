import { Badge } from "@/components/ui/badge";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySidebarItemProps<T> {
  category: T;
  selected: boolean;
  isDeletedView: boolean;
  name: string;
  count: number;
  color?: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRestore?: () => void;
}

export function CategorySidebarItem<T>({
  selected,
  isDeletedView,
  name,
  count,
  color,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
}: CategorySidebarItemProps<T>) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-left transition-colors group",
          selected ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                {count}
              </Badge>
              {color ? (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isDeletedView ? (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onRestore?.();
                }}
                className="h-6 w-6 rounded hover:bg-emerald-500/10 inline-flex items-center justify-center"
                title="Restore category"
              >
                <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="h-6 w-6 rounded hover:bg-muted inline-flex items-center justify-center"
                  title="Edit category"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="h-6 w-6 rounded hover:bg-destructive/10 inline-flex items-center justify-center"
                  title="Delete category"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}
