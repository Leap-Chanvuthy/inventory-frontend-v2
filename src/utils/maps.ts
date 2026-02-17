interface OpenGoogleMapsOptions {
  latitude?: string | number | null;
  longitude?: string | number | null;
  address?: (string | null | undefined)[];
}

/**
 * Opens Google Maps in a new tab.
 * Uses coordinates if available, otherwise falls back to address fields.
 */
export function openGoogleMaps({
  latitude,
  longitude,
  address = [],
}: OpenGoogleMapsOptions): void {
  const q =
    latitude && longitude
      ? `${latitude},${longitude}`
      : address.filter(Boolean).join(", ");

  if (!q) return;

  window.open(
    `https://maps.google.com/maps?q=${encodeURIComponent(q)}`,
    "_blank",
  );
}
