import { AuditLog } from "@/api/audit-log/audit-log.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/utils/date-format";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Globe, ShieldCheck, User2 } from "lucide-react";
import TableActions from "@/components/reusable/partials/table-actions";

export const FILTER_OPTIONS = [
  { label: "Create", value: "CREATE" },
  { label: "Update", value: "UPDATE" },
  { label: "Delete", value: "DELETE" },
  { label: "Login", value: "LOGIN" },
];

export const SORT_OPTIONS = [
  { label: "Newest", value: "-created_at" },
  { label: "Oldest", value: "created_at" },
];

function parseTagDescription(tags?: string | null): string {
  if (!tags) return "";

  try {
    const parsed = JSON.parse(tags) as Record<string, string | undefined>;
    return parsed.description || parsed.context || "";
  } catch {
    return "";
  }
}


const AuditLogAction = ({ auditLog }: { auditLog: AuditLog }) => {

  return (
    <div className="flex items-center gap-2">
      <TableActions
          viewDetailPath={`/audit-logs/view/${auditLog.id}`}
      />
    </div>
  );
};

function getAction(log: AuditLog): string {
  const event = (log.event || "").toUpperCase();

  if (event.includes("LOGIN")) return "LOGIN";
  if (event.includes("CREATE")) return "CREATE";
  if (event.includes("UPDATE") || event.includes("RESTORE") || event.includes("VERIFY")) return "UPDATE";
  if (event.includes("DELETE") || event.includes("REMOVE")) return "DELETE";

  return event || "UNKNOWN";
}

function getModule(log: AuditLog): string {
  const fullType = log.auditable_type || "";
  if (!fullType) return "Unknown";

  const model = fullType.split("\\").pop() || "Unknown";
  return model.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function getActionBadgeClass(action: string): string {
  switch (action) {
    case "CREATE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "UPDATE":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "DELETE":
      return "bg-red-50 text-red-700 border-red-200";
    case "LOGIN":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function getDisplayName(log: AuditLog): string {
  return log.user?.name || "System";
}

function getDescription(log: AuditLog): string {
  const moduleName = getModule(log);
  const action = getAction(log).toLowerCase();
  const tagDescription = parseTagDescription(log.tags);

  if (tagDescription) return tagDescription;
  return `${getDisplayName(log)} ${action} ${moduleName} #${log.auditable_id || "-"}`;
}

function getRelativeTime(date: string): string {
  try {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
  } catch {
    return "-";
  }
}

function getUserInitial(name: string): string {
  return (name || "S").charAt(0).toUpperCase();
}

export const COLUMNS: DataTableColumn<AuditLog>[] = [
  {
    key: "user",
    header: "User",
    className: "whitespace-nowrap py-6",
    render: log => {
      const name = getDisplayName(log);
      return (
        <div className="flex items-center gap-3 min-w-[180px]">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={log.user?.profile_picture || ""} alt={name} />
            <AvatarFallback>{getUserInitial(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Text.Small color="default" fontWeight="semibold" overflow="ellipsis">
              {name}
            </Text.Small>
            <Text.Small color="muted" overflow="ellipsis">
              {log.user?.email || "-"}
            </Text.Small>
          </div>
        </div>
      );
    },
  },
  {
    key: "action",
    header: "Action",
    className: "whitespace-nowrap py-6",
    render: log => {
      const action = getAction(log);
      return (
        <Badge className={getActionBadgeClass(action)}>
          {action}
        </Badge>
      );
    },
  },
  {
    key: "module",
    header: "Module",
    className: "whitespace-nowrap py-6",
    render: log => getModule(log),
  },
  {
    key: "description",
    header: "Description",
    className: "min-w-[260px] max-w-[460px] py-6",
    render: log => {
      const description = getDescription(log);
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="truncate font-medium text-foreground">{description}</p>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm whitespace-normal break-words">
            {description}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    key: "created_at",
    header: "Date",
    className: "whitespace-nowrap py-6",
    render: log => (
      <div className="flex flex-col">
        <span>{formatDate(log.created_at, "dd MMM yyyy, hh:mm a")}</span>
        <span className="text-xs text-muted-foreground">{getRelativeTime(log.created_at)}</span>
      </div>
    ),
  },
  {
    key: "ip_address",
    header: "IP Address",
    className: "whitespace-nowrap py-6",
    render: log => log.ip_address || "-",
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: log => <AuditLogAction auditLog={log} />,
  },
];

export function AuditLogCard({ log }: { log?: AuditLog }) {
  if (!log) return null;

  const action = getAction(log);
  const moduleName = getModule(log);
  const description = getDescription(log);
  const name = getDisplayName(log);

  return (
    <Card className="h-full rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-11 w-11 border shadow-sm">
              <AvatarImage src={log.user?.profile_picture || ""} alt={name} />
              <AvatarFallback>{getUserInitial(name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Text.Small color="default" fontWeight="semibold" overflow="ellipsis">
                {name}
              </Text.Small>
              <Text.Small color="muted" overflow="ellipsis">
                {log.user?.email || "System generated"}
              </Text.Small>
            </div>
          </div>

          <Badge className={getActionBadgeClass(action)}>{action}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <Text.Medium color="default" fontWeight="semibold" maxLines={2}>
          {description}
        </Text.Medium>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Module: {moduleName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>IP: {log.ip_address || "-"}</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <User2 className="h-4 w-4" />
            <span>{formatDate(log.created_at, "dd MMM yyyy, hh:mm a")} ({getRelativeTime(log.created_at)})</span>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <AuditLogAction auditLog={log} />
        </div>
      </CardContent>
    </Card>
  );
}
