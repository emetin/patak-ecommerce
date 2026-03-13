import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import InfoSplit from "../../components/sections/InfoSplit";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Press Release",
  description:
    "Read company updates, brand announcements and press-related information from Patak Textile.",
  path: "/press-release",
});

const pressItems = [
  {
    title: "Brand Presentation Updates",
    text: "Patak Textile continues improving its digital presentation to better reflect its hospitality textile capabilities and quality standards.",
  },
  {
    title: "Collection Announcements",
    text: "New collection highlights and textile category updates will be shared through structured brand communication.",
  },
  {
    title: "Corporate Developments",
    text: "Operational and brand milestones can be presented here in a more formal and accessible format.",
  },
];

export default function PressReleasePage() {
  return (
    <>
      <PageHero
        kicker="Press Release"
        title="Company updates and brand announcements"
        text="This page is designed to present formal updates, collection news and important brand developments in a clear corporate format."
      />

      <InfoSplit
        kicker="Press Communication"
        title="A cleaner format for official brand updates"
        text="Press communication should feel clear, direct and trustworthy. This section helps organize company announcements in a way that supports both professionalism and brand perception."
        image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Press release visual"
      />

      <Section>
        <Container>
          <div className="press-list">
            {pressItems.map((item, index) => (
              <article className="press-item" key={`${item.title}-${index}`}>
                <div className="section-heading__kicker">Update {index + 1}</div>
                <h3 className="press-item__title">{item.title}</h3>
                <p className="press-item__text">{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}