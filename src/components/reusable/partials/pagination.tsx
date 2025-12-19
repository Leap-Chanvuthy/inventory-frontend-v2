import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface GlobalPaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function GlobalPagination({ currentPage, lastPage, onPageChange }: GlobalPaginationProps) {
  const getPages = () => {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= lastPage; i++) {
      // Show all pages if lastPage <= 5
      if (lastPage <= 5) {
        pages.push(i);
      } else {
        // Always show first, last, current, and neighbors
        if (i === 1 || i === lastPage || Math.abs(i - currentPage) <= 1) {
          pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
          pages.push("...");
        }
      }
    }
    return pages;
  };

  const pages = getPages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem >
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.max(currentPage - 1, 1));
            }}
          />
        </PaginationItem>

        {pages.map((page, idx) =>
          page === "..." ? (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={idx}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Number(page));
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.min(currentPage + 1, lastPage));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
