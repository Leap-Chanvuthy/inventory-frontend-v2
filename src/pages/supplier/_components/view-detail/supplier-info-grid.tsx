import type { Supplier } from "@/api/suppliers/supplier.types";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/ui/icons-badge";
import { type IconBadgeLabel, type IconBadgeVariant } from "@/utils/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SupplierInfoGridProps {
  supplier: Supplier;
}

export function SupplierInfoGrid({ supplier }: SupplierInfoGridProps) {
  return (
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
  );
}

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
        <a
          href={href}
          className="text-sm font-medium text-primary hover:underline block truncate"
        >
          {value || "-"}
        </a>
      ) : (
        <p className="text-sm font-medium leading-relaxed">{value || "-"}</p>
      )}
    </div>
  );
}
