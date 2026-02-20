import { useSupplierTransactions } from "@/api/suppliers/supplier.query";
import { SupplierTransactionItem } from "@/api/suppliers/supplier.types";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { History } from "lucide-react";
import { TRANSACTION_COLUMNS, TRANSACTION_SORT_OPTIONS } from "../../utils/table-feature";

interface SupplierTransactionTabProps {
  supplierId: number;
}

export function SupplierTransactionTab({ supplierId }: SupplierTransactionTabProps) {
  const {
    setPage,
    setSearch,
    setSort,
    setPerPage,
    perPage,
    search,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, isError } = useSupplierTransactions(supplierId, {
    ...apiParams,
    "filter[search]": search || "",
  });

  const transactions = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const currentPage = data?.data?.current_page ?? 1;
  const lastPage = data?.data?.last_page ?? 1;

  if (isError) {
    return <p className="text-center text-red-500">Failed to load transactions</p>;
  }

  return (
    <div className="py-6 animate-in fade-in duration-300">
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <History className="w-4 h-4 text-primary" />
                </div>
                Transaction History
              </CardTitle>
              <CardDescription className="mt-1">
                Purchase and re-order stock movements for this supplier
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">
              {total.toLocaleString()} Entries
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <TableToolbar
            searchPlaceholder="Search material name or SKU..."
            onSearch={setSearch}
            search={search}
            sortOptions={TRANSACTION_SORT_OPTIONS}
            onSortChange={values => setSort(values[0])}
            requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
            perPage={perPage}
            onPerPageChange={setPerPage}
          />

          <DataTable<SupplierTransactionItem>
            columns={TRANSACTION_COLUMNS}
            data={transactions}
            isLoading={isLoading}
            emptyText="No transactions found for this supplier."
          />

          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              <GlobalPagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={setPage}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
