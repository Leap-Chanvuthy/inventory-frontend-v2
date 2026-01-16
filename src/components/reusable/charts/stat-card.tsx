import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import StatCardSkeleton from "./stat-card-skelaton";

interface StatCardProps {
  title: string;
  value: string;
  pillValue: string;
  trend: "up" | "down";
  trendLabel: string;
  description: string;
  className?: string;
  isPeinding?: boolean;
}

export function StatCard({
  title,
  value,
  pillValue,
  trend,
  trendLabel,
  description,
  className,
  isPeinding,
}: StatCardProps) {

  // Determine icons and colors based on trend direction
  const isPositive = trend === "up";
  const PillIcon = isPositive ? TrendingUp : TrendingDown;
  // const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div>
      {isPeinding ? (
        <StatCardSkeleton />
      ) :
        <Card className={cn("w-full shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground ${isPositive ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}>
              <PillIcon className="mr-1 h-3 w-3" />
              {pillValue}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight mb-4 text-foreground">
              {value}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center text-sm font-medium">
                {trendLabel}
                {isPositive ? (
                  <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="ml-1 h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </CardContent>
        </Card>
      }
    </div>
  );
}