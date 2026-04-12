import { useMemo } from "react";
import { useAuditLogs } from "@/api/audit-log/audit-log.query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
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
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
}) {
  return (
    <Card className="rounded-xl border border-transparent shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-primary/5 to-primary/3">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <Text.TitleMedium className="text-2xl md:text-3xl text-primary font-bold">{value}</Text.TitleMedium>
        <Text.Small color="muted">{hint}</Text.Small>
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
        />
        <MetricCard
          title="Total Actions"
          value={isLoading ? "..." : String(metrics.totalActions)}
          icon={ClipboardList}
          hint="All visible actions"
        />
        <MetricCard
          title="Most Active User"
          value={isLoading ? "..." : metrics.mostActiveUser}
          icon={UserRound}
          hint="Top actor in current dataset"
        />
        <MetricCard
          title="Most Common Action"
          value={isLoading ? "..." : metrics.mostCommonAction}
          icon={Sparkles}
          hint="Most frequent action type"
        />
      </div>
    </section>
  );
}
