import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fratelli d'Italia · Caffè ~ Pizza · Wiener Neustadt",
  description:
    "Authentische italienische Pizza in Wiener Neustadt. Dünner Teig, ehrliche Zutaten, echter italienischer Schmäh. 4,8 ★ aus 512 Bewertungen. Friedrichsgasse 8.",
  keywords: [
    "Pizzeria Wiener Neustadt",
    "italienisches Restaurant",
    "Pizza",
    "Fratelli d'Italia",
  ],
  openGraph: {
    title: "Fratelli d'Italia · Caffè ~ Pizza",
    description:
      "Italienische Seele in Wiener Neustadt — Pizza, Pasta & Amore. 4,8 ★",
    locale: "de_AT",
    type: "website",
  },
};

// Google-Trust: strukturierte Restaurant-Daten (Rich Results in der Suche)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Fratelli d'Italia",
  servesCuisine: "Italienisch",
  priceRange: "€ 10–20",
  telephone: "+43 2622 42220",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Friedrichsgasse 8",
    postalCode: "2700",
    addressLocality: "Wiener Neustadt",
    addressCountry: "AT",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "512",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "11:15",
      closes: "14:15",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "17:45",
      closes: "22:30",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
