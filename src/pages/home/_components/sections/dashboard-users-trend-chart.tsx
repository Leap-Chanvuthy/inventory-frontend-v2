import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersSummary } from "@/api/dashboard/dashboard.types";
import { Users } from "lucide-react";

interface Props {
  data: UsersSummary["charts"]["users_trend_overtime"];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl text-xs space-y-1 min-w-[140px]">
      <p className="font-semibold text-foreground text-sm">{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          New Users
        </span>
        <span className="font-semibold text-foreground">{Number(payload[0].value).toLocaleString()}</span>
      </div>
    </div>
  );
};

export function DashboardUsersTrendChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.users_count, 0);
  const peak = Math.max(...data.map((d) => d.users_count));
  const peakEntry = data.find((d) => d.users_count === peak);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              User Registrations
            </CardTitle>
            <CardDescription className="mt-0.5">New users over time</CardDescription>
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
              <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.03} />
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
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#a855f7", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              dataKey="users_count"
              stroke="#a855f7"
              strokeWidth={2.5}
              fill="url(#usersGrad)"
              type="monotone"
              dot={{ r: 3.5, fill: "#a855f7", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#a855f7" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
