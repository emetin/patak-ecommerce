import Link from "next/link";
import Container from "../ui/Container";

type LegalSection = { title: string; body: string[] };
type Props = { badge: string; title: string; description: string; lastUpdated?: string; sections: LegalSection[] };

export default function LegalPage({ badge, title, description, lastUpdated = "Last updated: January 2026", sections }: Props) {
  return (
    <>
      <section className="page-hero"><Container><div className="page-hero__inner"><div className="page-hero__kicker">{badge}</div><h1 className="page-hero__title">{title}</h1><p className="page-hero__text">{description}</p><p className="legal-updated">{lastUpdated}</p></div></Container></section>
      <section className="legal-layout-section"><Container><div className="legal-layout">
        <aside><p className="eyebrow">Patak Textile</p><h2>Legal information</h2><p>Information about our website policies and data handling principles.</p><Link href="/contact-us">Contact us →</Link></aside>
        <div className="legal-content">{sections.map((section, index) => <article key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2>{section.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</article>)}</div>
      </div></Container></section>
    </>
  );
}
