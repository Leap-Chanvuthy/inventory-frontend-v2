import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import AuditLogDiff from "./audit-log-diff";
import { AuditEntry } from "@/api/audit-log/audit-log.types";

function JsonPane({ title, value }: { title: string; value: any }) {
  const formatted = value ? JSON.stringify(value, null, 2) : "";

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <Text.Small color="muted">{title}</Text.Small>
      </div>

      <div className="rounded-md border border-border bg-muted/30 p-3 max-h-[420px] overflow-auto font-mono text-sm">
        <pre className="whitespace-pre-wrap break-words">{formatted || "{}"}</pre>
      </div>
    </div>
  );
}

export default function AuditLogDetail({ audit }: { audit?: AuditEntry }) {
  const [mode, setMode] = useState<"diff" | "json">("diff");

  return (
    <div>
      <Card className="rounded-xl border shadow-sm mb-6">
        <CardHeader className="flex items-center justify-between gap-4">
          <div>
            <Text.TitleMedium className="!text-base">Detail View</Text.TitleMedium>
            <Text.Small color="muted">Compare before and after values</Text.Small>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={mode === "diff" ? "primary" : "outline"} size="sm" onClick={() => setMode("diff")}>Diff View</Button>
            <Button variant={mode === "json" ? "primary" : "outline"} size="sm" onClick={() => setMode("json")}>JSON View</Button>
          </div>
        </CardHeader>
        <CardContent>
          {mode === "diff" ? (
            <AuditLogDiff audit={audit} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <JsonPane title="Old Values" value={audit?.old_values} />
              <JsonPane title="New Values" value={audit?.new_values} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
