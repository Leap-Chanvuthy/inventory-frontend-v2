"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
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

interface MovementTypeData {
  type: string;
  in: number;
  out: number;
}

interface RawMaterialBarchartProps {
  data: MovementTypeData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  in: {
    label: "Stock In",
    color: "var(--chart-1)",
  },
  out: {
    label: "Stock Out",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RawMaterialBarchart({
  data,
  title = "Stock Movement by Type",
  description = "Quantity moved in and out by movement type",
}: RawMaterialBarchartProps) {
  const totalIn = data.reduce((acc, item) => acc + item.in, 0);
  const totalOut = data.reduce((acc, item) => acc + item.out, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              left: 20,
              right: 20,
            }}
            barSize={40}
            barGap={4}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="type"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={9}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="in" fill="var(--color-in)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => (value > 0 ? value : "")}
              />
            </Bar>
            <Bar dataKey="out" fill="var(--color-out)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => (value > 0 ? value : "")}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total In: {totalIn.toFixed(2)} | Total Out: {totalOut.toFixed(2)}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing stock movements grouped by type
        </div>
      </CardFooter>
    </Card>
  );
}
