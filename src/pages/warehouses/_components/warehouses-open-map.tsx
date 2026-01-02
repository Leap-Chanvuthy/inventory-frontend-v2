import { WarehousesMap } from "@/components/reusable/partials/openstreet-map";
import { useWarehouses } from "@/api/warehouses/warehouses.query";

interface WarehousesOpenMapProps {
  totalWarehouses: number;
}

export default function WarehousesOpenMap({
  totalWarehouses,
}: WarehousesOpenMapProps) {
  const { data, isLoading, isError } = useWarehouses({
    per_page: totalWarehouses,
  });

  const warehouses = data?.data || [];

  if (isError) {
    return (
      <div className="mb-6 mt-8 mx-6">
        <div className="flex items-center justify-center h-[500px] border rounded-lg bg-muted/10">
          <p className="text-red-500">Failed to load warehouse locations</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-6 mt-8 mx-6">
        <div className="flex items-center justify-center h-[500px] border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 mt-8 mx-6">
      <WarehousesMap
        warehouses={warehouses}
        title="Warehouse Locations"
        subtitle="View all active warehouse sites on the map."
      />
    </div>
  );
}
