"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE_SETTINGS } from "../../lib/site-settings";
import { normalizeImageUrl } from "../../lib/image-url";

const navigation = [
  { label: "Collections", href: "/collections" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/services" },
  { label: "Company", href: "/about-us" },
  { label: "Leadership", href: "/our-ceo" },
  { label: "Journal", href: "/blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="lux-header">
      <div className="lux-topline">
        <div className="lux-topline__inner">
          <span>Premium hospitality textiles · Denizli, Türkiye</span>
          <div>
            <a href="tel:+902584084757">+90 258 408 47 57</a>
            <a href="mailto:customerservice@globaltexusa.com">Email us</a>
          </div>
        </div>
      </div>

      <div className="lux-header__bar">
        <Link href="/" className="lux-brand" aria-label="Patak Textile home">
          <img
            src={normalizeImageUrl(SITE_SETTINGS.logo.header)}
            alt={SITE_SETTINGS.siteName}
          />
        </Link>

        <nav
          className={`lux-nav ${menuOpen ? "lux-nav--open" : ""}`}
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact-us"
            className="lux-nav__mobile-cta"
            onClick={() => setMenuOpen(false)}
          >
            Contact us
          </Link>
        </nav>

        <div className="lux-header__actions">
          <Link href="/contact-us" className="lux-header__quote">
            Contact us <span aria-hidden="true">↗</span>
          </Link>
          <button
            type="button"
            className="lux-menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
