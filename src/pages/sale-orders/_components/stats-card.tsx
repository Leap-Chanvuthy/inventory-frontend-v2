import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: "green" | "red" | "purple" | "blue";
  subValue?: string;
}

const TONE_STYLES: Record<StatsCardProps["tone"], string> = {
  green: "border-green-500/20 bg-green-500/5 text-green-600",
  red: "border-red-500/20 bg-red-500/5 text-red-600",
  purple: "border-purple-500/20 bg-purple-500/5 text-purple-600",
  blue: "border-blue-500/20 bg-blue-500/5 text-blue-600",
};

export function StatsCard({ label, value, icon: Icon, tone, subValue }: StatsCardProps) {
  return (
    <article className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
      <div className="flex items-start gap-2.5">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${TONE_STYLES[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-base font-semibold leading-tight text-foreground">{value}</p>
          {subValue && <p className="text-[10px] text-muted-foreground">{subValue}</p>}
        </div>
      </div>
    </article>
  );
}
