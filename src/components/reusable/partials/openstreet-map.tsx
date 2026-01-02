import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import { Warehouse } from "@/api/warehouses/warehouses.types";
import { Link } from "react-router-dom";
import { useRef } from "react";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface WarehousesMapProps {
  warehouses: Warehouse[];
  title?: string;
  subtitle?: string;
}

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
export const WarehousesMap: React.FC<WarehousesMapProps> = ({
  warehouses,
  title,
  subtitle,
}) => {
  const popupCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter warehouses that have valid coordinates
  const validWarehouses = warehouses.filter(w => w.latitude && w.longitude);

  // First Display to make it center display in UI
  const center =
    validWarehouses.length > 0
      ? {
          lat:
            validWarehouses.reduce(
              (sum, w) => sum + parseFloat(w.latitude),
              0
            ) / validWarehouses.length,
          lng:
            validWarehouses.reduce(
              (sum, w) => sum + parseFloat(w.longitude),
              0
            ) / validWarehouses.length,
        }
      : { lat: 11.562108, lng: 104.888535 };

  return (
    <div className="w-full">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Map */}
      <div className="h-[500px] w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={7}
          className="h-full w-full"
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validWarehouses.map(warehouse => (
            <Marker
              key={warehouse.id}
              position={[
                parseFloat(warehouse.latitude),
                parseFloat(warehouse.longitude),
              ]}
              icon={defaultIcon}
            >
              {/* Tooltip - shows on hover */}
              <Tooltip direction="top" permanent={false}>
                <div className="text-sm font-semibold">
                  {warehouse.warehouse_name}
                </div>
              </Tooltip>

              {/* Popup - shows on click */}
              <Popup
                closeButton={true}
                eventHandlers={{
                  add: e => {
                    // Clear any existing timeout
                    if (popupCloseTimeoutRef.current) {
                      clearTimeout(popupCloseTimeoutRef.current);
                    }
                    // Set timeout to auto-close after 5 seconds
                    popupCloseTimeoutRef.current = setTimeout(() => {
                      e.target.close();
                    }, 5000);
                  },
                  remove: () => {
                    // Clear timeout when popup is manually closed
                    if (popupCloseTimeoutRef.current) {
                      clearTimeout(popupCloseTimeoutRef.current);
                      popupCloseTimeoutRef.current = null;
                    }
                  },
                }}
              >
                <div className="flex flex-col overflow-hidden">
                  {/* Header/Info Section */}
                  <div className="p-4 bg-white">
                    <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">
                      {warehouse.warehouse_name}
                    </h3>
                    <p className="text-[12px] text-slate-500 leading-relaxed mb-0">
                      {warehouse.warehouse_address}
                    </p>
                  </div>

                  {/* Action Buttons Section */}
                  <div className="px-4 pb-4 flex flex-col gap-2">
                    <Link
                      to={`/warehouses/view/${warehouse.id}`}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 !text-white hover:!text-white text-xs font-semibold rounded-lg text-center transition-all shadow-sm active:scale-[0.98] no-underline"
                    >
                      View Full Details
                    </Link>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${warehouse.latitude},${warehouse.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg text-center transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      Google Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
