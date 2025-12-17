import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { SelectInput, TextAreaInput, TextInput } from "@/components/reusable/partials/input";
import { Info } from "lucide-react";
import { useState } from "react";

const USER_ROLES = [
  { value: "ADMIN", label: "Administrator" },
  { value: "VENDER", label: "Vender" },
  { value: "STOCK_CONTROLLER", label: "Stock Controller" },
];

export const CreateUserForm = () => {

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const formData = new FormData();
  if (profileFile) formData.append("profile_picture", profileFile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  }


  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">

      {/* Main Content Card */}
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">

          <h2 className="text-xl font-bold mb-6">Create a New User</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Row: File Upload and Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Col: Upload */}
              <div className="lg:col-span-1">
                <ImageUpload label="Profile Picture" onChange={setProfileFile} />
                <div className="my-5 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  <Info /> After creating the user, an email will be sent to them to set up their password.
                </div>
              </div>

              {/* Right Col: Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col lg:md:flex-row gap-3">
                  <TextInput type="email" error="email must be a valid email" label="Email" id="email" placeholder="Enter email address" />
                  <SelectInput label="Role" id="role" placeholder="Select role" options={USER_ROLES} />
                </div>
                <div className="flex flex-col lg:md:flex-row gap-3">
                  <TextInput type="text" label="Username" id="username" placeholder="Enter username" />
                  <TextInput type="tel" label="Phone Number" id="phone" placeholder="Enter phone number" />
                </div>
                <div className="flex flex-col lg:md:flex-row gap-3">

                  <TextInput type="password" label="Password" id="password" placeholder="Enter password" />
                  <TextInput type="password" label="Confirm Password" id="password_confirmation" placeholder="Re-enter password" />
                </div>
                <TextAreaInput label="About This User" id="about" placeholder="Enter about this user" />
              </div>
            </div>
            <FormFooterActions />
          </form>

        </div>


      </div>
    </div>
  );
};