import "./globals.css";
import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-assistant",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.pataktextile.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Patak Textile",
    template: "%s | Patak Textile",
  },
  description:
    "Patak Textile presents premium textile collections for hospitality, residences and refined project-based environments through a stronger corporate catalog structure.",
  keywords: [
    "Patak Textile",
    "hospitality textiles",
    "hotel bedding",
    "hotel towels",
    "bathrobes",
    "textile collections",
    "hotel linen supplier",
    "corporate textile catalog",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Patak Textile",
    description:
      "Patak Textile presents premium textile collections for hospitality, residences and refined project-based environments through a stronger corporate catalog structure.",
    url: SITE_URL,
    siteName: "Patak Textile",
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Patak Textile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patak Textile",
    description:
      "Patak Textile presents premium textile collections for hospitality, residences and refined project-based environments through a stronger corporate catalog structure.",
    images: ["/og-default.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={assistant.variable}>
        <div className="site-shell">
          <Header />

          <main className="site-main">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}