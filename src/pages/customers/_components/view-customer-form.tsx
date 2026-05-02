import { useSingleCustomer } from "@/api/customers/customer.query";
import { useParams, useNavigate } from "react-router-dom";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { ViewCustomerTabs } from "./view-customer-tabs";
import { Text } from "@/components/ui/text/app-text";
import { useDeleteCustomer } from "@/api/customers/customer.mutation";
import { CustomerStatusBadge } from "../utils/customer-status";
import {
  formatPaymentTerms,
  memberDuration,
  statusMeta,
  StatTile,
  ContactRow,
} from "../utils/customer-detail-utils";
// import { IconBadge } from "@/components/ui/icons-badge";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Percent,
  Calendar,
  CreditCard,
} from "lucide-react";

export function ViewCustomerForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError } = useSingleCustomer(
    Number(id),
  );
  const deleteMutation = useDeleteCustomer();

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(Number(id), {
        onSuccess: () => navigate("/customer"),
      });
    }
  };

  if (isLoading)
    return <DataCardLoading text="Loading customer details data..." />;
  if (isError && !isFetching)
    return <UnexpectedError kind="fetch" homeTo="/customers" />;
  if (!data?.data) return <DataCardEmpty emptyText="Customer not found." />;

  const customer = data.data;
  const category = customer.customer_category;
  const accentColor = category?.label_color || "#6366f1";
  const sm = statusMeta(customer.customer_status);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* 1. Profile Hero */}
      <div className="rounded-2xl border overflow-hidden shadow-sm">
        {/* Accent banner */}
        <div
          className="h-20 w-full"
          style={{
            background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10, transparent)`,
            borderBottom: `1px solid ${accentColor}20`,
          }}
        />

        {/* Content — overlaps banner */}
        <div className="px-6 pb-6 -mt-10 flex flex-col md:flex-row md:items-end gap-4">
          {/* Avatar */}
          <div
            className="shrink-0 rounded-2xl overflow-hidden shadow-lg border-4 border-background"
            style={{ width: 80, height: 80 }}
          >
            <img
              src={
                customer.image ||
                `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(customer.fullname)}`
              }
              alt={customer.fullname}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Identity + actions */}
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div className="space-y-2">
              <Text.TitleLarge className="leading-tight truncate">
                {customer.fullname}
              </Text.TitleLarge>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono bg-muted/80 border px-2 py-0.5 rounded-md">
                  {customer.customer_code}
                </span>
                {category && (
                  <Badge
                    variant="outline"
                    className="shadow-none text-xs"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      borderColor: `${accentColor}50`,
                      color: accentColor,
                    }}
                  >
                    {category.category_name}
                  </Badge>
                )}
                <CustomerStatusBadge status={customer.customer_status} />
              </div>

              {/* Quick contact */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                {customer.phone_number && (
                  <a
                    href={`tel:${customer.phone_number}`}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-3 h-3 shrink-0" />
                    {customer.phone_number}
                  </a>
                )}
                {customer.email_address && (
                  <a
                    href={`mailto:${customer.email_address}`}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-3 h-3 shrink-0" />
                    {customer.email_address}
                  </a>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <HeaderActionButtons
                editPath={`/customer/update/${customer.id}`}
                showEdit
                showDelete
                onDelete={handleDelete}
                deleteHeading="Delete This Customer"
                deleteSubheading="Are you sure want to delete this customer? This action cannot be undone."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          icon={sm.icon}
          iconBg={sm.bg}
          label="Account Status"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-base">
              {sm.label}
            </Text.Small>
          }
        />
        <StatTile
          icon={<Percent className="w-4 h-4 text-indigo-500" />}
          iconBg="bg-indigo-500/10"
          label="Category Discount"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-lg">
              {category?.discount_percentage != null
                ? `${category.discount_percentage}%`
                : "—"}
            </Text.Small>
          }
        />
        <StatTile
          icon={<Calendar className="w-4 h-4 text-rose-500" />}
          iconBg="bg-rose-500/10"
          label="Member Duration"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-base">
              {memberDuration(customer.created_at)}
            </Text.Small>
          }
        />
        <StatTile
          icon={<CreditCard className="w-4 h-4 text-teal-500" />}
          iconBg="bg-teal-500/10"
          label="Payment Terms"
          value={
            <Text.Small fontWeight="bold" color="default" className="text-base">
              {formatPaymentTerms(customer.customer_financial?.payment_terms)}
            </Text.Small>
          }
        />
      </div>

      {/* 3. Main info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info as styled rows */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pt-0 pb-4">
            <ContactRow
              icon={<Mail className="w-3.5 h-3.5 text-blue-500" />}
              label="Email Address"
              value={customer.email_address}
              href={
                customer.email_address
                  ? `mailto:${customer.email_address}`
                  : undefined
              }
            />
            <ContactRow
              icon={<Phone className="w-3.5 h-3.5 text-green-500" />}
              label="Phone Number"
              value={customer.phone_number}
              href={
                customer.phone_number
                  ? `tel:${customer.phone_number}`
                  : undefined
              }
            />
            <ContactRow
              icon={<Globe className="w-3.5 h-3.5 text-indigo-500" />}
              label="Social Media"
              value={customer.social_media}
              href={customer.social_media || undefined}
              external
            />
            <ContactRow
              icon={<MapPin className="w-3.5 h-3.5 text-rose-500" />}
              label="Primary Address"
              value={customer.customer_address}
            />
            {customer.google_map_link && (
              <ContactRow
                icon={<Globe className="w-3.5 h-3.5 text-teal-500" />}
                label="Google Maps"
                value="View on Google Maps"
                href={customer.google_map_link}
                external
              />
            )}
          </CardContent>
        </Card>

        {/* Category card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Category badge + description */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{
                backgroundColor: `${accentColor}10`,
                border: `1px solid ${accentColor}25`,
              }}
            >
              {category ? (
                <>
                  <Badge
                    variant="outline"
                    className="shadow-none text-xs font-semibold"
                    style={{
                      backgroundColor: `${accentColor}20`,
                      borderColor: `${accentColor}50`,
                      color: accentColor,
                    }}
                  >
                    {category.category_name}
                  </Badge>
                  {category.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  {category.discount_percentage != null && (
                    <p
                      className="text-xs font-semibold"
                      style={{ color: accentColor }}
                    >
                      {category.discount_percentage}% discount applied
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">No category assigned.</p>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Registered
                </p>
                <p className="text-sm font-medium">
                  {new Date(customer.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Last Updated
                </p>
                <p className="text-sm font-medium">
                  {new Date(customer.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Tabs */}
      <ViewCustomerTabs customer={customer} />
    </div>
  );
}
