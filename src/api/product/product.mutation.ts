import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct } from "./product.api";
import { CreateProductRequest, UpdateProductRequest } from "./product.type";
import { toast } from "sonner";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductRequest) => createProduct(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message || "Product created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
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
      toast.error(error.response?.data?.message || "Failed to update product");
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
      toast.error(error?.response?.data?.message || "Failed to delete product");
    },
  });
};
