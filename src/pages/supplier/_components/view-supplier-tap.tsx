import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building2 } from "lucide-react";
import { Supplier } from "@/api/suppliers/supplier.types";
import ReusableTabs from "@/components/reusable/partials/tabs";

interface ViewSupplierTapProps {
  supplier: Supplier;
}

export function ViewSupplierTap({ supplier }: ViewSupplierTapProps) {
  const tabs = [
    {
      label: "General Info",
      value: "general",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>
              <Building2 className="h-5 w-5 inline mr-2" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div>
              <p className="text-sm text-muted-foreground">
                Business Registration Number
              </p>
              <p className="font-medium">
                {supplier.business_registration_number || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                <FileText className="h-4 w-4 inline mr-1" />
                Business Description
              </p>
              <p className="font-medium whitespace-pre-wrap">
                {supplier.business_description || "-"}
              </p>
            </div> */}
          </CardContent>
        </Card>
      ),
    },
    {
      label: "Banking Info",
      value: "banking",
      content: (
        <>
          {supplier.banks && supplier.banks.length > 0 ? (
            supplier.banks.map(bank => (
              <Card key={bank.id} className="mb-6">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_1fr] gap-8 items-start">
                    {/* Left Section */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        Banking Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Details for direct bank transfers and KHQR payments.
                      </p>
                      <div className="hidden lg:block h-full w-px bg-gray-300"></div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block h-full w-px bg-gray-300"></div>

                    {/* Middle Bank Details Section */}
                    <div className="space-y-4 pl-14">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Supplier Bank Account Name
                        </p>
                        <p className="text-lg font-semibold">
                          {bank.account_holder_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Bank Account Number
                        </p>
                        <p className="text-lg font-semibold">
                          {bank.account_number}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Name of the Bank
                        </p>
                        <p className="text-lg font-semibold">
                          {bank.bank_name}
                        </p>
                      </div>
                    </div>

                    {/* Right Section - KHQR */}
                    <div className="flex flex-col items-center justify-start space-y-4">
                      <h4 className="text-base font-semibold text-center">
                        KHQR Code of Payment
                      </h4>

                      {bank.qr_code_image ? (
                        <>
                          <div className="border rounded-xl p-3 shadow-sm">
                            <img
                              src={bank.qr_code_image}
                              alt={`KHQR Code for ${bank.bank_name}`}
                              className="w-32 h-32 object-contain"
                            />
                          </div>

                          {bank.payment_link && (
                            <a
                              href={bank.payment_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline font-medium"
                            >
                              Click here to pay via KHQR
                            </a>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">
                          No QR code available
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No banking information available
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ),
    },
    {
      label: "Location",
      value: "location",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>
              <MapPin className="h-5 w-5 inline mr-2" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Address Line 1
                  </p>
                  <p className="font-medium">{supplier.address_line1 || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Address Line 2
                  </p>
                  <p className="font-medium">{supplier.address_line2 || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Village</p>
                  <p className="font-medium">{supplier.village || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Commune</p>
                  <p className="font-medium">{supplier.commune || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{supplier.district || "-"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{supplier.city || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Province</p>
                  <p className="font-medium">{supplier.province || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Postal Code</p>
                  <p className="font-medium">{supplier.postal_code || "-"}</p>
                </div>

                {(supplier.latitude || supplier.longitude) && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Latitude</p>
                      <p className="font-medium">{supplier.latitude || "-"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Longitude</p>
                      <p className="font-medium">{supplier.longitude || "-"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="mt-6">
      {/* <UnderlineTabs
        name="supplier-details"
        tabs={tabs}
        defaultValue="general"
      /> */}

      <ReusableTabs
        name="supplier-details"
        tabs={tabs}
        defaultValue="general"
      />
    </div>
  );
}
