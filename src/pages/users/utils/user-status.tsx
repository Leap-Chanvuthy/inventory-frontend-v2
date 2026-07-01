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

const ROLE_PALETTE = [
  {
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  {
    dot: "bg-red-500",
    badge:
      "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  {
    dot: "bg-amber-500",
    badge:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  {
    dot: "bg-blue-500",
    badge:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  {
    dot: "bg-violet-500",
    badge:
      "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  },
  {
    dot: "bg-cyan-500",
    badge:
      "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  },
  {
    dot: "bg-rose-500",
    badge:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  },
];

const DEFAULT_CONFIG = {
  label: "Unassigned",
  dot: "bg-slate-400",
  badge:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

function formatRoleLabel(roleKey: string) {
  return roleKey
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

function getPaletteIndex(roleKey: string) {
  return roleKey.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % ROLE_PALETTE.length;
}

export const RoleBadge = ({ role }: { role: RoleValue }) => {
  const roleKey = typeof role === "string" ? role : role?.key || "UNASSIGNED";
  const roleLabel = typeof role === "object" && role?.name
    ? role.name
    : roleKey === "UNASSIGNED"
      ? DEFAULT_CONFIG.label
      : formatRoleLabel(roleKey);
  const colorConfig = roleKey === "UNASSIGNED"
    ? DEFAULT_CONFIG
    : ROLE_PALETTE[getPaletteIndex(roleKey)];

  return (
    <Badge
      variant="outline"
      className={`max-w-[140px] min-w-[140px] lg:min-w-[175px] justify-center gap-1.5 font-medium ${colorConfig.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${colorConfig.dot}`} />
      <span className="truncate">{roleLabel}</span>
    </Badge>
  );
};
