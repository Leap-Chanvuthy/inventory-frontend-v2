import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function trendIcon(direction: "up" | "down" | "flat") {
  if (direction === "up")
    return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
  if (direction === "down")
    return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}
