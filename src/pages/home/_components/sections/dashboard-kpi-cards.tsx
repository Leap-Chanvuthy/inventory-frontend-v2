import {
  Package,
  FlaskConical,
  Truck,
  Warehouse,
  AlertTriangle,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  UserCheck,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import { DashboardSummaryData } from "@/api/dashboard/dashboard.types";
import { cn } from "@/lib/utils";

interface Props {
  data: DashboardSummaryData;
  isLoading: boolean;
}

const fmt = (n: number | null | undefined) =>
  n != null ? n.toLocaleString() : "0";

const fmtMoney = (n: number | null | undefined) => {
  if (n == null) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

const pct = (t: { percentage_change_display: string | null; change: number }) =>
  t.percentage_change_display ??
  (t.change >= 0 ? `+${t.change}` : String(t.change));

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down" | "neutral";
  change: string;
  icon: React.ReactNode;
  iconBg: string;
  cardBg?: string;
  large?: boolean;
}

function KpiCard({
  title,
  value,
  subtitle,
  trend,
  change,
  icon,
  iconBg,
  cardBg,
  large,
}: KpiCardProps) {
  const isUp = trend === "up";
  const isNeutral = trend === "neutral";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-200",
        cardBg ?? "bg-card",
        large && "col-span-2"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            {title}
          </p>
          <p
            className={cn(
              "font-bold tracking-tight text-foreground",
              large ? "text-4xl" : "text-3xl",
            )}
          >
            {value}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 truncate">
            {subtitle}
          </p>
        </div>

        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            iconBg,
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
            isNeutral
              ? "bg-muted text-muted-foreground"
              : isUp
                ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
          )}
        >
          {!isNeutral &&
            (isUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            ))}
          {change}
        </span>
        <span className="text-xs text-muted-foreground">
          vs previous period
        </span>
      </div>
    </div>
  );
}

export function DashboardKpiCards({ data }: Props) {
  const {
    products,
    raw_materials,
    suppliers,
    warehouses,
    users,
    sale_orders,
    customers,
  } = data.summary;

  const heroCards: KpiCardProps[] = [
    {
      title: "Total Revenue",
      value: fmtMoney(sale_orders.metrics.total_revenue.current),
      subtitle: `Avg order: ${fmtMoney(sale_orders.metrics.average_order_value.current)}`,
      trend: sale_orders.metrics.total_revenue.direction,
      change: pct(sale_orders.metrics.total_revenue),
      icon: (
        <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      ),
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      large: true,
    },
    {
      title: "Total Sale Orders",
      value: fmt(sale_orders.metrics.total_sale_orders.current),
      subtitle: `Discount: ${fmtMoney(sale_orders.metrics.total_discount.current)}`,
      trend: sale_orders.metrics.total_sale_orders.direction,
      change: pct(sale_orders.metrics.total_sale_orders),
      icon: (
        <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      ),
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      large: true,
    },
  ];

  const statCards: KpiCardProps[] = [
    {
      title: "Total Products",
      value: fmt(products.metrics.total_products.current),
      subtitle: `${products.metrics.new_products_in_period.current} new this period`,
      trend: products.metrics.total_products.direction,
      change: pct(products.metrics.total_products),
      icon: (
        <Package className="h-5 w-5 text-violet-600 dark:text-violet-400" />
      ),
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
    },
    {
      title: "Raw Materials",
      value: fmt(raw_materials.metrics.total_raw_materials.current),
      subtitle: `${raw_materials.metrics.out_of_stock_raw_materials.current} out of stock`,
      trend: raw_materials.metrics.total_raw_materials.direction,
      change: pct(raw_materials.metrics.total_raw_materials),
      icon: (
        <FlaskConical className="h-5 w-5 text-orange-600 dark:text-orange-400" />
      ),
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Total Suppliers",
      value: fmt(suppliers.metrics.total_suppliers.current),
      subtitle: "active this period",
      trend: suppliers.metrics.total_suppliers.direction,
      change: pct(suppliers.metrics.total_suppliers),
      icon: <Truck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />,
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      title: "Warehouses",
      value: fmt(warehouses.metrics.total_warehouses.current),
      subtitle: `${warehouses.metrics.warehouses_with_stock.current} with stock`,
      trend: warehouses.metrics.total_warehouses.direction,
      change: pct(warehouses.metrics.total_warehouses),
      icon: (
        <Warehouse className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      ),
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Total Customers",
      value: fmt(customers.metrics.total_customers.current),
      subtitle: `${customers.metrics.active_customers.current} active`,
      trend: customers.metrics.total_customers.direction,
      change: pct(customers.metrics.total_customers),
      icon: <UserCheck className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
      iconBg: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "Total Users",
      value: fmt(users.metrics.total_users.current),
      subtitle: `${users.metrics.new_users_in_period.current} new this period`,
      trend: users.metrics.total_users.direction,
      change: pct(users.metrics.total_users),
      icon: <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Out of Stock",
      value: fmt(raw_materials.metrics.out_of_stock_raw_materials.current),
      subtitle: "raw materials need restock",
      trend:
        raw_materials.metrics.out_of_stock_raw_materials.direction === "down"
          ? "up"
          : "down",
      change: pct(raw_materials.metrics.out_of_stock_raw_materials),
      icon: (
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
      ),
      iconBg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Low Stock",
      value: fmt(raw_materials.metrics.low_stock_raw_materials.current),
      subtitle: "raw materials low",
      trend: raw_materials.metrics.low_stock_raw_materials.direction,
      change: pct(raw_materials.metrics.low_stock_raw_materials),
      icon: (
        <BarChart2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      ),
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {heroCards.map(card => (
          <KpiCard key={card.title} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <KpiCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
