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
import { Text } from "@/components/ui/text/app-text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const CreateUserForm = () => {
  const userMutation = useCreateUser();
  const error =
    userMutation.error as AxiosError<CreateUserValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;
  const navigate = useNavigate();

  const initialForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    phone_number: "",
    profile_picture: null as File | null,
  };

  const [form, setForm] = useState(initialForm);

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
        } else {
          setForm(initialForm);
        }
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <Text.TitleMedium className="mb-2">Create a New User</Text.TitleMedium>
      <p className="text-sm text-muted-foreground mb-6">
        Manage user details and roles within the application.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form inputs */}

          {/* Right: Profile picture + notice */}
          <div className="lg:col-span-5 space-y-6">
            <div className="lg:sticky lg:top-6 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <Text.TitleSmall>Profile Picture</Text.TitleSmall>
                  <p className="text-xs text-muted-foreground">Upload an optional profile image for the user.</p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <ImageUpload onChange={handleFileChange} />
                </CardContent>
              </Card>

              <div className="flex items-start gap-3 p-4 rounded-xl border bg-muted/30 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  After creating the user, an email will be sent to them to set
                  up their password.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <Text.TitleSmall>Basic Information</Text.TitleSmall>
                <p className="text-xs text-muted-foreground">Account credentials and contact details.</p>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TextInput
                    id="email"
                    type="email"
                    label="Email"
                    required={true}
                    placeholder="Enter email address"
                    value={form.email}
                    error={fieldErrors?.email?.[0]}
                    onChange={handleChange}
                  />
                  <SelectInput
                    id="role"
                    label="Role"
                    placeholder="Select role"
                    options={USER_ROLES}
                    value={form.role}
                    error={fieldErrors?.role?.[0]}
                    onChange={value =>
                      setForm(prev => ({ ...prev, role: value }))
                    }
                    required={true}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TextInput
                    id="name"
                    label="Name"
                    error={fieldErrors?.name?.[0]}
                    placeholder="Enter username"
                    value={form.name}
                    onChange={handleChange}
                    required={true}
                  />
                  <TextInput
                    id="phone_number"
                    label="Phone Number"
                    required={true}
                    onChange={handleChange}
                    error={fieldErrors?.phone_number?.[0]}
                    placeholder="Enter phone number"
                    value={form.phone_number}
                    isNumberOnly={true}
                    maxLength={10}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TextInput
                    id="password"
                    type="password"
                    error={fieldErrors?.password?.[0]}
                    label="Password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    required={true}
                  />
                  <TextInput
                    id="password_confirmation"
                    type="password"
                    label="Confirm Password"
                    error={fieldErrors?.password_confirmation?.[0]}
                    placeholder="Re-enter password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required={true}
                    allowPaste={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <FormFooterActions isSubmitting={userMutation.isPending} />
      </form>
    </div>
  );
};
