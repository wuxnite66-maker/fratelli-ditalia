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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="grain hungry-warm">{children}</body>
    </html>
  );
}
