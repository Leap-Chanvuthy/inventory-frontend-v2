"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
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
import { useSupplierStatistics } from "@/api/suppliers/supplier.query";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  total: {
    label: "Suppliers",
  },
  ELECTRONICS: {
    label: "Electronics",
    color: "var(--chart-1)",
  },
  FOOD: {
    label: "Food",
    color: "var(--chart-2)",
  },
  CLOTHING: {
    label: "Clothing",
    color: "var(--chart-3)",
  },
  LOGISTICS: {
    label: "Logistics",
    color: "var(--chart-4)",
  },
  SERVICES: {
    label: "Services",
    color: "var(--chart-5)",
  },
  PRODUCTS: {
    label: "Products",
    color: "var(--chart-1)",
  },
  OTHERS: {
    label: "Others",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function SupplierPiechart() {
  const { data, isPending } = useSupplierStatistics();
  const categoryData = data?.data?.total_by_category;

  if (isPending) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <Skeleton className="mx-auto aspect-square max-h-[250px] w-full rounded-full" />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>
    );
  }

  const chartData = Object.entries(categoryData || {}).map(
    ([category, total], index) => ({
      category,
      total: total || 0,
      fill: `var(--chart-${(index % 5) + 1})`,
    }),
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Products By Category</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="total" hideLabel />}
            />
            <Pie data={chartData} dataKey="total">
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) => value.slice(0, 3)}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total products for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
