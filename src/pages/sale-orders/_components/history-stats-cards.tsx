import { CheckCircle2, DollarSign, RotateCcw, XCircle } from "lucide-react";
import type { HistoryStats } from "../types";
import { convertUsdToRiel, formatCurrency } from "../utils/order-utils";
import { StatsCard } from "./stats-card";

interface HistoryStatsCardsProps {
  stats: HistoryStats;
}

export function HistoryStatsCards({ stats }: HistoryStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatsCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="green" />
      <StatsCard label="Cancelled" value={stats.cancelled} icon={XCircle} tone="red" />
      <StatsCard label="Refunded" value={stats.refunded} icon={RotateCcw} tone="purple" />
      <StatsCard
        label="Earnings"
        value={formatCurrency(stats.earnings)}
        subValue={formatCurrency(convertUsdToRiel(stats.earnings), "KHR")}
        icon={DollarSign}
        tone="blue"
      />
    </div>
  );
}
