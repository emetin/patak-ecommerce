import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../../components/sections/PageHero";
import InfoSplit from "../../components/sections/InfoSplit";
import HighlightGrid from "../../components/sections/HighlightGrid";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us | Patak Textile",
  description: "Discover Patak Textile, our Denizli textile heritage, values, production culture and global perspective.",
  path: "/about-us",
});

export default function AboutUsPage() {
  return (
    <>
      <PageHero kicker="About Patak Textile" title="Textile knowledge shaped by place, people and purpose." text="From Denizli, one of the world’s most established textile regions, Patak Textile brings together material knowledge, production discipline and a global hospitality perspective." />
      <InfoSplit kicker="Our Origin" title="Rooted in Denizli’s textile heritage" text="Our company draws on a region where cotton, weaving and finishing expertise have been passed through generations. We carry that knowledge forward with modern standards, considered design and an enduring respect for the material." image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=90" imageAlt="Textile craftsmanship in Denizli" />
      <HighlightGrid kicker="What Guides Us" title="Principles woven into our company" text="The values behind our products also shape how we work as a company." items={[
        { title: "Quality", text: "Consistency, durability and attention to detail guide every product and process." },
        { title: "Responsibility", text: "We value thoughtful material choices and responsible production practices." },
        { title: "Reliability", text: "Clear communication and disciplined operations support long-term relationships." },
        { title: "Progress", text: "We combine established textile knowledge with modern ideas and technologies." },
      ]} />
      <InfoSplit reverse kicker="Our Perspective" title="A Turkish company with a global outlook" text="Patak Textile connects the textile expertise of Türkiye with the needs and expectations of international hospitality environments. Our offices, partners and team share one standard: represent the company with clarity, integrity and care." image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=90" imageAlt="Patak Textile global company perspective" />
      <Section>
        <Container>
          <SectionHeading kicker="Our Story Continues" title="More than products: a complete textile company." text="Explore our leadership, collections, company news and the ideas shaping Patak Textile today." />
          <div className="company-link-grid">
            <Link href="/our-ceo"><span>01</span><h3>Leadership</h3><p>Meet the vision behind Patak Textile.</p></Link>
            <Link href="/collections"><span>02</span><h3>Collections</h3><p>Discover our product families.</p></Link>
            <Link href="/our-brands"><span>03</span><h3>Brands</h3><p>Learn about our brand structure.</p></Link>
            <Link href="/blog"><span>04</span><h3>Journal</h3><p>Read company and textile stories.</p></Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
