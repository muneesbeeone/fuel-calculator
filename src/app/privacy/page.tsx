export const metadata = {
  title: "Privacy Policy | Fuel Calculator India",
  description: "Privacy policy for Fuel Calculator India.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-8">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="mt-3 text-sm leading-7 opacity-80">
        We respect your privacy. This app uses the browser's geolocation API (with your permission) only to
        detect your approximate city and show relevant fuel information. Location data is not stored on our
        servers. We do not collect personally identifiable information.
      </p>
      <h2 className="mt-6 text-lg font-medium">What we collect</h2>
      <ul className="mt-2 list-disc pl-5 text-sm leading-7">
        <li>Approximate location for city detection (processed on-device and via reverse geocoding API).</li>
        <li>Anonymous usage logs for performance and error diagnostics.</li>
      </ul>
      <h2 className="mt-6 text-lg font-medium">Third‑party services</h2>
      <p className="mt-2 text-sm leading-7">
        We use OpenStreetMap Nominatim for reverse geocoding and Overpass API for nearby stations. Your
        browser connects to these services via our server endpoints.
      </p>
      <h2 className="mt-6 text-lg font-medium">Cookies and storage</h2>
      <p className="mt-2 text-sm leading-7">
        We store your calculator settings locally in your browser (localStorage) to improve your experience.
        You can clear this data anytime from your browser settings.
      </p>
      <h2 className="mt-6 text-lg font-medium">Contact</h2>
      <p className="mt-2 text-sm leading-7">
        For any privacy questions, please contact us at example@example.com.
      </p>
      <p className="mt-8 text-xs opacity-70">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}


