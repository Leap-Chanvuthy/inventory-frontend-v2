import { useState, useEffect } from "react";
import { Search, ArrowUpDown, Check, SlidersHorizontal, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export interface PickerColumn<T> {
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

export interface PickerSortOption {
  label: string;
  value: string;
}

export interface PickerFilterGroup {
  /** The key used in currentFilters / onFilterChange */
  key: string;
  /** Display label shown as section header */
  label: string;
  options: { label: string; value: string }[];
}

export interface PickerDialogProps<T extends { id: number }> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selected: T[]) => void;
  alreadySelectedIds?: number[];

  title: string;
  description?: string;

  // Data
  items: T[];
  isLoading?: boolean;
  columns: PickerColumn<T>[];

  // Search
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Sort (optional)
  sortOptions?: PickerSortOption[];
  currentSort?: string;
  onSortChange?: (value: string) => void;

  // Filter (optional)
  filterGroups?: PickerFilterGroup[];
  currentFilters?: Record<string, string>;
  onFilterChange?: (filters: Record<string, string>) => void;

  // Pagination
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;

  // Optional
  confirmLabel?: (count: number) => string;
  emptyText?: string;
}

export function PickerDialog<T extends { id: number }>({
  open,
  onOpenChange,
  onConfirm,
  alreadySelectedIds = [],
  title,
  description,
  items,
  isLoading = false,
  columns,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortOptions,
  currentSort,
  onSortChange,
  filterGroups,
  currentFilters = {},
  onFilterChange,
  currentPage,
  lastPage,
  onPageChange,
  confirmLabel,
  emptyText = "No items found.",
}: PickerDialogProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedMap, setSelectedMap] = useState<Map<number, T>>(new Map());

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(alreadySelectedIds));
      setSelectedMap(new Map());
    }
  }, [open]);

  const toggleSelect = (item: T) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
    setSelectedMap(prev => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.set(item.id, item);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = Array.from(selectedMap.values()).filter(item =>
      selectedIds.has(item.id),
    );
    onConfirm(selected);
    onOpenChange(false);
  };

  const handleFilterSelect = (groupKey: string, value: string) => {
    if (!onFilterChange) return;
    const next = { ...currentFilters };
    if (next[groupKey] === value) {
      delete next[groupKey];
    } else {
      next[groupKey] = value;
    }
    onFilterChange(next);
    onPageChange(1);
  };

  const clearFilter = (groupKey: string) => {
    if (!onFilterChange) return;
    const next = { ...currentFilters };
    delete next[groupKey];
    onFilterChange(next);
    onPageChange(1);
  };

  const activeFilterCount = Object.keys(currentFilters).length;
  const currentSortLabel = sortOptions?.find(
    o => o.value === currentSort,
  )?.label;
  const colCount = columns.length + 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[70vw] w-full p-0 gap-0 overflow-hidden"
        onPointerDownOutside={e => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b space-y-1">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Action Bar */}
        <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9 h-9"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>

          {/* Sort */}
          {sortOptions && onSortChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {currentSortLabel ?? "Sort"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {sortOptions.map(opt => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => onSortChange(opt.value)}
                    className="flex items-center justify-between gap-4"
                  >
                    {opt.label}
                    {currentSort === opt.value && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Filter */}
          {filterGroups && filterGroups.length > 0 && onFilterChange && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 relative"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filter
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-4 space-y-4">
                {filterGroups.map(group => (
                  <div key={group.key}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {group.label}
                    </p>
                    <div className="space-y-1.5">
                      {group.options.map(opt => {
                        const isSelected =
                          currentFilters[group.key] === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-muted text-sm"
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                handleFilterSelect(group.key, opt.value)
                              }
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-muted-foreground text-xs"
                    onClick={() => onFilterChange({})}
                  >
                    Clear all filters
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          )}

          {/* Active filter chips */}
          {filterGroups &&
            filterGroups.map(group => {
              const val = currentFilters[group.key];
              if (!val) return null;
              const label = group.options.find(o => o.value === val)?.label;
              return (
                <span
                  key={group.key}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  {group.label}: {label}
                  <button
                    type="button"
                    onClick={() => clearFilter(group.key)}
                    className="ml-0.5 hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}

          <div className="flex-1" />

          {selectedIds.size > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedIds.size} selected
            </p>
          )}

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            className="h-9"
          >
            {confirmLabel
              ? confirmLabel(selectedIds.size)
              : `+ Select (${selectedIds.size})`}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-auto border-t h-[350px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 h-12">
                <TableHead className="w-16 pl-6 font-semibold text-foreground text-sm">
                  Select
                </TableHead>
                {columns.map((col, i) => (
                  <TableHead
                    key={i}
                    className={`font-semibold text-foreground text-sm ${col.className ?? ""}`}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: colCount }).map((_, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={colCount}
                    className="text-center py-12 text-muted-foreground"
                  >
                    {emptyText}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                items.map(item => {
                  const isChecked = selectedIds.has(item.id);
                  return (
                    <TableRow
                      key={item.id}
                      className={`cursor-pointer transition-colors h-14 ${
                        isChecked
                          ? "bg-primary/8 hover:bg-primary/12"
                          : "hover:bg-muted/40"
                      }`}
                      onClick={() => toggleSelect(item)}
                    >
                      <TableCell
                        className="pl-6"
                        onClick={e => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSelect(item)}
                        />
                      </TableCell>
                      {columns.map((col, i) => (
                        <TableCell key={i} className={col.className}>
                          {col.render(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex justify-center">
          <div className="flex items-center gap-1 border border-border rounded-xl px-2 py-1">
            <GlobalPagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
