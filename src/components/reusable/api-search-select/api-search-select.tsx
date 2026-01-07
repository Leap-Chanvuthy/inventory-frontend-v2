import { X, Check, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApiSearchSelectProps } from "./api-search-select.type";
import APISearchSelectLoading from "./api-search-select-loading";
import { Button } from "@/components/ui/button";

export function ApiSearchSelect<T>({
  mode = "multiple",
  data = [],
  isLoading,
  emptyText = "No results found",
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  selected,
  onChange,
  getId,
  getLabels,

  // ✅ pagination
  currentPage,
  lastPage,
  onPageChange,
}: ApiSearchSelectProps<T>) {
  const isSelected = (item: T) =>
    selected.some(s => String(getId(s)) === String(getId(item)));

  const toggleItem = (item: T) => {
    if (mode === "single") {
      onChange([item]);
      return;
    }

    if (isSelected(item)) {
      onChange(selected.filter(s => String(getId(s)) !== String(getId(item))));
    } else {
      onChange([...selected, item]);
    }
  };

  const removeItem = (item: T) => {
    onChange(selected.filter(s => String(getId(s)) !== String(getId(item))));
  };

  const showPagination =
    !!searchValue &&
    typeof currentPage === "number" &&
    typeof lastPage === "number" &&
    !!onPageChange &&
    lastPage > 1;

  const canPrev = showPagination && currentPage > 1 && !isLoading;
  const canNext = showPagination && currentPage < lastPage && !isLoading;

  return (
    <div className="w-full space-y-2">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9 w-full"
        />
        {searchValue && (
          <X
            className="absolute right-3 top-2.5 h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
            onClick={() => onSearchChange("")}
          />
        )}
      </div>

      {/* Selected Items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(item => {
            const labels = getLabels(item);
            return (
              <Badge
                key={String(getId(item))}
                variant="secondary"
                className="flex items-center gap-1 max-w-full"
              >
                <span className="truncate">{labels[0]}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3 text-red-500 dark:text-white" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Dropdown Results */}
      {searchValue && (
        <div className="relative">
          <div className="absolute z-50 w-full rounded-md border bg-background shadow">
            <ScrollArea className="max-h-60">
              {isLoading && <APISearchSelectLoading />}

              {!isLoading && data.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">{emptyText}</div>
              )}

              {!isLoading &&
                data.map(item => {
                  const selectedState = isSelected(item);
                  const labels = getLabels(item);

                  return (
                    <div
                      key={String(getId(item))}
                      onClick={() => toggleItem(item)}
                      className={cn(
                        "cursor-pointer px-3 py-2 hover:bg-accent",
                        selectedState && "bg-accent"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col text-sm min-w-0">
                          <span className="font-medium leading-tight truncate">
                            {labels[0]}
                          </span>

                          {labels.slice(1).map((label, index) => (
                            <span
                              key={index}
                              className="text-xs text-muted-foreground truncate"
                            >
                              {label}
                            </span>
                          ))}
                        </div>

                        {selectedState && (
                          <Check className="mt-1 h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
            </ScrollArea>

            {/* ✅ Pagination footer */}
            {showPagination && (
              <div className="flex items-center justify-between gap-2 border-t px-2 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!canPrev}
                  onClick={() => onPageChange(currentPage - 1)}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-xs text-muted-foreground">
                  {currentPage}/{lastPage}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!canNext}
                  onClick={() => onPageChange(currentPage + 1)}
                  className="h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}