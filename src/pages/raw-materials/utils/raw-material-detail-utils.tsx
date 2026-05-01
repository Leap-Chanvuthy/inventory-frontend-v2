import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import { IconBadge } from "@/components/ui/icons-badge";
import { type IconBadgeLabel, type IconBadgeVariant } from "@/utils/icon-badge";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export function StockStatusBadge({
  current,
  minimum,
}: {
  current: number;
  minimum: number;
}) {
  if (current <= 0)
    return (
      <Badge className="bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20 shadow-none gap-1">
        <XCircle className="w-3 h-3" /> Out of Stock
      </Badge>
    );
  if (current <= minimum)
    return (
      <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20 shadow-none gap-1">
        <AlertTriangle className="w-3 h-3" /> Low Stock
      </Badge>
    );
  return (
    <Badge className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20 shadow-none gap-1">
      <CheckCircle2 className="w-3 h-3" /> In Stock
    </Badge>
  );
}

export function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>{icon}</div>
          <Text.Small color="muted" className="text-xs font-medium leading-tight">
            {label}
          </Text.Small>
        </div>
        <div className="leading-tight">{value}</div>
        {sub && (
          <Text.Small color="muted" className="text-xs leading-snug">
            {sub}
          </Text.Small>
        )}
      </CardContent>
    </Card>
  );
}

export function InfoField({
  label,
  value,
  icon,
  variant = "default",
}: {
  label: string;
  value?: string | null;
  icon: IconBadgeLabel;
  variant?: IconBadgeVariant;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <IconBadge label={icon} variant={variant} size={14} />
        {label}
      </p>
      <p className="text-sm font-medium leading-relaxed">{value || "—"}</p>
    </div>
  );
}
