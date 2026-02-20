import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
} from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
};

export type FetchParams = {
  page: number;
  per_page: number;
  "filter[search]"?: string;
};

export type FetchResult = {
  data: SelectOption[];
  current_page: number;
  last_page: number;
};

type SearchableSelectProps = {
  id: string;
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  itemsPerPage?: number;

  // API fetch mode
  fetchFn?: (params: FetchParams) => Promise<FetchResult>;
  fetchPerPage?: number;
  /** Label to display for the currently selected value (needed for fetchFn mode when options aren't loaded yet) */
  selectedLabel?: string;
};

export const SearchableSelect = ({
  id,
  label,
  placeholder = "Select an option",
  options = [],
  error,
  value,
  onChange,
  required = false,
  itemsPerPage = 10,

  fetchFn,
  fetchPerPage = 10,
  selectedLabel: selectedLabelProp,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search for API mode
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  const isApiMode = !!fetchFn;

  // Debounce search for API mode
  useEffect(() => {
    if (!isApiMode) return;
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [search, isApiMode]);

  // API fetch query
  const {
    data: fetchedData,
    isLoading: isFetching,
  } = useQuery({
    queryKey: ["searchable-select", id, debouncedSearch, currentPage, fetchPerPage],
    queryFn: () =>
      fetchFn!({
        page: currentPage,
        per_page: fetchPerPage,
        "filter[search]": debouncedSearch || undefined,
      }),
    enabled: isApiMode && open,
  });

  // Resolve displayed options and pagination based on mode
  const resolvedOptions = isApiMode ? (fetchedData?.data ?? []) : (() => {
    const filtered = search.trim()
      ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
      : options;
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  })();

  const totalPages = isApiMode
    ? (fetchedData?.last_page ?? 1)
    : Math.ceil(
        (search.trim()
          ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
          : options
        ).length / itemsPerPage
      );

  const totalItems = isApiMode
    ? undefined
    : (search.trim()
        ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
        : options
      ).length;

  // Jump to selected item's page (static mode only)
  React.useEffect(() => {
    if (isApiMode) return;
    if (!open) return;
    if (search.trim()) return;
    if (!value) return;

    const selectedIndex = options.findIndex(opt => opt.value === value);
    if (selectedIndex < 0) return;

    const nextPage = Math.floor(selectedIndex / itemsPerPage) + 1;
    setCurrentPage(nextPage);
  }, [open, search, value, options, itemsPerPage, isApiMode]);

  // Get selected option label
  const displayLabel = selectedLabelProp
    || options.find(opt => opt.value === value)?.label
    || fetchedData?.data.find(opt => opt.value === value)?.label;

  // Reset page when search changes (static mode)
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
    if (!isApiMode) {
      setCurrentPage(1);
    }
  }, [isApiMode]);

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    setOpen(false);
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  const isLoading = isApiMode && isFetching;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <Label
          htmlFor={id}
          className={error ? "text-red-500" : "text-gray-700 dark:text-gray-300"}
        >
          {label}
          {required && <span className="text-red-500 px-1">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <span className="truncate">
              {displayLabel || placeholder}
            </span>
            <div className="flex items-center gap-1">
              {value && (
                <X
                  className="h-4 w-4 opacity-50 hover:opacity-100"
                  onClick={handleClear}
                />
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search..."
                className="pl-8 h-9"
              />
              {search && (
                <X
                  className="absolute right-2.5 top-2.5 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => handleSearchChange("")}
                />
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[280px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4 gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : resolvedOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              resolvedOptions.map(option => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent",
                    value === option.value && "bg-accent"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-2 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={currentPage === 1 || isLoading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-xs text-muted-foreground">
                {currentPage} / {totalPages}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages || isLoading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-8 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Total count (static mode only) */}
          {!isApiMode && (
            <div className="border-t px-3 py-2 text-xs text-muted-foreground text-center">
              {totalItems} item{totalItems !== 1 ? "s" : ""} found
            </div>
          )}
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
