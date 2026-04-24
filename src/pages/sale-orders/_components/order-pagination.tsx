import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function OrderPagination({
  page,
  totalPages,
  totalItems,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}: OrderPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages} · {totalItems} orders
      </p>

      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="outline"
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
          className="h-8 w-8"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="h-8 w-8"
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
