"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBrowserLocation } from "@/lib/geolocation";
import { reverseGeocode } from "@/lib/reverseGeocode";
import { estimateTripCost, findCityPrice, listCities, type FuelType } from "@/lib/fuelPrices";

function CountUp({ value, prefix = "", className = "" }: { value?: number; prefix?: string; className?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === undefined) return;
    const start = display;
    const end = value;
    const duration = 400;
    const startTs = performance.now();
    let raf = 0;
    function step(ts: number) {
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <p className={className}>{`${prefix}${display.toFixed(2)}`}</p>;
}

type UiState = {
  locationLabel: string;
  city?: string;
  state?: string;
  country?: string;
};

export default function Home() {
  const [ui, setUi] = useState<UiState>({ locationLabel: "Detecting location..." });
  const [fuelType, setFuelType] = useState<FuelType>("Petrol");
  const [distanceKm, setDistanceKm] = useState<number>(100);
  const [mileage, setMileage] = useState<number>(15);
  const [roundTrip, setRoundTrip] = useState<boolean>(false);
  const [stations, setStations] = useState<Array<{ id: number; name: string; brand?: string; operator?: string; lat?: number; lon?: number }>>([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [news, setNews] = useState<Array<{ title: string; link: string; pubDate?: string }>>([]);

  const cityPrice = useMemo(() => findCityPrice(ui.city, ui.state), [ui.city, ui.state]);
  const cities = useMemo(() => listCities(), []);
  const [cityQuery, setCityQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const coords = await getBrowserLocation();
        const info = await reverseGeocode(coords);
        if (!isMounted) return;
        setUi({
          locationLabel: info.displayName || "Location detected",
          city: info.city,
          state: info.state,
          country: info.country,
        });
      } catch {
        if (!isMounted) return;
        setUi({ locationLabel: "Could not detect location" });
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch nearby stations (reusable)
  async function refreshStations() {
    try {
      setStationsLoading(true);
      const coords = await getBrowserLocation();
      // Query Overpass directly for nearby stations
      const query = `node["amenity"="fuel"](around:3000,${coords.latitude},${coords.longitude});out tags center;`;
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: new URLSearchParams({ data: query }).toString(),
      });
      const json = await res.json();
      const data = { items: (json.elements || []).map((el: { id: number; tags?: Record<string, string>; lat?: number; lon?: number; center?: { lat: number; lon: number } }) => ({ id: el.id, name: el.tags?.name || "Fuel Station", brand: el.tags?.brand, operator: el.tags?.operator, lat: el.lat ?? el.center?.lat, lon: el.lon ?? el.center?.lon })) };
      setStations(Array.isArray(data.items) ? data.items : []);
    } catch {
      setStations([]);
    } finally {
      setStationsLoading(false);
    }
  }

  useEffect(() => {
    refreshStations();
  }, []);

  const result = useMemo(() => {
    if (!cityPrice) return undefined;
    const totalDistance = roundTrip ? distanceKm * 2 : distanceKm;
    return estimateTripCost(totalDistance, mileage, fuelType, cityPrice);
  }, [distanceKm, mileage, fuelType, cityPrice, roundTrip]);

  function formatInr(n?: number): string {
    if (n === undefined) return "--";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
  }

  // Persist user inputs for convenience
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fuel-calc-settings");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.fuelType) setFuelType(s.fuelType);
        if (typeof s.distanceKm === "number") setDistanceKm(s.distanceKm);
        if (typeof s.mileage === "number") setMileage(s.mileage);
        if (typeof s.roundTrip === "boolean") setRoundTrip(s.roundTrip);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const payload = { fuelType, distanceKm, mileage, roundTrip };
      localStorage.setItem("fuel-calc-settings", JSON.stringify(payload));
    } catch {}
  }, [fuelType, distanceKm, mileage, roundTrip]);

  // Sync state to URL for sharing
  useEffect(() => {
    const params = new URLSearchParams();
    if (ui.city) params.set("city", ui.city);
    if (ui.state) params.set("state", ui.state);
    params.set("fuel", fuelType);
    params.set("d", String(distanceKm));
    params.set("m", String(mileage));
    params.set("rt", String(Number(roundTrip)));
    const url = `${location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [ui.city, ui.state, fuelType, distanceKm, mileage, roundTrip]);

  // Load state from URL on first mount
  useEffect(() => {
    try {
      const sp = new URLSearchParams(location.search);
      const f = sp.get("fuel") as FuelType | null;
      const d = Number(sp.get("d"));
      const m = Number(sp.get("m"));
      const rt = sp.get("rt");
      const c = sp.get("city");
      const s = sp.get("state");
      if (f) setFuelType(f);
      if (isFinite(d)) setDistanceKm(d);
      if (isFinite(m)) setMileage(m);
      if (rt !== null) setRoundTrip(rt === "1");
      if (c) setUi((prev) => ({ ...prev, city: c || undefined, state: s || undefined }));
    } catch {}
  }, []);

  // Load fuel-related news
  useEffect(() => {
    let ignore = false;
    async function loadNews() {
      try {
        // Query Google News RSS directly
        const q = encodeURIComponent("India petrol diesel CNG fuel price OR oil marketing companies");
        const url = `https://news.google.com/rss/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;
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
        if (!ignore) setNews(items);
      } catch {}
    }
    loadNews();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground bg-subtle water-bg">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl font-semibold"
        >
          <svg aria-hidden className="h-7 w-7 text-[var(--color-primary)]"><use href="#icon-pump"/></svg>
          India Fuel Cost Calculator
        </motion.h1>
        <p className="mt-2 text-sm opacity-80">{ui.locationLabel}</p>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <motion.div className="rounded-xl border border-black/10 dark:border-white/15 p-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
            <label className="block text-sm mb-2">City</label>
            <input
              list="city-list"
              placeholder={ui.city || "Type city name"}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              onBlur={() => {
                const chosen = cities.find((c) => c.city.toLowerCase() === cityQuery.trim().toLowerCase());
                if (chosen) {
                  setUi((prev) => ({ ...prev, city: chosen.city, state: chosen.state, locationLabel: `${chosen.city}, ${chosen.state ?? ""}`.trim() }));
                }
              }}
            />
            <datalist id="city-list">
              {cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.state ? `${c.city}, ${c.state}` : c.city}
                </option>
              ))}
            </datalist>

            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {(["Petrol", "Diesel", "CNG", "E20", "XP95", "XP100", "AutoLPG"] as FuelType[]).map((ft) => (
                <motion.button
                  key={ft}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`rounded-md border px-3 py-2 ${fuelType === ft ? "bg-foreground text-background" : "border-black/10 dark:border-white/15"}`}
                  onClick={() => setFuelType(ft)}
                >
                  {ft}
                </motion.button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm mb-1">Distance (km)</label>
              <input
                type="number"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
                value={distanceKm}
                min={0}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
              />
              <div className="mt-2 flex items-center gap-2 text-sm">
                <input id="rt" type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} />
                <label htmlFor="rt">Round trip</label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm mb-1">Mileage (km/l or km/kg)</label>
              <input
                type="number"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
                value={mileage}
                min={0}
                onChange={(e) => setMileage(Number(e.target.value))}
              />
            </div>
          </motion.div>

          <motion.div className="rounded-xl border border-black/10 dark:border-white/15 p-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.05 }}>
            <h2 className="flex items-center gap-2 text-lg font-medium">
              <svg aria-hidden className="h-5 w-5 text-[var(--color-secondary)]"><use href="#icon-leaf"/></svg>
              Estimated Cost
            </h2>
            {cityPrice ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm opacity-80">City prices updated: {cityPrice.updatedAt}</p>
                <p className="text-sm">Selected fuel: <span className="font-medium">{fuelType}</span></p>
                <p className="text-sm">Price per unit: {formatInr(cityPrice.prices[fuelType])}</p>
                <p className="text-sm">Distance: {roundTrip ? `${(distanceKm * 2).toLocaleString()} km (round trip)` : `${distanceKm.toLocaleString()} km`}</p>
                <p className="text-sm">Estimated fuel needed: {mileage > 0 ? (roundTrip ? (distanceKm * 2) / mileage : distanceKm / mileage).toFixed(2) : "--"} {fuelType === "CNG" || fuelType === "AutoLPG" ? "kg" : "litres"}</p>
                <div className="mt-4 rounded-lg bg-black/5 dark:bg-white/10 p-4">
                  <CountUp value={result?.cost} prefix="₹ " className="text-2xl font-semibold" />
                  <p className="text-sm opacity-80">{formatInr(result?.perKm)} per km</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm">City not in list. Select the nearest major city.</p>
            )}
          </motion.div>
        </div>

        {cityPrice && (
          <motion.div className="mt-8 rounded-xl border border-black/10 dark:border-white/15 p-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.1 }}>
            <h2 className="text-lg font-medium">{cityPrice.city}{cityPrice.state ? `, ${cityPrice.state}` : ""} Fuel Prices</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {Object.entries(cityPrice.prices).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-black/5 dark:bg-white/10 p-3">
                  <p className="font-medium">{k}</p>
                  <p>{formatInr(v)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div className="mt-8 rounded-xl border border-black/10 dark:border-white/15 p-4 hidden" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.15 }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Nearby Fuel Stations</h2>
            <div className="flex items-center gap-3">
              <button
                className="text-sm underline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {}
                }}
              >
                {copied ? "Link copied" : "Copy link"}
              </button>
            <button className="text-sm underline" onClick={refreshStations}>Refresh</button>
            </div>
          </div>
          {stationsLoading ? (
            <p className="mt-3 text-sm">Searching nearby stations…</p>
          ) : stations.length === 0 ? (
            <p className="mt-3 text-sm">No stations found within 3 km. Try moving closer to the city center.</p>
          ) : (
            <motion.ul className="mt-3 space-y-2 text-sm" layout>
              <AnimatePresence>
                {stations.slice(0, 10).map((s) => (
                  <motion.li
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="rounded-lg bg-black/5 dark:bg-white/10 p-3"
                  >
                    <p className="font-medium">{s.name}{s.brand ? ` (${s.brand})` : ""}</p>
                    <p className="opacity-80">{s.operator || "Operator unknown"}</p>
                    <a className="underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${s.lat},${s.lon}`}>
                      Open in Maps
                    </a>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </motion.div>

        <p className="mt-6 text-xs opacity-70">Prices are illustrative. Replace with live API for accuracy.</p>

        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold">About Indian Fuel Types</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">Common fuels</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li>Petrol (Gasoline)</li>
                <li>Diesel</li>
                <li>CNG and AutoLPG (where available)</li>
                <li>Premium petrols: XP95, XP100</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">What is E20?</h3>
              <p className="mt-2 text-sm leading-6">
                E20 is petrol with <strong>20% ethanol</strong>. Use it only in <strong>E20‑compliant</strong> or flex‑fuel vehicles. Older engines may
                see slightly lower mileage.
              </p>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">How we calculate cost</h3>
              <p className="mt-2 text-sm leading-6">
                <span className="font-medium">Formula</span>: distance ÷ mileage × city fuel price.
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li>Choose fuel type and city.</li>
                <li>Enter one‑way distance and mileage; toggle round trip if needed.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">Why prices vary by city</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li>State VAT and local levies</li>
                <li>Freight and dealer commission</li>
                <li>Crude price and INR–USD exchange rate</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-black/10 dark:border-white/15 p-4">
            <h3 className="text-base font-medium">Quick answers</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
              <li><span className="font-medium">Cheapest per km</span>: often CNG/AutoLPG, depending on availability and mileage.</li>
              <li><span className="font-medium">E20 availability</span>: expanding; check pump and vehicle compatibility.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold">Benefits, disadvantages and engine compatibility</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">Petrol</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li><span className="font-medium">Benefits</span>: Refined, quieter engines; wide availability.</li>
                <li><span className="font-medium">Disadvantages</span>: Lower mileage than diesel.</li>
                <li><span className="font-medium">Engines</span>: Spark‑ignition (SI). E20 requires E20‑rated components.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">Diesel</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li><span className="font-medium">Benefits</span>: Higher torque and mileage for long trips.</li>
                <li><span className="font-medium">Disadvantages</span>: Higher NVH; DPF care on short trips.</li>
                <li><span className="font-medium">Engines</span>: Compression‑ignition (CI) with turbo & after‑treatment.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">CNG</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li><span className="font-medium">Benefits</span>: Low running cost and emissions.</li>
                <li><span className="font-medium">Disadvantages</span>: Reduced boot space; slight power drop.</li>
                <li><span className="font-medium">Engines</span>: Bi‑fuel SI engines (Petrol/CNG) with factory or approved kits.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">AutoLPG</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li><span className="font-medium">Benefits</span>: Cleaner than petrol; good urban availability in some cities.</li>
                <li><span className="font-medium">Disadvantages</span>: Fewer stations than petrol/diesel; range anxiety.</li>
                <li><span className="font-medium">Engines</span>: SI engines with LPG kits (homologated).</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">E20 (20% ethanol petrol)</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li><span className="font-medium">Benefits</span>: Lower fossil fuel use; potential price advantage.</li>
                <li><span className="font-medium">Disadvantages</span>: Slightly lower mileage; not for non‑compliant vehicles.</li>
                <li><span className="font-medium">Engines</span>: E20‑compliant SI engines; check fuel cap/manual.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">Premium petrol (XP95/XP100)</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li><span className="font-medium">Benefits</span>: Helps high‑compression/turbo engines avoid knock.</li>
                <li><span className="font-medium">Disadvantages</span>: Costlier; limited gains on regular engines.</li>
                <li><span className="font-medium">Engines</span>: SI engines designed for higher octane (check manual).</li>
              </ul>
            </div>
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold">More about fuel pricing in India</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">What drives price changes?</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li>International crude benchmarks (Brent/WTI)</li>
                <li>INR–USD exchange rate</li>
                <li>Central excise duty and state VAT</li>
                <li>Freight, logistics, dealer commission</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">Improve your mileage</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
                <li>Keep tyres at recommended PSI</li>
                <li>Smooth throttle; avoid sudden braking</li>
                <li>Remove unnecessary weight/roof racks</li>
                <li>Service regularly; clean air filter, right oil grade</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">E20 compatibility</h3>
              <p className="mt-2 text-sm leading-6">Most new vehicles (2023+) are E20‑ready. Check your fuel lid/manual or manufacturer website.</p>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <h3 className="text-base font-medium">What’s in a litre price?</h3>
              <p className="mt-2 text-sm leading-6">Base fuel price + central excise + dealer commission + state VAT and local levies. Composition varies by state and over time.</p>
            </div>
          </div>

          <details className="mt-4 rounded-lg border border-black/10 dark:border-white/15 p-4">
            <summary className="cursor-pointer text-base font-medium">FAQs</summary>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6">
              <li><span className="font-medium">How often do prices change?</span> Depends on market conditions and OMC policies.</li>
              <li><span className="font-medium">Why is CNG priced in kg?</span> Energy content differs; vehicles report mileage in km/kg for CNG.</li>
              <li><span className="font-medium">Is premium petrol worth it?</span> Helps engines designed for higher octane; minimal gains otherwise.</li>
              <li><span className="font-medium">Why no official live API?</span> No free public API from OMCs; we use a maintainable city list.</li>
            </ul>
          </details>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How often do fuel prices change in India?",
                acceptedAnswer: { "@type": "Answer", text: "OMCs revise prices periodically; cadence depends on market conditions and regulations." }
              },
              {
                "@type": "Question",
                name: "Is E20 compatible with my vehicle?",
                acceptedAnswer: { "@type": "Answer", text: "Many new vehicles are E20-compliant; check your fuel lid/manual or the manufacturer website." }
              },
              {
                "@type": "Question",
                name: "How can I improve fuel mileage?",
                acceptedAnswer: { "@type": "Answer", text: "Maintain tyre pressure, smooth throttle, remove excess weight, and service regularly." }
              }
            ]
          })
        }} />

        {news.length > 0 && (
          <motion.div className="mt-10 rounded-xl border border-black/10 dark:border-white/15 p-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.2 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Fuel Price News</h2>
              <button className="text-sm underline" onClick={async () => {
                const res = await fetch("/api/fuel-news", { cache: "no-store" });
                const data = await res.json();
                setNews(data.items || []);
              }}>Refresh</button>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {news.map((n, i) => (
                <li key={i} className="rounded-lg bg-black/5 dark:bg-white/10 p-3">
                  <a className="font-medium underline" href={n.link} target="_blank" rel="noreferrer">{n.title}</a>
                  {n.pubDate && <p className="opacity-70">{new Date(n.pubDate).toLocaleString()}</p>}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "India Fuel Cost Calculator",
            description: "Estimate trip fuel cost with city-wise petrol, diesel, CNG, E20, XP95, XP100, AutoLPG prices.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
          })
        }} />
      </div>
    </div>
  );
}
