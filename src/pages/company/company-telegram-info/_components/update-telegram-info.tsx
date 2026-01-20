// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { TextInput } from "@/components/reusable/partials/input";
// import { useUpdateTelegramInfo } from "@/api/company/company.mutation";
// import {
//   UpdateTelegramRequest,
//   UpdateCompanyValidationErrors,
// } from "@/api/company/company.type";
// import { AxiosError } from "axios";

// type TelegramInfoFormProps = {
//   onCancel: () => void;
// };

// export const TelegramInfoForm = ({ onCancel }: TelegramInfoFormProps) => {
//   const updateTelegramMutation = useUpdateTelegramInfo();

//   const [form, setForm] = React.useState<UpdateTelegramRequest>({
//     type: "inventory",
//     chat_id: "",
//   });

//   const error =
//     updateTelegramMutation.error as AxiosError<UpdateCompanyValidationErrors> | null;
//   const fieldErrors = error?.response?.data?.errors;

//   const handleChange =
//     (field: keyof UpdateTelegramRequest) =>
//     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       setForm({ ...form, [field]: e.target.value });
//     };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     updateTelegramMutation.mutate(form, {
//       onSuccess: () => {
//         onCancel();
//       },
//     });
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Telegram Notification</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="grid gap-6">
//           {/* Type & Chat ID */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <TextInput
//               id="type"
//               label="Type"
//               value={form.type}
//               onChange={handleChange("type")}
//               placeholder="Enter type (e.g., inventory)"
//               error={fieldErrors?.type ? fieldErrors.type[0] : undefined}
//               required={true}
//             />
//             <TextInput
//               id="chatId"
//               label="Chat ID"
//               value={form.chat_id}
//               onChange={handleChange("chat_id")}
//               placeholder="Enter telegram chat ID"
//               error={fieldErrors?.chat_id ? fieldErrors.chat_id[0] : undefined}
//               required={true}
//             />
//           </div>

//           {/* Form Footer Buttons */}
//           <CardFooter className="flex justify-end gap-2 p-0 pt-6">
//             <Button
//               variant="outline"
//               type="button"
//               onClick={onCancel}
//               disabled={updateTelegramMutation.isPending}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={updateTelegramMutation.isPending}>
//               {updateTelegramMutation.isPending ? "Saving..." : "Save"}
//             </Button>
//           </CardFooter>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };
