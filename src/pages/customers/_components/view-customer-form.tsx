import { useSingleCustomer } from "@/api/customers/customer.query";
import { useParams, useNavigate } from "react-router-dom";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { ViewCustomerTabs } from "./view-customer-tabs";
import { Text } from "@/components/ui/text/app-text";
import { useDeleteCustomer } from "@/api/customers/customer.mutation";
import {
  CustomerCategoryBadge,
  CustomerStatusBadge,
} from "../utils/customer-status";
import { IconBadge } from "@/components/ui/icons-badge";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";

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
        onSuccess: () => {
          navigate("/customer");
        },
      });
    }
  };

  if (isLoading || isFetching) {
    return <DataCardLoading text="Loading customer details..." />;
  }

  if (isError) {
    return <UnexpectedError kind="fetch" homeTo="/customers" />;
  }

  if (!data?.data) {
    return <DataCardEmpty emptyText="Customer not found." />;
  }

  const customer = data.data;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Text.TitleLarge className="mb-2">{customer.fullname}</Text.TitleLarge>

        <HeaderActionButtons
          editPath={`/customer/update/${customer.id}`}
          showEdit={true}
          showDelete={true}
          onDelete={handleDelete}
          deleteHeading="Delete This Customer"
          deleteSubheading="Are you sure want to delete this customer? This action cannot be undone."
        />
      </div>

      <div className="rounded-2xl shadow-sm border max-w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Text.TitleLarge className="mb-2">
              Customer Information
            </Text.TitleLarge>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {/* Customer Profile Image */}
          <div className="flex justify-start mb-6">
            <img
              src={
                customer.image ||
                "https://api.dicebear.com/9.x/adventurer/svg?seed=default"
              }
              alt={customer.fullname}
              className="h-24 w-24 rounded-full border-4 border-purple-200 dark:border-purple-800 object-cover shadow-lg"
            />
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="code" variant="warning" />
                  Customer Code
                </p>
                <p className="font-medium">{customer.customer_code}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="name" variant="info" />
                  Full Name
                </p>
                <p className="font-medium">{customer.fullname}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="email" variant="info" />
                  Email
                </p>
                <a
                  href={`mailto:${customer.email_address}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {customer.email_address || "-"}
                </a>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="phone" variant="success" />
                  Phone
                </p>
                <a
                  href={`tel:${customer.phone_number}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {customer.phone_number || "-"}
                </a>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="status" variant="success" />
                  Status
                </p>
                <CustomerStatusBadge status={customer.customer_status} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="category" variant="warning" />
                  Category
                </p>
                <CustomerCategoryBadge
                  categoryName={customer.customer_category.category_name}
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="website" variant="indigo" />
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

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="address" variant="danger" />
                  Address
                </p>
                <p className="font-medium">
                  {customer.customer_address || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="address" variant="success" />
                  Google Map Link
                </p>
                {customer.google_map_link ? (
                  <a
                    href={customer.google_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    View on Google Maps
                  </a>
                ) : (
                  <p className="font-medium">-</p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <IconBadge label="created_date" />
                  Registration Date
                </p>
                <p className="font-medium">
                  {new Date(customer.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <ViewCustomerTabs customer={customer} />
    </div>
  );
}
