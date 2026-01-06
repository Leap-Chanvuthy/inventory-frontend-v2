import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRawMaterialCategory } from "./category.api";
import { CreateCategoryRequest } from "./category.types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useCreateRawMaterialCategory = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      createRawMaterialCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-material-categories"] });
      toast.success("Category created successfully");
      navigate("/categories");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
      );
    },
  });
};
