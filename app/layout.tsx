import "./globals.css";
import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import JsonLd from "../components/seo/JsonLd";
import { SITE_SETTINGS } from "../lib/site-settings";

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
    default: SITE_SETTINGS.siteName,
    template: `%s | ${SITE_SETTINGS.siteName}`,
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
  icons: {
    icon: [
      {
        url: SITE_SETTINGS.favicon.icon,
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: SITE_SETTINGS.favicon.apple,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_SETTINGS.siteName,
    description:
      "Patak Textile presents premium textile collections for hospitality, residences and refined project-based environments through a stronger corporate catalog structure.",
    url: SITE_URL,
    siteName: SITE_SETTINGS.siteName,
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: SITE_SETTINGS.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_SETTINGS.siteName,
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
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_SETTINGS.siteName,
              url: SITE_URL,
              logo: SITE_SETTINGS.logo.header,
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: SITE_SETTINGS.siteName,
              url: SITE_URL,
              publisher: { "@id": `${SITE_URL}/#organization` },
              inLanguage: "en",
            },
          ]}
        />
        <div className="site-shell">
          <Header />

          <main className="site-main">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
