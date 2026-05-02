import { ReactNode, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Archive, CirclePlus, Folder, Search } from "lucide-react";
import { CategoryCreateUpdateDialog, CategoryDialogValues } from "./category-create-update-dialog";
import { CategoryFilterList } from "./category-filter-list";
import { useDebounce } from "@/hooks/use-debounce";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CategoryCreateMode = "modal" | "page";

interface CategoryFormRenderContext<T> {
  mode: "create" | "update";
  category?: T;
  values?: CategoryDialogValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface CategoryFilterSidebarProps<T> {
  categoryKey: string;
  categoryLabel?: string;
  createMode?: CategoryCreateMode;
  createHref?: string;
  categories: T[];
  isLoading: boolean;
  selectedCategory: number | null;
  showAllOption?: boolean;
  allLabel?: string;
  allCount?: number;
  categoryStatus: "active" | "deleted";
  categoryPage: number;
  categoryLastPage: number;
  categorySearch: string;
  isCreatingCategory?: boolean;
  isUpdatingCategory?: boolean;
  onCategorySearchChange: (value: string) => void;
  onCategoryPageChange: (page: number) => void;
  onCategoryStatusToggle: () => void;
  onCategoryChange: (categoryId: number | null) => void;
  onCreateCategory: (values: CategoryDialogValues) => Promise<void>;
  onUpdateCategory: (id: number, values: CategoryDialogValues) => Promise<void>;
  onDeleteCategory: (id: number) => void;
  onRestoreCategory?: (id: number) => void;
  getCategoryId?: (category: T) => number;
  getCategoryLabel?: (category: T) => string;
  getCategoryDescription?: (category: T) => string;
  getCategoryColor?: (category: T) => string | undefined;
  getCategoryCount?: (category: T) => number;
  getCategoryViewHref?: (category: T) => string | undefined;
  renderCreateForm?: (context: CategoryFormRenderContext<T>) => ReactNode;
  renderUpdateForm?: (context: CategoryFormRenderContext<T>) => ReactNode;
}

export function CategoryFilterSidebar<T extends Record<string, any>>({
  categoryKey,
  categoryLabel = "Categories",
  createMode = "modal",
  createHref,
  categories,
  isLoading,
  selectedCategory,
  showAllOption = true,
  allLabel = "All",
  allCount,
  categoryStatus,
  categoryPage,
  categoryLastPage,
  categorySearch,
  isCreatingCategory = false,
  isUpdatingCategory = false,
  onCategorySearchChange,
  onCategoryPageChange,
  onCategoryStatusToggle,
  onCategoryChange,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onRestoreCategory,
  getCategoryId = (category: T) => category.id,
  getCategoryLabel = (category: T) => category.category_name || category.name || "",
  getCategoryDescription = (category: T) => category.description || "",
  getCategoryColor = (category: T) => category.label_color,
  getCategoryCount = (category: T) => category.items_count || category.units_count || category.raw_materials_count || 0,
  getCategoryViewHref,
  renderCreateForm,
  renderUpdateForm,
}: CategoryFilterSidebarProps<T>) {
  const [createOpen, setCreateOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<T | null>(null);
  const [searchInput, setSearchInput] = useState(categorySearch);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  useEffect(() => {
    setSearchInput(categorySearch);
  }, [categorySearch]);

  useEffect(() => {
    if (debouncedSearchInput === categorySearch) return;
    onCategorySearchChange(debouncedSearchInput);
  }, [categorySearch, debouncedSearchInput, onCategorySearchChange]);

  const targetValues = useMemo(
    () =>
      updateTarget
        ? {
            category_name: getCategoryLabel(updateTarget),
            description: getCategoryDescription(updateTarget),
            label_color: getCategoryColor(updateTarget) || "#5c52d6",
          }
        : undefined,
    [updateTarget, getCategoryColor, getCategoryDescription, getCategoryLabel]
  );

  return (
    <aside
      className="rounded-xl border bg-card min-h-[640px] max-h-[calc(100vh-220px)] flex flex-col"
      data-category-key={categoryKey}
    >
      <div className="px-4 pt-4 pb-3 border-b space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">{categoryLabel}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCategoryStatusToggle}
              className="h-8 w-8 rounded-md border bg-background hover:bg-muted transition-colors inline-flex items-center justify-center"
              title={
                categoryStatus === "active"
                  ? "Show archived categories"
                  : "Show active categories"
              }
            >
              {categoryStatus === "active" ? (
                <Archive className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Folder className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {createMode === "page" && createHref ? (
              <Button type="button" size="sm" className="h-8" asChild>
                <Link to={createHref}>
                  <CirclePlus className="h-3.5 w-3.5 mr-1.5" />
                  Create
                </Link>
              </Button>
            ) : (
              <Button type="button" size="sm" className="h-8" onClick={() => setCreateOpen(true)}>
                <CirclePlus className="h-3.5 w-3.5 mr-1.5" />
                Create
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="h-8 text-sm pl-8"
            placeholder={`Search ${categoryLabel.toLowerCase()}...`}
          />
        </div>
      </div>

      <CategoryFilterList
        categories={categories}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        showAllOption={showAllOption}
        allLabel={allLabel}
        allCount={allCount}
        isDeletedView={categoryStatus === "deleted"}
        currentPage={categoryPage}
        lastPage={categoryLastPage}
        onPageChange={onCategoryPageChange}
        getCategoryId={getCategoryId}
        getCategoryLabel={getCategoryLabel}
        getCategoryCount={getCategoryCount}
        getCategoryColor={getCategoryColor}
        getCategoryViewHref={getCategoryViewHref}
        onCategoryChange={onCategoryChange}
        onEditCategory={setUpdateTarget}
        onDeleteCategory={category => onDeleteCategory(getCategoryId(category))}
        onRestoreCategory={
          onRestoreCategory
            ? category => onRestoreCategory(getCategoryId(category))
            : undefined
        }
      />

      {renderCreateForm ? (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-3xl p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Create {categoryLabel}</DialogTitle>
            </DialogHeader>
            {renderCreateForm({
              mode: "create",
              onSuccess: () => setCreateOpen(false),
              onCancel: () => setCreateOpen(false),
            })}
          </DialogContent>
        </Dialog>
      ) : (
        <CategoryCreateUpdateDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          mode="create"
          isSubmitting={isCreatingCategory}
          onSubmit={async payload => {
            await onCreateCategory(payload);
            setCreateOpen(false);
          }}
        />
      )}

      {renderUpdateForm && updateTarget ? (
        <Dialog
          open={!!updateTarget}
          onOpenChange={open => {
            if (!open) setUpdateTarget(null);
          }}
        >
          <DialogContent className="max-w-3xl p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Update {categoryLabel}</DialogTitle>
            </DialogHeader>
            {renderUpdateForm({
              mode: "update",
              category: updateTarget,
              values: targetValues,
              onSuccess: () => setUpdateTarget(null),
              onCancel: () => setUpdateTarget(null),
            })}
          </DialogContent>
        </Dialog>
      ) : (
        <CategoryCreateUpdateDialog
          open={!!updateTarget}
          onOpenChange={open => {
            if (!open) setUpdateTarget(null);
          }}
          mode="update"
          defaultValues={targetValues}
          isSubmitting={isUpdatingCategory}
          onSubmit={async payload => {
            if (!updateTarget) return;
            await onUpdateCategory(getCategoryId(updateTarget), payload);
            setUpdateTarget(null);
          }}
        />
      )}
    </aside>
  );
}
