import { OpenStreetMap } from "@/components/reusable/partials/openstreet-map";
import { Warehouse } from "@/api/warehouses/warehouses.types";

interface WarehousesOpenMapProps {
  warehouses: Warehouse[];
}

export default function WarehousesOpenMap({
  warehouses,
}: WarehousesOpenMapProps) {
  return (
    <div className="mb-6 mt-8 mx-6">
      <OpenStreetMap
        title="Warehouse Locations"
        subtitle="View all active warehouse sites on the map."
        markers={warehouses.map(w => ({
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
