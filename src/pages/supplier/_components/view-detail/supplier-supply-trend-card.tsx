import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import { trendIcon } from "../../utils/trend-icon";
import {
  Package,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "@/utils/date-format";

interface TrendMetric {
  current: number;
  previous: number;
  delta: number;
  percent: number;
  direction: "up" | "down" | "flat";
}

interface SupplyTrendData {
  period: {
    last_month_start: string;
    last_month_end: string;
    this_month_start: string;
    this_month_end: string;
  };
  usd: TrendMetric;
  khr: TrendMetric;
  raw_materials: TrendMetric;
}

interface SupplierSupplyTrendCardProps {
  supplyTrend?: SupplyTrendData | null;
}

function getTrendColor(dir: string) {
  if (dir === "up") return "rgb(16 185 129)";
  if (dir === "down") return "rgb(244 63 94)";
  return "rgb(148 163 184)";
}

export function SupplierSupplyTrendCard({
  supplyTrend,
}: SupplierSupplyTrendCardProps) {
  if (!supplyTrend) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500/10 rounded-md">
              <RefreshCw className="w-4 h-4 text-orange-500" />
            </div>
            Supply Trend Compare to Last Month
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border">
              {formatDate(supplyTrend.period.last_month_start)} –{" "}
              {formatDate(supplyTrend.period.last_month_end)}
            </span>
            <span className="text-xs text-muted-foreground font-bold">vs</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-600 border border-orange-200">
              {formatDate(supplyTrend.period.this_month_start)} –{" "}
              {formatDate(supplyTrend.period.this_month_end)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "USD Spend",
              icon: <DollarSign className="w-4 h-4 text-green-500" />,
              iconBg: "bg-green-500/10",
              metric: supplyTrend.usd,
              fmt: (v: number) =>
                `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            },
            {
              label: "KHR Spend",
              icon: <DollarSign className="w-4 h-4 text-blue-500" />,
              iconBg: "bg-blue-500/10",
              metric: supplyTrend.khr,
              fmt: (v: number) => `៛${v.toLocaleString()}`,
            },
            {
              label: "Raw Materials",
              icon: <Package className="w-4 h-4 text-indigo-500" />,
              iconBg: "bg-indigo-500/10",
              metric: supplyTrend.raw_materials,
              fmt: (v: number) => `${v}`,
            },
          ].map(({ label, icon, iconBg, metric, fmt }) => {
            const isUp = (metric.direction as string) === "up";
            const isDown = (metric.direction as string) === "down";
            return (
              <Card key={label} className="shadow-none border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${iconBg}`}>
                        {icon}
                      </div>
                      <Text.Small className="text-xs font-semibold">
                        {label}
                      </Text.Small>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-bold ${isUp ? "text-emerald-500" : isDown ? "text-rose-500" : "text-muted-foreground"}`}
                    >
                      {trendIcon(metric.direction)}
                      {isUp ? "+" : isDown ? "-" : ""}
                      {metric.percent}%
                    </div>
                  </div>
                  <div>
                    <Text.Small
                      fontWeight="bold"
                      color="default"
                      className="text-base leading-tight"
                    >
                      {fmt(metric.current)}
                    </Text.Small>
                    <Text.Small className="text-xs text-muted-foreground block">
                      last month: {fmt(metric.previous)}
                    </Text.Small>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(metric.percent, 100)}%`,
                        backgroundColor: getTrendColor(
                          metric.direction as string,
                        ),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
