import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { MapSearch } from "./map-search";

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

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold">{label}</label>}

      <div className="relative border rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "400px" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Better search */}
          <MapSearch
            onSelect={(lat, lng) => {
              update(lat, lng);
            }}
          />

          <MapController lat={position[0]} lng={position[1]} />

          <LocationPicker onPick={update} />

          <Marker position={position} />
        </MapContainer>
      </div>
    </div>
  );
}

import { useMap } from "react-leaflet";

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

  map.setView([lat, lng], zoom, { animate: true });
  return null;
}
