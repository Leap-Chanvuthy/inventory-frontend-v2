import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, Globe } from "lucide-react";
import { Customer } from "@/api/customers/customer.types";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { Text } from "@/components/ui/text/app-text";

interface ViewCustomerTabsProps {
  customer: Customer;
}

export function ViewCustomerTabs({ customer }: ViewCustomerTabsProps) {
  const tabs = [
    {
      label: "Notes",
      value: "notes",
      content: (
        <div className="py-6 animate-in fade-in duration-300">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                Customer Note
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {customer.customer_note ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {customer.customer_note}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                  <div className="p-3 bg-muted rounded-full">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Text.Small color="muted">No notes for this customer.</Text.Small>
                </div>
              )}
            </CardContent>
          </Card>
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
                {/* Address details */}
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
                  <p className="text-sm font-medium leading-relaxed">
                    {customer.customer_address || "No address provided."}
                  </p>
                </div>

                {/* Map panel */}
                <div
                  className="relative m-4 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-10 text-center space-y-4 min-h-[220px]"
                  style={{
                    backgroundImage: "url('/assets/google_map.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/50 rounded-2xl" />
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
                    {customer.google_map_link ? (
                      <Button
                        size="sm"
                        asChild
                        className="bg-white text-black hover:bg-white/90"
                      >
                        <a
                          href={customer.google_map_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Google Maps
                        </a>
                      </Button>
                    ) : (
                      <Text.Small className="text-white/50 text-xs">
                        No map link available
                      </Text.Small>
                    )}
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
    <div className="pt-2">
      <ReusableTabs
        name="customer-details"
        tabs={tabs}
        defaultValue="notes"
      />
    </div>
  );
}
