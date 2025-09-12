import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "India Fuel Cost Calculator | Petrol, Diesel, CNG, E20 Prices",
  description:
    "Free India fuel cost calculator. Estimate trip fuel cost with city-wise petrol, diesel, CNG, E20, XP95, XP100, AutoLPG prices.",
  keywords: [
    "fuel cost calculator",
    "petrol price India",
    "diesel price India",
    "CNG price",
    "E20 fuel",
    "XP95",
    "XP100",
    "AutoLPG",
    "trip cost calculator",
    "city-wise fuel price",
    "fuel price today",
    "petrol price today",
    "diesel price today",
    "fuel price in delhi",
    "fuel price in mumbai",
    "fuel price in bengaluru",
    "india fuel calculator",
    "cost per km calculator",
  ],
  metadataBase: new URL("https://fuelcalculator.munees.co.in"),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } as any,
  },
  authors: [{ name: "Fuel Calculator India" }],
  creator: "Fuel Calculator India",
  publisher: "Fuel Calculator India",
  category: "Automotive",
  openGraph: {
    title: "India Fuel Cost Calculator",
    description:
      "Estimate trip fuel cost in India with city-wise petrol, diesel, CNG, E20 prices.",
    url: "https://fuelcalculator.munees.co.in/",
    siteName: "Fuel Calculator India",
    type: "website",
    images: [
      {
        url: "https://fuelcalculator.munees.co.in/opengraph-image",
        width: 1200,
        height: 630,
        alt: "India Fuel Cost Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "India Fuel Cost Calculator",
    description:
      "Estimate trip fuel cost in India with city-wise petrol, diesel, CNG, E20 prices.",
    images: ["https://fuelcalculator.munees.co.in/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        {/* Fuel icons sprite */}
        <div dangerouslySetInnerHTML={{ __html: require("fs").readFileSync("public/fuel-icons.svg", "utf8") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Fuel Calculator India",
            url: "https://fuelcalculator.munees.co.in/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://fuelcalculator.munees.co.in/search?q={query}",
              "query-input": "required name=query"
            }
          })
        }} />
        <Navbar />
        {children}
        <footer className="mt-10 border-t border-black/10 dark:border-white/15 text-sm">
          <div className="mx-auto max-w-3xl px-4 py-6 flex flex-wrap items-center justify-between gap-3">
            <p className="opacity-70">© {new Date().getFullYear()} Fuel Calculator India</p>
            <nav className="flex gap-4 flex-wrap">
              <Link className="hover:underline" href="/">Home</Link>
              <Link className="hover:underline" href="/guides">Guides</Link>
              <Link className="hover:underline" href="/prices/delhi">Prices</Link>
              <Link className="hover:underline" href="/privacy">Privacy</Link>
              <Link className="hover:underline" href="/terms">Terms</Link>
              <Link className="hover:underline" href="/sitemap.xml">Sitemap</Link>
              <a className="hover:underline" href="/api/fuel-news" target="_blank" rel="noreferrer">News API</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
