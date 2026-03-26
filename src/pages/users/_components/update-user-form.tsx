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
import { Text } from "@/components/ui/text/app-text";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const UpdateUserForm = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const { data: user, isError, isLoading, isFetching } = useSingleUser(userId);

  const updateMutation = useUpdateUser(userId);

  const error =
    updateMutation.error as AxiosError<CreateUserValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    phone_number: "",
    profile_picture: null as File | null,
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number || "",
        profile_picture: null,
      }));
    }
  }, [user]);

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

    updateMutation.mutate(form, {
      onSuccess: () => {
        if (action === "save_and_close") {
          navigate("/users");
        }
      },
    });
  };

  if (isLoading) {
    return <DataCardLoading text="Loading user details data..." />;
  }

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" homeTo="/users" />;
  }

  if (!user) {
    return <DataCardEmpty emptyText="User not found." />;
  }

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5 mx-6">
      <Text.TitleMedium className="mb-2">Update User Info</Text.TitleMedium>
      <p className="text-sm text-muted-foreground mb-6">
        Manage user details and roles within the application.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="lg:sticky lg:top-6 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <Text.TitleSmall>Profile Picture</Text.TitleSmall>
                  <p className="text-xs text-muted-foreground">Upload an optional profile image for the user.</p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <ImageUpload
                    defaultImage={user?.profile_picture ?? undefined}
                    onChange={handleFileChange}
                  />
                </CardContent>
              </Card>

              <div className="flex items-start gap-3 p-4 rounded-xl border bg-muted/30 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  After updating the user, the changes will be reflected
                  immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Profile picture + notice */}

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
                    placeholder="Enter email address"
                    value={form.email}
                    error={fieldErrors?.email?.[0]}
                    onChange={handleChange}
                    required={true}
                  />
                  <SelectInput
                    id="role"
                    label="Role"
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
                    onChange={handleChange}
                    error={fieldErrors?.phone_number?.[0]}
                    placeholder="Enter phone number"
                    value={form.phone_number}
                    required={true}
                    isNumberOnly={true}
                    maxLength={10}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <FormFooterActions isSubmitting={updateMutation.isPending} />
      </form>
    </div>
  );
};
