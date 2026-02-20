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
import { MapPin, LocateFixed, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

const DEFAULT_CENTER: [number, number] = [11.5564, 104.9282];

export default function MapPicker({
  label,
  defaultPosition,
  onChange,
}: {
  label?: string;
  defaultPosition?: [number, number];
  onChange?: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    defaultPosition ?? null,
  );

  // Sync when defaultPosition arrives asynchronously (e.g. update forms)
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (defaultPosition && !hasInitialized.current) {
      hasInitialized.current = true;
      setPosition(defaultPosition);
    }
  }, [defaultPosition]);

  const update = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onChange?.(lat, lng);
  };

  const mapCenter = position ?? DEFAULT_CENTER;

  // Current location
  const [locating, setLocating] = useState(false);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
        toast.success("Location found!");
      },
      (err) => {
        setLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            toast.error("Location permission denied. Please allow location access in your browser settings.");
            break;
          case err.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("Failed to get your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

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
            center={mapCenter}
            zoom={13}
            className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full"
            attributionControl={false}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {position && <MapController lat={position[0]} lng={position[1]} />}

            <LocationPicker onPick={update} />

            {position && <Marker position={position} />}
          </MapContainer>

          <MapSearch
            onSelect={(lat, lng) => {
              update(lat, lng);
            }}
          />

          {/* My Location button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="absolute top-2.5 right-2.5 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-md p-2 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Go to my current location"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4 text-primary" />
            )}
          </button>

          {/* Coordinates overlay */}
          {position && (
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
  const isFirstRender = useRef(true);
  const prevRef = useRef({ lat, lng });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      map.setView([lat, lng], zoom, { animate: true });
      prevRef.current = { lat, lng };
      return;
    }
    if (prevRef.current.lat !== lat || prevRef.current.lng !== lng) {
      map.setView([lat, lng], zoom, { animate: true });
      prevRef.current = { lat, lng };
    }
  }, [lat, lng, zoom, map]);

  return null;
}
