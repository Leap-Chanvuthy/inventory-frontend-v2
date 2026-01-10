import { useCreateUser } from "@/api/users/user.mutation";
import { CreateUserValidationErrors } from "@/api/users/user.types";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { SelectInput, TextInput } from "@/components/reusable/partials/input";
import { USER_ROLES } from "@/consts/role";
import { AxiosError } from "axios";
import { Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateUserForm = () => {
  const userMutation = useCreateUser();
  const error =
    userMutation.error as AxiosError<CreateUserValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();
  // console.log(fieldErrors);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    phone_number: "",
    profile_picture: null as File | null,
  });

  /* ---------- Handlers ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setForm(prev => ({ ...prev, profile_picture: file }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    userMutation.mutate(form, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/users");
        }
        // save → stay, data auto-refreshed
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 ">
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Create a New User</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload */}
              <div className="lg:col-span-1">
                <ImageUpload
                  label="Profile Picture"
                  onChange={handleFileChange}
                />

                <div className="my-5 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border text-xs text-gray-500">
                  <Info />
                  After creating the user, an email will be sent to them to set
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
                    required={true}
                    placeholder="Enter email address"
                    value={form.email}
                    error={
                      fieldErrors?.email ? fieldErrors.email[0] : undefined
                    }
                    onChange={handleChange}
                  />

                  <SelectInput
                    label="Role"
                    placeholder="Select role"
                    options={USER_ROLES}
                    value={form.role}
                    error={fieldErrors?.role ? fieldErrors.role[0] : undefined}
                    onChange={value =>
                      setForm(prev => ({ ...prev, role: value }))
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
                    error={
                      fieldErrors?.phone_number
                        ? fieldErrors.phone_number[0]
                        : undefined
                    }
                    placeholder="Enter phone number"
                    value={form.phone_number}
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-3">
                  <TextInput
                    id="password"
                    type="password"
                    error={
                      fieldErrors?.password
                        ? fieldErrors.password[0]
                        : undefined
                    }
                    label="Password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                  />

                  <TextInput
                    id="password_confirmation"
                    type="password"
                    label="Confirm Password"
                    error={
                      fieldErrors?.password_confirmation
                        ? fieldErrors.password_confirmation[0]
                        : undefined
                    }
                    placeholder="Re-enter password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <FormFooterActions isSubmitting={userMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
};
