import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SuppliersSummary } from "@/api/dashboard/dashboard.types";
import { Truck } from "lucide-react";

interface Props {
  data: SuppliersSummary["charts"]["suppliers_trend_overtime"];
  total: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const cumulative = payload.find((p: any) => p.dataKey === "cumulative");
  const newCount = payload.find((p: any) => p.dataKey === "suppliers_count");
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-lg text-xs min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {cumulative && (
        <div className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Total so far
          </span>
          <span className="font-bold text-foreground tabular-nums">{Number(cumulative.value).toLocaleString()}</span>
        </div>
      )}
      {newCount && (
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            New added
          </span>
          <span className="font-semibold text-foreground tabular-nums">+{Number(newCount.value).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export function DashboardSuppliersTrendChart({ data, total }: Props) {
  const cumulative = data.map((d, i) => ({
    ...d,
    cumulative: data.slice(0, i + 1).reduce((s, x) => s + x.suppliers_count, 0),
  }));


  return (
    <Card className="border-border/60 shadow-sm self-start w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-500" />
              Supplier Growth
            </CardTitle>
            <CardDescription className="mt-0.5">Cumulative total — each step up = new suppliers added</CardDescription>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground tabular-nums">{total.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground">total suppliers</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={cumulative} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="suppliersStepGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="90%" stopColor="#f59e0b" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
            <YAxis tickLine={false} axisLine={false} tickMargin={4} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={36} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f59e0b", strokeWidth: 1.5, strokeDasharray: "4 4" }} />
            <Area
              dataKey="cumulative"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#suppliersStepGrad)"
              type="stepAfter"
              dot={false}
              activeDot={{ r: 5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  );
}
