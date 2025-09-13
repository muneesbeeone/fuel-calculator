import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  // Use OpenStreetMap Nominatim for reverse geocoding. Respect usage policy with a custom UA.
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "fuel-calculator/1.0 (contact: example@example.com)",
      },
      // Prevent caching to ensure fresh data
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }
    const data = await res.json();
    const address = data?.address ?? {};
    const city: string | undefined = address.city || address.town || address.village || address.county;
    const state: string | undefined = address.state;
    const country: string | undefined = address.country;
    const displayName: string | undefined = data?.display_name;
    return NextResponse.json({ city, state, country, displayName });
  } catch {
    return NextResponse.json({ error: "Reverse geocode failed" }, { status: 500 });
  }
}


