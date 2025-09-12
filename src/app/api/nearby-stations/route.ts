import { NextRequest, NextResponse } from "next/server";

// Fetch nearby fuel stations using OpenStreetMap Overpass API
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const radius = Number(searchParams.get("radius")) || 3000; // in meters

  if (!isFinite(lat) || !isFinite(lon)) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  // Overpass QL to find amenities=fuel within radius
  const query = `[
    out: json
  ];
  node["amenity"="fuel"](around:${radius},${lat},${lon});
  out tags center;`;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "fuel-calculator/1.0 (contact: example@example.com)",
      },
      body: new URLSearchParams({ data: query }).toString(),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Overpass error" }, { status: 502 });
    }
    const data = await res.json();
    const elements = Array.isArray(data?.elements) ? data.elements : [];
    const items = elements.map((el: any) => ({
      id: el.id,
      name: el.tags?.name || "Fuel Station",
      brand: el.tags?.brand,
      operator: el.tags?.operator,
      lat: el.lat ?? el.center?.lat,
      lon: el.lon ?? el.center?.lon,
      tags: el.tags || {},
    }));
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
  }
}


