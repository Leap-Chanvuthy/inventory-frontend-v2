import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import DeleteModal from "@/components/reusable/partials/delete-modal";
import { Link } from "react-router-dom";

interface CategoryFilterItemProps {
  name: string;
  count?: number;
  selected: boolean;
  color?: string;
  isDeletedView: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  showActions?: boolean;
  viewHref?: string;
}

function CategoryFilterItemComponent({
  name,
  count,
  selected,
  color,
  isDeletedView,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
  showActions = true,
  viewHref,
}: CategoryFilterItemProps) {
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
            {(count !== undefined || color) && (
              <div className="mt-1 flex items-center gap-2">
                {count !== undefined && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                    {count}
                  </Badge>
                )}
                {color ? (
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full border"
                    style={{ backgroundColor: color }}
                  />
                ) : null}
              </div>
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {viewHref && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  asChild
                >
                  <Link
                    to={viewHref}
                    onClick={e => e.stopPropagation()}
                    aria-label={`View ${name}`}
                  >
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                </Button>
              )}
              {isDeletedView ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={e => {
                  e.stopPropagation();
                  onRestore?.();
                }}
              >
                <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
              </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={e => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                    <div
                      className="h-6 w-6"
                      onClick={e => e.stopPropagation()}
                      onMouseDown={e => e.stopPropagation()}
                    >
                      <DeleteModal
                        heading="Delete Category"
                        subheading="Are you sure you want to delete this category? This action cannot be undone."
                        tooltipText="Delete Category"
                        onDelete={onDelete}
                      />
                    </div>
                </>
              )}
            </div>
          )}
        </div>
      </button>
    </li>
  );
}

export const CategoryFilterItem = memo(CategoryFilterItemComponent);
