"use client";

import { Pie, PieChart, Cell, Label } from "recharts";
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

interface MovementTypeCount {
  type: string;
  count: number;
}

interface RawMaterialPiechartProps {
  data: Record<string, number>;
  title?: string;
  description?: string;
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function RawMaterialPiechart({
  data,
  title = "Movement Type Breakdown",
  description = "Distribution of stock movements by type",
}: RawMaterialPiechartProps) {
  // Transform the record into chart data
  const chartData: MovementTypeCount[] = Object.entries(data).map(
    ([type, count]) => ({
      type: type.replace(/_/g, " "),
      count,
    }),
  );

  const total = chartData.reduce((acc, item) => acc + item.count, 0);

  const chartConfig = chartData.reduce(
    (config, item, index) => {
      config[item.type] = {
        label: item.type,
        color: COLORS[index % COLORS.length],
      };
      return config;
    },
    {} as ChartConfig,
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Movements
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex flex-wrap justify-center gap-3 text-muted-foreground">
          {chartData.map((item, index) => (
            <div key={item.type} className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs">
                {item.type} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
