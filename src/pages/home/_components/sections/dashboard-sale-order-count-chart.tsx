import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SaleOrdersSummary } from "@/api/dashboard/dashboard.types";
import { ShoppingCart } from "lucide-react";

interface Props {
  data: SaleOrdersSummary["charts"]["order_count_trend_overtime"];
  total: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-lg text-xs min-w-[140px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
          Orders
        </span>
        <span className="font-bold text-foreground tabular-nums">{Number(payload[0].value).toLocaleString()}</span>
      </div>
    </div>
  );
};

export function DashboardSaleOrderCountChart({ data, total }: Props) {
  const peak = data.length ? Math.max(...data.map((d) => d.orders_count)) : 0;
  const avg = data.length ? total / data.length : 0;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              Order Count
            </CardTitle>
            <CardDescription className="mt-0.5">Orders placed each period — darker bar is the peak</CardDescription>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground tabular-nums">{total.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground">total orders</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="28%">
            <defs>
              <linearGradient id="barGradNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="barGradPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
            <YAxis tickLine={false} axisLine={false} tickMargin={4} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={36} allowDecimals={false} />
            <ReferenceLine y={avg} stroke="#3b82f6" strokeDasharray="5 3" strokeOpacity={0.5} label={{ value: "avg", position: "insideTopRight", fontSize: 10, fill: "#3b82f6", opacity: 0.7 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.35, radius: 4 }} />
            <Bar dataKey="orders_count" radius={[5, 5, 0, 0]} maxBarSize={36}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.orders_count === peak ? "url(#barGradPeak)" : "url(#barGradNormal)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  );
}
