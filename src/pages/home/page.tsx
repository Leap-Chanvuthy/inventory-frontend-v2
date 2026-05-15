import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardSummary } from "@/api/dashboard/dashboard.query";
import { Text } from "@/components/ui/text/app-text";
import { DashboardKpiCards } from "./_components/sections/dashboard-kpi-cards";
import { DashboardSaleTrendChart } from "./_components/sections/dashboard-sale-trend-chart";
import { DashboardRmUsageChart } from "./_components/sections/dashboard-rm-usage-chart";
import { DashboardTopProductsTable } from "./_components/sections/dashboard-top-products-table";
import { DashboardRecentOrdersTable } from "./_components/sections/dashboard-recent-orders-table";
import { DashboardActivityFeed } from "./_components/sections/dashboard-activity-feed";
import { DashboardTopSuppliersTable } from "./_components/sections/dashboard-top-suppliers-table";
import {
  DashboardTopUsedRmTable,
  DashboardExpensiveRmTable,
} from "./_components/sections/dashboard-rm-tables";
import {
  DashboardUsersByRole,
  DashboardTopActivitiesTable,
} from "./_components/sections/dashboard-users-section";
import { DashboardUsersTrendChart } from "./_components/sections/dashboard-users-trend-chart";
import { DashboardLogsTrendChart } from "./_components/sections/dashboard-logs-trend-chart";
import { DashboardSuppliersTrendChart } from "./_components/sections/dashboard-suppliers-trend-chart";
import { DashboardWarehousesTrendChart } from "./_components/sections/dashboard-warehouses-trend-chart";
import { DashboardUomsTrendChart } from "./_components/sections/dashboard-uoms-trend-chart";
import {
  DashboardUomByProductsTable,
  DashboardUomByRmTable,
} from "./_components/sections/dashboard-uoms-tables";
import { DashboardSaleOrderStatus } from "./_components/sections/dashboard-sale-order-status";
import { DashboardRevenueTrendChart } from "./_components/sections/dashboard-revenue-trend-chart";
import { DashboardSaleOrderCountChart } from "./_components/sections/dashboard-sale-order-count-chart";
import { DashboardTopCustomersTable } from "./_components/sections/dashboard-top-customers-table";
import { DashboardCustomersTrendChart } from "./_components/sections/dashboard-customers-trend-chart";
import { DashboardCategoriesCard } from "./_components/sections/dashboard-categories-tables";
import { DashboardDateFilter } from "./_components/dashboard-date-filter";
import QuickMenuDashboard from "./_components/quick-menu-dashboard";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 pb-1 border-b border-border/50">
      <div className="h-5 w-1 rounded-full bg-primary shrink-0" />
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
    </div>
  );
}

const Home = () => {
  const { user } = useAuth();
  const [appliedStart, setAppliedStart] = useState("");
  const [appliedEnd, setAppliedEnd] = useState("");

  const { data, isLoading, isFetching, refetch, isError } = useDashboardSummary({
    start_date: appliedStart || undefined,
    end_date: appliedEnd || undefined,
  });

  if (isLoading) return <DataCardLoading text="Loading dashboard..." />;
  if (isError && !isFetching) return <UnexpectedError kind="fetch" homeTo="/" />;
  if (!data?.data) return <DataCardEmpty emptyText="No dashboard data available." />;

  const summary = data.data;

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Text.Large>Hi {user?.name}, Welcome Back.</Text.Large>
          <p className="text-sm text-muted-foreground mt-0.5">
            Inventory dashboard overview
            {appliedStart && appliedEnd && (
              <>
                {" "}
                &nbsp;·&nbsp;{" "}
                <span className="font-medium text-foreground">
                  {appliedStart}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {appliedEnd}
                </span>
              </>
            )}
          </p>
        </div>
        <DashboardDateFilter
          onApply={(start, end) => {
            setAppliedStart(start);
            setAppliedEnd(end);
          }}
          isFetching={isFetching}
          onRefresh={() => refetch()}
        />
      </div>

      {/* ── Quick Menu ─────────────────────────────────────────────────── */}
      <QuickMenuDashboard />

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading title="Overview" description="Key numbers at a glance" />
        <DashboardKpiCards data={summary} isLoading={false} />
      </section>

      {/* ── Sale Orders ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Sale Orders"
          description="How much revenue came in and how many orders were placed"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardRevenueTrendChart
              data={summary.summary.sale_orders.charts.revenue_trend_overtime}
            />
          </div>
          <DashboardSaleOrderStatus
            data={summary.summary.sale_orders.metrics.sale_orders_by_status}
          />
        </div>
        <DashboardSaleOrderCountChart
          data={summary.summary.sale_orders.charts.order_count_trend_overtime}
          total={summary.summary.sale_orders.metrics.total_sale_orders.current}
        />
      </section>

      {/* ── Products ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Products"
          description="Which products are selling and what orders came in recently"
        />
        <DashboardSaleTrendChart
          data={summary.summary.products.charts.sale_trend_overtime}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardTopProductsTable
            data={
              summary.summary.products.tables
                .top_10_most_selling_products_with_customer
            }
          />
          <DashboardRecentOrdersTable
            data={
              summary.summary.products.tables.last_10_sale_orders_with_customer
            }
          />
        </div>
      </section>

      {/* ── Raw Materials ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Raw Materials"
          description="What's being used most in production and what costs the most"
        />
        <DashboardRmUsageChart
          data={
            summary.summary.raw_materials.charts
              .raw_material_usage_trend_overtime
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardTopUsedRmTable
            data={
              summary.summary.raw_materials.tables
                .top_10_most_used_raw_materials_in_production
            }
          />
          <DashboardExpensiveRmTable
            data={
              summary.summary.raw_materials.tables.top_10_expensive_raw_materials
            }
          />
        </div>
      </section>

      {/* ── Suppliers ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Suppliers"
          description="Who supplies the most items and how the count has grown"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardTopSuppliersTable
            data={
              summary.summary.suppliers.tables.top_10_suppliers_by_supplied_items
            }
          />
          <DashboardSuppliersTrendChart
            data={summary.summary.suppliers.charts.suppliers_trend_overtime}
            total={summary.summary.suppliers.metrics.total_suppliers.current}
          />
        </div>
      </section>

      {/* ── Customers ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Customers"
          description="Who spends the most and how the customer base is growing"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardTopCustomersTable
            data={summary.summary.customers.tables.top_10_customers_by_revenue}
          />
          <DashboardCustomersTrendChart
            data={summary.summary.customers.charts.customers_trend_overtime}
            total={summary.summary.customers.metrics.total_customers.current}
          />
        </div>
      </section>

      {/* ── Warehouses ────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Warehouses"
          description="How many warehouses are active and how the count has changed"
        />
        <DashboardWarehousesTrendChart
          data={summary.summary.warehouses.charts.warehouses_trend_overtime}
          total={summary.summary.warehouses.metrics.total_warehouses.current}
        />
      </section>

      {/* ── Units of Measure ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Units of Measure"
          description="Which units are used most across products and raw materials"
        />
        <DashboardUomsTrendChart
          data={summary.summary.uoms.charts.uoms_trend_overtime}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardUomByProductsTable
            data={summary.summary.uoms.tables.top_10_uom_by_products_count}
          />
          <DashboardUomByRmTable
            data={summary.summary.uoms.tables.top_10_uom_by_raw_materials_count}
          />
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Categories"
          description="Which categories have the most products, materials and customers"
        />
        <DashboardCategoriesCard
          products={
            summary.summary.categories.tables
              .top_10_categories_by_products_count
          }
          rawMaterials={
            summary.summary.categories.tables
              .top_10_categories_by_raw_materials_count
          }
          customers={
            summary.summary.categories.tables.top_10_categories_by_customers_count
          }
        />
      </section>

      {/* ── Users & Audit ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading
          title="Users & Audit"
          description="Who's on the team, what actions were performed and system logs"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardUsersByRole
            data={summary.summary.users.tables.users_by_role}
            total={summary.summary.users.metrics.total_users.current}
          />
          <DashboardTopActivitiesTable
            data={
              summary.summary.audit_logs.tables.top_10_most_performed_activities
            }
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardUsersTrendChart
            data={summary.summary.users.charts.users_trend_overtime}
          />
          <DashboardLogsTrendChart
            data={summary.summary.audit_logs.charts.logs_trend_overtime}
            totalLogs={summary.summary.audit_logs.metrics.total_logs.current}
          />
        </div>
        <DashboardActivityFeed
          activities={summary.summary.audit_logs.tables.latest_10_activities}
        />
      </section>
    </div>
  );
};

export default Home;
