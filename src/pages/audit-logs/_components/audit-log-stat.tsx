import { useMemo } from "react";
import { useAuditLogs } from "@/api/audit-log/audit-log.query";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, UserRound, Sparkles, ClipboardList } from "lucide-react";
import { isToday, parseISO } from "date-fns";

function normalizeAction(event: string): string {
  const upper = (event || "").toUpperCase();

  if (upper.includes("LOGIN")) return "LOGIN";
  if (upper.includes("CREATE")) return "CREATE";
  if (upper.includes("UPDATE") || upper.includes("RESTORE") || upper.includes("VERIFY")) return "UPDATE";
  if (upper.includes("DELETE") || upper.includes("REMOVE")) return "DELETE";

  return upper || "UNKNOWN";
}

function MetricCard({
  title,
  value,
  icon: Icon,
  hint,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground truncate">{value}</p>
            <p className="text-xs text-muted-foreground mt-1.5 truncate">{hint}</p>
          </div>
          <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuditLogStat() {
  const { data, isLoading } = useAuditLogs({ per_page: 100 });

  const metrics = useMemo(() => {
    const logs = data?.data || [];

    const totalToday = logs.filter(log => {
      try {
        return isToday(parseISO(log.created_at));
      } catch {
        return false;
      }
    }).length;

    const actions = new Map<string, number>();
    const users = new Map<string, number>();

    for (const log of logs) {
      const action = normalizeAction(log.event);
      actions.set(action, (actions.get(action) || 0) + 1);

      const userName = log.user?.name || "System";
      users.set(userName, (users.get(userName) || 0) + 1);
    }

    const mostCommonAction =
      [...actions.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    const mostActiveUser =
      [...users.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return {
      totalToday,
      totalActions: logs.length,
      mostCommonAction,
      mostActiveUser,
    };
  }, [data]);

  return (
    <section className="mx-2 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Logs Today"
          value={isLoading ? "..." : String(metrics.totalToday)}
          icon={Activity}
          hint="Activities recorded today"
          iconBg="bg-violet-100 dark:bg-violet-900/30"
          iconColor="text-violet-600 dark:text-violet-400"
        />
        <MetricCard
          title="Total Actions"
          value={isLoading ? "..." : String(metrics.totalActions)}
          icon={ClipboardList}
          hint="All visible actions"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <MetricCard
          title="Most Active User"
          value={isLoading ? "..." : metrics.mostActiveUser}
          icon={UserRound}
          hint="Top actor in current dataset"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          title="Most Common Action"
          value={isLoading ? "..." : metrics.mostCommonAction}
          icon={Sparkles}
          hint="Most frequent action type"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>
    </section>
  );
}
