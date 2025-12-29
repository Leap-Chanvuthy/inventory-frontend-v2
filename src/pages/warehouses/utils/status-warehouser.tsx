import { Badge } from "@/components/ui/badge";
import { Warehouse } from "@/api/warehouses/warehouses.types";

type WarehouseStatus = Warehouse['status'];

export const StatusBadge = ({ status }: { status: WarehouseStatus }) => {
  const map: Record<WarehouseStatus, string> = {
    Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "Low Stock": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Full: "bg-red-500/10 text-red-600 dark:text-red-400",
    Inactive: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  };
  return (
    <Badge variant="secondary" className={map[status]}>
      {status}
    </Badge>
  );
};
