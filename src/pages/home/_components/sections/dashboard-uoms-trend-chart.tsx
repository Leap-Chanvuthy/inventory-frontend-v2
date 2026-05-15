import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UomsSummary } from "@/api/dashboard/dashboard.types";
import { Ruler } from "lucide-react";

interface Props {
  data: UomsSummary["charts"]["uoms_trend_overtime"];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl text-xs space-y-1 min-w-[140px]">
      <p className="font-semibold text-foreground text-sm">{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          UOMs
        </span>
        <span className="font-semibold text-foreground">{Number(payload[0].value).toLocaleString()}</span>
      </div>
    </div>
  );
};

export function DashboardUomsTrendChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.uoms_count, 0);
  const peak = Math.max(...data.map((d) => d.uoms_count));
  const peakEntry = data.find((d) => d.uoms_count === peak);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Ruler className="h-4 w-4 text-teal-500" />
              UOM Growth
            </CardTitle>
            <CardDescription className="mt-0.5">Units of measure over time</CardDescription>
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
              <linearGradient id="uomsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.03} />
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
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#14b8a6", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              dataKey="uoms_count"
              stroke="#14b8a6"
              strokeWidth={2.5}
              fill="url(#uomsGrad)"
              type="monotone"
              dot={{ r: 3.5, fill: "#14b8a6", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#14b8a6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
