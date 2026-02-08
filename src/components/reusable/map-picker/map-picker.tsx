import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { MapSearch } from "./map-search";
import { MapPin } from "lucide-react";

function LocationPicker({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({
  label,
  defaultPosition = [11.5564, 104.9282],
  onChange,
}: {
  label?: string;
  defaultPosition?: [number, number];
  onChange?: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  const update = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onChange?.(lat, lng);
  };

  const hasChanged =
    position[0] !== defaultPosition[0] || position[1] !== defaultPosition[1];

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          {label}
        </label>
      )}

      <div className="border rounded-lg overflow-hidden shadow-sm isolate">
        <div className="relative overflow-hidden">
          <MapContainer
            center={position}
            zoom={13}
            className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full"
            attributionControl={false}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MapController lat={position[0]} lng={position[1]} />

            <LocationPicker onPick={update} />

            <Marker position={position} />
          </MapContainer>

          <MapSearch
            onSelect={(lat, lng) => {
              update(lat, lng);
            }}
          />

          {/* Coordinates overlay */}
          {hasChanged && (
            <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-md px-3 py-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-[11px] font-mono text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {position[0].toFixed(6)}
                </span>
                ,{" "}
                <span className="font-semibold text-foreground">
                  {position[1].toFixed(6)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Click on the map or search to pick a location.
      </p>
    </div>
  );
}

export function MapController({
  lat,
  lng,
  zoom = 15,
}: {
  lat: number;
  lng: number;
  zoom?: number;
}) {
  const map = useMap();
  const prevRef = useRef({ lat, lng });

  useEffect(() => {
    if (prevRef.current.lat !== lat || prevRef.current.lng !== lng) {
      map.setView([lat, lng], zoom, { animate: true });
      prevRef.current = { lat, lng };
    }
  }, [lat, lng, zoom, map]);

  return null;
}
