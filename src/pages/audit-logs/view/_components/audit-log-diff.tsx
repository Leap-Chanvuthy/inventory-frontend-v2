import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import { Button } from "@/components/ui/button";
import { AuditEntry } from "@/api/audit-log/audit-log.types";
import { cn } from "@/lib/utils";

function isObject(val: any) {
  return val && typeof val === "object" && !Array.isArray(val);
}

function prettyPrint(val: any) {
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
}

// function renderValue(val: any) {
//   if (val === null || typeof val === "undefined") return <span className="text-muted-foreground">—</span>;
//   if (typeof val === "boolean") return <span>{val ? "✅ True" : "❌ False"}</span>;
//   if (isObject(val) || Array.isArray(val))
//     return (
//       <pre className="whitespace-pre-wrap break-words font-mono text-sm max-h-44 overflow-auto bg-muted/20 p-3 rounded">{prettyPrint(val)}</pre>
//     );
//   return <span className="break-words">{String(val)}</span>;
// }

function FieldValue({ value }: { value: any }) {
  const [open, setOpen] = useState(false);

  if (value === null || typeof value === "undefined") return <span className="text-muted-foreground">—</span>;

  if (isObject(value) || Array.isArray(value)) {
    const formatted = prettyPrint(value);
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button size="xs" variant="outline" onClick={() => navigator.clipboard.writeText(formatted)}>
            Copy JSON
          </Button>
          <Button size="xs" variant="ghost" onClick={() => setOpen(v => !v)}>
            {open ? "Collapse" : "Expand"}
          </Button>
        </div>

        {open ? (
          <pre className="whitespace-pre-wrap break-words font-mono text-sm max-h-64 overflow-auto bg-muted/20 p-3 rounded">{formatted}</pre>
        ) : (
          <div className="rounded-md border border-border bg-muted/10 p-2 text-sm font-mono truncate">{formatted.split('\n')[0]}</div>
        )}
      </div>
    );
  }

  if (typeof value === "boolean") return <span>{value ? "✅ True" : "❌ False"}</span>;

  return <span className="break-words">{String(value)}</span>;
}

export default function AuditLogDiff({ audit }: { audit?: AuditEntry }) {
  if (!audit) return null;

  const oldValues = (audit.old_values as any) || {};
  const newValues = (audit.new_values as any) || {};

  // collect keys
  const keys = Array.from(new Set([...Object.keys(oldValues), ...Object.keys(newValues)]));

  // filter changed
  const changed = keys.filter(k => {
    const a = oldValues[k];
    const b = newValues[k];
    try {
      return JSON.stringify(a) !== JSON.stringify(b);
    } catch {
      return String(a) !== String(b);
    }
  });

  if (!changed.length) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle>No Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <Text.Small color="muted">No differences found between before and after values.</Text.Small>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {changed.map(field => {
        const a = oldValues[field];
        const b = newValues[field];
        // const aIsObj = isObject(a) || Array.isArray(a);
        // const bIsObj = isObject(b) || Array.isArray(b);

        return (
          <Card key={field} className="rounded-xl border shadow-sm overflow-hidden">
            <CardHeader className="bg-background/50">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="!text-sm font-semibold">{field}</CardTitle>
                <div className="text-sm text-muted-foreground">Before / After</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn("p-3 rounded border border-border", a === null ? "bg-destructive/10" : "bg-destructive/5")}>
                  <div className="flex items-center justify-between">
                    <Text.Small className="font-semibold">Before</Text.Small>
                    <Button size="xs" variant="outline" onClick={() => navigator.clipboard.writeText(prettyPrint(a))}>Copy</Button>
                  </div>
                  <div className="mt-2"><FieldValue value={a} /></div>
                </div>

                <div className={cn("p-3 rounded border border-border", b === null ? "bg-primary/10" : "bg-primary/5")}>
                  <div className="flex items-center justify-between">
                    <Text.Small className="font-semibold">After</Text.Small>
                    <Button size="xs" variant="outline" onClick={() => navigator.clipboard.writeText(prettyPrint(b))}>Copy</Button>
                  </div>
                  <div className="mt-2"><FieldValue value={b} /></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
