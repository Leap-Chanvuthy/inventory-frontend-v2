import { Badge } from "@/components/ui/badge";

export const RoleBadge = ({ role }: { role: string }) => {
  const map: Record<string, string> = {
    ADMIN: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    VENDER: "bg-red-500/10 text-red-600 dark:text-red-400",
    STOCK_CONTROLLER: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <Badge
      variant="secondary"
      className={`min-w-[155px] justify-center ${map[role]}`}
    >
      {role}
    </Badge>
  );
};
