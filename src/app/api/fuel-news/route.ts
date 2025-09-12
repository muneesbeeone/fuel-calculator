import { NextResponse } from "next/server";

// Fetch fuel-related news using Google News RSS (public)
export async function GET() {
  // Query terms focused on Indian fuel prices
  const q = encodeURIComponent(
    "India petrol diesel CNG fuel price OR oil marketing companies"
  );
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ items: [] });
    const xml = await res.text();
    // Very light RSS parse without extra deps
    const itemRegex = /<item>[\s\S]*?<\/item>/g;
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i;
    const linkRegex = /<link>(.*?)<\/link>/i;
    const dateRegex = /<pubDate>(.*?)<\/pubDate>/i;
    const items: Array<{ title: string; link: string; pubDate?: string }> = [];
    const matches = xml.match(itemRegex) || [];
    for (const itm of matches.slice(0, 10)) {
      const tMatch = itm.match(titleRegex);
      const lMatch = itm.match(linkRegex);
      const dMatch = itm.match(dateRegex);
      const title = (tMatch?.[1] || tMatch?.[2] || "").replace(/\s+/g, " ").trim();
      const link = (lMatch?.[1] || "").trim();
      const pubDate = dMatch?.[1];
      if (title && link) items.push({ title, link, pubDate });
    }
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ items: [] });
  }
}


