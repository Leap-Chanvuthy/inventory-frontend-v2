import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SaleOrdersSummary } from "@/api/dashboard/dashboard.types";
import { DollarSign } from "lucide-react";

interface Props {
  data: SaleOrdersSummary["charts"]["revenue_trend_overtime"];
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl text-xs space-y-1.5 min-w-[170px]">
      <p className="font-semibold text-foreground text-sm">{label}</p>
      {payload.map((p: any) => {
        const labels: Record<string, string> = {
          revenue: "Gross Revenue",
          net_revenue: "Net Revenue",
          discount: "Discount",
        };
        return (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {labels[p.dataKey] ?? p.dataKey}
            </span>
            <span className="font-semibold text-foreground">${Number(p.value).toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
};

export function DashboardRevenueTrendChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: MONTHS[new Date(d.date).getUTCMonth()],
  }));

  const totalNet = data.reduce((s, d) => s + d.net_revenue, 0);
  const totalDiscount = data.reduce((s, d) => s + d.discount, 0);

  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toFixed(0)}`;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Revenue Breakdown
            </CardTitle>
            <CardDescription>Gross vs net revenue by month</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">{fmt(totalNet)}</p>
            <p className="text-xs text-muted-foreground">net of {fmt(totalDiscount)} discount</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={44}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />
            <Area
              dataKey="revenue"
              name="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#grossGrad)"
              type="monotone"
              dot={false}
            />
            <Area
              dataKey="net_revenue"
              name="net_revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#netGrad)"
              type="monotone"
              dot={{ r: 3.5, fill: "#6366f1", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-4 rounded-full bg-emerald-500/60" />
            Gross Revenue
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-4 rounded-full bg-indigo-500" />
            Net Revenue
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
