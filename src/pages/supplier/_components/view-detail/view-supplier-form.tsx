import { useSingleSupplier } from "@/api/suppliers/supplier.query";
import { useDeleteSupplier } from "@/api/suppliers/supplier.mutation";
import { useParams, useNavigate } from "react-router-dom";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { ViewSupplierTap } from "./view-supplier-tap";
import { SupplierCategoryBadge } from "../../utils/supplier-status";
import { SupplierDetailCard } from "./supplier-detail-card";
import { SupplierSpendChart } from "./supplier-spend-chart";
import { SupplierFinancialsCard } from "./supplier-financials-card";
import { SupplierSupplyTrendCard } from "./supplier-supply-trend-card";
import { SupplierInfoGrid } from "./supplier-info-grid";
import { trendIcon } from "../../utils/trend-icon";
import { Text } from "@/components/ui/text/app-text";
import { IconBadge } from "@/components/ui/icons-badge";
import { Separator } from "@/components/ui/separator";
import { Package, DollarSign, ShoppingCart, RefreshCw } from "lucide-react";

export function ViewSupplierForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSingleSupplier(Number(id));
  const deleteMutation = useDeleteSupplier();

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => navigate("/supplier"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">
          Loading supplier details...
        </p>
      </div>
    );
  }

  if (isError || !data?.data?.supplier) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 border-2 border-dashed rounded-xl">
          <p className="text-destructive font-medium">
            Failed to load supplier details
          </p>
          <p className="text-sm text-muted-foreground">
            Please check your connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  const supplier = data.data.supplier;
  const statistics = data.data.statistics;
  const supplyTrend = statistics.supply_trend;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* 1. Profile Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-muted/30 p-6 rounded-2xl border">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <IconBadge label="supplier" size={24} />
            </div>
            <div>
              <Text.TitleLarge className="leading-none">
                {supplier.official_name}
              </Text.TitleLarge>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground font-mono">
                  {supplier.supplier_code}
                </span>
                <Separator orientation="vertical" className="h-3" />
                <SupplierCategoryBadge category={supplier.supplier_category} />
              </div>
            </div>
          </div>
        </div>

        <HeaderActionButtons
          editPath={`/supplier/update/${supplier.id}`}
          showEdit={true}
          showDelete={true}
          onDelete={handleDelete}
          deleteHeading="Delete Supplier"
          deleteSubheading={`Are you sure you want to delete "${supplier.official_name}"? This action cannot be undone.`}
        />
      </div>

      {/* 2. Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SupplierDetailCard
          icon={<Package className="w-4 h-4 text-indigo-500" />}
          iconBg="bg-indigo-500/10"
          label="Raw Materials"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-lg">
              {statistics.total_raw_materials}
            </Text.Small>
          }
          subLabel="linked to this supplier"
        />

        <SupplierDetailCard
          icon={<DollarSign className="w-4 h-4 text-green-500" />}
          iconBg="bg-green-500/10"
          label="Total Spend"
          value={
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1">
                <Text.Small className="text-xs text-muted-foreground">
                  USD
                </Text.Small>
                <Text.Small
                  fontWeight="bold"
                  color="default"
                  className="text-base"
                >
                  $
                  {statistics.financials.total_spend_usd.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </Text.Small>
              </div>
              <div className="flex items-baseline gap-1">
                <Text.Small className="text-xs text-muted-foreground">
                  KHR
                </Text.Small>
                <Text.Small
                  fontWeight="bold"
                  color="default"
                  className="text-base"
                >
                  ៛{statistics.financials.total_spend_khr.toLocaleString()}
                </Text.Small>
              </div>
            </div>
          }
        />

        <SupplierDetailCard
          icon={<ShoppingCart className="w-4 h-4 text-blue-500" />}
          iconBg="bg-blue-500/10"
          label="Transactions"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-lg">
              {statistics.counts.purchase_count +
                statistics.counts.reorder_count}
            </Text.Small>
          }
          subLabel={`${statistics.counts.purchase_count} purchases · ${statistics.counts.reorder_count} reorders`}
        />

        <SupplierDetailCard
          icon={<RefreshCw className="w-4 h-4 text-orange-500" />}
          iconBg="bg-orange-500/10"
          label="Supply Trend (USD)"
          value={
            <div className="flex items-center gap-1.5">
              {trendIcon(statistics.supply_trend?.usd?.direction ?? "flat")}
              <Text.Small fontWeight="bold" color="default" className="text-lg">
                {statistics.supply_trend?.usd?.percent ?? 0}%
              </Text.Small>
            </div>
          }
          subLabel="vs last month"
        />
      </div>

      {/* 3. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <SupplierSpendChart topRawMaterials={statistics.top_raw_materials} />

        <div className="flex flex-col h-full">
          <SupplierFinancialsCard financials={statistics.financials} />
        </div>
      </div>

      {/* 4. Supply Trend Chart */}
      <SupplierSupplyTrendCard supplyTrend={supplyTrend} />

      {/* 6. Content Grid */}
      <SupplierInfoGrid supplier={supplier} />

      {/* 7. Bottom Tabs Section */}
      <div className="pt-4">
        <ViewSupplierTap supplier={supplier} />
      </div>
    </div>
  );
}
