/**
 * SimplePagination
 *
 * A compact, reusable prev/next pagination control designed for narrow
 * containers (sidebars, cards, small panels).
 *
 * Props
 *  currentPage  – 1-based current page index
 *  lastPage     – total number of pages (from Laravel paginator)
 *  onPageChange – callback fired with the new page number
 *  className    – optional extra tailwind classes for the wrapper
 *
 * Usage:
 *  <SimplePagination
 *    currentPage={page}
 *    lastPage={data.last_page}
 *    onPageChange={setPage}
 *  />
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimplePaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  currentPage,
  lastPage,
  onPageChange,
  className,
}: SimplePaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between gap-2 px-3 py-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="text-xs text-muted-foreground tabular-nums">
        {currentPage} / {lastPage}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
