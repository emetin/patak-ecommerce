import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import InfoSplit from "../../components/sections/InfoSplit";
import HighlightGrid from "../../components/sections/HighlightGrid";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Our CEO",
  description:
    "Learn more about the leadership vision behind Patak Textile and our commitment to quality, customer trust and long-term business growth.",
  path: "/our-ceo",
});

export default function OurCeoPage() {
  return (
    <>
      <PageHero
        kicker="Our CEO"
        title="Leadership shaped by quality, responsibility and long-term vision"
        text="Patak Textile’s leadership approach is built on trust, consistency and a commitment to creating stronger value for customers through better service, better presentation and better textile solutions."
      />

      <InfoSplit
        kicker="Leadership"
        title="A more structured vision for growth and trust"
        text="Our leadership perspective is centered on sustainable growth, operational discipline and customer-focused decision making. The goal is to strengthen Patak Textile not only as a product supplier, but as a more reliable and refined business partner for hospitality and residential textile projects."
        image="https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?auto=format&fit=crop&w=1400&q=80"
        imageAlt="CEO leadership visual"
      />

      <HighlightGrid
        kicker="Core Principles"
        title="What defines our leadership mindset"
        items={[
          {
            title: "Consistency",
            text: "A stable and disciplined business approach helps build confidence across every stage of the customer relationship.",
          },
          {
            title: "Responsibility",
            text: "Leadership means taking ownership of quality, communication and long-term brand reputation.",
          },
          {
            title: "Adaptability",
            text: "We continue improving our processes and presentation to meet changing market expectations more effectively.",
          },
          {
            title: "Partnership",
            text: "We value long-term partnerships built on trust, service quality and a shared focus on results.",
          },
        ]}
      />

      <InfoSplit
        kicker="Forward Outlook"
        title="Building a stronger future for Patak Textile"
        text="The future of Patak Textile depends on combining operational strength with a more modern brand presence. By improving how we present ourselves and how we support our customers, we aim to grow with greater confidence in hospitality, residential and project-based textile supply."
        image="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Forward outlook visual"
        reverse
      />

      <Section tight>
        <Container>
          <div className="cta-panel">
            <h2>Explore the vision behind the brand</h2>
            <p>
              Discover the collections, product categories and structured business
              approach that shape Patak Textile’s next stage.
            </p>
            <div className="cta-panel__actions">
              <ButtonLink href="/products">View Products</ButtonLink>
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