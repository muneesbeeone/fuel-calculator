export const metadata = {
  title: "Terms & Conditions | Fuel Calculator India",
  description: "Terms and conditions for using Fuel Calculator India.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-8">
      <h1 className="text-2xl font-semibold">Terms & Conditions</h1>
      <p className="mt-3 text-sm leading-7 opacity-80">
        By using this website, you agree to the following terms. If you do not agree, please do not use the
        service.
      </p>
      <h2 className="mt-6 text-lg font-medium">Use of the service</h2>
      <ul className="mt-2 list-disc pl-5 text-sm leading-7">
        <li>The calculator provides estimates only and may not reflect actual prices or costs.</li>
        <li>You are responsible for verifying any information before relying on it.</li>
        <li>We may update or discontinue features without notice.</li>
      </ul>
      <h2 className="mt-6 text-lg font-medium">No warranties</h2>
      <p className="mt-2 text-sm leading-7">
        The service is provided on an "as is" and "as available" basis without warranties of any kind.
      </p>
      <h2 className="mt-6 text-lg font-medium">Limitation of liability</h2>
      <p className="mt-2 text-sm leading-7">
        We are not liable for any direct or indirect damages arising from the use of the service.
      </p>
      <h2 className="mt-6 text-lg font-medium">Contact</h2>
      <p className="mt-2 text-sm leading-7">
        For questions about these terms, contact example@example.com.
      </p>
      <p className="mt-8 text-xs opacity-70">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}


