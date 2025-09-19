import AdSense from "@/components/AdSense";

export default function GuidesIndex() {
  const items = [
    { href: "/guides/e20-fuel", title: "E20 fuel: what you need to know", desc: "Compatibility, pros/cons, and mileage impact." },
    { href: "/guides/save-fuel", title: "10 practical ways to save fuel", desc: "Tyres, driving style, maintenance, and planning." },
    { href: "/guides/fuel-price-breakdown", title: "Fuel price breakdown in India", desc: "Taxes, duties, freight, and dealer commission." },
  ];
  return (
    <div>
      <h1 className="text-2xl font-semibold">Guides</h1>
      <ul className="mt-4 space-y-3">
        {items.map((x) => (
          <li key={x.href} className="rounded-lg border border-black/10 dark:border-white/15 p-4">
            <a className="font-medium underline" href={x.href}>{x.title}</a>
            <p className="text-sm opacity-80 mt-1">{x.desc}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
          <AdSense
            slot="9783500294"
            className="max-w-728px w-full"
            adType="banner"
          />
        </div>
    </div>
  );
}


