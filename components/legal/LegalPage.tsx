import Container from "../ui/Container";
import Section from "../ui/Section";
import ButtonLink from "../ui/ButtonLink";

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  badge: string;
  title: string;
  description: string;
  lastUpdated?: string;
  sections: LegalSection[];
};

export default function LegalPage({
  badge,
  title,
  description,
  lastUpdated = "Last updated: January 2026",
  sections,
}: LegalPageProps) {
  return (
    <>
      <section style={heroStyle}>
        <Container>
          <div style={{ maxWidth: 920 }}>
            <div style={badgeStyle}>{badge}</div>
            <h1 style={titleStyle}>{title}</h1>
            <p style={descriptionStyle}>{description}</p>
            <div style={updatedStyle}>{lastUpdated}</div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div style={layoutStyle}>
            <aside style={sideStyle}>
              <div style={sideKickerStyle}>Patak Textile</div>
              <h2 style={sideTitleStyle}>Legal Information</h2>
              <p style={sideTextStyle}>
                These pages provide general information about our website
                policies, customer terms and data handling principles.
              </p>

              <ButtonLink href="/contact-us">Contact Us</ButtonLink>
            </aside>

            <div style={contentStyle}>
              {sections.map((section) => (
                <article key={section.title} style={sectionStyle}>
                  <h2 style={sectionTitleStyle}>{section.title}</h2>

                  {section.body.map((paragraph, index) => (
                    <p key={index} style={paragraphStyle}>
                      {paragraph}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

const heroStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #f8f4ed 0%, #f3eee6 58%, #ffffff 100%)",
  borderBottom: "1px solid #ede3d7",
  padding: "84px 0 62px",
};

const badgeStyle: React.CSSProperties = {
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

const titleStyle: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: "clamp(2.5rem, 4.8vw, 4.8rem)",
  lineHeight: 1.02,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#171717",
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: 780,
  color: "#5d554a",
  fontSize: 17,
  lineHeight: 1.9,
};

const updatedStyle: React.CSSProperties = {
  marginTop: 22,
  color: "#7a7064",
  fontSize: 14,
  fontWeight: 800,
};

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.34fr 0.66fr",
  gap: 28,
  alignItems: "start",
};

const sideStyle: React.CSSProperties = {
  position: "sticky",
  top: 118,
  padding: 28,
  borderRadius: 28,
  background:
    "linear-gradient(135deg, #17352d 0%, #2f7d62 68%, #3b9276 100%)",
  color: "#fff",
};

const sideKickerStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 800,
  marginBottom: 12,
  color: "rgba(255,255,255,0.76)",
};

const sideTitleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 28,
  lineHeight: 1.12,
  fontWeight: 800,
};

const sideTextStyle: React.CSSProperties = {
  margin: "0 0 20px",
  color: "rgba(255,255,255,0.86)",
  lineHeight: 1.8,
  fontSize: 15,
};

const contentStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e6ddd0",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 10px 28px rgba(23,23,23,0.04)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 24,
  lineHeight: 1.2,
  fontWeight: 800,
  color: "#171717",
};

const paragraphStyle: React.CSSProperties = {
  margin: "0 0 12px",
  color: "#5a5349",
  fontSize: 15,
  lineHeight: 1.85,
};