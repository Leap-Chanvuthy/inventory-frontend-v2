import { useMemo } from "react";
import type { DateRange, HistoryStats, Order } from "../types";
import { calculateOrderTotals, filterOrdersByDate } from "../utils/order-utils";
import type { Customer } from "../types";

export function useHistoryStats(orders: Order[], dateRange: DateRange, customers: Customer[]): HistoryStats {
  return useMemo(() => {
    const historyOrders = orders.filter(order => ["COMPLETED", "CANCELLED", "REFUNDED"].includes(order.status));
    const scopedOrders = filterOrdersByDate(historyOrders, dateRange);

    return scopedOrders.reduce<HistoryStats>(
      (acc, order) => {
        if (order.status === "COMPLETED") {
          acc.completed += 1;
          acc.earnings += calculateOrderTotals(order, customers).total;
        }
        if (order.status === "CANCELLED") {
          acc.cancelled += 1;
        }
        if (order.status === "REFUNDED") {
          acc.refunded += 1;
        }

        return acc;
      },
      {
        completed: 0,
        cancelled: 0,
        refunded: 0,
        earnings: 0,
      },
    );
  }, [customers, dateRange, orders]);
}
