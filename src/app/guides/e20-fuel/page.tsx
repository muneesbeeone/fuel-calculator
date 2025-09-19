import AdSense from "@/components/AdSense";

export const metadata = {
  title: "E20 Fuel Guide | Fuel Calculator India",
  description: "Understand E20 petrol in India: compatibility, advantages, and tips.",
};

export default function E20Guide() {
  return (
    <article>
      <h1 className="text-2xl font-semibold">E20 fuel: what you need to know</h1>
      <p className="mt-3 text-sm leading-7 opacity-80">
        E20 is petrol blended with 20% ethanol. It reduces fossil fuel use and emissions, but older vehicles may
        see slightly lower mileage. Always check your vehicle&apos;s E20 compatibility.
      </p>
      <h2 className="mt-6 text-lg font-medium">Compatibility</h2>
      <ul className="mt-2 list-disc pl-5 text-sm leading-7">
        <li>Newer vehicles (2023+) are often E20-ready. Look for an E20 sticker on the fuel lid/manual.</li>
        <li>Non-compliant engines should use regular petrol to avoid potential component wear.</li>
      </ul>
      <h2 className="mt-6 text-lg font-medium">Pros and cons</h2>
      <ul className="mt-2 list-disc pl-5 text-sm leading-7">
        <li><span className="font-medium">Pros</span>: lower crude import dependence, potentially lower pump price.</li>
        <li><span className="font-medium">Cons</span>: marginally lower mileage; limited availability in some cities.</li>
      </ul>
      <h2 className="mt-6 text-lg font-medium">Tips</h2>
      <ul className="mt-2 list-disc pl-5 text-sm leading-7">
        <li>For mixed trips, calculate with both Petrol and E20 to compare net cost per km.</li>
        <li>Maintain recommended tyre pressure and smooth driving to offset any mileage drop.</li>
      </ul>
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


