import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct, createExternalPurchase, createInternalManufacturing, recoverProduct, updateExternalPurchase, updateInternalManufacturing } from "./product.api";
import { CreateProductRequest, UpdateProductRequest, CreateExternalPurchaseRequest, CreateInternalManufacturingRequest } from "./product.type";
import { toast } from "sonner";
import { showApiErrorToast } from "@/components/reusable/partials/api-error-response-toast";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductRequest) => createProduct(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message || "Product created successfully");
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Failed to create product");
    },
  });
};

export const useUpdateProduct = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProductRequest) => updateProduct(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success(response.message || "Product updated successfully");
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Failed to update product");
    },
  });
};

export const useCreateExternalPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExternalPurchaseRequest) => createExternalPurchase(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message || "Product created successfully");
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Failed to create product");
    },
  });
};

export const useCreateInternalManufacturing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInternalManufacturingRequest) => createInternalManufacturing(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message || "Product created successfully");
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Failed to create product");
    },
  });
};

export const useUpdateExternalPurchase = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExternalPurchaseRequest) => updateExternalPurchase(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success(response.message || "Product updated successfully");
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Failed to update product");
    },
  });
};

export const useUpdateInternalManufacturing = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInternalManufacturingRequest) => updateInternalManufacturing(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success(response.message || "Product updated successfully");
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Failed to update product");
    },
  });
};

export const useRecoverProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recoverProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-trashed"] });
      toast.success("Product recovered successfully");
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Failed to recover product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Failed to delete product");
    },
  });
};
