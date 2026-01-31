import { StatCard } from "@/components/reusable/charts/stat-card";
import { SupplierChartAreaStacked } from "./charts/supplier-chart-area-stack";
import { SupplierBarchart } from "./charts/supplier-barchart";
import { SupplierPiechart } from "./charts/supplier-piechart";
import { useSupplierStatistics } from "@/api/suppliers/supplier.query";

export function SupplierStatistics() {
  const { data, isPending } = useSupplierStatistics();
  const stats = data?.data;

  return (
    <div>
      <section className="p-4 mx-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
          <StatCard
            title="Total Suppliers Trend"
            value={stats ? stats.total_suppliers.toString() : "0"}
            pillValue={stats ? `${stats.total_suppliers_trend.percent}%` : "0%"}
            trend={
              stats && stats.total_suppliers_trend.direction === "up"
                ? "up"
                : "down"
            }
            trendLabel="Since last month"
            description="Number of active suppliers in the system."
            isPeinding={isPending}
          />
          <StatCard
            title="New Suppliers"
            value={stats ? stats.new_suppliers.this_month.toString() : "0"}
            pillValue={stats ? `${stats.new_suppliers.trend.percent}%` : "0%"}
            trend={
              stats && stats.new_suppliers.trend.direction === "up"
                ? "up"
                : "down"
            }
            trendLabel="Since last month"
            description="New suppliers added this month."
            isPeinding={isPending}
          />
          <StatCard
            title="Total Categories"
            value={
              stats
                ? Object.keys(stats.total_by_category).length.toString()
                : "0"
            }
            pillValue={stats ? `${stats.total_suppliers_trend.percent}%` : "0%"}
            trend={
              stats && stats.total_suppliers_trend.direction === "up"
                ? "up"
                : "down"
            }
            trendLabel="Since last month"
            description="Active supplier categories in the system."
            isPeinding={isPending}
          />
        </div>
      </section>
      <div className="w-full my-4 mx-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SupplierChartAreaStacked />
        <SupplierBarchart />
        <SupplierPiechart />
      </div>
    </div>
  );
}
