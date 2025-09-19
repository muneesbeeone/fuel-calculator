import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

// Fonts
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

// SEO Metadata
export const metadata: Metadata = {
  title: "India Fuel Cost Calculator | Petrol, Diesel, CNG, E20 Prices",
  description:
    "Free India fuel cost calculator. Estimate trip fuel cost with city-wise petrol, diesel, CNG, E20, XP95, XP100, AutoLPG prices.",
  metadataBase: new URL("https://fuelcalculator.munees.co.in"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
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

// Layout Component
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        {/* SVG Sprite */}
        <div
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="icon-pump" viewBox="0 0 24 24">
    <path fill="currentColor" d="M4 3h9a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 3h5v3H6V6Zm0 5h5v7H6v-7Zm12-7a1 1 0 0 0-1 1v4a2 2 0 1 0 2 0V8h1v7a1 1 0 0 1-1 1h-1v2h1a3 3 0 0 0 3-3V7a2 2 0 0 0-2-2h-2Z"/>
  </symbol>
  <symbol id="icon-leaf" viewBox="0 0 24 24">
    <path fill="currentColor" d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75S7 14 17 14s11.25.25 11.25.25-.5-1.25-.5-3.25S17 8 17 8Z"/>
  </symbol>
</svg>`,
          }}
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Fuel Calculator India",
              url: "https://fuelcalculator.munees.co.in/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://fuelcalculator.munees.co.in/search?q={query}",
                "query-input": "required name=query",
              },
            }),
          }}
        />

        <Navbar />
        {children}

        <footer className="mt-10 border-t border-black/10 dark:border-white/15 text-sm">
          <div className="mx-auto max-w-3xl px-4 py-6 flex flex-wrap items-center justify-between gap-3">
            <p className="opacity-70">
              © {new Date().getFullYear()} Fuel Calculator India
            </p>
            <nav className="flex gap-4 flex-wrap">
              <Link className="hover:underline" href="/">
                Home
              </Link>
              <Link className="hover:underline" href="/guides">
                Guides
              </Link>
              <Link className="hover:underline" href="/prices/delhi">
                Prices
              </Link>
              <Link className="hover:underline" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:underline" href="/terms">
                Terms
              </Link>
              <Link className="hover:underline" href="/sitemap.xml">
                Sitemap
              </Link>
              <a
                className="hover:underline"
                href="/api/fuel-news"
                target="_blank"
                rel="noreferrer"
              >
                News API
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
