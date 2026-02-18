import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  ShieldCheck,
  Globe,
  CreditCard,
  FileText,
  Calendar,
  Tag,
  Hash,
  Copy,
} from "lucide-react";
import { Supplier } from "@/api/suppliers/supplier.types";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text/app-text";
import { toast } from "sonner";
import { OverviewItem } from "./overview-item";
import { openGoogleMaps } from "@/utils/maps";

interface ViewSupplierTapProps {
  supplier: Supplier;
}

export function ViewSupplierTap({ supplier }: ViewSupplierTapProps) {
  const copyValue = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    toast.success(`${label} copied`);
  };

  const tabs = [
    {
      label: "Overview",
      value: "general",
      content: (
        <div className="py-6 animate-in fade-in duration-300">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Description */}
              <div>
                <Text.Small className="text-xs mb-1.5">
                  Business Description
                </Text.Small>
                <Text.Small color="muted">
                  {supplier.business_description ||
                    "No business description provided. Update the supplier profile to add company details."}
                </Text.Small>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <OverviewItem
                    icon={<Hash className="w-3.5 h-3.5" />}
                    label="Tax ID (TIN)"
                    value={supplier.tax_identification_number}
                    copyable
                    onCopy={() =>
                      copyValue(
                        supplier.tax_identification_number || "",
                        "Tax ID",
                      )
                    }
                  />
                  <OverviewItem
                    icon={<Hash className="w-3.5 h-3.5" />}
                    label="Registration No."
                    value={supplier.business_registration_number}
                    copyable
                    onCopy={() =>
                      copyValue(
                        supplier.business_registration_number || "",
                        "Registration No.",
                      )
                    }
                  />
                  <OverviewItem
                    icon={<Tag className="w-3.5 h-3.5" />}
                    label="Category"
                    value={supplier.supplier_category}
                  />
                  <OverviewItem
                    icon={<MapPin className="w-3.5 h-3.5" />}
                    label="District"
                    value={supplier.district}
                  />
                  <OverviewItem
                    icon={<ShieldCheck className="w-3.5 h-3.5" />}
                    label="Status"
                    value="Active"
                    badge
                  />
                  <OverviewItem
                    icon={<Calendar className="w-3.5 h-3.5" />}
                    label="Joined Since"
                    value={new Date(supplier.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  />
                  <OverviewItem
                    icon={<Calendar className="w-3.5 h-3.5" />}
                    label="Last Updated"
                    value={new Date(supplier.updated_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      label: "Banking",
      value: "banking",
      content: (
        <div className="space-y-4 py-6 animate-in fade-in duration-300">
          {supplier.banks?.length ? (
            supplier.banks.map(bank => (
              <Card key={bank.id} className="overflow-hidden shadow-sm">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Bank Brand */}
                    <div className="md:w-48 p-6 flex flex-col items-center justify-center bg-muted/40 border-b md:border-b-0 md:border-r gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white shadow-sm border p-2">
                        <img
                          src={bank.bank_label || ""}
                          alt={bank.bank_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wide text-center">
                        {bank.bank_name}
                      </span>
                    </div>

                    {/* Account Details */}
                    <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-3">
                        <div>
                          <Text.Small className="text-xs mb-1">
                            Account Holder
                          </Text.Small>
                          <Text.Small fontWeight="semibold" color="default">
                            {bank.account_holder_name}
                          </Text.Small>
                        </div>
                        <div>
                          <Text.Small className="text-xs mb-1">
                            Account Number
                          </Text.Small>
                          <button
                            onClick={() =>
                              copyValue(bank.account_number, "Account Number")
                            }
                            className="flex items-center gap-3 px-4 py-2.5 bg-muted rounded-lg hover:bg-muted/70 transition-colors group w-full text-left"
                          >
                            <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-mono font-bold tracking-widest text-sm flex-1">
                              {bank.account_number}
                            </span>
                            <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                          </button>
                        </div>
                      </div>

                      {/* QR Code / Payment Link */}
                      {(bank.qr_code_image || bank.payment_link) && (
                        <div className="flex items-center gap-4 md:justify-end md:border-l md:pl-6 border-dashed">
                          <div className="flex flex-col items-center gap-1.5">
                            {bank.qr_code_image && (
                              <>
                                <Text.Small
                                  fontWeight="semibold"
                                  color="default"
                                  className="text-xs"
                                >
                                  Scan to Pay
                                </Text.Small>
                                <div className="p-2 bg-white rounded-lg shadow-sm border">
                                  <img
                                    src={bank.qr_code_image}
                                    alt="QR Code"
                                    className="w-20 h-20 object-contain"
                                  />
                                </div>
                              </>
                            )}
                            {bank.payment_link && (
                              <a
                                href={bank.payment_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline font-semibold"
                              >
                                Click here to pay via KHQR
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
              <Text.Small fontWeight="medium" color="muted">
                No bank accounts added
              </Text.Small>
              <Text.Small color="muted" className="mt-1">
                Bank details will appear here once added.
              </Text.Small>
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Location",
      value: "location",
      content: (
        <div className="py-6 animate-in fade-in duration-300">
          <Card className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Address Details */}
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-4 h-4" />
                    <Text.Small
                      fontWeight="bold"
                      color="primary"
                      className="text-xs uppercase tracking-widest"
                    >
                      Primary Address
                    </Text.Small>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <OverviewItem
                      label="Street"
                      value={supplier.address_line1}
                    />
                    <OverviewItem
                      label="Building"
                      value={supplier.address_line2}
                    />
                    <OverviewItem
                      label="Village / Commune"
                      value={[supplier.village, supplier.commune]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <OverviewItem
                      label="City / Province"
                      value={[supplier.city, supplier.province]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <OverviewItem
                      label="Postal Code"
                      value={supplier.postal_code}
                    />
                    <OverviewItem
                      label="Coordinates"
                      value={
                        supplier.latitude
                          ? `${supplier.latitude}, ${supplier.longitude}`
                          : undefined
                      }
                    />
                  </div>
                </div>

                {/* Map Panel */}
                <div
                  className="relative m-4 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-10 text-center space-y-4 min-h-[220px]"
                  style={{
                    backgroundImage: "url('/assets/google_map.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-2xl" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <Text.Small
                        fontWeight="semibold"
                        className="text-white text-xs"
                      >
                        Open in Maps
                      </Text.Small>
                      <Text.Small className="text-white/70 text-xs mt-1 max-w-[180px]">
                        View this location in Google Maps for directions.
                      </Text.Small>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        openGoogleMaps({
                          latitude: supplier.latitude,
                          longitude: supplier.longitude,
                          address: [
                            supplier.address_line1,
                            supplier.city,
                            supplier.province,
                          ],
                        })
                      }
                      className="bg-white text-black hover:bg-white/90"
                    >
                      Open Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <ReusableTabs
        name="supplier-details"
        tabs={tabs}
        defaultValue="general"
      />
    </div>
  );
}
