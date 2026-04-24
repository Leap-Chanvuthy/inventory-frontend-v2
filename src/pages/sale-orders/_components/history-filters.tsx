import { CalendarDays, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DateRange, TopTab } from "../types";
import { SearchInput } from "./search-input";

interface HistoryFiltersProps {
  mode: TopTab;
  searchTerm: string;
  dateRange: DateRange;
  onSearchChange: (value: string) => void;
  onOpenDateFilter: () => void;
  onClearDateFilter: () => void;
  onDownloadReport: () => void;
}

function getDateRangeLabel(dateRange: DateRange) {
  if (!dateRange.start || !dateRange.end) {
    return "Date Range";
  }

  return `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`;
}

export function HistoryFilters({
  mode,
  searchTerm,
  dateRange,
  onSearchChange,
  onOpenDateFilter,
  onClearDateFilter,
  onDownloadReport,
}: HistoryFiltersProps) {
  const isHistory = mode === "HISTORY";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="min-w-[220px] flex-1">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={isHistory ? "Search order ID or customer..." : "Search active orders..."}
        />
      </div>

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

          <Button type="button" size="sm" variant="secondary" onClick={onDownloadReport} className="h-9 px-3">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download
          </Button>
        </>
      )}
    </div>
  );
}
