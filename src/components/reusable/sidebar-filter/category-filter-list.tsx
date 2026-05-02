import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { CategoryFilterItem } from "./category-filter-item";

interface CategoryFilterListProps<T> {
  categories: T[];
  isLoading: boolean;
  selectedCategory: number | null;
  showAllOption?: boolean;
  allLabel?: string;
  allCount?: number;
  isDeletedView: boolean;
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onCategoryChange: (categoryId: number | null) => void;
  onEditCategory: (category: T) => void;
  onDeleteCategory: (category: T) => void;
  onRestoreCategory?: (category: T) => void;
  getCategoryId: (category: T) => number;
  getCategoryLabel: (category: T) => string;
  getCategoryCount: (category: T) => number;
  getCategoryColor?: (category: T) => string | undefined;
  getCategoryViewHref?: (category: T) => string | undefined;
}

export function CategoryFilterList<T>({
  categories,
  isLoading,
  selectedCategory,
  showAllOption = true,
  allLabel = "All",
  allCount,
  isDeletedView,
  currentPage,
  lastPage,
  onPageChange,
  onCategoryChange,
  onEditCategory,
  onDeleteCategory,
  onRestoreCategory,
  getCategoryId,
  getCategoryLabel,
  getCategoryCount,
  getCategoryColor,
  getCategoryViewHref,
}: CategoryFilterListProps<T>) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1.5">
            {showAllOption && (
              <CategoryFilterItem
                key="all"
                name={allLabel}
                count={allCount}
                selected={selectedCategory === null}
                isDeletedView={false}
                onSelect={() => onCategoryChange(null)}
                showActions={false}
              />
            )}

            {categories.map(category => {
              const categoryId = getCategoryId(category);
              return (
                <CategoryFilterItem
                  key={categoryId}
                  name={getCategoryLabel(category)}
                  count={getCategoryCount(category)}
                  selected={selectedCategory === categoryId}
                  color={getCategoryColor?.(category)}
                  isDeletedView={isDeletedView}
                  onSelect={() => onCategoryChange(categoryId)}
                  onEdit={() => onEditCategory(category)}
                  onDelete={() => onDeleteCategory(category)}
                  onRestore={() => onRestoreCategory?.(category)}
                  viewHref={getCategoryViewHref?.(category)}
                />
              );
            })}

            {categories.length === 0 && (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                No categories found.
              </li>
            )}
          </ul>
        )}
      </div>

      {lastPage > 1 && (
        <div className="border-t p-2">
          <GlobalPagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
