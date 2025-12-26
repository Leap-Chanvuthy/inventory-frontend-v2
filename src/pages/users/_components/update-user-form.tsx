import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { useSingleUser } from "@/api/users/user.query";
import { useUpdateUser } from "@/api/users/user.mutation";
import { CreateUserValidationErrors } from "@/api/users/user.types";

import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { USER_ROLES } from "@/consts/role";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { SelectInput, TextInput } from "@/components/reusable/partials/input";
import { Info } from "lucide-react";


export const UpdateUserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data: user } = useSingleUser(userId);

  const updateMutation = useUpdateUser(userId);

  const error = updateMutation.error as AxiosError<CreateUserValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    phone_number: "",
    profile_picture: null as File | null,
  });

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number || "",
      profile_picture: null,
    }));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setForm((prev) => ({
      ...prev,
      profile_picture: file,
    }));
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    updateMutation.mutate(form, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/users");
        }
        // save → stay, data auto-refreshed
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Update User Info</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload */}
              <div className="lg:col-span-1">
                <ImageUpload
                  label="Profile Picture"
                  defaultImage={user?.profile_picture ?? undefined}
                  onChange={handleFileChange}
                />

                <div className="my-5 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border text-xs text-gray-500">
                  <Info />
                  After updating the user, an email will be sent to them to set
                  up their password.
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col lg:flex-row gap-3">
                  <TextInput
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="Enter email address"
                    value={form.email}
                    error={fieldErrors?.email ? fieldErrors.email[0] : undefined}
                    onChange={handleChange}
                  />

                  <SelectInput
                    label="Role"
                    placeholder="Select role"
                    options={USER_ROLES}
                    value={form.role}
                    error={fieldErrors?.role ? fieldErrors.role[0] : undefined}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, role: value }))
                    }
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-3">
                  <TextInput
                    id="name"
                    label="Name"
                    error={fieldErrors?.name ? fieldErrors.name[0] : undefined}
                    placeholder="Enter username"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-3">
                  <TextInput
                    id="phone_number"
                    label="Phone Number"
                    onChange={handleChange}
                    error={fieldErrors?.phone_number ? fieldErrors.phone_number[0] : undefined}
                    placeholder="Enter phone number"
                    value={form.phone_number}
                  />
                </div>

              </div>
            </div>

            <FormFooterActions isSubmitting={updateMutation.isPending} />

          </form>
        </div>
      </div>
    </div>
  );
};
