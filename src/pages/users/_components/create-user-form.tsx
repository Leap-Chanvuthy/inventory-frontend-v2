// import { useCreateUser } from "@/api/users/user.mutation";
// import FormFooterActions from "@/components/reusable/partials/form-footer-action";
// import { ImageUpload } from "@/components/reusable/partials/image-upload";
// import { SelectInput, TextAreaInput, TextInput } from "@/components/reusable/partials/input";
// import { Info } from "lucide-react";
// import { useState } from "react";

// const USER_ROLES = [
//   { value: "ADMIN", label: "Administrator" },
//   { value: "VENDER", label: "Vender" },
//   { value: "STOCK_CONTROLLER", label: "Stock Controller" },
// ];

// export const CreateUserForm = () => {

//   const {mutate , isPending} = useCreateUser();


//   const [form , setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     password_confirmation: '',
//     role: '',
//     profile_picture: null as File | null,
//   });

//   console.log(form);

//   const handleChange  = (e : React.ChangeEvent<HTMLInputElement> ) => {
//     const id = e.target.id;
//     const value = e.target.value;
//     setForm({...form , [id]: value});
//   }

//   const handleFileChange = (file: File | null) => {
//     setForm({...form , profile_picture: file});
//   }
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//   }


//   return (
//     <div className="animate-in slide-in-from-right-8 duration-300 my-5">

//       {/* Main Content Card */}
//       <div className="rounded-2xl shadow-sm border max-w-full mx-auto">
//         <div className="p-8">

//           <h2 className="text-xl font-bold mb-6">Create a New User</h2>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Top Row: File Upload and Basic Info */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Left Col: Upload */}
//               <div className="lg:col-span-1">
//                 <ImageUpload label="Profile Picture" onChange={handleFileChange} />
//                 <div className="my-5 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
//                   <Info /> After creating the user, an email will be sent to them to set up their password.
//                 </div>
//               </div>

//               {/* Right Col: Basic Info */}
//               <div className="lg:col-span-2 space-y-6">
//                 <div className="flex flex-col lg:md:flex-row gap-3">
//                   <TextInput onChange={handleChange} type="email" error="email must be a valid email" label="Email" id="email" placeholder="Enter email address" />
//                   <SelectInput onChange={(value) => setForm({...form, role: value})} label="Role" id="role" placeholder="Select role" options={USER_ROLES} />
//                 </div>
//                 <div className="flex flex-col lg:md:flex-row gap-3">
//                   <TextInput onChange={handleChange} type="text" label="Name" id="name" placeholder="Enter username" />
//                   {/* <TextInput type="tel" label="Phone Number" id="phone" placeholder="Enter phone number" /> */}
//                 </div>
//                 <div className="flex flex-col lg:md:flex-row gap-3">

//                   <TextInput onChange={handleChange} type="password" label="Password" id="password" placeholder="Enter password" />
//                   <TextInput onChange={handleChange} type="password" label="Confirm Password" id="password_confirmation" placeholder="Re-enter password" />
//                 </div>
//                 {/* <TextAreaInput label="About This User" id="about" placeholder="Enter about this user" /> */}
//               </div>
//             </div>
//             <FormFooterActions />
//           </form>

//         </div>


//       </div>
//     </div>
//   );
// };


import { useCreateUser } from "@/api/users/user.mutation";
import { CreateUserValidationErrors } from "@/api/users/user.types";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { SelectInput, TextInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { Info } from "lucide-react";
import { useState } from "react";

const USER_ROLES = [
  { value: "ADMIN", label: "Administrator" },
  { value: "VENDER", label: "Vender" },
  { value: "STOCK_CONTROLLER", label: "Stock Controller" },
];

export const CreateUserForm = () => {
  const userMutation = useCreateUser();
      const error = userMutation.error as AxiosError<CreateUserValidationErrors> | null;
      const fieldErrors = error?.response?.data?.errors;

      console.log(fieldErrors);

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
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, profile_picture: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userMutation.mutate(
      (() => {
        const payload = new FormData();
        payload.append("name", form.name);
        payload.append("email", form.email);
        payload.append("password", form.password);
        payload.append("password_confirmation", form.password_confirmation);
        payload.append("phone_number", form.phone_number || "");
        payload.append("role", form.role);

        if (form.profile_picture) {
          payload.append("profile_picture", form.profile_picture);
        }
        return payload;
      })()
    );
  }

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 my-5">
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

                <div className="flex flex-col lg:flex-row gap-3">
                  <TextInput
                    id="password"
                    type="password"
                    error={fieldErrors?.password ? fieldErrors.password[0] : undefined}
                    label="Password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                  />

                  <TextInput
                    id="password_confirmation"
                    type="password"
                    label="Confirm Password"
                    error={fieldErrors?.password_confirmation ? fieldErrors.password_confirmation[0] : undefined}
                    placeholder="Re-enter password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {/* <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create User"}</Button>
            <Button type="submit" >Create User</Button> */}

            <FormFooterActions isSubmitting={userMutation.isPending} />

          </form>
        </div>
      </div>
    </div>
  );
};
