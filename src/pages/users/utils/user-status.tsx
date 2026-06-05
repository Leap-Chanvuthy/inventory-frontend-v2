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

const ROLE_CONFIG: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  ADMIN: {
    label: "Admin",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  VENDER: {
    label: "Vendor",
    dot: "bg-red-500",
    badge:
      "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  STOCK_CONTROLLER: {
    label: "Stock Controller",
    dot: "bg-amber-500",
    badge:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  PRODUCTION_SPECIALIST: {
    label: "Production Specialist",
    dot: "bg-blue-500",
    badge:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
};

const DEFAULT_CONFIG = {
  label: "Unassigned",
  dot: "bg-slate-400",
  badge:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

export const RoleBadge = ({ role }: { role: RoleValue }) => {
  const roleKey = typeof role === "string" ? role : role?.key || "UNASSIGNED";
  const config = ROLE_CONFIG[roleKey] ?? {
    ...DEFAULT_CONFIG,
    label: roleKey
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase()),
  };

  return (
    <Badge
      variant="outline"
      className={`max-w-[140px] min-w-[140px] lg:min-w-[175px] justify-center gap-1.5 font-medium ${config.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span className="truncate">{config.label}</span>
    </Badge>
  );
};
