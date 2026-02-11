import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import { Link } from "react-router-dom";
import { useRef } from "react";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export interface MapMarker {
  id: string | number;
  lat: string | number;
  lng: string | number;
  title: string;
  description?: string;
  viewLink?: string;
}

interface OpenStreetMapProps {
  markers: MapMarker[];
  title?: string;
  subtitle?: string;
  height?: number;
  defaultCenter?: { lat: number; lng: number };
}

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  markers,
  title,
  subtitle,
  height = 500,
  defaultCenter = { lat: 11.562108, lng: 104.888535 },
}) => {
  const popupCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter markers with valid coordinates
  const validMarkers = markers.filter(m => {
    const lat = Number(m.lat);
    const lng = Number(m.lng);
    return (
      m.lat != null && m.lng != null &&
      !isNaN(lat) && !isNaN(lng) &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180
    );
  });

  const center =
    validMarkers.length > 0
      ? {
          lat:
            validMarkers.reduce((sum, m) => sum + Number(m.lat), 0) /
            validMarkers.length,
          lng:
            validMarkers.reduce((sum, m) => sum + Number(m.lng), 0) /
            validMarkers.length,
        }
      : defaultCenter;

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div
        className="w-full rounded-lg overflow-hidden border isolate"
        style={{ height }}
      >
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

          {validMarkers.map(marker => (
            <Marker
              key={marker.id}
              position={[Number(marker.lat), Number(marker.lng)]}
              icon={defaultIcon}
            >
              <Tooltip direction="top">
                <div className="text-sm font-semibold">{marker.title}</div>
              </Tooltip>

              <Popup
                eventHandlers={{
                  add: e => {
                    if (popupCloseTimeoutRef.current) {
                      clearTimeout(popupCloseTimeoutRef.current);
                    }
                    popupCloseTimeoutRef.current = setTimeout(() => {
                      e.target.close();
                    }, 5000);
                  },
                  remove: () => {
                    if (popupCloseTimeoutRef.current) {
                      clearTimeout(popupCloseTimeoutRef.current);
                      popupCloseTimeoutRef.current = null;
                    }
                  },
                }}
              >
                <div className="flex flex-col">
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900">{marker.title}</h3>
                    {marker.description && (
                      <p className="text-xs text-slate-500">
                        {marker.description}
                      </p>
                    )}
                  </div>

                  <div className="px-4 pb-4 flex flex-col gap-2">
                    {marker.viewLink && (
                      <Link
                        to={marker.viewLink}
                        className="w-full py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg text-center"
                      >
                        View Details
                      </Link>
                    )}

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${marker.lat},${marker.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-slate-100 text-xs font-semibold rounded-lg text-center"
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
