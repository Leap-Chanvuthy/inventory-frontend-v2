import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
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
