import { useNavigate } from "react-router-dom";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";
import { useDeleteWarehouse } from "@/api/warehouses/warehouses.mutation";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { HorizontalImageScroll } from "@/components/reusable/partials/horizontal-image-scroll";
import { OpenStreetMap } from "@/components/reusable/partials/openstreet-map";
import { formatDate } from "@/utils/date-format";
import { Text } from "@/components/ui/text/app-text";
import { IconBadge } from "@/components/ui/icons-badge";
import { Separator } from "@/components/ui/separator";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import { InfoRow } from "./info-row";

interface ViewWarehouseFormProps {
  warehouseId: string;
}

export const ViewWarehouseForm = ({ warehouseId }: ViewWarehouseFormProps) => {
  const navigate = useNavigate();
  const {
    data: warehouse,
    isLoading,
    isFetching,
    isError,
  } = useSingleWarehouse(warehouseId);
  const deleteMutation = useDeleteWarehouse();

  const handleDelete = () => {
    deleteMutation.mutate(warehouseId, {
      onSuccess: () => navigate("/warehouses"),
    });
  };

  if (isLoading || isFetching)
    return <DataCardLoading text="Loading warehouse details..." />;
  if (isError) return <UnexpectedError kind="fetch" homeTo="/warehouses" />;
  if (!warehouse) return <DataCardEmpty emptyText="Warehouse not found." />;

  const hasCoordinates = !!(warehouse.latitude && warehouse.longitude);

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 w-full py-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2"></div>
          <Text.TitleLarge className="text-3xl font-bold tracking-tight">
            {warehouse.warehouse_name}
          </Text.TitleLarge>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <IconBadge label="address" size={14} />
            <span className="text-sm">{warehouse.warehouse_address}</span>
          </div>
        </div>

        <HeaderActionButtons
          editPath={`/warehouses/update/${warehouseId}`}
          showEdit={true}
          showDelete={true}
          onDelete={handleDelete}
          deleteHeading="Delete Warehouse"
          deleteSubheading={`Are you sure you want to delete "${warehouse.warehouse_name}"? This action cannot be undone.`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gallery & Description */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-muted/30">
              <Text.TitleMedium>Warehouse Images</Text.TitleMedium>
            </div>
            <div className="p-6">
              <HorizontalImageScroll
                images={warehouse.images}
                imageWidth="500px"
                imageHeight="340px"
                gap="1.5rem"
                emptyMessage="No images available"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <Text.TitleMedium className="mb-4">Description</Text.TitleMedium>
            <p className="text-muted-foreground leading-relaxed">
              {warehouse.warehouse_description ||
                "No description provided for this location."}
            </p>
          </div>
        </div>

        {/* Right Column: Management & Location */}
        <div className="lg:col-span-4 space-y-6">
          {/* Management Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <Text.TitleMedium className="mb-6">Management</Text.TitleMedium>

            <div className="space-y-6">
              <InfoRow
                label="Warehouse Manager"
                value={warehouse.warehouse_manager}
                icon={<IconBadge label="supplier" variant="info" />}
              />

              <InfoRow
                label="Contact Number"
                value={warehouse.warehouse_manager_contact}
                icon={<IconBadge label="phone" />}
              />
              <InfoRow
                label="Email Address"
                value={warehouse.warehouse_manager_email}
                icon={<IconBadge label="email" />}
              />
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Last Updated
                </span>
                <span className="text-sm font-medium">
                  {formatDate(warehouse.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <Text.TitleMedium className="mb-4">Location</Text.TitleMedium>
            {hasCoordinates ? (
              <OpenStreetMap
                markers={[
                  {
                    id: warehouseId,
                    lat: warehouse.latitude!,
                    lng: warehouse.longitude!,
                    title: warehouse.warehouse_name,
                    description: warehouse.warehouse_address,
                  },
                ]}
                height={220}
              />
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-[220px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground font-medium mb-1">
                    No Location Set
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    No coordinates have been configured.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
