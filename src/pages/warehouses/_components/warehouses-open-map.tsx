import { OpenStreetMap } from "@/components/reusable/partials/openstreet-map";
import { Warehouse } from "@/api/warehouses/warehouses.types";

interface WarehousesOpenMapProps {
  warehouses: Warehouse[];
}

export default function WarehousesOpenMap({
  warehouses,
}: WarehousesOpenMapProps) {
  // Filter warehouses with valid coordinates before mapping
  const warehousesWithCoordinates = warehouses.filter(
    w => w.latitude != null && w.longitude != null &&
         !isNaN(Number(w.latitude)) && !isNaN(Number(w.longitude))
  );

  return (
    <div className="mb-6 mt-8 mx-6">
      <OpenStreetMap
        title="Warehouse Locations"
        subtitle="View all active warehouse sites on the map."
        markers={warehousesWithCoordinates.map(w => ({
          id: w.id,
          lat: w.latitude,
          lng: w.longitude,
          title: w.warehouse_name,
          description: w.warehouse_address,
          viewLink: `/warehouses/view/${w.id}`,
        }))}
      />
    </div>
  );
}
