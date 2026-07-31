import type { Metadata } from "next";
import Link from "next/link";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import ButtonLink from "../../components/ui/ButtonLink";
import JsonLd from "../../components/seo/JsonLd";
import { buildPageMetadata } from "../../lib/seo";

export const dynamic = "force-static";


export const metadata: Metadata = buildPageMetadata({
  title: "FAQ | Patak Textile",
  description:
    "Find answers to frequently asked questions about Patak Textile products, ordering, payment options, delivery, returns, customer service and textile support.",
  path: "/faq",
});

const faqItems = [
  {
    category: "Ordering",
    question: "How can I buy Patak Textile products?",
    answer:
      "You can explore our product categories, review the products that suit your needs and contact our team for professional support. For project-based or hospitality orders, we recommend contacting us directly so we can guide you with the most suitable textile solutions.",
  },
  {
    category: "Ordering",
    question: "Can I request textile solutions for hotels or residences?",
    answer:
      "Yes. Patak Textile provides textile solutions for hotels, residences and professional projects. Our team can support you with product selection, quantity planning and customized textile requirements.",
  },
  {
    category: "Payment",
    question: "What are the payment options?",
    answer:
      "Payment options may vary depending on the order type, customer location and project scope. For professional and wholesale orders, our team will share the available payment details during the quotation and order process.",
  },
  {
    category: "Delivery",
    question: "What is the delivery time?",
    answer:
      "Delivery time may vary depending on order content, product availability, production requirements and destination. Standard orders are usually processed within a few business days, while project-based orders may require a separate timeline.",
  },
  {
    category: "Delivery",
    question: "How can I track my order?",
    answer:
      "When your order is prepared and shipped, tracking details can be shared with you by our team. You can also contact customer service for order status updates.",
  },
  {
    category: "Returns",
    question: "What is the return and refund policy?",
    answer:
      "Return and refund conditions may vary depending on product type, order content and whether the order is customized. Products generally need to be unused, clean and in their original packaging. Please contact our customer service team before starting a return process.",
  },
  {
    category: "Returns",
    question: "How can I return a product?",
    answer:
      "To request a return, please contact customer service first. Our team will review your request, confirm whether the product meets the return conditions and share the necessary return instructions.",
  },
  {
    category: "Support",
    question: "How can I get customer service support?",
    answer:
      "You can contact Patak Textile through the Contact Us page, by phone or by email. Our team can support you with product information, order questions, delivery updates and project-based textile needs.",
  },
  {
    category: "Support",
    question: "Can I get information about discounts or promotions?",
    answer:
      "Yes. You can subscribe to our newsletter or contact our team to receive information about current campaigns, product updates and special opportunities.",
  },
  {
    category: "Privacy",
    question: "Where can I find the privacy policy?",
    answer:
      "You can review the Privacy Policy page on our website to understand how personal information is collected, processed and protected.",
  },
];

const supportItems = [
  "Product selection support",
  "Hotel and residence textile guidance",
  "Order and delivery information",
  "Return and customer service assistance",
];

export default function FAQPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />
      <section style={heroStyle}>
        <Container>
          <div style={heroInnerStyle}>
            <div style={heroBadgeStyle}>FAQ</div>

            <h1 style={heroTitleStyle}>Frequently Asked Questions</h1>

            <p style={heroTextStyle}>
              Find quick answers about Patak Textile products, ordering,
              delivery, returns and customer support. For hospitality or
              project-based requests, our team can also guide you directly.
            </p>

            <div style={heroActionsStyle}>
              <ButtonLink href="/contact-us">Contact Customer Support</ButtonLink>
              <ButtonLink href="/collections" variant="secondary">
                Explore Collections
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div style={layoutStyle}>
            <aside style={sidePanelStyle}>
              <div style={sidePanelKickerStyle}>Need help?</div>
              <h2 style={sidePanelTitleStyle}>
                Our team is ready to support your textile needs
              </h2>
              <p style={sidePanelTextStyle}>
                If your question is related to a hotel, residence or custom
                textile project, contacting our team is the fastest way to get a
                clear answer.
              </p>

              <div style={supportListStyle}>
                {supportItems.map((item) => (
                  <div key={item} style={supportItemStyle}>
                    <span style={checkStyle}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div style={contactBoxStyle}>
                <div style={contactLabelStyle}>Phone</div>
                <div style={contactValueStyle}>+90 (258) 408 47 57</div>

                <div style={{ ...contactLabelStyle, marginTop: 16 }}>
                  Address
                </div>
                <div style={contactValueStyle}>
                  Selcukbey Mah. Evora Houses, C1 Block 9/A Floor:17 No:156,
                  20010 Merkezefendi / Denizli / TÜRKİYE
                </div>
              </div>

              <Link href="/contact-us" style={sideButtonStyle}>
                Send a Message
              </Link>
            </aside>

            <div style={faqListStyle}>
              {faqItems.map((item, index) => (
                <details
                  key={item.question}
                  open={index === 0}
                  style={faqCardStyle}
                >
                  <summary style={summaryStyle}>
                    <span style={summaryContentStyle}>
                      <span style={categoryStyle}>{item.category}</span>
                      <span style={questionStyle}>{item.question}</span>
                    </span>

                    <span style={plusStyle}>+</span>
                  </summary>

                  <div style={answerStyle}>{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div style={infoGridStyle}>
            <article style={infoCardStyle}>
              <div style={infoKickerStyle}>For Hospitality Buyers</div>
              <h3 style={infoTitleStyle}>Project-based support</h3>
              <p style={infoTextStyle}>
                For hotels, residences and larger orders, our team can help with
                textile selection, quantity planning and supply details.
              </p>
            </article>

            <article style={infoCardStyle}>
              <div style={infoKickerStyle}>For Product Questions</div>
              <h3 style={infoTitleStyle}>Clear product guidance</h3>
              <p style={infoTextStyle}>
                We can provide more information about product categories,
                materials, usage expectations and care requirements.
              </p>
            </article>

            <article style={infoCardStyle}>
              <div style={infoKickerStyle}>For Order Support</div>
              <h3 style={infoTitleStyle}>Delivery and return assistance</h3>
              <p style={infoTextStyle}>
                Contact customer service for order tracking, delivery updates,
                return conditions and related support.
              </p>
            </article>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div style={ctaStyle}>
            <div style={ctaKickerStyle}>Still have questions?</div>
            <h2 style={ctaTitleStyle}>
              Contact Patak Textile for professional support
            </h2>
            <p style={ctaTextStyle}>
              Whether you need product information, hotel textile guidance or
              support with an existing order, our team is ready to help.
            </p>

            <div style={ctaActionsStyle}>
              <ButtonLink href="/contact-us">Contact Us</ButtonLink>
              <ButtonLink href="/collections" variant="secondary">
                View Collections
              </ButtonLink>
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

const heroInnerStyle: React.CSSProperties = {
  maxWidth: 900,
};

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
  maxWidth: 760,
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

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.82fr 1.18fr",
  gap: 28,
  alignItems: "start",
};

const sidePanelStyle: React.CSSProperties = {
  position: "sticky",
  top: 118,
  padding: 30,
  borderRadius: 28,
  background:
    "linear-gradient(135deg, #17352d 0%, #2f7d62 68%, #3b9276 100%)",
  color: "#fff",
  overflow: "hidden",
};

const sidePanelKickerStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 800,
  marginBottom: 12,
  color: "rgba(255,255,255,0.76)",
};

const sidePanelTitleStyle: React.CSSProperties = {
  margin: "0 0 14px",
  fontSize: 30,
  lineHeight: 1.12,
  fontWeight: 800,
};

const sidePanelTextStyle: React.CSSProperties = {
  margin: "0 0 20px",
  color: "rgba(255,255,255,0.86)",
  lineHeight: 1.8,
  fontSize: 15,
};

const supportListStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginBottom: 22,
};

const supportItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 14,
  fontWeight: 700,
  color: "rgba(255,255,255,0.92)",
};

const checkStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 auto",
};

const contactBoxStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 20,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.14)",
  marginBottom: 18,
};

const contactLabelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.62)",
  fontWeight: 800,
  marginBottom: 6,
};

const contactValueStyle: React.CSSProperties = {
  color: "#fff",
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
};

const sideButtonStyle: React.CSSProperties = {
  minHeight: 48,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  borderRadius: 999,
  background: "#fff",
  color: "#2f7d62",
  fontWeight: 800,
  textDecoration: "none",
};

const faqListStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const faqCardStyle: React.CSSProperties = {
  borderRadius: 22,
  background: "#fff",
  border: "1px solid #e6ddd0",
  boxShadow: "0 10px 28px rgba(23,23,23,0.04)",
  overflow: "hidden",
};

const summaryStyle: React.CSSProperties = {
  listStyle: "none",
  cursor: "pointer",
  padding: "22px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 18,
};

const summaryContentStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
};

const categoryStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#2f7d62",
  fontWeight: 800,
};

const questionStyle: React.CSSProperties = {
  fontSize: 20,
  lineHeight: 1.28,
  color: "#171717",
  fontWeight: 800,
};

const plusStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 999,
  background: "#f3eee6",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#2f7d62",
  fontWeight: 900,
  fontSize: 20,
  flex: "0 0 auto",
};

const answerStyle: React.CSSProperties = {
  padding: "0 24px 24px",
  color: "#5a5349",
  fontSize: 16,
  lineHeight: 1.85,
};

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 18,
};

const infoCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e6ddd0",
  borderRadius: 22,
  padding: 24,
  boxShadow: "0 10px 28px rgba(23,23,23,0.04)",
};

const infoKickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#7a7064",
  marginBottom: 12,
};

const infoTitleStyle: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 800,
  color: "#171717",
};

const infoTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#5a5349",
  lineHeight: 1.85,
  fontSize: 15,
};

const ctaStyle: React.CSSProperties = {
  borderRadius: 30,
  padding: "40px 34px",
  background:
    "linear-gradient(135deg, #17352d 0%, #2f7d62 65%, #3b9276 100%)",
  color: "#fff",
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
