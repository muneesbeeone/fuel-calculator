import AdSense from "@/components/AdSense";

export const metadata = {
  title: "Save Fuel: Practical Tips | Fuel Calculator India",
  description: "Actionable ways to improve mileage and cut fuel costs in India.",
};

export default function SaveFuelGuide() {
  const tips = [
    "Maintain tyre pressure as per manual",
    "Gentle throttle and steady speeds",
    "Plan routes; avoid peak congestion",
    "Remove roof racks and excess weight",
    "Service on time; clean air filter",
    "Use recommended engine oil grade",
  ];
  return (
    <article>
      <h1 className="text-2xl font-semibold">10 practical ways to save fuel</h1>
      <ul className="mt-3 list-disc pl-5 text-sm leading-7">
        {tips.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
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


