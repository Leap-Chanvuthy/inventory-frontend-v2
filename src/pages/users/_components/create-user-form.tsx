
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { SelectInput, TextAreaInput, TextInput } from "@/components/reusable/partials/input";
import { Button } from "@/components/ui/button";
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

  console.log("Profile File:", profileFile);

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">

      {/* Main Content Card */}
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
        <div className="p-8">

          <h2 className="text-xl font-bold mb-6">Create a New User</h2>

          <div className="space-y-8">
            {/* Top Row: File Upload and Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Col: Upload */}
              <div className="lg:col-span-1">
                <ImageUpload label="Profile Picture" onChange={setProfileFile} />
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

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-50 dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button variant="primary" className="bg-[#5c52d6] hover:bg-[#4b43b3] text-white w-full sm:w-auto">
            Save & Close
          </Button>
          <Button variant="primary" className="bg-[#5c52d6] hover:bg-[#4b43b3] text-white w-full sm:w-auto">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};