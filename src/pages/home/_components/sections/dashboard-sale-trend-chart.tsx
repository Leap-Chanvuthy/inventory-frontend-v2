import {
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductsSummary } from "@/api/dashboard/dashboard.types";
import { TrendingUp } from "lucide-react";

interface Props {
  data: ProductsSummary["charts"]["sale_trend_overtime"];
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl text-xs space-y-1.5 min-w-[160px]">
      <p className="font-semibold text-foreground text-sm">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name === "revenue" ? "Revenue" : "Orders"}
          </span>
          <span className="font-semibold text-foreground">
            {p.name === "revenue" ? `$${Number(p.value).toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function DashboardSaleTrendChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: MONTHS[new Date(d.date).getUTCMonth()],
  }));

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders_count, 0);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Sales Trend
            </CardTitle>
            <CardDescription className="mt-0.5">Monthly revenue &amp; order count</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">
              ${totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}K` : totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{totalOrders} orders</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={formatted} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              yAxisId="revenue"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={44}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              name="revenue"
              fill="url(#revenueGrad)"
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
            />
            <Line
              yAxisId="orders"
              dataKey="orders_count"
              name="orders"
              type="monotone"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "#6366f1", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#6366f1" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            Revenue (USD)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-4 rounded-full bg-indigo-500" />
            Orders
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
