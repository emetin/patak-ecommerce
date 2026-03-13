import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Assistant } from "next/font/google";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-assistant",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.pataktextile.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Patak Textile",
    template: "%s | Patak Textile",
  },
  description:
    "Premium hospitality textile collections, hotel bedding, towels, bathrobes and curated textile solutions by Patak Textile.",
  keywords: [
    "Patak Textile",
    "hospitality textiles",
    "hotel bedding",
    "hotel towels",
    "bathrobes",
    "luxury textile",
    "hotel linen supplier",
    "hospitality bedding",
    "resort textiles",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Patak Textile",
    description:
      "Premium hospitality textile collections, hotel bedding, towels, bathrobes and curated textile solutions by Patak Textile.",
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
      "Premium hospitality textile collections, hotel bedding, towels, bathrobes and curated textile solutions by Patak Textile.",
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
          <div className="site-topbar">
            <div className="container site-topbar__inner">
              <div className="site-topbar__left">
                <span>customerservice@globaltexusa.com</span>
                <span>+90 (258) 408 47 57</span>
              </div>

              <div className="site-topbar__right">
                <span>Premium Turkish Cotton Hotel Textiles</span>
              </div>
            </div>
          </div>

          <header className="site-header">
            <div className="container site-header__inner">
              <Link href="/" className="site-logo" aria-label="Patak Textile Home">
                <span className="site-logo__eyebrow">Trusted by Hotels & Residences</span>
                <span className="site-logo__title">Patak Textile</span>
              </Link>

              <nav className="site-nav" aria-label="Main navigation">
                <Link href="/">Home</Link>
                <Link href="/about-us">About Us</Link>
                <Link href="/collections">Collections</Link>
                <Link href="/products">Products</Link>
                <Link href="/our-brands">Our Brands</Link>
                <Link href="/contact-us">Contact Us</Link>
                <Link href="/faq">FAQ</Link>
              </nav>

              <div className="site-header__actions">
                <Link href="/collections" className="button-link btn-accent">
                  Explore Collections
                </Link>
              </div>
            </div>
          </header>

          <main className="site-main">{children}</main>

          <footer className="site-footer">
            <div className="container site-footer__top">
              <div className="site-footer__grid">
                <div className="site-footer__brand">
                  <img
                    src="https://www.pataktextile.com/cdn/shop/files/PATAK_LOGO_BEYAZ-01_170x.png?v=1716291308"
                    alt="Patak Textile"
                  />
                  <p>
                    Premium hospitality textile solutions for hotels, residences and
                    refined accommodation projects with a cleaner and more trusted
                    presentation.
                  </p>

                  <div className="site-footer__meta">
                    <span>Phone: +90 (258) 408 47 57</span>
                    <span>
                      Address: Selcukbey Mah. Evora Houses, C1 Block 9/A Floor:17 No:156,
                      Merkezefendi / Denizli / Türkiye
                    </span>
                  </div>
                </div>

                <div className="site-footer__column">
                  <h4>Quick Links</h4>
                  <div className="site-footer__links">
                    <Link href="/about-us">About Us</Link>
                    <Link href="/services">Services</Link>
                    <Link href="/careers">Careers</Link>
                    <Link href="/press-release">Press Release</Link>
                    <Link href="/policies">Policies</Link>
                  </div>
                </div>

                <div className="site-footer__column">
                  <h4>Explore</h4>
                  <div className="site-footer__links">
                    <Link href="/collections">Collections</Link>
                    <Link href="/products">Products</Link>
                    <Link href="/blog">Blog</Link>
                    <Link href="/our-ceo">Our CEO</Link>
                    <Link href="/contact-us">Contact Us</Link>
                  </div>
                </div>

                <div className="site-footer__newsletter">
                  <h4>Subscribe to our newsletter</h4>
                  <p>Be the first to know about new collections and selected updates.</p>

                  <form className="site-footer__newsletter-form">
                    <input type="email" placeholder="Email" />
                    <button type="submit">Submit</button>
                  </form>
                </div>
              </div>
            </div>

            <div className="container site-footer__bottom">
              © 2026 Patak Textile. All Rights Reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}