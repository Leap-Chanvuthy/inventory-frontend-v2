import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { CategoriesSummary } from "@/api/dashboard/dashboard.types";
import { Tag, TrendingUp, TrendingDown, Minus } from "lucide-react";

function TrendBadge({ direction, change }: { direction: string; change: number }) {
  if (direction === "up")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
        <TrendingUp className="h-2.5 w-2.5" />+{change}
      </span>
    );
  if (direction === "down")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:text-red-400">
        <TrendingDown className="h-2.5 w-2.5" />{change}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Minus className="h-2.5 w-2.5" />0
    </span>
  );
}

interface RowItem {
  category_id: number;
  category_name: string;
  count: number;
  trend: { direction: string; change: number };
}

function CategoryRowList({ rows }: { rows: RowItem[] }) {
  const active = rows.filter((r) => r.count > 0);

  if (active.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-muted-foreground gap-2">
        <Tag className="h-8 w-8 opacity-20" />
        No data for this period
      </div>
    );
  }

  return (
    <>
      {/* Column headers */}
      <div className="grid grid-cols-[2rem_1fr_4rem_5rem] border-b border-border/60 bg-muted/30 px-4 py-2.5">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">#</span>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Category</span>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Count</span>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Change</span>
      </div>
      <div className="divide-y divide-border/40">
        {active.map((row, idx) => (
          <div
            key={row.category_id}
            className="grid grid-cols-[2rem_1fr_4rem_5rem] items-center px-4 py-2.5 hover:bg-muted/30 transition-colors"
          >
            <span className="text-xs text-muted-foreground font-medium tabular-nums">{idx + 1}</span>
            <span className="text-sm font-medium text-foreground truncate pr-2">{row.category_name}</span>
            <span className="text-sm font-bold text-foreground tabular-nums text-right">{row.count}</span>
            <div className="flex justify-end">
              <TrendBadge direction={row.trend.direction} change={row.trend.change} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <span className="flex items-center gap-1.5">
      {text}
      <span className="rounded-full bg-black/10 dark:bg-white/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none">
        {count}
      </span>
    </span>
  );
}

interface Props {
  products: CategoriesSummary["tables"]["top_10_categories_by_products_count"];
  rawMaterials: CategoriesSummary["tables"]["top_10_categories_by_raw_materials_count"];
  customers: CategoriesSummary["tables"]["top_10_categories_by_customers_count"];
}

export function DashboardCategoriesCard({ products, rawMaterials, customers }: Props) {
  const productRows = products.map((r) => ({ category_id: r.category_id, category_name: r.category_name, count: r.products_count, trend: r.trend }));
  const rmRows = rawMaterials.map((r) => ({ category_id: r.category_id, category_name: r.category_name, count: r.raw_materials_count, trend: r.trend }));
  const customerRows = customers.map((r) => ({ category_id: r.category_id, category_name: r.category_name, count: r.customers_count, trend: r.trend }));

  const totals = {
    products: productRows.filter((r) => r.count > 0).reduce((s, r) => s + r.count, 0),
    raw_materials: rmRows.filter((r) => r.count > 0).reduce((s, r) => s + r.count, 0),
    customers: customerRows.filter((r) => r.count > 0).reduce((s, r) => s + r.count, 0),
  };

  const tabs = [
    {
      value: "products",
      label: <TabLabel text="Products" count={totals.products} />,
      content: <CategoryRowList rows={productRows} />,
    },
    {
      value: "raw_materials",
      label: <TabLabel text="Raw Materials" count={totals.raw_materials} />,
      content: <CategoryRowList rows={rmRows} />,
    },
    {
      value: "customers",
      label: <TabLabel text="Customers" count={totals.customers} />,
      content: <CategoryRowList rows={customerRows} />,
    },
  ];

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          Top Categories
        </CardTitle>
        <CardDescription>Switch between products, raw materials and customers</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ReusableTabs name="dashboard-categories" tabs={tabs} defaultValue="products" />
      </CardContent>
    </Card>
  );
}
