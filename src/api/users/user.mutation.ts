import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "./user.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreateUserPayload } from "./user.types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),

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
