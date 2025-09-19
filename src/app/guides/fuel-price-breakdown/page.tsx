import AdSense from "@/components/AdSense";

export const metadata = {
  title: "Fuel Price Breakdown in India | Fuel Calculator India",
  description: "Understand how petrol and diesel prices are built up in India.",
};

export default function BreakdownGuide() {
  return (
    <article>
      <h1 className="text-2xl font-semibold">Fuel price breakdown in India</h1>
      <ol className="mt-3 list-decimal pl-5 text-sm leading-7 space-y-1">
        <li>Base fuel price (refinery/import parity)</li>
        <li>Central excise duty</li>
        <li>Dealer commission</li>
        <li>State VAT and local levies</li>
        <li>Freight and logistics</li>
      </ol>
      <p className="mt-3 text-sm leading-7 opacity-80">Shares vary by state and change over time with policy and crude prices.</p>
      <div className="mt-6 flex justify-center">
          <AdSense
            slot="9783500294"
            className="max-w-728px w-full"
            adType="banner"
          />
        </div>
    </article>
  );
}


