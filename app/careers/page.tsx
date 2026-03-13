import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import InfoSplit from "../../components/sections/InfoSplit";
import HighlightGrid from "../../components/sections/HighlightGrid";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers",
  description:
    "Explore career opportunities at Patak Textile and learn more about our professional culture, values and growth vision.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="Careers"
        title="Grow with a textile company focused on quality and trust"
        text="We believe strong teams build strong businesses. Patak Textile values responsibility, communication and long-term growth."
      />

      <InfoSplit
        kicker="Working at Patak Textile"
        title="A professional environment shaped by structure and continuity"
        text="Our business approach depends on reliable teamwork, practical problem solving and a commitment to quality. We value people who want to contribute to a stronger textile service structure and a more professional brand future."
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Careers visual"
      />

      <HighlightGrid
        kicker="Why Join Us"
        title="What we value in our team culture"
        items={[
          {
            title: "Professional growth",
            text: "We support people who want to grow through responsibility, learning and long-term contribution.",
          },
          {
            title: "Clear communication",
            text: "We care about practical communication that helps teams work together more effectively.",
          },
          {
            title: "Quality mindset",
            text: "Attention to quality is important not only in products, but also in service and daily work standards.",
          },
          {
            title: "Long-term vision",
            text: "We aim to build a stronger future by working with people who value continuity and trust.",
          },
        ]}
      />

      <Section tight>
        <Container>
          <div className="cta-panel">
            <h2>Interested in working with Patak Textile?</h2>
            <p>
              Reach out to our team to learn more about current opportunities and
              how you can contribute to our growing structure.
            </p>
            <div className="cta-panel__actions">
              <ButtonLink href="/contact-us">Contact Us</ButtonLink>
              <ButtonLink href="/about-us" variant="secondary">
                Learn About Us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}