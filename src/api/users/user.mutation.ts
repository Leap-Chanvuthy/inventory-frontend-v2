import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "./user.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: FormData) => createUser(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
      navigate("/users");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create user"
      );
    },
  });
};
