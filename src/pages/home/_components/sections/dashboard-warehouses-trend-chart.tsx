import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WarehousesSummary } from "@/api/dashboard/dashboard.types";
import { Warehouse } from "lucide-react";

interface Props {
  data: WarehousesSummary["charts"]["warehouses_trend_overtime"];
  total: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl text-xs space-y-1 min-w-[140px]">
      <p className="font-semibold text-foreground text-sm">{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          Warehouses
        </span>
        <span className="font-semibold text-foreground">{Number(payload[0].value).toLocaleString()}</span>
      </div>
    </div>
  );
};

export function DashboardWarehousesTrendChart({ data, total }: Props) {
  const peak = Math.max(...data.map((d) => d.warehouses_count));
  const peakEntry = data.find((d) => d.warehouses_count === peak);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-indigo-500" />
              Warehouse Growth
            </CardTitle>
            <CardDescription className="mt-0.5">Warehouses over time</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">{total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              Peak: {peakEntry ? peakEntry.label : "—"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="warehousesGrad" x1="0" y1="0" x2="0" y2="1">
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
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={36}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              dataKey="warehouses_count"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#warehousesGrad)"
              type="monotone"
              dot={{ r: 3.5, fill: "#6366f1", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#6366f1" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
