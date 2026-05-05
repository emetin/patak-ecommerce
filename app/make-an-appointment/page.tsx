import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Make an Appointment | Patak Textile",
  description:
    "Schedule an appointment with Patak Textile to discuss wholesale pricing, stock availability, product options and hospitality textile project needs.",
  alternates: {
    canonical: "/make-an-appointment",
  },
};

const APPOINTMENT_IFRAME_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2WYCKDnzQqxqGqsYJSJzN3wI5FrBIJUdtqeEtAbrcasLd77WnN4K7D6qR78j7Qc0HKGuMoKUUg?gv=true";

export default function MakeAppointmentPage() {
  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .appointment-intro-container,
          .appointment-benefits-grid {
            grid-template-columns: 1fr !important;
          }

          .appointment-cta-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .appointment-cta-button {
            width: 100% !important;
            text-align: center !important;
          }
        }

        @media (max-width: 768px) {
          .appointment-hero {
            min-height: auto !important;
            background: #ffffff !important;
          }

          .appointment-hero-image {
            position: relative !important;
            height: auto !important;
            aspect-ratio: 16 / 10 !important;
          }

          .appointment-hero-overlay {
            display: none !important;
          }

          .appointment-hero-content {
            min-height: auto !important;
            padding: 22px 16px 30px !important;
            background: #ffffff !important;
          }

          .appointment-hero-panel {
            width: 100% !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
          }

          .appointment-hero-title {
            color: #111827 !important;
            font-size: 34px !important;
            line-height: 1.08 !important;
          }

          .appointment-hero-text {
            color: #5f564c !important;
            font-size: 15px !important;
          }

          .appointment-hero-button {
            width: 100% !important;
            margin-top: 22px !important;
          }

          .appointment-intro-section {
            padding: 48px 16px 24px !important;
          }

          .appointment-benefits-section {
            padding: 24px 16px 50px !important;
          }

          .appointment-benefit-card {
            padding: 22px !important;
            border-radius: 20px !important;
          }

          .appointment-cta-section {
            padding: 0 16px 28px !important;
          }

          .appointment-cta-inner {
            padding: 24px 20px !important;
            border-radius: 20px !important;
          }

          .appointment-scheduler-section {
            padding: 34px 16px 64px !important;
          }

          .appointment-scheduler-header {
            align-items: flex-start !important;
          }

          .appointment-secondary-link {
            width: 100% !important;
            text-align: center !important;
          }

          .appointment-iframe-card {
            border-radius: 18px !important;
          }

          .appointment-iframe {
            height: 820px !important;
          }
        }

        @media (max-width: 480px) {
          .appointment-hero-title {
            font-size: 30px !important;
          }

          .appointment-section-title,
          .appointment-cta-title,
          .appointment-scheduler-title {
            font-size: 28px !important;
          }

          .appointment-benefit-title {
            font-size: 20px !important;
          }
        }
      `}</style>

      <section className="appointment-hero" style={heroStyle}>
        <img
          className="appointment-hero-image"
          src="https://www.globaltexusa.com/image_10.png"
          alt="Modern hospitality textile appointment environment"
          style={heroImageStyle}
        />

        <div className="appointment-hero-overlay" style={heroOverlayStyle} />

        <div className="appointment-hero-content" style={heroContentStyle}>
          <div className="appointment-hero-panel" style={heroPanelStyle}>
            <div style={heroKickerStyle}>Wholesale Appointment</div>

            <h1 className="appointment-hero-title" style={heroTitleStyle}>
              Make an Appointment
            </h1>

            <p className="appointment-hero-text" style={heroTextStyle}>
              Schedule a quick call with our team to discuss wholesale pricing,
              stock availability, product options and hospitality project needs.
            </p>

            <a
              href="#appointment-scheduler"
              className="appointment-hero-button"
              style={heroButtonStyle}
            >
              Schedule Appointment
            </a>
          </div>
        </div>
      </section>

      <section className="appointment-intro-section" style={introSectionStyle}>
        <div className="appointment-intro-container" style={introContainerStyle}>
          <div>
            <div style={sectionKickerStyle}>Project Support</div>

            <h2 className="appointment-section-title" style={sectionTitleStyle}>
              Speak with our team before planning your next textile purchase
            </h2>
          </div>

          <p style={introTextStyle}>
            This appointment page is designed for hotels, resorts, residences,
            purchasing teams and hospitality professionals who need clear product
            guidance, availability information and wholesale purchase support.
          </p>
        </div>
      </section>

      <section
        className="appointment-benefits-section"
        style={benefitsSectionStyle}
      >
        <div className="appointment-benefits-grid" style={benefitsGridStyle}>
          <article className="appointment-benefit-card" style={benefitCardStyle}>
            <div style={benefitNumberStyle}>01</div>
            <h3 className="appointment-benefit-title" style={benefitTitleStyle}>
              Wholesale Pricing
            </h3>
            <p style={benefitTextStyle}>
              Discuss quantity-based pricing, product options and purchasing
              details for hospitality textile needs.
            </p>
          </article>

          <article className="appointment-benefit-card" style={benefitCardStyle}>
            <div style={benefitNumberStyle}>02</div>
            <h3 className="appointment-benefit-title" style={benefitTitleStyle}>
              Product Recommendations
            </h3>
            <p style={benefitTextStyle}>
              Get guidance on towels, bathrobes, bedding, poolside textiles and
              custom hospitality products.
            </p>
          </article>

          <article className="appointment-benefit-card" style={benefitCardStyle}>
            <div style={benefitNumberStyle}>03</div>
            <h3 className="appointment-benefit-title" style={benefitTitleStyle}>
              Project Planning
            </h3>
            <p style={benefitTextStyle}>
              Review availability, specifications, customization options and
              next steps for hotel or resort projects.
            </p>
          </article>
        </div>
      </section>

      <section className="appointment-cta-section" style={ctaSectionStyle}>
        <div className="appointment-cta-inner" style={ctaInnerStyle}>
          <div>
            <div style={sectionKickerStyle}>Schedule Online</div>

            <h2 className="appointment-cta-title" style={ctaTitleStyle}>
              Ready to book your wholesale purchase appointment?
            </h2>

            <p style={ctaTextStyle}>
              Choose a convenient time to speak with our team. The scheduler
              below allows you to select an available appointment slot directly.
            </p>
          </div>

          <a
            href="#appointment-scheduler"
            className="appointment-cta-button"
            style={ctaButtonStyle}
          >
            Go to Scheduler
          </a>
        </div>
      </section>

      <section
        id="appointment-scheduler"
        className="appointment-scheduler-section"
        aria-label="Wholesale appointment scheduling"
        style={schedulerSectionStyle}
      >
        <div style={schedulerContainerStyle}>
          <div
            className="appointment-scheduler-header"
            style={schedulerHeaderStyle}
          >
            <div>
              <div style={sectionKickerStyle}>Appointment Calendar</div>

              <h2
                className="appointment-scheduler-title"
                style={schedulerTitleStyle}
              >
                Select a time that works for you
              </h2>
            </div>

            <Link
              href="/contact-us"
              className="appointment-secondary-link"
              style={secondaryLinkStyle}
            >
              Contact Us Instead
            </Link>
          </div>

          <div className="appointment-iframe-card" style={iframeCardStyle}>
            <iframe
              className="appointment-iframe"
              src={APPOINTMENT_IFRAME_URL}
              title="Wholesale purchase appointment scheduling"
              loading="lazy"
              allow="fullscreen"
              style={iframeStyle}
            />
          </div>
        </div>
      </section>
    </>
  );
}

const heroStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: 500,
  overflow: "hidden",
  background: "#111827",
};

const heroImageStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const heroOverlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(8,14,27,0.76) 0%, rgba(8,14,27,0.5) 48%, rgba(8,14,27,0.2) 100%)",
};

const heroContentStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  minHeight: 500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "72px 20px",
};

const heroPanelStyle: React.CSSProperties = {
  width: "min(760px, 100%)",
  textAlign: "center",
  padding: "34px 38px",
  borderRadius: 26,
  background: "rgba(4, 10, 22, 0.62)",
  border: "1px solid rgba(255,255,255,0.22)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
  backdropFilter: "blur(8px)",
};

const heroKickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#d8bc55",
  marginBottom: 12,
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(36px, 5vw, 66px)",
  lineHeight: 1,
  color: "#ffffff",
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const heroTextStyle: React.CSSProperties = {
  margin: "18px auto 0",
  maxWidth: 650,
  fontSize: "clamp(15px, 1.4vw, 19px)",
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.84)",
};

const heroButtonStyle: React.CSSProperties = {
  minHeight: 48,
  marginTop: 26,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 24px",
  borderRadius: 999,
  border: "1px solid #d8bc55",
  background: "#d8bc55",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 900,
};

const introSectionStyle: React.CSSProperties = {
  padding: "76px 20px 34px",
  background: "#ffffff",
};

const introContainerStyle: React.CSSProperties = {
  maxWidth: 1220,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "0.95fr 1.05fr",
  gap: 42,
  alignItems: "end",
};

const sectionKickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#2f7d62",
  marginBottom: 12,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 3vw, 46px)",
  lineHeight: 1.08,
  color: "#111827",
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const introTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  lineHeight: 1.9,
  color: "#5f564c",
};

const benefitsSectionStyle: React.CSSProperties = {
  padding: "34px 20px 76px",
  background: "#ffffff",
};

const benefitsGridStyle: React.CSSProperties = {
  maxWidth: 1220,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 22,
};

const benefitCardStyle: React.CSSProperties = {
  padding: 28,
  borderRadius: 24,
  background: "#faf8f4",
  border: "1px solid #e5dccf",
};

const benefitNumberStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  background: "#2f7d62",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 900,
  marginBottom: 20,
};

const benefitTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 900,
  color: "#111827",
};

const benefitTextStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: 15,
  lineHeight: 1.75,
  color: "#5f564c",
};

const ctaSectionStyle: React.CSSProperties = {
  padding: "0 20px 34px",
  background: "#ffffff",
};

const ctaInnerStyle: React.CSSProperties = {
  maxWidth: 1220,
  margin: "0 auto",
  padding: "34px 38px",
  borderRadius: 24,
  background: "#111827",
  border: "1px solid #111827",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 28,
  color: "#ffffff",
};

const ctaTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(26px, 2.6vw, 40px)",
  lineHeight: 1.1,
  fontWeight: 900,
  letterSpacing: "-0.035em",
};

const ctaTextStyle: React.CSSProperties = {
  margin: "12px 0 0",
  maxWidth: 760,
  fontSize: 15,
  lineHeight: 1.8,
  color: "rgba(255,255,255,0.72)",
};

const ctaButtonStyle: React.CSSProperties = {
  minHeight: 48,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 22px",
  borderRadius: 999,
  border: "1px solid #d8bc55",
  background: "#d8bc55",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 900,
  whiteSpace: "nowrap",
};

const schedulerSectionStyle: React.CSSProperties = {
  padding: "42px 20px 90px",
  background: "#ffffff",
};

const schedulerContainerStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
};

const schedulerHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: 22,
  flexWrap: "wrap",
  marginBottom: 24,
};

const schedulerTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px, 2.8vw, 42px)",
  lineHeight: 1.1,
  fontWeight: 900,
  color: "#111827",
  letterSpacing: "-0.035em",
};

const secondaryLinkStyle: React.CSSProperties = {
  minHeight: 44,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
  borderRadius: 999,
  border: "1px solid #d9cfbf",
  background: "#ffffff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 850,
};

const iframeCardStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 26,
  background: "#ffffff",
  border: "1px solid #e5dccf",
  boxShadow: "0 22px 70px rgba(17,24,39,0.08)",
  overflow: "hidden",
};

const iframeStyle: React.CSSProperties = {
  width: "100%",
  height: 720,
  display: "block",
  border: 0,
};