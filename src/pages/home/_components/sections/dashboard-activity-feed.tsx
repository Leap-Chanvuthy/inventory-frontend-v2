import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/date-format";
import { AuditLogsSummary } from "@/api/dashboard/dashboard.types";
import {
  LogIn,
  ShoppingCart,
  RefreshCcw,
  Package,
  Tag,
  Edit3,
  Activity,
} from "lucide-react";

interface Props {
  activities: AuditLogsSummary["tables"]["latest_10_activities"];
}

const getActivityMeta = (activity: string): { icon: React.ReactNode; color: string; bg: string } => {
  const a = activity.toLowerCase();
  if (a.includes("login")) return {
    icon: <LogIn className="h-3.5 w-3.5" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  };
  if (a.includes("sale") || a.includes("order")) return {
    icon: <ShoppingCart className="h-3.5 w-3.5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  };
  if (a.includes("refund")) return {
    icon: <RefreshCcw className="h-3.5 w-3.5" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  };
  if (a.includes("product") || a.includes("reorder")) return {
    icon: <Package className="h-3.5 w-3.5" />,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  };
  if (a.includes("category")) return {
    icon: <Tag className="h-3.5 w-3.5" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  };
  if (a.includes("update") || a.includes("edit")) return {
    icon: <Edit3 className="h-3.5 w-3.5" />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  };
  return {
    icon: <Activity className="h-3.5 w-3.5" />,
    color: "text-muted-foreground",
    bg: "bg-muted",
  };
};

const formatActivityLabel = (activity: string) =>
  activity
    .replace(/\./g, " › ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
];

export function DashboardActivityFeed({ activities }: Props) {
  return (
    <Card className="border-border/60 shadow-sm flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest system actions</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="divide-y divide-border/60">
          {activities.map((log) => {
            const meta = getActivityMeta(log.activity);
            const avatarColor = AVATAR_COLORS[log.user_id % AVATAR_COLORS.length];

            return (
              <div
                key={log.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors group"
              >
                {/* User avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${avatarColor}`}
                >
                  {getInitials(log.user_name)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-xs font-semibold text-foreground truncate">{log.user_name}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center justify-center h-5 w-5 rounded-md shrink-0 ${meta.bg} ${meta.color}`}>
                      {meta.icon}
                    </span>
                    <p className="text-xs text-muted-foreground truncate">
                      {formatActivityLabel(log.activity)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <span className="shrink-0 text-[10px] text-muted-foreground whitespace-nowrap tabular-nums">
                  {formatDate(log.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
