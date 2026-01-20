import { useState } from "react";
import { GeneralInfoCard } from "./_components/general-info";
import { GeneralInfoForm } from "./_components/update-company-info";
import { useCompanyInfo } from "@/api/company/company.query";

export function GeneralInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const { data, error, isLoading } = useCompanyInfo();
  return (
    <div className="space-y-4">
      {!isEditing && (
        <GeneralInfoCard
          onEditClick={() => setIsEditing(true)}
          company={data?.data}
          isLoading={isLoading}
          error={error}
        />
      )}
      {isEditing && <GeneralInfoForm onCancel={() => setIsEditing(false)} />}
    </div>
  );
}
