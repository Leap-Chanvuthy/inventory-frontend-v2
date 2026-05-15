import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomersSummary } from "@/api/dashboard/dashboard.types";
import { Users } from "lucide-react";

interface Props {
  data: CustomersSummary["charts"]["customers_trend_overtime"];
  total: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const cumulative = payload.find((p: any) => p.dataKey === "cumulative");
  const newCount = payload.find((p: any) => p.dataKey === "customers_count");
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-lg text-xs min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {cumulative && (
        <div className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Total so far
          </span>
          <span className="font-bold text-foreground tabular-nums">{Number(cumulative.value).toLocaleString()}</span>
        </div>
      )}
      {newCount && (
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-rose-300" />
            New joined
          </span>
          <span className="font-semibold text-foreground tabular-nums">+{Number(newCount.value).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export function DashboardCustomersTrendChart({ data, total }: Props) {
  const enriched = data.map((d, i) => ({
    ...d,
    cumulative: data.slice(0, i + 1).reduce((s, x) => s + x.customers_count, 0),
  }));


  return (
    <Card className="border-border/60 shadow-sm self-start w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-rose-500" />
              Customer Growth
            </CardTitle>
            <CardDescription className="mt-0.5">Cumulative customer base — smooth upward curve shows overall momentum</CardDescription>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground tabular-nums">{total.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground">total customers</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={enriched} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="customersGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="90%" stopColor="#f43f5e" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
            <YAxis tickLine={false} axisLine={false} tickMargin={4} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={36} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f43f5e", strokeWidth: 1.5, strokeDasharray: "4 4" }} />
            <Area
              dataKey="cumulative"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fill="url(#customersGrowthGrad)"
              type="monotone"
              dot={false}
              activeDot={{ r: 5, fill: "#f43f5e", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  );
}
