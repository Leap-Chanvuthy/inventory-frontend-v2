import { Badge } from "@/components/ui/badge";
import { CustomerStatus } from "@/api/customers/customer.types";

const customerCategoryColorMap: Record<string, string> = {
  Glass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  Metals: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  Plastics: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Ceramics: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Services: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  Company: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  "Paper Products": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export const CustomerCategoryBadge = ({
  categoryName,
}: {
  categoryName: string;
}) => {
  const colorClass =
    customerCategoryColorMap[categoryName] ||
    "bg-gray-500/10 text-gray-600 dark:text-gray-400";

  return (
    <Badge
      variant="secondary"
      className={`min-w-[120px] justify-center ${colorClass}`}
    >
      {categoryName}
    </Badge>
  );
};

const statusMap: Record<CustomerStatus, { label: string; className: string }> =
  {
    [CustomerStatus.ACTIVE]: {
      label: "Active",
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    [CustomerStatus.INACTIVE]: {
      label: "Inactive",
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    [CustomerStatus.PROSPECTIVE]: {
      label: "Prospective",
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
  };

export const CustomerStatusBadge = ({ status }: { status: CustomerStatus }) => {
  const statusInfo = statusMap[status] || statusMap[CustomerStatus.ACTIVE];

  return (
    <Badge
      variant="secondary"
      className={`min-w-[110px] justify-center ${statusInfo.className}`}
    >
      {statusInfo.label}
    </Badge>
  );
};
