import type { Coordinates } from "./geolocation";

export type ReverseGeocodeResult = {
  city?: string;
  state?: string;
  country?: string;
  displayName?: string;
};

// Calls our internal API route to avoid exposing third-party endpoints directly from the client.
export async function reverseGeocode(coords: Coordinates): Promise<ReverseGeocodeResult> {
  const params = new URLSearchParams({
    lat: String(coords.latitude),
    lon: String(coords.longitude),
  });
  const res = await fetch(`/api/reverse-geocode?${params.toString()}`, {
    headers: { "accept": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to reverse geocode");
  }
  return (await res.json()) as ReverseGeocodeResult;
}


