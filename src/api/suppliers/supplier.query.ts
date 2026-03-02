import { useQuery } from "@tanstack/react-query";
import { getSuppliers, getSupplierById, getImportHistories, getSupplierStatistics, getSupplierTransactionHistory, getDeletedSuppliers } from "./supplier.api";
import { SupplierQueryParams, ImportHistoryQueryParams, SupplierTransactionHistoryQueryParams } from "./supplier.types";

// Get all suppliers with pagination and filters
export const useSuppliers = (params?: SupplierQueryParams) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
  });
};

// Get single supplier by ID
export const useSingleSupplier = (id: number) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierById(id),
    enabled: !!id,
  });
};

// Get import histories with pagination and filters
export const useImportHistories = (params?: ImportHistoryQueryParams) => {
  return useQuery({
    queryKey: ["import-histories", params],
    queryFn: () => getImportHistories(params),
  });
};

// Get supplier statistics
export const useSupplierStatistics = () => {
  return useQuery({
    queryKey: ["supplier-statistics"],
    queryFn: () => getSupplierStatistics(),
  });
};


export const useSupplierTransactions = (supplierId: number , params: SupplierTransactionHistoryQueryParams) => {
  return useQuery({
    queryKey: ["supplier-transactions", supplierId, params],
    queryFn: () => getSupplierTransactionHistory(supplierId , params),
    enabled: !!supplierId,
  });
};

// Get deleted (soft-deleted) suppliers
export const useDeletedSuppliers = (params?: SupplierQueryParams) => {
  return useQuery({
    queryKey: ["suppliers-deleted", params],
    queryFn: () => getDeletedSuppliers(params),
  });
};
