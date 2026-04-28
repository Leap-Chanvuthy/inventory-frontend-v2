import { CheckCircle2, Clock3, DollarSign, PauseCircle, RotateCcw, StickyNote } from "lucide-react";
import type { SaleOrderStatistics } from "@/api/sale-orders/sale-order.types";
import { formatCurrency } from "../utils/order-utils";
import { StatsCard } from "./stats-card";

interface SaleOrderStatsCardsProps {
  stats?: SaleOrderStatistics;
}

export function SaleOrderStatsCards({ stats }: SaleOrderStatsCardsProps) {
  const safe = stats || {
    total_draft: 0,
    total_processing: 0,
    total_on_hold: 0,
    total_completed: 0,
    total_refunded: 0,
    total_earning_usd: 0,
    total_earning_riel: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      <StatsCard label="Draft" value={safe.total_draft} icon={StickyNote} tone="gray" />
      <StatsCard label="Processing" value={safe.total_processing} icon={Clock3} tone="blue" />
      <StatsCard label="On Hold" value={safe.total_on_hold} icon={PauseCircle} tone="yellow" />
      <StatsCard label="Completed" value={safe.total_completed} icon={CheckCircle2} tone="green" />
      <StatsCard label="Refunded" value={safe.total_refunded} icon={RotateCcw} tone="orange" />
      <StatsCard
        label="Earnings"
        value={formatCurrency(safe.total_earning_usd)}
        subValue={`${Math.round(safe.total_earning_riel).toLocaleString()} KHR`}
        icon={DollarSign}
        tone="blue"
      />
    </div>
  );
}

