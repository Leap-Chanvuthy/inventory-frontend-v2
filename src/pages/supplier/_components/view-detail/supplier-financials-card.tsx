import { SupplierFinancials } from "@/api/suppliers/supplier.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import { DollarSign } from "lucide-react";

interface SupplierFinancialsCardProps {
  financials: SupplierFinancials;
}

export function SupplierFinancialsCard({ financials }: SupplierFinancialsCardProps) {
  const rows = [
    {
      label: "Total (USD)",
      value: `$${(financials?.total_spend_usd ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
    {
      label: "Total (KHR)",
      value: `៛${(financials?.total_spend_khr ?? 0).toLocaleString()}`,
    },
    {
      label: "Avg Rate",
      value: `1 USD = ៛${(financials?.avarage_exchange_rate_usd_to_khr ?? 4100).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
    },
    {
      label: "Avg Unit Price",
      value: `$${(financials?.average_unit_price_usd ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })}`,
    },
  ];

  return (
    <Card className="shadow-sm flex-1 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 bg-green-500/10 rounded-md">
            <DollarSign className="w-4 h-4 text-green-500" />
          </div>
          Total Spent to Supplier
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center space-y-3">
        {rows.map((item, i) => (
          <div
            key={item.label}
            className={`flex justify-between items-center py-3.5 ${
              i < rows.length - 1 ? "border-b" : ""
            }`}
          >
            <Text.Small className="text-xs">{item.label}</Text.Small>
            <Text.Small
              fontWeight="semibold"
              color="default"
              className="text-xs"
            >
              {item.value}
            </Text.Small>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
