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
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <Text.Small>{label}</Text.Small>
          <div className="leading-tight">{value}</div>
          {subLabel && <Text.Small>{subLabel}</Text.Small>}
        </div>
      </CardContent>
    </Card>
  );
}
