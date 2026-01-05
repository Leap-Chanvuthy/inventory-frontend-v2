import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder";

interface GeocoderControlProps {
  onSelect?: (lat: number, lng: number, name: string) => void;
}

export default function GeocoderControl({ onSelect }: GeocoderControlProps) {
  const map = useMap();

  useEffect(() => {
    const geocoder = (L.Control as any)
      .geocoder({
        defaultMarkGeocode: false,
      })
      .on("markgeocode", (e: any) => {
        const { center, name } = e.geocode;

        map.setView(center, 15);

        if (onSelect) {
          onSelect(center.lat, center.lng, name);
        }
      })
      .addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map, onSelect]);

  return null;
}
