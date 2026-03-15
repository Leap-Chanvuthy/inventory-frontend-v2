/**
 * CategorySidebar
 *
 * Left-panel sidebar for the UOM management page.
 *
 * Features
 *  • Server-side search via filter[search] query param
 *  • Pagination (prev/next) with page stored in the URL
 *  • URL-persisted state via useTableQueryParams — survives page refreshes
 *  • Soft-delete: archive button hides the category (and its units)
 *  • Trashed toggle: shows archived categories with a Restore button
 *  • Inline validation errors on the Add Category dialog
 */

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useUomCategories, useTrashedUomCategories } from "@/api/uom/uom.query";
import {
  useCreateUomCategory,
  useDeleteUomCategory,
  useRestoreUomCategory,
  useUpdateUomCategory,
} from "@/api/uom/uom.mutation";
import { UomCategory } from "@/api/uom/uom.types";
import { parseApiError } from "@/api/uom/uom-error.utils";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useDebounce } from "@/hooks/use-debounce";
import { SimplePagination } from "@/components/table/simple-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Layers,
  Plus,
  Search,
  Trash2,
  Pencil,
  RotateCcw,
  ChevronRight,
  AlertCircle,
  ArchiveX,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-destructive mt-1">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {error}
    </p>
  );
}

// ── Add-category mini-form dialog ─────────────────────────────────────────────
function AddCategoryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mutation = useCreateUomCategory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const serverErrors = useMemo(
    () =>
      mutation.error
        ? parseApiError(mutation.error)
        : { fields: {} as Record<string, string> },
    [mutation.error]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate(
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Category Name *</Label>
            <Input
              id="cat-name"
              placeholder="e.g., Weight, Volume, Packaging"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className={cn(
                serverErrors.fields.name &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            <FieldError error={serverErrors.fields.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea
              id="cat-desc"
              placeholder="Optional description…"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                serverErrors.fields.description &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            <FieldError error={serverErrors.fields.description} />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={mutation.isPending || !name.trim()}
            >
              {mutation.isPending ? "Saving…" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit-category mini-form dialog ───────────────────────────────────────────
function EditCategoryDialog({
  category,
  onClose,
}: {
  category: UomCategory;
  onClose: () => void;
}) {
  const mutation = useUpdateUomCategory(category.id);
  const [name, setName] = useState(category.name ?? "");
  const [description, setDescription] = useState(category.description ?? "");

  useEffect(() => {
    setName(category.name ?? "");
    setDescription(category.description ?? "");
  }, [category]);

  const serverErrors = useMemo(
    () =>
      mutation.error
        ? parseApiError(mutation.error)
        : { fields: {} as Record<string, string> },
    [mutation.error]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate(
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="edit-cat-name">Category Name *</Label>
            <Input
              id="edit-cat-name"
              placeholder="e.g., Weight, Volume, Packaging"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className={cn(
                serverErrors.fields.name &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            <FieldError error={serverErrors.fields.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-cat-desc">Description</Label>
            <Textarea
              id="edit-cat-desc"
              placeholder="Optional description…"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                serverErrors.fields.description &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            <FieldError error={serverErrors.fields.description} />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={mutation.isPending || !name.trim()}
            >
              {mutation.isPending ? "Saving…" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── CategoryRow ───────────────────────────────────────────────────────────────
function CategoryRow({
  cat,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
  isTrashed,
}: {
  cat: UomCategory;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (cat: UomCategory) => void;
  onDelete: (cat: UomCategory) => void;
  onRestore: (cat: UomCategory) => void;
  isTrashed: boolean;
}) {
  const isSelected = selectedId === cat.id;

  return (
    <li>
      <button
        type="button"
        onClick={() => !isTrashed && onSelect(cat.id)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors group",
          isTrashed
            ? "text-muted-foreground/60 cursor-default bg-muted/30"
            : isSelected
            ? "bg-[#5c52d6]/10 text-[#5c52d6] font-medium"
            : "text-foreground hover:bg-muted"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform",
              isSelected && !isTrashed
                ? "rotate-90 opacity-100"
                : "opacity-0 group-hover:opacity-50"
            )}
          />
          <span className="truncate">{cat.name}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Unit count badge */}
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-full",
              isSelected && !isTrashed
                ? "bg-[#5c52d6]/20 text-[#5c52d6]"
                : "bg-muted text-muted-foreground"
            )}
          >
            {cat.units_count ?? 0}
          </span>

          {isTrashed ? (
            /* Restore button */
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRestore(cat);
              }}
              className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-green-600 hover:bg-green-600/10 transition-all"
              title={`Restore ${cat.name}`}
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          ) : (
            <>
              {/* Edit button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cat);
                }}
                className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-[#5c52d6] hover:bg-[#5c52d6]/10 transition-all"
                aria-label={`Edit ${cat.name}`}
              >
                <Pencil className="h-3 w-3" />
              </button>

              {/* Archive button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cat);
                }}
                className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                aria-label={`Archive ${cat.name}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </button>
    </li>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState({ search, isTrashed }: { search: string; isTrashed: boolean }) {
  if (search) {
    return (
      <p className="text-xs text-muted-foreground text-center py-8 px-3">
        No categories match your search.
      </p>
    );
  }
  if (isTrashed) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 px-3 text-center">
        <ArchiveX className="h-8 w-8 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground">No archived categories.</p>
      </div>
    );
  }
  return (
    <p className="text-xs text-muted-foreground text-center py-8 px-3">
      No categories yet. Create one above.
    </p>
  );
}

// ── Main sidebar ──────────────────────────────────────────────────────────────
export interface CategorySidebarProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CategorySidebar({ selectedId, onSelect }: CategorySidebarProps) {
  /**
   * URL-persisted table state.
   * search → filter[search] passed to the API
   * page   → pagination stored in URL so refreshes land on the same page
   */
  const { page, search, setPage, setSearch, apiParams } = useTableQueryParams({
    defaultPerPage: 10,
  });

  // Local input state — debounced before firing the API request
  const [inputValue, setInputValue] = useState(search);
  const debouncedSearch = useDebounce(inputValue, 400);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
      setPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // cat_view=archived persisted in URL — survives page refresh
  const [searchParams, setSearchParams] = useSearchParams();
  const showTrashed = searchParams.get("cat_view") === "archived";

  function toggleShowTrashed() {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!showTrashed) next.set("cat_view", "archived");
        else next.delete("cat_view");
        return next;
      },
      { replace: true }
    );
    setPage(1);
  }

  // ── Active categories (server-side search + pagination) ───────────────────
  const { data: activeData, isLoading: activeLoading } = useUomCategories({
    ...apiParams,
    per_page: 10,
    sort: "name",
  });

  // ── Trashed categories (only fetched when the toggle is on) ───────────────
  const { data: trashedData, isLoading: trashedLoading } = useTrashedUomCategories(
    { "filter[search]": search || undefined, page, per_page: 10 },
    showTrashed
  );

  const deleteMutation = useDeleteUomCategory();
  const restoreMutation = useRestoreUomCategory();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UomCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UomCategory | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<UomCategory | null>(null);

  const currentData = showTrashed ? trashedData : activeData;
  const isLoading = showTrashed ? trashedLoading : activeLoading;
  const categories: UomCategory[] = currentData?.data ?? [];
  const lastPage: number = currentData?.last_page ?? 1;

  return (
    <aside className="flex flex-col h-full bg-background">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            Categories
          </h2>
          <div className="flex items-center gap-1">
            {/* Archived view toggle */}
            <button
              type="button"
              onClick={toggleShowTrashed}
              title={showTrashed ? "Show active" : "Show archived"}
              className={cn(
                "h-7 w-7 rounded flex items-center justify-center transition-colors",
                showTrashed
                  ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <ArchiveX className="h-3.5 w-3.5" />
            </button>

            {/* Add — hidden while browsing archived */}
            {!showTrashed && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            )}
          </div>
        </div>

        {showTrashed && (
          <p className="text-[11px] font-medium text-amber-600 uppercase tracking-wide">
            Archived categories
          </p>
        )}

        {/* Search — value written to URL via setSearch */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search categories…"
            className="pl-8 h-8 text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>

      {/* ── Category list ───────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 min-h-0">
        {isLoading ? (
          <div className="space-y-1.5 p-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState search={search} isTrashed={showTrashed} />
        ) : (
          <ul className="space-y-0.5">
            {categories.map((cat) => (
              <CategoryRow
                key={cat.id}
                cat={cat}
                selectedId={selectedId}
                onSelect={onSelect}
                onEdit={setEditTarget}
                isTrashed={showTrashed}
                onDelete={setDeleteTarget}
                onRestore={(cat) => setRestoreTarget(cat)}
              />
            ))}
          </ul>
        )}
      </nav>

      {/* ── Pagination ──────────────────────────────────────────────────── */}
      {lastPage > 1 && (
        <div className="border-t shrink-0">
          <SimplePagination
            currentPage={page}
            lastPage={lastPage}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}
      <AddCategoryDialog open={addOpen} onClose={() => setAddOpen(false)} />

      {editTarget && (
        <EditCategoryDialog
          category={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Archive confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Archive "{deleteTarget?.name}"?</DialogTitle>
            <DialogDescription>
              The category will be hidden from active lists. Its units will become
              unavailable until the category is restored. No data is permanently
              deleted — you can bring it back at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  });
                }
              }}
            >
              {deleteMutation.isPending ? "Archiving…" : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore confirmation */}
      <Dialog
        open={!!restoreTarget}
        onOpenChange={(open: boolean) => !open && setRestoreTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Restore UOM Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore "{restoreTarget?.name}"?{" "}
              All associated units will become available again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRestoreTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={restoreMutation.isPending}
              onClick={() => {
                if (restoreTarget) {
                  restoreMutation.mutate(restoreTarget.id, {
                    onSuccess: () => setRestoreTarget(null),
                  });
                }
              }}
            >
              {restoreMutation.isPending ? "Restoring…" : "Restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
