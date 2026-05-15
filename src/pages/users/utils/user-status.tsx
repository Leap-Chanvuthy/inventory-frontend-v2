import { Badge } from "@/components/ui/badge";

type RoleValue =
  | string
  | {
      id: number;
      name: string;
      key: string;
      is_system: boolean;
    }
  | null
  | undefined;

export const RoleBadge = ({ role }: { role: RoleValue }) => {
  const roleKey = typeof role === "string" ? role : role?.key || "UNASSIGNED";
  const map: Record<string, string> = {
    ADMIN: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    VENDER: "bg-red-500/10 text-red-600 dark:text-red-400",
    STOCK_CONTROLLER: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    UNASSIGNED: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  };

  return (
    <Badge
      variant="secondary"
      className={`min-w-[155px] justify-center ${map[roleKey] || map.UNASSIGNED}`}
    >
      {roleKey}
    </Badge>
  );
};
