import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import InfoSplit from "../../components/sections/InfoSplit";
import HighlightGrid from "../../components/sections/HighlightGrid";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description:
    "Learn more about Patak Textile, our hospitality textile expertise, our values and our approach to quality, supply and customer relationships.",
  path: "/about-us",
});

export default function AboutUsPage() {
  return (
    <>
      <PageHero
        kicker="About Us"
        title="A trusted textile partner for hospitality and premium living spaces"
        text="Patak Textile brings together Turkish textile expertise, hospitality-focused quality and a cleaner corporate presentation designed to build trust with hotels, residences and refined accommodation projects."
      />

      <InfoSplit
        kicker="Our Story"
        title="Built on quality, continuity and customer trust"
        text="Based in Denizli, Patak Textile serves hospitality and residential textile needs with a focus on quality, communication and dependable supply. Our goal is not only to deliver textile products, but also to support stronger long-term partnerships through consistency, product knowledge and a more professional service approach."
        image="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Patak Textile about us visual"
      />

      <HighlightGrid
        kicker="Why Patak Textile"
        title="The values behind our business approach"
        text="Our structure is shaped around practical service quality and a more refined presentation standard."
        items={[
          {
            title: "Quality-focused production",
            text: "We aim to maintain strong product standards across hospitality textile categories with attention to comfort, durability and consistency.",
          },
          {
            title: "Reliable communication",
            text: "Clear communication supports smoother project management and better long-term customer relationships.",
          },
          {
            title: "Structured supply approach",
            text: "We work with an organized supply mindset to support hospitality operations and project-based needs more effectively.",
          },
          {
            title: "Professional brand presentation",
            text: "A cleaner, more trusted and more modern digital structure helps us present our capabilities with greater confidence.",
          },
        ]}
      />

      <InfoSplit
        kicker="Mission & Vision"
        title="Elevating comfort through better textile presentation and supply"
        text="Our mission is to provide hospitality textile solutions that balance product quality, dependable service and visual refinement. Our vision is to strengthen our position as a trusted textile supplier for hotels, residences and hospitality projects by continuously improving both our product offer and our corporate presentation."
        image="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Mission and vision visual"
        reverse
      />

      <Section tight>
        <Container>
          <div className="cta-panel">
            <h2>Discover the structure behind Patak Textile</h2>
            <p>
              Explore our collections, product categories and brand perspective
              through a cleaner and more refined digital experience.
            </p>
            <div className="cta-panel__actions">
              <ButtonLink href="/collections">View Collections</ButtonLink>
              <ButtonLink href="/contact-us" variant="secondary">
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}