import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "A Detail | Mobile Car Detailing in Costa Mesa & Orange County",
  description:
    "A Detail brings premium mobile car detailing to Costa Mesa and all of Orange County. We come to your home or office — no drop-off required.",
  openGraph: {
    siteName: "A Detail",
    title: "A Detail | Mobile Car Detailing in Costa Mesa & Orange County",
    description:
      "A Detail brings premium mobile car detailing to Costa Mesa and all of Orange County. We come to your home or office — no drop-off required.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
