import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides | Fuel Calculator India",
  description: "Guides on fuel types, E20, mileage tips, and pricing in India.",
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-8">
      {children}
    </div>
  );
}


