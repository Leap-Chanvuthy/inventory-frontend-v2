import * as React from "react";
import { useState, useMemo } from "react";
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
} from "lucide-react";

type SelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  id: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  itemsPerPage?: number;
};

export const SearchableSelect = ({
  id,
  label,
  placeholder = "Select an option",
  options,
  error,
  value,
  onChange,
  required = false,
  itemsPerPage = 10,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    if (!open) return;
    if (search.trim()) return;
    if (!value) return;

    const selectedIndex = options.findIndex(opt => opt.value === value);
    if (selectedIndex < 0) return;

    const nextPage = Math.floor(selectedIndex / itemsPerPage) + 1;
    setCurrentPage(nextPage);
  }, [open, search, value, options, itemsPerPage]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOptions = filteredOptions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get selected option label
  const selectedLabel = options.find(opt => opt.value === value)?.label;

  // Reset page when search changes
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  // Handle selection
  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    setOpen(false);
    setSearch("");
    setCurrentPage(1);
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

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
              {selectedLabel || placeholder}
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
            {paginatedOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              paginatedOptions.map(option => (
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
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-8 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Total count */}
          <div className="border-t px-3 py-2 text-xs text-muted-foreground text-center">
            {filteredOptions.length} item{filteredOptions.length !== 1 ? "s" : ""} found
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
