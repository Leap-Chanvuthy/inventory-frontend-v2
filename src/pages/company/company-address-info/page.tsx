import { useState } from "react";
import { AddressInfoCard } from "./_components/address-info";
import { AddressInfoForm } from "./_components/update-address-info";

export function AddressInfo() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="pt-4">
      {!isEditing && <AddressInfoCard onEditClick={() => setIsEditing(true)} />}

      {isEditing && <AddressInfoForm onCancel={() => setIsEditing(false)} />}
    </div>
  );
}
