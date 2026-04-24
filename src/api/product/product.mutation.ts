import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct, createExternalPurchase, createInternalManufacturing, recoverProduct, updateExternalPurchase, updateInternalManufacturing, reorderExternalPurchase, reorderInternalManufacturing, updateExternalReorderMovement, updateInternalReorderMovement, deleteExternalReorderMovement, deleteInternalReorderMovement, createScrapMovement, updateScrapMovement } from "./product.api";
import { CreateProductRequest, UpdateProductRequest, CreateExternalPurchaseRequest, CreateInternalManufacturingRequest, ReorderExternalPurchasePayload, ReorderInternalManufacturingPayload, CreateScrapMovementPayload, UpdateScrapMovementPayload } from "./product.type";
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

export const useReorderExternalPurchase = (productId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderExternalPurchasePayload) =>
      reorderExternalPurchase(productId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      toast.success(response.message || "Reorder created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create reorder");
    },
  });
};

export const useReorderInternalManufacturing = (productId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderInternalManufacturingPayload) =>
      reorderInternalManufacturing(productId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      toast.success(response.message || "Reorder created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create reorder");
    },
  });
};

export const useUpdateExternalReorderMovement = (productId: number, movementId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderExternalPurchasePayload) =>
      updateExternalReorderMovement(productId, movementId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      toast.success(response.message || "Movement updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update movement");
    },
  });
};

export const useUpdateInternalReorderMovement = (productId: number, movementId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderInternalManufacturingPayload) =>
      updateInternalReorderMovement(productId, movementId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      toast.success(response.message || "Movement updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update movement");
    },
  });
};

export const useDeleteExternalReorderMovement = (productId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movementId: number) =>
      deleteExternalReorderMovement(productId, movementId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      toast.success(response.message || "Movement deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete movement");
    },
  });
};

export const useDeleteInternalReorderMovement = (productId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movementId: number) =>
      deleteInternalReorderMovement(productId, movementId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      toast.success(response.message || "Movement deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete movement");
    },
  });
};

export const useCreateScrapMovement = (productId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateScrapMovementPayload) =>
      createScrapMovement(productId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      toast.success(response.message || "Product scrapped successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create scrap movement");
    },
  });
};

export const useUpdateScrapMovement = (productId: number, movementId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateScrapMovementPayload) =>
      updateScrapMovement(productId, movementId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-scrap-movement", productId, movementId] });
      toast.success(response.message || "Scrap movement updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update scrap movement");
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
