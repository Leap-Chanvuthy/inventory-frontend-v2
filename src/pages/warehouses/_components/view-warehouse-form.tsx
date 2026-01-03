import { useNavigate } from "react-router-dom";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { MultipleImageCard } from "@/components/reusable/partials/multiple-image-card";
import { formatDate } from "@/utils/date-format";

interface ViewWarehouseFormProps {
  warehouseId: string;
}

export const ViewWarehouseForm = ({ warehouseId }: ViewWarehouseFormProps) => {
  const navigate = useNavigate();
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
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold truncate">
            {warehouse.warehouse_name}
          </h1>
          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2 bg-primary sm:size-default"
              onClick={() => navigate(`/warehouses/update/${warehouseId}`)}
            >
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2 sm:size-default"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Warehouse Images */}
          <MultipleImageCard
            images={warehouse.images}
            title="Warehouse Images"
            description={warehouse.warehouse_address}
          />

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
