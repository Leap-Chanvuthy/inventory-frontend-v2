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
import { trendIcon } from "../../utils/trend-icon";
import { Text } from "@/components/ui/text/app-text";
import { IconBadge } from "@/components/ui/icons-badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  Phone,
  Mail,
  User2,
  MapPin,
  Building2,
} from "lucide-react";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";

export function ViewSupplierForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError } = useSingleSupplier(
    Number(id),
  );
  const deleteMutation = useDeleteSupplier();

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => navigate("/supplier"),
    });
  };

  if (isLoading) {
    return <DataCardLoading text="Loading supplier details data..." />;
  }

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" homeTo="/supplier" />;
  }

  if (!data?.data?.supplier) {
    return <DataCardEmpty emptyText="Supplier not found." />;
  }

  const supplier = data.data.supplier;
  const statistics = data.data.statistics;
  const supplyTrend = statistics.supply_trend;

  const cityProvince = [supplier.city, supplier.province]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* 1. Profile Hero */}
      <div className="relative rounded-2xl border bg-gradient-to-br from-primary/5 via-muted/20 to-background overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-start gap-5">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="h-20 w-20 md:h-[88px] md:w-[88px] rounded-2xl border-2 border-background shadow-md overflow-hidden bg-primary/10 flex items-center justify-center">
              {supplier.image ? (
                <img
                  src={supplier.image}
                  alt={supplier.official_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <IconBadge label="supplier" size={36} />
              )}
            </div>
          </div>

          {/* Identity block */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div>
              <Text.TitleLarge className="leading-tight truncate">
                {supplier.official_name}
              </Text.TitleLarge>
              {supplier.legal_business_name &&
                supplier.legal_business_name !== supplier.official_name && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <Text.Small color="muted" className="truncate">
                      {supplier.legal_business_name}
                    </Text.Small>
                  </div>
                )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground font-mono bg-muted/60 border px-2 py-0.5 rounded-md">
                  {supplier.supplier_code}
                </span>
                <SupplierCategoryBadge category={supplier.supplier_category} />
              </div>
            </div>

            <Separator className="w-full opacity-50" />

            {/* Quick contact row */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {supplier.contact_person && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User2 className="w-3.5 h-3.5 shrink-0" />
                  {supplier.contact_person}
                </span>
              )}
              {supplier.phone && (
                <a
                  href={`tel:${supplier.phone}`}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {supplier.phone}
                </a>
              )}
              {supplier.email && (
                <a
                  href={`mailto:${supplier.email}`}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {supplier.email}
                </a>
              )}
              {cityProvince && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {cityProvince}
                </span>
              )}
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

      {/* 4. Supply Trend */}
      <SupplierSupplyTrendCard supplyTrend={supplyTrend} />

      {/* 5. Tabs */}
      <div className="pt-2">
        <ViewSupplierTap supplier={supplier} />
      </div>
    </div>
  );
}
