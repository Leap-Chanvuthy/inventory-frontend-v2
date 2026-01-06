import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser } from "./user.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreateUserPayload, UpdateUserPayload } from "./user.types";

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
      toast.error(error?.response?.data?.message || "Failed to create user");
    },
  });
};

// export const useUpdateUser = (userId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: UpdateUserPayload) =>
//       updateUser(userId, payload),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//       queryClient.invalidateQueries({ queryKey: ["user", userId] });

//       toast.success("User updated successfully");
//     },

//     onError: (error: any) => {
//       toast.error(
//         error?.response?.data?.message || "Failed to update user"
//       );
//     },
//   });
// };

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user", userId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("User updated successfully");
      navigate("/users");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });
};
