import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MapPin, Calendar } from "lucide-react";
import { Customer } from "@/api/customers/customer.types";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { Text } from "@/components/ui/text/app-text";

interface ViewCustomerTabsProps {
  customer: Customer;
}

export function ViewCustomerTabs({ customer }: ViewCustomerTabsProps) {
  const tabs = [
    {
      label: "General Info",
      value: "general",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>
              <FileText className="h-5 w-5 inline mr-2" />
              Customer Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Customer Note
              </p>
              <p className="font-medium whitespace-pre-wrap">
                {customer.customer_note || "No notes available"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created At</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <p className="font-medium">
                    {new Date(customer.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Last Updated
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <p className="font-medium">
                    {new Date(customer.updated_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Customer Address
                </p>
                <p className="font-medium">
                  {customer.customer_address || "-"}
                </p>
              </div>

              {/* {customer.google_map_link && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Google Map Location</p>
                  <a
                    href={customer.google_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                </div>
              )} */}

              {/* {customer.google_map_link && (
                <div className="mt-4">
                  <iframe
                    src={customer.google_map_link.replace(
                      "/maps/",
                      "/maps/embed?pb=",
                    )}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      label: "Contact Info",
      value: "contact",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>
              <Text.TitleSmall>Contact Details</Text.TitleSmall>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <a
                    href={`mailto:${customer.email_address}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {customer.email_address || "-"}
                  </a>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Phone Number
                  </p>
                  <a
                    href={`tel:${customer.phone_number}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {customer.phone_number || "-"}
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Social Media
                  </p>
                  {customer.social_media ? (
                    <a
                      href={customer.social_media}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {customer.social_media}
                    </a>
                  ) : (
                    <p className="font-medium">-</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="mt-6">
      <ReusableTabs
        name="customer-details"
        tabs={tabs}
        defaultValue="general"
      />
    </div>
  );
}
