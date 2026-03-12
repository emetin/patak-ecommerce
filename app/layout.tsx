import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Assistant } from "next/font/google";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  title: "Patak Textile",
  description:
    "Premium hospitality textile collections, hotel bedding, towels, bathrobes and curated textile solutions by Patak Textile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={assistant.variable}>
      <body>
        <div className="site-shell">
          <div className="topbar">
            <div className="container topbar-inner">
              <div className="topbar-left">
                <span>Premium Hospitality Textile Solutions</span>
                <span>Hotel • Residence • Resort • Spa</span>
              </div>
              <div className="topbar-right">
                <span>Trusted by Hotels & Residences</span>
              </div>
            </div>
          </div>

          <header className="site-header">
            <div className="container site-header-inner">
              <Link href="/" className="brand">
                <span className="brand-mark">
                  PATAK <span>TEXTILE</span>
                </span>
                <span className="brand-sub">
                  HOSPITALITY TEXTILE PRESENTATION
                </span>
              </Link>

              <nav className="nav">
                <Link href="/">Home</Link>
                <Link href="/about-us">About Us</Link>
                <Link href="/collections">Collections</Link>
                <Link href="/contact-us">Contact Us</Link>
                <Link href="/faq">FAQ</Link>
              </nav>

              <div className="header-actions">
                <Link href="/products" className="btn-primary">
                  View Products
                </Link>
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="footer">
            <div className="container footer-inner">
              <div className="footer-brand">
                <h3>PATAK TEXTILE</h3>
                <p>
                  A cleaner and more prestigious digital presentation for hotel
                  textiles, product collections, editorial content and
                  hospitality-focused textile storytelling.
                </p>
              </div>

              <div className="footer-links">
                <div className="footer-col">
                  <strong>Quick Links</strong>
                  <Link href="/about-us">About Us</Link>
                  <Link href="/services">Services</Link>
                  <Link href="/careers">Careers</Link>
                  <Link href="/press-release">Press Release</Link>
                  <Link href="/policies/cookie-policy">Cookie Policy</Link>
                </div>

                <div className="footer-col">
                  <strong>Customer Services</strong>
                  <Link href="/blog">Blog</Link>
                  <Link href="/collections">Collections</Link>
                  <Link href="/our-brands">Our Brands</Link>
                  <Link href="/our-ceo">Our CEO</Link>
                  <Link href="/policies/kvkk">KVKK</Link>
                </div>
              </div>
            </div>

            <div className="container footer-bottom">
              © 2026 Patak Textile. Custom Next.js frontend with Google Sheets
              based content management.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}