import { useSingleSupplier } from "@/api/suppliers/supplier.query";
import { useDeleteSupplier } from "@/api/suppliers/supplier.mutation";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { ViewSupplierTap } from "./view-supplier-tap";
import { SupplierCategoryBadge } from "../utils/supplier-status";
import { Text } from "@/components/ui/text/app-text";
import { IconBadge } from "@/components/ui/icons-badge";
import { type IconBadgeLabel, type IconBadgeVariant } from "@/utils/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

      {/* 2. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information Card */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <InfoGroup
                label="Legal Business Name"
                value={supplier.legal_business_name}
                icon="name"
                variant="info"
              />
              <InfoGroup
                label="Contact Person"
                value={supplier.contact_person}
                icon="supplier"
              />

              <InfoGroup
                label="Email Address"
                value={supplier.email}
                icon="email"
                variant="info"
                href={`mailto:${supplier.email}`}
              />

              <InfoGroup
                label="Phone Number"
                value={supplier.phone}
                icon="phone"
                variant="success"
                href={`tel:${supplier.phone}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Registration Card */}
        <Card className="shadow-sm border-l-4 border-l-primary/50">
          <CardHeader>
            <CardTitle className="text-lg">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoGroup
              label="Tax ID (TIN)"
              value={supplier.tax_identification_number}
              icon="barcode"
              variant="primary"
            />
            <InfoGroup
              label="Registration No."
              value={supplier.business_registration_number}
              icon="barcode"
              variant="primary"
            />

            <Separator />

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <Badge className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20 shadow-none">
                Active
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Joined Since
              </p>
              <p className="text-sm font-medium">
                {new Date(supplier.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Bottom Tabs Section */}
      <div className="pt-4">
        <ViewSupplierTap supplier={supplier} />
      </div>
    </div>
  );
}

// Helper component for clean data rows
function InfoGroup({
  label,
  value,
  icon,
  variant = "default",
  href,
}: {
  label: string;
  value?: string;
  icon: IconBadgeLabel;
  variant?: IconBadgeVariant;
  href?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <IconBadge label={icon} variant={variant} size={14} /> {label}
      </p>
      {href ? (
        <a href={href} className="text-sm font-medium text-primary hover:underline block truncate">
          {value || "-"}
        </a>
      ) : (
        <p className="text-sm font-medium leading-relaxed">{value || "-"}</p>
      )}
    </div>
  );
}
