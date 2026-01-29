import { useState } from "react";
import { BankingInfoList } from "./_components/banking-info-list";
import { AddBankingForm } from "./_components/add-banking-form";

export function BankingInfo() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="pt-2">
      {!isAdding && <BankingInfoList onAddClick={() => setIsAdding(true)} />}

      {isAdding && <AddBankingForm onCancel={() => setIsAdding(false)} />}
    </div>
  );
}
