import { CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/utils/date-format";
import type { DateRange, TopTab } from "../types";
import { SearchInput } from "./search-input";

interface HistoryFiltersProps {
  mode: TopTab;
  searchTerm: string;
  dateRange: DateRange;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOpenDateFilter: () => void;
  onClearDateFilter: () => void;
}

function getDateRangeLabel(dateRange: DateRange) {
  if (!dateRange.start || !dateRange.end) {
    return "Date Range";
  }

  return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
}

export function HistoryFilters({
  mode,
  searchTerm,
  dateRange,
  sort,
  onSearchChange,
  onSortChange,
  onOpenDateFilter,
  onClearDateFilter,
}: HistoryFiltersProps) {
  const isHistory = mode === "HISTORY";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="min-w-[220px] flex-1">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={isHistory ? "Search order ID, customer, or phone..." : "Search order ID, customer, or phone..."}
        />
      </div>

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="h-9 w-[180px] border-border bg-background text-xs text-muted-foreground">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-created_at">Newest Created</SelectItem>
          <SelectItem value="created_at">Oldest Created</SelectItem>
          <SelectItem value="-updated_at">Recently Updated</SelectItem>
          <SelectItem value="order_no">Order ID (A-Z)</SelectItem>
          <SelectItem value="customer_name">Customer (A-Z)</SelectItem>
          <SelectItem value="-grand_total_amount_in_usd">Total (High-Low)</SelectItem>
          <SelectItem value="grand_total_amount_in_usd">Total (Low-High)</SelectItem>
        </SelectContent>
      </Select>

      {isHistory && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onOpenDateFilter}
            className="h-9 border-border bg-background text-xs text-muted-foreground hover:bg-muted/60"
          >
            <CalendarDays className="mr-2 h-3.5 w-3.5" />
            {getDateRangeLabel(dateRange)}
          </Button>

          {(dateRange.start || dateRange.end) && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={onClearDateFilter}
              className="h-9 w-9 border-border bg-background text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
