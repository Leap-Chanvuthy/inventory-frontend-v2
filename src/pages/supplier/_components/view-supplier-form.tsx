import { useSingleSupplier } from "@/api/suppliers/supplier.query";
import { useParams, useNavigate } from "react-router-dom";
import { Phone, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { ViewSupplierTap } from "./view-supplier-tap";

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

  const CategoryBadge = ({ category }: { category: string }) => {
    const map: Record<string, string> = {
      ELECTRONICS: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      PRODUCTS: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      FOOD: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      CLOTHING: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      LOGISTICS: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      OTHERS: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    };

    return (
      <Badge variant="secondary" className={map[category] || map["OTHERS"]}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold mb-2">{supplier.official_name}</h1>

        <HeaderActionButtons
          editPath={`/warehouses/update/${supplier.id}`}
          showEdit={true}
          showDelete={true}
        />
      </div>
      <div className="rounded-2xl shadow-sm border max-w-full mx-auto p-8  ">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-xl  mb-2">Supplier Information</h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {/* Supplier Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Supplier ID
                </p>
                <p className="font-medium">{supplier.supplier_code}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Contact Person
                </p>
                <p className="font-medium">{supplier.contact_person || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <a
                    href={`mailto:${supplier.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {supplier.email || "-"}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <a
                    href={`tel:${supplier.phone}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {supplier.phone || "-"}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
                  Active
                </Badge>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Legal Business Name
                </p>
                <p className="font-medium">
                  {supplier.legal_business_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-medium">
                  <CategoryBadge category={supplier.supplier_category} />
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Registration Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <p className="font-medium">
                    {new Date(supplier.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Tax ID</p>
                <p className="font-medium">
                  {supplier.tax_identification_number || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
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

      {/* Tabs Section */}
      {/* <ViewSupplierTap supplier={supplier} /> */}
    </div>
  );
}
