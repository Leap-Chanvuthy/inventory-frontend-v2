import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building2, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Supplier } from "@/api/suppliers/supplier.types";

interface ViewSupplierTapProps {
  supplier: Supplier;
}

export function ViewSupplierTap({ supplier }: ViewSupplierTapProps) {
  return (
    <Tabs defaultValue="general" className="w-full mt-6">
      <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start gap-1 mb-6">
        <TabsTrigger
          value="general"
          className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          General Info
        </TabsTrigger>
        <TabsTrigger
          value="banking"
          className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Banking Info
        </TabsTrigger>
        <TabsTrigger
          value="location"
          className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Location
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        {/* Company Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Building2 className="h-5 w-5 inline mr-2" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
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
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="banking">
        {/* Banking Info Section */}
        {supplier.banks && supplier.banks.length > 0 ? (
          supplier.banks.map((bank) => (
            <Card key={bank.id} className="mb-6">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Section - Banking Information */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Banking Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Details for direct bank transfers and KHQR payments.
                    </p>
                  </div>

                  {/* Middle Section - Bank Details */}
                  <div className="space-y-4">
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

                  {/* Right Section - KHQR Code */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <h4 className="text-base font-semibold text-center">
                      KHQR Code of Payment
                    </h4>
                    {bank.qr_code_image ? (
                      <>
                        <div className="border-2 rounded-lg p-3">
                          <img
                            src={bank.qr_code_image}
                            alt={`KHQR Code for ${bank.bank_name}`}
                            className="w-40 h-40 object-contain"
                          />
                        </div>
                        {bank.payment_link && (
                          <a
                            href={bank.payment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
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
      </TabsContent>

      <TabsContent value="location">
        {/* Location Section */}
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
                  <p className="font-medium">
                    {supplier.address_line1 || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Address Line 2
                  </p>
                  <p className="font-medium">
                    {supplier.address_line2 || "-"}
                  </p>
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
                      <p className="text-sm text-muted-foreground">
                        Latitude
                      </p>
                      <p className="font-medium">
                        {supplier.latitude || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Longitude
                      </p>
                      <p className="font-medium">
                        {supplier.longitude || "-"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
