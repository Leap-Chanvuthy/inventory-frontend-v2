import { TopRawMaterial } from "@/api/suppliers/supplier.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import { Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  CartesianGrid,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface SupplierSpendChartProps {
  topRawMaterials: TopRawMaterial[];
}

export function SupplierSpendChart({
  topRawMaterials,
}: SupplierSpendChartProps) {
  const chartData = topRawMaterials.map(rm => ({
    name: rm.material_name,
    value: rm.spend_usd,
    qty: rm.total_quantity,
    uom: rm.uom?.symbol ?? "",
    spend_usd: rm.spend_usd,
    spend_khr: rm.spend_khr,
  }));

  return (
    <Card className="lg:col-span-2 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 rounded-md">
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          Top 5 Most Expensive Raw Materials
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer
            config={{ value: { label: "USD Spend" } }}
            className="h-[260px] w-full"
          >
            <BarChart
              data={chartData}
              margin={{ top: 24, right: 8, bottom: 40, left: 8 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600 }}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as (typeof chartData)[0];
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md text-xs space-y-1.5 min-w-[160px]">
                      <p className="font-semibold text-foreground truncate max-w-[200px]">
                        {d.name}
                      </p>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Qty</span>
                        <span className="font-semibold">
                          {d.qty.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}{" "}
                          {d.uom}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">USD</span>
                        <span className="font-semibold">
                          $
                          {d.spend_usd.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">KHR</span>
                        <span className="font-semibold">
                          ៛{d.spend_khr.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="value"
                barSize={40}
                radius={[6, 6, 0, 0]}
                fill="var(--chart-1)"
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  content={({ x, y, width, value }) => {
                    const num = Number(value);
                    const label =
                      num >= 1000
                        ? `$${(num / 1000).toFixed(1)}k`
                        : `$${num.toFixed(2)}`;
                    return (
                      <text
                        x={Number(x) + Number(width) / 2}
                        y={Number(y) - 4}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={700}
                        fill="var(--chart-1)"
                      >
                        {label}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <Text.Small color="muted" className="py-8 text-center block">
            No raw material data available.
          </Text.Small>
        )}
      </CardContent>
    </Card>
  );
}
