import type { Metadata } from "next";
import { Hind_Siliguri, Baloo_Da_2 } from "next/font/google";
import "./globals.css";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-hind",
  display: "swap",
});

const baloo = Baloo_Da_2({
  subsets: ["bengali", "latin"],
  weight: ["600", "800"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "ছেলেবেলা স্কোর",
  description: "তোমার ছেলেবেলা কতটা ৯০-এর দশকের? টিক দাও, স্কোর দেখো!",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    title: "ছেলেবেলা স্কোর",
    description: "তোমার ছেলেবেলা কতটা ৯০-এর দশকের? টিক দাও, স্কোর দেখো!",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ছেলেবেলা স্কোর" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ছেলেবেলা স্কোর",
    description: "তোমার ছেলেবেলা কতটা ৯০-এর দশকের? টিক দাও, স্কোর দেখো!",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${hind.variable} ${baloo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
