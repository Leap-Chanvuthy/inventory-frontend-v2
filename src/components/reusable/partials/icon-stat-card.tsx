import { Card, CardContent } from "@/components/ui/card";

interface IconStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  iconBg: string;
}

export function IconStatCard({ icon, label, value, sub, iconBg }: IconStatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ${iconBg}`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5 truncate">{label}</p>
            <p className="text-lg font-bold leading-snug truncate">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5 truncate">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
