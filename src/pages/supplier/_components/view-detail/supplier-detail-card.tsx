import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";

interface SupplierDetailCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
  subLabel?: React.ReactNode;
}

export function SupplierDetailCard({
  icon,
  iconBg,
  label,
  value,
  subLabel,
}: SupplierDetailCardProps) {
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
        {subLabel && (
          <Text.Small color="muted" className="text-xs leading-snug">
            {subLabel}
          </Text.Small>
        )}
      </CardContent>
    </Card>
  );
}
