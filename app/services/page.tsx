import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import HighlightGrid from "../../components/sections/HighlightGrid";
import InfoSplit from "../../components/sections/InfoSplit";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Services",
  description:
    "Explore Patak Textile services including hospitality textile supply, custom solutions and long-term partnership support.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Services"
        title="Textile services designed for hospitality and premium spaces"
        text="Patak Textile supports hospitality and residential projects with reliable textile supply, product knowledge and structured service communication."
      />

      <HighlightGrid
        kicker="Our Services"
        title="What we provide"
        items={[
          {
            title: "Hospitality Textile Supply",
            text: "High quality bedding, towels, bathrobes and textile essentials designed for hotels and hospitality projects.",
          },
          {
            title: "Project Support",
            text: "Support for hospitality projects requiring structured textile sourcing and category organization.",
          },
          {
            title: "Product Consultation",
            text: "Guidance in selecting the right textile products based on comfort, durability and operational needs.",
          },
          {
            title: "Long-term Supply Partnership",
            text: "A structured supply approach designed to build long-term cooperation with hospitality clients.",
          },
        ]}
      />

      <InfoSplit
        kicker="Service Approach"
        title="Reliable textile service structure"
        text="Our service model is based on communication clarity, consistent product quality and structured cooperation with our partners. We aim to make textile sourcing simpler and more dependable."
        image="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
      />
    </>
  );
}