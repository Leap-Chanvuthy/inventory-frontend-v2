import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RawMaterialsSummary } from "@/api/dashboard/dashboard.types";
import { FlaskConical } from "lucide-react";

interface Props {
  data: RawMaterialsSummary["charts"]["raw_material_usage_trend_overtime"];
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmt = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-lg text-xs min-w-[150px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Used qty
        </span>
        <span className="font-bold text-foreground tabular-nums">{Number(payload[0].value).toLocaleString()}</span>
      </div>
    </div>
  );
};

export function DashboardRmUsageChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: MONTHS[new Date(d.date).getUTCMonth()],
  }));

  const total = data.reduce((s, d) => s + d.used_quantity, 0);
  const avg = data.length ? total / data.length : 0;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-orange-500" />
              Raw Material Usage
            </CardTitle>
            <CardDescription className="mt-0.5">Monthly quantity used — dashed line is the monthly average</CardDescription>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground tabular-nums">{fmt(total)}</p>
            <p className="text-[11px] text-muted-foreground">total used</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="rmAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="85%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickLine={false} axisLine={false} tickMargin={4} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={38} tickFormatter={fmt} />
            <ReferenceLine y={avg} stroke="#f97316" strokeDasharray="6 3" strokeOpacity={0.55} label={{ value: "avg", position: "insideTopRight", fontSize: 10, fill: "#f97316", opacity: 0.75 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f97316", strokeWidth: 1.5, strokeDasharray: "4 4" }} />
            <Area
              dataKey="used_quantity"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#rmAreaGrad)"
              type="monotone"
              dot={{ r: 4, fill: "#fff", stroke: "#f97316", strokeWidth: 2.5 }}
              activeDot={{ r: 6, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  );
}
