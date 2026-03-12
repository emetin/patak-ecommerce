import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import InfoSplit from "../../components/sections/InfoSplit";
import HighlightGrid from "../../components/sections/HighlightGrid";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Brands",
  description:
    "Explore the brand universe behind Patak Textile and our approach to presenting textile quality through a cleaner and more trusted structure.",
  path: "/our-brands",
});

export default function OurBrandsPage() {
  return (
    <>
      <PageHero
        kicker="Our Brands"
        title="A more refined way to present our textile world"
        text="Our brands reflect product quality, presentation standards and a structured approach to hospitality and residential textile supply."
      />

      <InfoSplit
        kicker="Brand Perspective"
        title="Each brand expression should feel clear, trusted and premium"
        text="A strong brand structure helps customers understand not only what we sell, but also how we think about quality, category organization and long-term service. Our goal is to create a brand experience that feels more consistent, more professional and more aligned with premium hospitality expectations."
        image="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Our brands visual"
      />

      <HighlightGrid
        kicker="Brand Strength"
        title="What our brand structure should communicate"
        items={[
          {
            title: "Trust",
            text: "A cleaner visual system helps establish stronger confidence in the brand and its capabilities.",
          },
          {
            title: "Clarity",
            text: "Organized categories and clear messaging make it easier for customers to understand our offer.",
          },
          {
            title: "Continuity",
            text: "A consistent brand language supports long-term perception and recognition.",
          },
          {
            title: "Prestige",
            text: "Subtle refinement in presentation strengthens the quality image of our textile products.",
          },
        ]}
      />

      <InfoSplit
        kicker="Brand Direction"
        title="From product supplier to stronger brand presence"
        text="We are building a more cohesive brand language that supports both hospitality projects and premium residential positioning. This direction helps bridge clean corporate communication with a more elevated visual identity."
        image="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Brand direction visual"
        reverse
      />

      <Section tight>
        <Container>
          <div className="cta-panel">
            <h2>Explore our collections through a stronger brand structure</h2>
            <p>
              Review our curated categories and product groups with a cleaner and
              more premium presentation layer.
            </p>
            <div className="cta-panel__actions">
              <ButtonLink href="/collections">View Collections</ButtonLink>
              <ButtonLink href="/products" variant="secondary">
                Browse Products
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}