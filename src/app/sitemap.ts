import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com";
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/guides/e20-fuel`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/guides/save-fuel`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/guides/fuel-price-breakdown`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Add city price pages
  try {
    const { listCities } = await import("@/lib/fuelPrices");
    const cities = listCities();
    for (const c of cities) {
      const slug = c.city.toLowerCase();
      entries.push({ url: `${base}/prices/${slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 });
    }
  } catch {}

  return entries;
}


