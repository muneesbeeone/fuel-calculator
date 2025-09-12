import { notFound } from "next/navigation";
import { listCities, findCityPrice } from "@/lib/fuelPrices";
import Link from "next/link";

export async function generateStaticParams() {
  return listCities().map((c) => ({ city: c.city.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: { city: string } }) {
  const cityName = params.city.replace(/-/g, " ");
  const info = findCityPrice(cityName);
  const title = info ? `${info.city}${info.state ? ", " + info.state : ""} Fuel Prices` : `Fuel Prices`;
  return { title: `${title} | Fuel Calculator India`, description: `Current fuel prices and trip cost estimation for ${info?.city || cityName}.` };
}

export default function CityPricesPage({ params }: { params: { city: string } }) {
  const cityName = params.city.replace(/-/g, " ");
  const info = findCityPrice(cityName);
  if (!info) return notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-8">
      <h1 className="text-2xl font-semibold">{info.city}{info.state ? `, ${info.state}` : ""} Fuel Prices</h1>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        {Object.entries(info.prices).map(([k, v]) => (
          <div key={k} className="rounded-lg border border-black/10 dark:border-white/15 p-3">
            <p className="font-medium">{k}</p>
            <p>₹ {v.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs opacity-70">Updated: {info.updatedAt}. Prices are indicative.</p>
      <p className="mt-6 text-sm">Use the calculator on the home page to estimate your trip cost with these prices.</p>
      <p className="mt-4 text-sm"><Link className="underline" href="/">Go to calculator</Link></p>
    </div>
  );
}


