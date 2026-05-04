import type { Metadata } from "next";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import SectionHeading from "../../components/ui/SectionHeading";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us | Patak Textile",
  description:
    "Learn more about Patak Textile, a Denizli-based textile company delivering premium hotel and residence textile solutions with quality, sustainability and global service standards.",
  path: "/about-us",
});

export default function AboutUsPage() {
  return (
    <>
      <section
        style={{
          background:
            "linear-gradient(180deg, #f8f4ed 0%, #f3eee6 58%, #ffffff 100%)",
          borderBottom: "1px solid #ede3d7",
          padding: "84px 0 62px",
        }}
      >
        <Container>
          <div style={{ maxWidth: 980 }}>
            <div style={heroBadgeStyle}>About Patak Textile</div>

            <h1 style={heroTitleStyle}>
              A trusted textile partner for hotels, residences and global
              hospitality projects
            </h1>

            <p style={heroTextStyle}>
              Located in Denizli, Turkey, Patak Textile delivers premium textile
              solutions for distinguished hotels and residences worldwide. Our
              work combines Turkish textile craftsmanship, production discipline,
              sustainability and long-term business reliability.
            </p>

            <div style={heroActionsStyle}>
              <ButtonLink href="/collections">Explore Collections</ButtonLink>
              <ButtonLink href="/contact-us" variant="secondary">
                Contact Our Team
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="split-layout">
            <div className="split-card">
              <SectionHeading
                kicker="Who We Are"
                title="Premium textile solutions with a professional hospitality mindset"
                text="Patak Textile is built around quality, consistency and dependable textile supply for hotels, residences and project-based environments."
              />

              <p style={paragraphStyle}>
                Welcome to Patak Textile, your trusted partner in textile
                solutions for the finest hotels and residences. Based in the
                heart of Denizli, one of Turkey’s strongest textile production
                regions, we take pride in offering high-quality products that
                elevate comfort, aesthetics and sustainability.
              </p>

              <p style={paragraphStyle}>
                We specialize in hotel textile wholesale and export, serving
                professional customers who require durability, softness, long
                service life and reliable supply standards. Every product is
                developed with the needs of hospitality and residential projects
                in mind.
              </p>

              <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                Our philosophy is simple: to offer our customers the best quality
                textile products at competitive prices, supported by a wide range
                of options and a service approach that continues from planning to
                final delivery.
              </p>
            </div>

            <div className="split-media">
              <img
                src="https://drive.google.com/thumbnail?id=1HU7rJ1xdEcG83lrtsQKrc6b19N8izmT-&sz=w1600"
                alt="Patak Textile production"
              />

              <div style={mediaOverlayStyle} />

              <div style={mediaCardStyle}>
                <div style={mediaCardKickerStyle}>
                  Denizli Textile Expertise
                </div>

                <div style={mediaCardTitleStyle}>
                  Crafted for comfort, durability and professional performance
                </div>

                <div style={mediaCardTextStyle}>
                  Our products are designed to support daily hospitality use
                  while maintaining softness, beauty and long-term value.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            kicker="Mission & Vision"
            title="Built to define comfort, quality and sustainable textile excellence"
            text="Our mission and vision guide every product, every process and every customer relationship."
          />

          <div className="cards-grid cards-grid--2">
            <article style={largeValueCardStyle}>
              <div style={valueKickerStyle}>Our Mission</div>
              <h3 style={largeValueTitleStyle}>
                Deliver superior textile products that enhance comfort and guest
                experience
              </h3>
              <p style={valueTextStyle}>
                Our mission is to provide innovative, durable and eco-friendly
                textile solutions that exceed expectations while maintaining
                competitive prices. We aim to be a preferred source for textiles
                that define comfort and style.
              </p>
            </article>

            <article style={largeValueCardStyle}>
              <div style={valueKickerStyle}>Our Vision</div>
              <h3 style={largeValueTitleStyle}>
                Become a global benchmark for textile excellence
              </h3>
              <p style={valueTextStyle}>
                Our vision is to set industry standards in quality,
                sustainability and customer service. We believe luxurious and
                sustainable textiles can enrich hospitality and residential
                spaces around the world.
              </p>
            </article>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            kicker="Why Choose Patak Textile"
            title="A stronger foundation for long-term textile partnerships"
            text="Hotels and professional buyers need more than beautiful products. They need consistent quality, responsible production and reliable service."
          />

          <div className="value-grid">
            <article style={valueCardStyle}>
              <div style={valueKickerStyle}>01 / Quality</div>
              <h3 style={valueTitleStyle}>Unparalleled textile quality</h3>
              <p style={valueTextStyle}>
                Our textiles are carefully crafted with attention to detail,
                ensuring durability, softness and lasting beauty for professional
                environments.
              </p>
            </article>

            <article style={valueCardStyle}>
              <div style={valueKickerStyle}>02 / Sustainability</div>
              <h3 style={valueTitleStyle}>Responsible innovation</h3>
              <p style={valueTextStyle}>
                We are committed to eco-friendly practices, from material
                sourcing to production techniques, with the goal of reducing our
                environmental footprint.
              </p>
            </article>

            <article style={valueCardStyle}>
              <div style={valueKickerStyle}>03 / Service</div>
              <h3 style={valueTitleStyle}>Customer-centric support</h3>
              <p style={valueTextStyle}>
                Customer satisfaction is central to our work. We provide
                personalized solutions, timely communication and professional
                support throughout the entire process.
              </p>
            </article>

            <article style={valueCardStyle}>
              <div style={valueKickerStyle}>04 / Global Reach</div>
              <h3 style={valueTitleStyle}>Worldwide hospitality supply</h3>
              <p style={valueTextStyle}>
                With a global service perspective, we support customers across
                different markets, adapting to diverse needs and hospitality
                standards.
              </p>
            </article>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div style={statsPanelStyle}>
            <div>
              <SectionHeading
                kicker="Our Strength"
                title="Designed for hotels, residences and professional textile needs"
                text="Patak Textile focuses on products that combine comfort, long service life and reliable day-to-day performance."
              />
            </div>

            <div style={statsGridStyle}>
              <div style={statItemStyle}>
                <div style={statNumberStyle}>Denizli</div>
                <div style={statLabelStyle}>Textile production heritage</div>
              </div>

              <div style={statItemStyle}>
                <div style={statNumberStyle}>Global</div>
                <div style={statLabelStyle}>Hotel textile export mindset</div>
              </div>

              <div style={statItemStyle}>
                <div style={statNumberStyle}>Premium</div>
                <div style={statLabelStyle}>Quality and comfort standards</div>
              </div>

              <div style={statItemStyle}>
                <div style={statNumberStyle}>Sustainable</div>
                <div style={statLabelStyle}>Responsible production approach</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="split-layout">
            <div className="split-media">
              <img
                src="https://drive.google.com/thumbnail?id=1KRxy4fUcecVIznibQv8E6Ky54ExuLKdN&sz=w1600"
                alt="Hotel textile quality"
              />

              <div style={mediaOverlayStyle} />

              <div style={mediaCardStyle}>
                <div style={mediaCardKickerStyle}>Operational Reliability</div>
                <div style={mediaCardTitleStyle}>
                  From planning to execution and final delivery
                </div>
                <div style={mediaCardTextStyle}>
                  Our team is dedicated to providing exceptional service at
                  every stage of the textile supply process.
                </div>
              </div>
            </div>

            <div className="split-card">
              <SectionHeading
                kicker="How We Work"
                title="A complete textile supply approach"
                text="We support professional customers with product guidance, planning, quality control and reliable delivery."
              />

              <div style={processListStyle}>
                <div style={processItemStyle}>
                  <div style={processNumberStyle}>01</div>
                  <div>
                    <h3 style={processTitleStyle}>Understand the requirement</h3>
                    <p style={processTextStyle}>
                      We begin by understanding the customer’s hotel, residence
                      or project needs, including product type, quality
                      expectations and operational use.
                    </p>
                  </div>
                </div>

                <div style={processItemStyle}>
                  <div style={processNumberStyle}>02</div>
                  <div>
                    <h3 style={processTitleStyle}>Recommend textile solutions</h3>
                    <p style={processTextStyle}>
                      We guide customers toward products that match comfort,
                      durability, design and budget expectations.
                    </p>
                  </div>
                </div>

                <div style={processItemStyle}>
                  <div style={processNumberStyle}>03</div>
                  <div>
                    <h3 style={processTitleStyle}>Control quality and delivery</h3>
                    <p style={processTextStyle}>
                      We focus on consistent quality, responsible production and
                      dependable delivery from order planning through final
                      shipment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div style={ctaStyle}>
            <div style={{ maxWidth: 880 }}>
              <div style={ctaKickerStyle}>Build the relationship</div>

              <h2 style={ctaTitleStyle}>
                Discover collections, review categories and contact our team
                with confidence
              </h2>

              <p style={ctaTextStyle}>
                From premium hotel textiles to customized project-based
                solutions, Patak Textile is ready to support your business with
                reliable supply, consistent quality and professional service.
              </p>

              <div style={ctaActionsStyle}>
                <ButtonLink href="/collections">Explore Collections</ButtonLink>
                <ButtonLink href="/contact-us" variant="secondary">
                  Contact Us
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

const heroBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 34,
  padding: "0 14px",
  borderRadius: 999,
  background: "#e9e2d6",
  color: "#5f564c",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 18,
};

const heroTitleStyle: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: "clamp(2.5rem, 4.8vw, 4.8rem)",
  lineHeight: 1.02,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#171717",
};

const heroTextStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: 800,
  color: "#5d554a",
  fontSize: 17,
  lineHeight: 1.9,
};

const heroActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 26,
};

const paragraphStyle: React.CSSProperties = {
  margin: "0 0 18px",
  color: "#4f4a42",
  fontSize: 16,
  lineHeight: 1.95,
};

const mediaOverlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(17,24,22,0.08) 0%, rgba(17,24,22,0.54) 100%)",
};

const mediaCardStyle: React.CSSProperties = {
  position: "absolute",
  left: 24,
  right: 24,
  bottom: 24,
  padding: 22,
  borderRadius: 20,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.16)",
  backdropFilter: "blur(10px)",
  color: "#fff",
};

const mediaCardKickerStyle: React.CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
  color: "rgba(255,255,255,0.78)",
  fontWeight: 700,
};

const mediaCardTitleStyle: React.CSSProperties = {
  fontSize: 24,
  lineHeight: 1.28,
  fontWeight: 800,
  marginBottom: 8,
};

const mediaCardTextStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.8,
};

const valueCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e6ddd0",
  borderRadius: 22,
  padding: 24,
  boxShadow: "0 10px 28px rgba(23,23,23,0.04)",
};

const largeValueCardStyle: React.CSSProperties = {
  ...valueCardStyle,
  padding: 32,
};

const valueKickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#7a7064",
  marginBottom: 12,
};

const valueTitleStyle: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 800,
  color: "#171717",
};

const largeValueTitleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 30,
  lineHeight: 1.15,
  fontWeight: 800,
  color: "#171717",
};

const valueTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#5a5349",
  lineHeight: 1.85,
  fontSize: 15,
};

const statsPanelStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 28,
  alignItems: "center",
  padding: 34,
  borderRadius: 30,
  background: "#ffffff",
  border: "1px solid #e6ddd0",
  boxShadow: "0 14px 34px rgba(23,23,23,0.05)",
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const statItemStyle: React.CSSProperties = {
  padding: 22,
  borderRadius: 20,
  background: "#f8f4ed",
  border: "1px solid #eadfce",
};

const statNumberStyle: React.CSSProperties = {
  fontSize: 28,
  lineHeight: 1,
  fontWeight: 800,
  color: "#2f7d62",
  marginBottom: 10,
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#5a5349",
  fontWeight: 700,
};

const processListStyle: React.CSSProperties = {
  display: "grid",
  gap: 18,
};

const processItemStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "54px 1fr",
  gap: 16,
  alignItems: "start",
};

const processNumberStyle: React.CSSProperties = {
  width: 54,
  height: 54,
  borderRadius: 16,
  background: "#2f7d62",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
};

const processTitleStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 20,
  lineHeight: 1.25,
  fontWeight: 800,
  color: "#171717",
};

const processTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#5a5349",
  fontSize: 15,
  lineHeight: 1.85,
};

const ctaStyle: React.CSSProperties = {
  borderRadius: 30,
  padding: "40px 34px",
  background:
    "linear-gradient(135deg, #17352d 0%, #2f7d62 65%, #3b9276 100%)",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
};

const ctaKickerStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 800,
  marginBottom: 12,
  color: "rgba(255,255,255,0.76)",
};

const ctaTitleStyle: React.CSSProperties = {
  margin: "0 0 14px",
  fontSize: "clamp(2rem, 3vw, 3rem)",
  lineHeight: 1.08,
  fontWeight: 800,
};

const ctaTextStyle: React.CSSProperties = {
  margin: "0 0 22px",
  maxWidth: 740,
  fontSize: 16,
  lineHeight: 1.9,
  color: "rgba(255,255,255,0.9)",
};

const ctaActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};