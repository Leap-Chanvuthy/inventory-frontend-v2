"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StockTimeData {
  date: string;
  quantity: number;
}

interface RawMaterialAreachartProps {
  data: StockTimeData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  quantity: {
    label: "Stock Level",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RawMaterialAreachart({
  data,
  title = "Stock Level Over Time",
  description = "Running stock quantity based on movements",
}: RawMaterialAreachartProps) {
  // Calculate trend
  const firstValue = data[0]?.quantity || 0;
  const lastValue = data[data.length - 1]?.quantity || 0;
  const trend = lastValue - firstValue;
  const trendPercent =
    firstValue > 0 ? ((trend / firstValue) * 100).toFixed(1) : "0";
  const isPositive = trend >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="quantity"
              type="natural"
              fill="var(--color-quantity)"
              fillOpacity={0.4}
              stroke="var(--color-quantity)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {isPositive ? "Trending up" : "Trending down"} by {Math.abs(Number(trendPercent))}%
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Current stock: {lastValue.toFixed(2)} units
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
