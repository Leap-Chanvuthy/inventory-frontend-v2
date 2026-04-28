import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: "green" | "red" | "purple" | "blue" | "gray" | "yellow" | "orange";
  subValue?: string;
}

const TONE_STYLES: Record<StatsCardProps["tone"], string> = {
  green: "border-green-500/20 bg-green-500/5 text-green-600",
  red: "border-red-500/20 bg-red-500/5 text-red-600",
  purple: "border-purple-500/20 bg-purple-500/5 text-purple-600",
  blue: "border-blue-500/20 bg-blue-500/5 text-blue-600",
  gray: "border-slate-500/20 bg-slate-500/5 text-slate-600",
  yellow: "border-amber-500/20 bg-amber-500/5 text-amber-600",
  orange: "border-orange-500/20 bg-orange-500/5 text-orange-600",
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
