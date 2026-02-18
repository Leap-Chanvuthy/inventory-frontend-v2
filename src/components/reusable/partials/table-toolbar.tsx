import { useState, useEffect, useCallback, useRef } from "react";
import debounce from "debounce";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Search, ArrowUpDown, Download, X, CirclePlus } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import ListOptionToggle from "./list-option-toggle";

/* ===================== Types ===================== */

export type SortOption = {
  value: string;
  label: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type RequestPerPageOption = {
  value: number;
  label: string;
}

interface TableToolbarProps {
  /* Search */
  searchPlaceholder?: string;
  search?: string;
  onSearch: (value: string) => void;

  // request per page
  requestPerPageOptions?: RequestPerPageOption[];
  perPage?: number;
  onPerPageChange?: (value: number) => void;

  /* Sort */
  sortOptions?: SortOption[];
  selectedSort?: string[];
  onSortChange?: (values: string[]) => void;

  /* Filter */
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;

  /* Actions */
  onExport?: () => void;
  createHref?: string;
  onCreate?: () => void;
  isListOptionDisplayed?: boolean;
  extraActions?: React.ReactNode;
}

/* ===================== Component ===================== */

export const TableToolbar = ({
  searchPlaceholder = "Search...",
  search,
  onSearch,

  // request per page
  requestPerPageOptions = [],
  perPage,
  onPerPageChange,

  sortOptions = [],
  selectedSort = [],
  onSortChange,

  filterOptions = [],
  selectedFilter,
  onFilterChange,

  onExport,
  createHref,
  onCreate,
  isListOptionDisplayed = false,
  extraActions,
}: TableToolbarProps) => {
  const [searchValue, setSearchValue] = useState<string>(search || "");
  const [sortValues, setSortValues] = useState<string[]>(selectedSort || []);
  const [filterValue, setFilterValue] = useState<string>(selectedFilter ?? "");
  const [perPageValue, setPerPageValue] = useState<number | undefined>(perPage || undefined);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------- Keyboard shortcut: press "/" to focus search ---------- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // only plain "/" (no modifiers)
      if (e.key.toLowerCase() !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;

      // don't hijack typing in inputs/textareas/selects/contenteditable
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName?.toLowerCase();
      const isTypingContext =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        el?.isContentEditable;

      if (isTypingContext) return;

      e.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ---------- Debounced Search ---------- */
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  /* ---------- Sort Toggle ---------- */
  const toggleSort = (value: string) => {
    const updated = sortValues.includes(value)
      ? sortValues.filter(v => v !== value)
      : [...sortValues, value];

    setSortValues(updated);
    onSortChange?.(updated);
  };

  const handlePerPageChange = (value: string) => {
    const perPage = Number(value);
    setPerPageValue(perPage);
    onPerPageChange?.(perPage);
  }

  /* ---------- Filter Change ---------- */
  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    onFilterChange?.(value);
  };

  const clearShortAndFilter = () => {
    setSearchValue("");
    setFilterValue("");
    setSortValues([]);
    onSortChange?.([]);
    onFilterChange?.("");
    onPerPageChange?.(10);
    setPerPageValue(10);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
      {/* LEFT */}
      <div className="flex flex-1 flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

          <Input
            ref={searchInputRef}
            value={search || searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 pr-12"
          />

          {searchValue ? (
            <X
              className="text-red-500 absolute right-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={() => setSearchValue("")}
            />
          ) : (
            <KbdGroup
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2
                         rounded border border-border bg-muted
                         text-[10px] font-medium text-muted-foreground"
            >
              <Kbd>/</Kbd>
            </KbdGroup>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {/* Sort */}
          {sortOptions.length > 0 && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9  px-4 border border-border rounded-md">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-3 w-56">
                    <div className="space-y-2">
                      {sortOptions.map(opt => (
                        <label
                          key={opt.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={sortValues.includes(opt.value)}
                            onCheckedChange={() => toggleSort(opt.value)}
                          />
                          <span className="text-sm">{opt.label == selectedSort[0] ? `${opt.label}` : opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Filter */}
          {filterOptions.length > 0 && (
            <Select value={filterValue} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label == selectedFilter ? `${opt.label}` : opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* request per page */}
          {requestPerPageOptions.length > 0 && (
            <Select value={perPageValue?.toString()} onValueChange={handlePerPageChange}>
              <SelectTrigger className="w-16 h-9">
                <SelectValue placeholder="Per Page" />
              </SelectTrigger>
              <SelectContent>
                {requestPerPageOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.value == perPage ? `${opt.label}` : opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {isListOptionDisplayed && <ListOptionToggle />}

          {(filterValue || sortValues.length > 0) && (
            <Button
              variant="outline"
              className="text-red-500 h-9"
              size="sm"
              onClick={clearShortAndFilter}
            >
              Clear Filter
            </Button>
          )}

          {/* Export */}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* Extra Actions */}
        {extraActions}

        {/* Create Button */}
        {createHref && (
          <Link to={createHref}>
            <Button onClick={onCreate} className="flex items-center gap-2">
              <CirclePlus className="h-4 w-4" />
              Create New
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};