import Link from "next/link";
import FooterNewsletterForm from "./FooterNewsletterForm";
import { SITE_SETTINGS } from "../../lib/site-settings";
import { normalizeImageUrl } from "../../lib/image-url";

const companyLinks = [
  ["About", "/about-us"],
  ["Our CEO", "/our-ceo"],
  ["Brands", "/our-brands"],
  ["Careers", "/careers"],
  ["Journal", "/blog"],
];

const serviceLinks = [
  ["Collections", "/collections"],
  ["Products", "/products"],
  ["Hospitality", "/hospitality-projects"],
  ["Production & Quality", "/services"],
  ["Contact", "/contact-us"],
];

export default function Footer() {
  return (
    <footer className="lux-footer">
      <div className="lux-footer__grid">
        <div className="lux-footer__brand">
          <img src={normalizeImageUrl(SITE_SETTINGS.logo.footer)} alt={SITE_SETTINGS.siteName} />
          <p>
            Turkish cotton textiles for hospitality and refined living spaces.
          </p>
          <Link href="/contact-us" className="lux-footer__contact-link">Contact us <span>↗</span></Link>
        </div>

        <FooterColumn title="Company" links={companyLinks} />
        <FooterColumn title="Explore" links={serviceLinks} />

        <div className="lux-footer__newsletter">
          <h3>Notes from Patak</h3>
          <p>Occasional notes on collections, materials and our company.</p>
          <FooterNewsletterForm />
        </div>
      </div>

      <div className="lux-footer__contact">
        <p>Akhan Mah., 104. Sokak No: 2/D/3 · Pamukkale, Denizli, Türkiye</p>
        <p><a href="tel:+902584084757">+90 258 408 47 57</a> · <a href="mailto:customerservice@globaltexusa.com">customerservice@globaltexusa.com</a></p>
      </div>

      <div className="lux-footer__bottom">
        <span>© {new Date().getFullYear()} Patak Textile</span>
        <div><Link href="/policies/privacy-policy">Privacy</Link><Link href="/policies/kvkk">KVKK</Link><Link href="/policies/cookie-policy">Cookies</Link></div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div className="lux-footer__links">
      <h3>{title}</h3>
      {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
    </div>
  );
}
