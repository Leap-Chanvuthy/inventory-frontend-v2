import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategorySidebarItem } from "./category-sidebar-item";

interface CategorySidebarListProps<T> {
  categories: T[];
  isLoading: boolean;
  selectedId: number | null;
  isDeletedView: boolean;
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  getCategoryId: (category: T) => number;
  getCategoryName: (category: T) => string;
  getCategoryCount: (category: T) => number;
  getCategoryColor?: (category: T) => string | undefined;
  onSelect: (id: number) => void;
  onEdit: (category: T) => void;
  onDelete: (category: T) => void;
  onRestore?: (category: T) => void;
}

export function CategorySidebarList<T>({
  categories,
  isLoading,
  selectedId,
  isDeletedView,
  currentPage,
  lastPage,
  onPageChange,
  getCategoryId,
  getCategoryName,
  getCategoryCount,
  getCategoryColor,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
}: CategorySidebarListProps<T>) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground px-3 text-center">
            No categories found.
          </div>
        ) : (
          <ul className="space-y-1.5">
            {categories.map(category => {
              const id = getCategoryId(category);
              return (
                <CategorySidebarItem
                  key={id}
                  category={category}
                  selected={selectedId === id}
                  isDeletedView={isDeletedView}
                  name={getCategoryName(category)}
                  count={getCategoryCount(category)}
                  color={getCategoryColor?.(category)}
                  onSelect={() => onSelect(id)}
                  onEdit={() => onEdit(category)}
                  onDelete={() => onDelete(category)}
                  onRestore={() => onRestore?.(category)}
                />
              );
            })}
          </ul>
        )}
      </div>

      {lastPage > 1 && (
        <div className="border-t px-3 py-2.5 flex items-center justify-between gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="h-7 w-7 flex items-center justify-center rounded-md border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            Page {currentPage} of {lastPage}
          </span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, lastPage))}
            disabled={currentPage === lastPage}
            className="h-7 w-7 flex items-center justify-center rounded-md border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
