import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { BankingInfo } from "@/api/company/company.type";

export const buildBankingInfoColumns = (
  onEdit: (bank: BankingInfo) => void,
): DataTableColumn<BankingInfo>[] => [
  {
    key: "bank_name",
    header: "Bank Name",
    render: bank => <span className="text-sm">{bank.bank_name}</span>,
  },
  {
    key: "bank_account_number",
    header: "Account Number",
    render: bank => <span className="text-sm">{bank.bank_account_number}</span>,
  },
  {
    key: "bank_account_holder_name",
    header: "Account Holder",
    render: bank => <span className="text-sm">{bank.bank_account_holder_name}</span>,
  },
  {
    key: "khqr_code",
    header: "KHQR",
    render: bank =>
      bank.khqr_code ? (
        <div className="flex items-center gap-2">
          <img
            src={bank.khqr_code}
            alt="KHQR"
            className="w-8 h-8 object-contain border rounded"
          />
          {bank.payment_link ? (
            <a
              href={bank.payment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-600 hover:underline"
            >
              Pay
            </a>
          ) : null}
        </div>
      ) : (
        <span className="text-gray-400 text-xs">No QR</span>
      ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "text-center",
    render: bank => (
      <div className="flex justify-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(bank)}>
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    ),
  },
];
