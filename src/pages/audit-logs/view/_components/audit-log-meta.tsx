import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text/app-text";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/utils/date-format";
import { formatDistanceToNow, parseISO } from "date-fns";
import { AuditEntry } from "@/api/audit-log/audit-log.types";

function getActionLabel(event?: string) {
  const e = (event || "").toUpperCase();
  if (e.includes("CREATE")) return "Create";
  if (e.includes("UPDATE") || e.includes("RESTORE") || e.includes("VERIFY")) return "Update";
  if (e.includes("DELETE") || e.includes("REMOVE")) return "Delete";
  if (e.includes("LOGIN")) return "Login";
  return e || "Action";
}

export default function AuditLogMeta({ audit }: { audit?: AuditEntry }) {
  if (!audit) return null;

  const name = audit.user?.name || "System";
  const action = getActionLabel(audit.event);

  function getRelative(date?: string) {
    if (!date) return "-";
    try {
      return formatDistanceToNow(parseISO(date), { addSuffix: true });
    } catch {
      return "-";
    }
  }

  return (
    <Card className="rounded-xl border shadow-sm mb-6">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={audit.user?.profile_picture || ""} alt={name} />
              <AvatarFallback>{(name || "S").charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Text.TitleMedium className="!text-base">{name}</Text.TitleMedium>
              <Text.Small color="muted">{audit.user?.email || "system@localhost"}</Text.Small>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="px-3 py-1">{action}</Badge>
          </div>
        </div>
      </CardHeader>

      <Separator className="my-4" />

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text.Small color="muted">Module</Text.Small>
            <div className="mt-1">
              <Text.Medium>{audit.auditable_type?.split("\\").pop() || "-"}</Text.Medium>
            </div>
          </div>

          <div>
            <Text.Small color="muted">Timestamp</Text.Small>
            <div className="mt-1">
              <Text.Medium>{formatDate(audit.created_at, "dd MMM yyyy, hh:mm a")}</Text.Medium>
              <Text.Small color="muted">{getRelative(audit.created_at)}</Text.Small>
            </div>
          </div>

          <div>
            <Text.Small color="muted">IP</Text.Small>
            <div className="mt-1">
              <Text.Medium>{audit.ip_address || "-"}</Text.Medium>
              <div className="mt-2">
                <Text.Small color="muted">User Agent</Text.Small>
                <div className="mt-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate max-w-[320px]">{audit.user_agent || "-"}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md whitespace-normal break-words">
                      {audit.user_agent || "-"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
