import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import ContactInfoGrid from "../../components/sections/ContactInfoGrid";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Patak Textile for hospitality textile collections, product inquiries and project-based support.",
  path: "/contact-us",
});

export default function ContactUsPage() {
  return (
    <>
      <PageHero
        kicker="Contact Us"
        title="Let’s talk about your textile needs"
        text="Whether you need hospitality textile support, product information or a more specific project discussion, our team is here to help."
      />

      <ContactInfoGrid
        email="customerservice@globaltexusa.com"
        phone="+90 (258) 408 47 57"
        address="Selcukbey Mah. Evora Houses, C1 Block 9/A Floor:17 No:156, Merkezefendi / Denizli / Türkiye"
        hours="Monday - Friday / 09:00 - 18:00"
      />

      <Section tone="soft">
        <Container>
          <div className="home-split">
            <div className="home-split__panel">
              <div className="section-heading">
                <div className="section-heading__kicker">Work With Us</div>
                <h2 className="section-heading__title">
                  Start a conversation with our team
                </h2>
                <p className="section-heading__text">
                  We support hospitality, residential and project-based textile needs
                  with a more organized and professional communication approach.
                </p>
              </div>

              <p>
                Reach out for product inquiries, collection details, collaboration
                discussions or general information about Patak Textile. Clear
                communication is a key part of how we build long-term business
                relationships.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <ButtonLink href="/collections">Explore Collections</ButtonLink>
                <ButtonLink href="/products" variant="secondary">
                  View Products
                </ButtonLink>
              </div>
            </div>

            <div className="contact-form-card">
              <div className="section-heading__kicker">Quick Contact</div>
              <h3 className="contact-card__title">Send a quick inquiry</h3>

              <form className="contact-form">
                <input type="text" placeholder="Full Name" />
                <input type="email" placeholder="Email Address" />
                <input type="text" placeholder="Company Name" />
                <textarea placeholder="Your Message" rows={6} />
                <button type="submit" className="button-link btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}