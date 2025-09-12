import type { Coordinates } from "./geolocation";

export type ReverseGeocodeResult = {
  city?: string;
  state?: string;
  country?: string;
  displayName?: string;
};

// Calls our internal API route to avoid exposing third-party endpoints directly from the client.
export async function reverseGeocode(coords: Coordinates): Promise<ReverseGeocodeResult> {
  const params = new URLSearchParams({ lat: String(coords.latitude), lon: String(coords.longitude) });
  // Try internal API first (works on serverful hosts). If unavailable (static export), fall back to public endpoint.
  try {
    const res = await fetch(`/api/reverse-geocode?${params.toString()}`, { headers: { accept: "application/json" }, cache: "no-store" });
    if (res.ok) return (await res.json()) as ReverseGeocodeResult;
  } catch {}

  // Fallback 1: direct Nominatim (may be rate limited)
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(coords.latitude));
    url.searchParams.set("lon", String(coords.longitude));
    url.searchParams.set("zoom", "10");
    url.searchParams.set("addressdetails", "1");
    const r = await fetch(url.toString(), { cache: "no-store" });
    if (r.ok) {
      const data = await r.json();
      const address = data?.address ?? {};
      return {
        city: address.city || address.town || address.village || address.county,
        state: address.state,
        country: address.country,
        displayName: data?.display_name,
      };
    }
  } catch {}

  // Fallback 2: proxy via allorigins (for CORS)
  const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10&addressdetails=1`
  )}`;
  const r2 = await fetch(proxied, { cache: "no-store" });
  if (!r2.ok) throw new Error("Failed to reverse geocode");
  const data = await r2.json();
  const address = data?.address ?? {};
  return {
    city: address.city || address.town || address.village || address.county,
    state: address.state,
    country: address.country,
    displayName: data?.display_name,
  };
}


