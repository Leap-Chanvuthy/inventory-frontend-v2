import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { HorizontalImageScroll } from "@/components/reusable/partials/horizontal-image-scroll";
import { formatDate } from "@/utils/date-format";

interface ViewWarehouseFormProps {
  warehouseId: string;
}

export const ViewWarehouseForm = ({ warehouseId }: ViewWarehouseFormProps) => {
  const {
    data: warehouse,
    isLoading,
    isError,
  } = useSingleWarehouse(warehouseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading warehouse...</p>
      </div>
    );
  }

  if (isError || !warehouse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load warehouse details</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full my-5 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {warehouse.warehouse_name}
          </h1>

          <HeaderActionButtons
            editPath={`/warehouses/update/${warehouseId}`}
            showEdit={true}
            showDelete={true}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Warehouse Images */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Warehouse Images
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {warehouse.warehouse_address}
            </p>
            <HorizontalImageScroll
              images={warehouse.images}
              imageWidth="450px"
              imageHeight="300px"
              gap="1.5rem"
              emptyMessage="No images available"
            />
          </div>

          {/* Warehouse Information */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Warehouse Information
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Warehouse Name */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Warehouse Name:
                </p>
                <p className="text-base sm:text-lg font-semibold break-words">
                  {warehouse.warehouse_name}
                </p>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Address:
                </p>
                <p className="text-sm sm:text-base break-words">
                  {warehouse.warehouse_address}
                </p>
                {warehouse.latitude && warehouse.longitude && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Coordinates: {warehouse.latitude}, {warehouse.longitude}
                  </p>
                )}
              </div>

              {/* Capacity */}
              {warehouse.capacity_units && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Capacity:
                    </p>
                    <p className="text-sm sm:text-base font-medium">
                      {warehouse.capacity_percentage}% (
                      {warehouse.capacity_units}m³)
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 sm:h-2.5">
                    <div
                      className="bg-primary h-2 sm:h-2.5 rounded-full transition-all"
                      style={{ width: `${warehouse.capacity_percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Contact Person */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Contact Person:
                </p>
                <p className="text-base sm:text-lg font-semibold break-words">
                  {warehouse.warehouse_manager} (Manager)
                </p>
                {warehouse.warehouse_manager_contact && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-all">
                    Phone: {warehouse.warehouse_manager_contact}
                  </p>
                )}
                {warehouse.warehouse_manager_email && (
                  <p className="text-xs sm:text-sm text-muted-foreground break-all">
                    Email: {warehouse.warehouse_manager_email}
                  </p>
                )}
              </div>

              {/* Description */}
              {warehouse.warehouse_description && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Description:
                  </p>
                  <p className="text-sm sm:text-base break-words">
                    {warehouse.warehouse_description}
                  </p>
                </div>
              )}

              {/* Last Updated */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Last Updated:
                </p>
                <p className="text-sm sm:text-base font-medium">
                  {formatDate(warehouse.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
