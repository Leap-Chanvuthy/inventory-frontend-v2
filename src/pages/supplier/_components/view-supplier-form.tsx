import { useSingleSupplier } from "@/api/suppliers/supplier.query";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { ViewSupplierTap } from "./view-supplier-tap";
import { SupplierCategoryBadge } from "../utils/supplier-status";
import { Text } from "@/components/ui/text/app-text";
import { IconBadge } from "@/components/ui/icons-badge";

export function ViewSupplierForm() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSingleSupplier(Number(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading supplier details...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Failed to load supplier details</p>
        </div>
      </div>
    );
  }

  const supplier = data.data;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Text.TitleLarge className="mb-2">
          {supplier.official_name}
        </Text.TitleLarge>

        <HeaderActionButtons
          editPath={`/supplier/update/${supplier.id}`}
          showEdit={true}
          showDelete={true}
        />
      </div>

      <div className="rounded-2xl shadow-sm border max-w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Text.TitleLarge className="mb-2">
              Supplier Information
            </Text.TitleLarge>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="code" variant="warning" />
                  Supplier ID
                </p>
                <p className="font-medium">{supplier.supplier_code}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="supplier" />
                  Contact Person
                </p>
                <p className="font-medium">{supplier.contact_person || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="email" variant="info" />
                  Email
                </p>
                <a
                  href={`mailto:${supplier.email}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {supplier.email || "-"}
                </a>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="phone" variant="success" />
                  Phone
                </p>
                <a
                  href={`tel:${supplier.phone}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {supplier.phone || "-"}
                </a>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="status" variant="success" />
                  Status
                </p>
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
                  Active
                </Badge>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="name" variant="info" />
                  Legal Business Name
                </p>
                <p className="font-medium">
                  {supplier.legal_business_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="category" variant="warning" />
                  Category
                </p>
                <SupplierCategoryBadge category={supplier.supplier_category} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="created_date" />
                  Registration Date
                </p>
                <p className="font-medium">
                  {new Date(supplier.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="barcode" variant="primary" />
                  Tax ID
                </p>
                <p className="font-medium">
                  {supplier.tax_identification_number || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="barcode" variant="primary" />
                  Business Registration Number
                </p>
                <p className="font-medium">
                  {supplier.business_registration_number || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ViewSupplierTap supplier={supplier} />
    </div>
  );
}
