import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  LineChart as LineChartIcon,
  PauseCircle,
  RefreshCw,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SaleOrderStatistics } from "@/api/sale-orders/sale-order.types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate } from "@/utils/date-format";
import { StatsCard } from "./stats-card";
import { Text } from "@/components/ui/text/app-text";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";

interface StatisticsPanelProps {
  stats?: SaleOrderStatistics;
  groupBy: "day" | "week" | "month" | "year";
  customerId?: number;
  status?: string;
  customerOptions: Array<{ id: number; name: string }>;
  dateRange: { start: string; end: string };
  onGroupByChange: (value: "day" | "week" | "month" | "year") => void;
  onCustomerChange: (value?: number) => void;
  onStatusChange: (value?: string) => void;
  onOpenDateFilter: () => void;
  onClearDateFilter: () => void;
  onDownloadReport: () => void;
  onBackToOrders: () => void;
  onViewCustomer: (customerId: number) => void;
  onViewProduct: (productId: number) => void;
  isDownloading?: boolean;
  isLoading?: boolean;
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PROCESSING", label: "Processing" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

export function StatisticsPanel({
  stats,
  groupBy,
  customerId,
  status,
  customerOptions,
  dateRange,
  onGroupByChange,
  onCustomerChange,
  onStatusChange,
  onOpenDateFilter,
  onClearDateFilter,
  onDownloadReport,
  onBackToOrders,
  onViewCustomer,
  onViewProduct,
  isDownloading,
  isLoading = false,
}: StatisticsPanelProps) {
  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-muted/20 p-4">
        <DataCardLoading text="Loading sale order statistics..." className="min-h-[320px]" />
      </div>
    );
  }

  const safe = stats || {
    total_orders: 0,
    total_draft: 0,
    total_processing: 0,
    total_on_hold: 0,
    total_completed: 0,
    total_cancelled: 0,
    total_refunded_records: 0,
    total_refunded: 0,
    total_refunded_usd: 0,
    total_refunded_riel: 0,
    total_discount_amount: 0,
    gross_sales_usd: 0,
    gross_sales_riel: 0,
    total_sales_usd: 0,
    total_sales_riel: 0,
    net_revenue_usd: 0,
    net_revenue_riel: 0,
    average_order_value_usd: 0,
    average_order_value_riel: 0,
    total_earning_usd: 0,
    total_earning_riel: 0,
    group_by: groupBy,
    top_customers: [],
    top_products: [],
    top_refunded_customers: [],
    top_cancelled_customers: [],
    sales_trend: [],
  } as SaleOrderStatistics;

  const dateLabel = !dateRange.start || !dateRange.end
    ? "All Time"
    : `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;

  const topCustomersChart = (safe.top_customers || []).map((customer, index) => ({
    id: Number(customer.customer_id ?? 0),
    name: customer.customer_name || `Customer #${index + 1}`,
    label: `${index + 1}. ${customer.customer_name || "-"}`,
    value: Number(customer.total_sales_usd ?? 0),
  }));

  const topProductsChart = (safe.top_products || []).map((product, index) => ({
    id: Number(product.product_id ?? 0),
    name: product.product_name || `Product #${index + 1}`,
    label: `${index + 1}. ${product.product_name || "-"}`,
    value: Number(product.quantity_sold ?? 0),
  }));

  const refundedCustomersChart = (safe.top_refunded_customers || []).map(
    (customer, index) => ({
      id: Number(customer.customer_id ?? 0),
      name: customer.customer_name || `Customer #${index + 1}`,
      value: Number(customer.total_refund_usd ?? 0),
    }),
  );

  const cancelledCustomersChart = (safe.top_cancelled_customers || []).map(
    (customer, index) => ({
      id: Number(customer.customer_id ?? 0),
      name: customer.customer_name || `Customer #${index + 1}`,
      value: Number(customer.total_cancelled_usd ?? 0),
    }),
  );

  const refundedColors = [
    "#7c3aed",
    "#8b5cf6",
    "#a78bfa",
    "#c4b5fd",
    "#6d28d9",
    "#5b21b6",
    "#4c1d95",
    "#a855f7",
    "#9333ea",
    "#581c87",
  ];
  const cancelledColors = [
    "#dc2626",
    "#ef4444",
    "#f87171",
    "#fca5a5",
    "#b91c1c",
    "#991b1b",
    "#7f1d1d",
    "#fb7185",
    "#e11d48",
    "#9f1239",
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-muted/20 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={onBackToOrders}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Sale Orders
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={groupBy} onValueChange={value => onGroupByChange(value as "day" | "week" | "month" | "year")}>
            <SelectTrigger className="h-8 w-[110px] bg-card text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status || "ALL"} onValueChange={value => onStatusChange(value === "ALL" ? undefined : value)}>
            <SelectTrigger className="h-8 w-[140px] bg-card text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={customerId ? String(customerId) : "ALL"} onValueChange={value => onCustomerChange(value === "ALL" ? undefined : Number(value))}>
            <SelectTrigger className="h-8 w-[180px] bg-card text-xs">
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Customers</SelectItem>
              {customerOptions.map(customer => (
                <SelectItem key={customer.id} value={String(customer.id)}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="button" variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onOpenDateFilter}>
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            {dateLabel}
          </Button>

          {(dateRange.start || dateRange.end) && (
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={onClearDateFilter}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button type="button" size="sm" onClick={onDownloadReport} disabled={isDownloading} className="h-8 px-3 text-xs">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {isDownloading ? "Generating..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <div>
      <Text.Small className="mb-2 text-primary">
          Sales Summary
        </Text.Small>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-2.5 text-xs">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Gross Sales</p>
            <p className="mt-0.5 font-semibold text-foreground">{money(Number(safe.gross_sales_usd ?? 0))}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-2.5 text-xs">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Net Revenue</p>
            <p className="mt-0.5 font-semibold text-emerald-700">{money(Number(safe.net_revenue_usd ?? 0))}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-2.5 text-xs">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Refunded</p>
            <p className="mt-0.5 font-semibold text-amber-700">{money(Number(safe.total_refunded_usd ?? 0))}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-2.5 text-xs">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg Order Value</p>
            <p className="mt-0.5 font-semibold text-blue-700">{money(Number(safe.average_order_value_usd ?? 0))}</p>
          </div>
        </div>
      </div>

      <div>
        <Text.Small className="mb-2 mt-4 text-primary">
          Order Status Breakdown
        </Text.Small>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          <StatsCard
            label="Draft"
            value={Number(safe.total_draft ?? 0)}
            icon={FileText}
            tone="gray"
          />
          <StatsCard
            label="Processing"
            value={Number(safe.total_processing ?? 0)}
            icon={RefreshCw}
            tone="blue"
          />
          <StatsCard
            label="On Hold"
            value={Number(safe.total_on_hold ?? 0)}
            icon={PauseCircle}
            tone="yellow"
          />
          <StatsCard
            label="Completed"
            value={Number(safe.total_completed ?? 0)}
            icon={CheckCircle2}
            tone="green"
          />
          <StatsCard
            label="Cancelled"
            value={Number(safe.total_cancelled ?? 0)}
            icon={XCircle}
            tone="red"
          />
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground">
            <LineChartIcon className="h-3.5 w-3.5 text-blue-600" />
            Total Sales Over Time
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            {safe.group_by?.toUpperCase() || groupBy.toUpperCase()}
          </span>
        </div>
        <div className="h-[320px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safe.sales_trend || []} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                formatter={(value: number) => money(Number(value || 0))}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="total_sales_usd"
                name="Sales (USD)"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Top 10 Buying Customers
            </p>
            <span className="text-[10px] text-muted-foreground">USD sales</span>
          </div>
          <div className="h-[380px]">
            {topCustomersChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCustomersChart} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 10 }}
                    tickMargin={6}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={value => String(value).slice(0, 18)}
                  />
                  <Tooltip
                    formatter={(value: number) => [money(Number(value || 0)), "Total Sales"]}
                    labelFormatter={label => `${label} (click bar to view)`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(217 91% 60%)"
                    radius={[4, 4, 4, 4]}
                    onClick={payload => {
                      const id = Number(payload?.id ?? 0);
                      if (id > 0) onViewCustomer(id);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No customer data for the selected filters.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Top 10 Selling Products
            </p>
            <span className="text-[10px] text-muted-foreground">Units sold</span>
          </div>
          <div className="h-[380px]">
            {topProductsChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsChart} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 10 }}
                    tickMargin={6}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={value => String(value).slice(0, 18)}
                  />
                  <Tooltip
                    formatter={(value: number) => [Number(value || 0), "Qty Sold"]}
                    labelFormatter={label => `${label} (click bar to view)`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(142 71% 45%)"
                    radius={[4, 4, 4, 4]}
                    onClick={payload => {
                      const id = Number(payload?.id ?? 0);
                      if (id > 0) onViewProduct(id);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No product data for the selected filters.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Top 10 Refunded Customers
            </p>
            <span className="text-[10px] text-muted-foreground">Refund USD</span>
          </div>
          <div className="h-[260px] sm:h-[320px]">
            {refundedCustomersChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: number) => money(Number(value || 0))}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: "#ffffff",
                      color: "#111827",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                  <Pie
                    data={refundedCustomersChart}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={3}
                    onClick={entry => {
                      const id = Number(entry?.id ?? 0);
                      if (id > 0) onViewCustomer(id);
                    }}
                  >
                    {refundedCustomersChart.map((entry, index) => (
                      <Cell
                        key={`${entry.id}-${index}`}
                        fill={refundedColors[index % refundedColors.length]}
                        cursor="pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No refund data for the selected filters.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Top 10 Cancelled Customers
            </p>
            <span className="text-[10px] text-muted-foreground">Cancelled USD</span>
          </div>
          <div className="h-[260px] sm:h-[320px]">
            {cancelledCustomersChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: number) => money(Number(value || 0))}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: "#ffffff",
                      color: "#111827",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                  <Pie
                    data={cancelledCustomersChart}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={3}
                    onClick={entry => {
                      const id = Number(entry?.id ?? 0);
                      if (id > 0) onViewCustomer(id);
                    }}
                  >
                    {cancelledCustomersChart.map((entry, index) => (
                      <Cell
                        key={`${entry.id}-${index}`}
                        fill={cancelledColors[index % cancelledColors.length]}
                        cursor="pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No cancelled data for the selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
