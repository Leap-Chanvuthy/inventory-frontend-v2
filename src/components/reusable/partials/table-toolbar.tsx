import { useState, useEffect, useCallback } from "react";
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

import { Search, Plus, ArrowUpDown, Download } from "lucide-react";

/* ===================== Types ===================== */

export type SortOption = {
  value: string;
  label: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

interface TableToolbarProps {
  /* Search */
  searchPlaceholder?: string;
  onSearch: (value: string) => void;

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
}

/* ===================== Component ===================== */

export const TableToolbar = ({
  searchPlaceholder = "Search...",
  onSearch,

  sortOptions = [],
  selectedSort = [],
  onSortChange,

  filterOptions = [],
  selectedFilter,
  onFilterChange,

  onExport,
  createHref,
  onCreate,
}: TableToolbarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValues, setSortValues] = useState<string[]>(selectedSort);
  const [filterValue, setFilterValue] = useState<string>(selectedFilter ?? "");

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
      ? sortValues.filter((v) => v !== value)
      : [...sortValues, value];

    setSortValues(updated);
    onSortChange?.(updated);
  };

  /* ---------- Filter Change ---------- */
  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    onFilterChange?.(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
      {/* LEFT */}
      <div className="flex flex-1 flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {/* Sort */}
          {sortOptions.length > 0 && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-3 w-56">
                    <div className="space-y-2">
                      {sortOptions.map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={sortValues.includes(opt.value)}
                            onCheckedChange={() => toggleSort(opt.value)}
                          />
                          <span className="text-sm">{opt.label}</span>
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
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      {createHref && (
        <Link to={createHref}>
          <Button onClick={onCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </Link>
      )}
    </div>
  );
};
