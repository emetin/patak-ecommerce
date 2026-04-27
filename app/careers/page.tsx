import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../../components/sections/PageHero";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers",
  description:
    "Explore career opportunities at Patak Textile, discover open positions in Türkiye and learn more about our professional culture.",
  path: "/careers",
});

const openPositions = [
  {
    title: "Accounting Assistant",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    department: "Accounting",
    href: "/careers/accounting-assistant",
  },
  {
    title: "Digital Marketing Specialist",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    department: "Marketing",
    href: "/careers/digital-marketing-specialist",
  },
  {
    title: "Web Master / Web Developer",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    department: "Technology",
    href: "/careers/web-master-web-developer",
  },
  {
    title: "Human Resources Specialist",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    department: "Human Resources",
    href: "/careers/human-resources-specialist",
  },
  {
    title: "Logistics Specialist",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    department: "Operations",
    href: "/careers/logistics-specialist",
  },
  {
    title: "Customer Support Specialist",
    location: "Remote / Türkiye",
    type: "Remote",
    department: "Customer Support",
    href: "/careers/customer-support-specialist-remote",
  },
];

const whyJoinItems = [
  {
    title: "Global textile vision",
    text: "Be part of a company connected to hospitality, home textiles and international business growth.",
  },
  {
    title: "Career development",
    text: "We value people who want to learn, take responsibility and grow with a long-term mindset.",
  },
  {
    title: "Stable work culture",
    text: "Our structure is built around reliability, clear communication and sustainable teamwork.",
  },
  {
    title: "Real impact",
    text: "Every role contributes to product quality, customer experience and the future of our brand.",
  },
];

const offices = [
  {
    title: "Denizli Office",
    text: "Selcukbey Mah. Evora Houses, C1 Block 9/A Floor:17 No:156, 20010 Merkezefendi / Denizli / TÜRKİYE",
  },
  {
    title: "Production & Operations",
    text: "Our textile operations are shaped around quality control, reliable supply and professional production standards.",
  },
  {
    title: "Global Communication",
    text: "We work with a global mindset while keeping our operational strength rooted in Türkiye.",
  },
];

const faqItems = [
  {
    question: "How can I apply for a position?",
    answer:
      "You can review the open positions and click the role that matches your profile. Each position page will include a dedicated application form.",
  },
  {
    question: "Can I apply for multiple roles?",
    answer:
      "Yes. You can apply for more than one role if your experience and interests match different positions.",
  },
  {
    question: "Do you offer remote work options?",
    answer:
      "Some positions may offer remote flexibility depending on the role. Remote details are listed on the relevant job page.",
  },
  {
    question: "What does the recruitment process look like?",
    answer:
      "The process usually includes application review, initial communication, interview scheduling and final evaluation.",
  },
  {
    question: "Can I submit my resume if there is no suitable position?",
    answer:
      "Yes. You can contact our team and share your resume for future opportunities.",
  },
];

export default function CareersPage() {
  return (
    <>
      

      <Section>
        <Container>
          <div className="split-layout">
            <div className="split-card">
              <div style={kickerStyle}>Careers at Patak Textile</div>
              <h2 style={sectionTitleStyle}>
                A professional culture built around quality and continuity
              </h2>
              <p style={textStyle}>
                Patak Textile brings together textile know-how, operational
                discipline and a strong service mindset. We are looking for team
                members who want to contribute to a growing structure and create
                long-term value.
              </p>
              <p style={textStyle}>
                Whether your expertise is in accounting, marketing, technology,
                human resources, logistics or customer support, your work can
                help us strengthen our brand and support our global business
                vision.
              </p>
            </div>

            <div className="split-media">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80"
                alt="Patak Textile team environment"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div className="cta-panel">
            <h2>Ready to schedule your interview?</h2>
            <p>
              If your profile matches our expectations, our team may invite you
              to an interview. You can also contact us to learn more about the
              current recruitment process.
            </p>
            <div className="cta-panel__actions">
              <ButtonLink href="/contact-us">Contact Our Team</ButtonLink>
              <ButtonLink href="#open-positions" variant="secondary">
                View Open Positions
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div style={sectionHeaderStyle}>
            <div style={kickerStyle}>Why Join Patak Textile?</div>
            <h2 style={sectionTitleStyle}>
              Grow inside a trusted textile structure
            </h2>
            <p style={sectionTextStyle}>
              We believe strong teams build strong businesses. Our culture values
              clear communication, responsibility, learning and quality-focused
              work.
            </p>
          </div>

          <div className="cards-grid cards-grid--4">
            {whyJoinItems.map((item) => (
              <article key={item.title} style={valueCardStyle}>
                <h3 style={cardTitleStyle}>{item.title}</h3>
                <p style={cardTextStyle}>{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div id="open-positions" style={sectionHeaderStyle}>
            <div style={kickerStyle}>Open Positions</div>
            <h2 style={sectionTitleStyle}>Current opportunities in Türkiye</h2>
            <p style={sectionTextStyle}>
              Explore our open roles and continue to the related job page to
              review responsibilities, requirements and the application form.
            </p>
          </div>

          <div className="cards-grid cards-grid--3">
            {openPositions.map((position) => (
              <Link
                key={position.title}
                href={position.href}
                style={positionCardStyle}
              >
                <div>
                  <div style={positionMetaStyle}>{position.department}</div>
                  <h3 style={positionTitleStyle}>{position.title}</h3>
                  <p style={positionLocationStyle}>{position.location}</p>
                </div>

                <div style={positionFooterStyle}>
                  <span style={positionTypeStyle}>{position.type}</span>
                  <span style={viewRoleStyle}>View role</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div style={sectionHeaderStyle}>
            <div style={kickerStyle}>Our Office Locations</div>
            <h2 style={sectionTitleStyle}>A strong base for global growth</h2>
            <p style={sectionTextStyle}>
              Patak Textile operates with a professional structure based in
              Denizli and a global business perspective.
            </p>
          </div>

          <div className="cards-grid cards-grid--3">
            {offices.map((office) => (
              <article key={office.title} style={officeCardStyle}>
                <h3 style={cardTitleStyle}>{office.title}</h3>
                <p style={cardTextStyle}>{office.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div style={sectionHeaderStyle}>
            <div style={kickerStyle}>Career Questions - FAQ</div>
            <h2 style={sectionTitleStyle}>
              Frequently asked career questions
            </h2>
            <p style={sectionTextStyle}>
              Find answers about applications, remote roles, interviews and the
              recruitment process.
            </p>
          </div>

          <div style={faqWrapperStyle}>
            {faqItems.map((item) => (
              <details key={item.question} style={faqItemStyle}>
                <summary style={faqQuestionStyle}>{item.question}</summary>
                <p style={faqAnswerStyle}>{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

const kickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#2f7d62",
  marginBottom: 10,
};

const sectionHeaderStyle: React.CSSProperties = {
  maxWidth: 780,
  marginBottom: 32,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(2rem, 3vw, 3rem)",
  lineHeight: 1.08,
  fontWeight: 800,
  color: "#171717",
};

const sectionTextStyle: React.CSSProperties = {
  margin: "14px 0 0",
  color: "#5a5349",
  fontSize: 16,
  lineHeight: 1.85,
};

const textStyle: React.CSSProperties = {
  margin: "0 0 14px",
  color: "#5a5349",
  fontSize: 16,
  lineHeight: 1.9,
};

const valueCardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e6ddd0",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 12px 30px rgba(23,23,23,0.04)",
};

const cardTitleStyle: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 800,
  color: "#171717",
};

const cardTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#5a5349",
  fontSize: 15,
  lineHeight: 1.8,
};

const positionCardStyle: React.CSSProperties = {
  minHeight: 245,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: "#ffffff",
  border: "1px solid #e6ddd0",
  borderRadius: 26,
  padding: 24,
  boxShadow: "0 12px 30px rgba(23,23,23,0.04)",
  color: "inherit",
  textDecoration: "none",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const positionMetaStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: 30,
  alignItems: "center",
  padding: "0 12px",
  borderRadius: 999,
  background: "#edf5f1",
  color: "#245845",
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 16,
};

const positionTitleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 24,
  lineHeight: 1.16,
  fontWeight: 800,
  color: "#171717",
};

const positionLocationStyle: React.CSSProperties = {
  margin: 0,
  color: "#5a5349",
  fontSize: 15,
  lineHeight: 1.7,
};

const positionFooterStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 22,
  paddingTop: 18,
  borderTop: "1px solid #eee5d8",
};

const positionTypeStyle: React.CSSProperties = {
  color: "#7a7064",
  fontSize: 13,
  fontWeight: 800,
};

const viewRoleStyle: React.CSSProperties = {
  color: "#2f7d62",
  fontSize: 14,
  fontWeight: 900,
};

const officeCardStyle: React.CSSProperties = {
  background: "#faf7f1",
  border: "1px solid #e6ddd0",
  borderRadius: 24,
  padding: 24,
};

const faqWrapperStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const faqItemStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e6ddd0",
  borderRadius: 18,
  padding: "0 20px",
  boxShadow: "0 10px 26px rgba(23,23,23,0.035)",
};

const faqQuestionStyle: React.CSSProperties = {
  cursor: "pointer",
  padding: "18px 0",
  color: "#171717",
  fontSize: 17,
  fontWeight: 800,
  listStyle: "none",
};

const faqAnswerStyle: React.CSSProperties = {
  margin: "0 0 18px",
  color: "#5a5349",
  fontSize: 15,
  lineHeight: 1.8,
};