import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="footer-root"
      style={{
        marginTop: 80,
        background: "#111715",
        color: "#fff",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="footer-container"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "56px 20px 24px",
        }}
      >
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr 0.75fr 1fr",
            gap: 28,
            marginBottom: 36,
          }}
        >
          <div className="footer-brand">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, #17352d 0%, #2f7d62 75%, #49a487 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 16,
                  letterSpacing: "0.04em",
                  flexShrink: 0,
                }}
              >
                PT
              </div>

              <div style={{ display: "grid", gap: 2 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  Patak Textile
                </span>
                <span
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.52)",
                    fontWeight: 800,
                  }}
                >
                  Corporate Textile Presentation
                </span>
              </div>
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.9,
                fontSize: 15,
                maxWidth: 420,
              }}
            >
              <div>+90 (258) 408 47 57</div>
              <div>Selcukbey Mah. Evora Houses</div>
              <div>C1 Block 9/A Floor:17 No:156</div>
              <div>20010 Merkezefendi / Denizli / TÜRKİYE</div>

              <div style={{ marginTop: 14 }}>
                <Link href="/contact-us" style={footerButtonStyle}>
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>

          <div className="footer-column">
            <div style={footerTitleStyle}>Quick Links</div>
            <div style={footerListStyle}>
              <Link href="/about-us" style={footerLinkStyle}>
                About Us
              </Link>
              <Link href="/our-services" style={footerLinkStyle}>
                Services
              </Link>
              <Link href="/careers" style={footerLinkStyle}>
                Careers
              </Link>
              <Link href="/press-release" style={footerLinkStyle}>
                Press Release
              </Link>
              <Link href="/cookie-policy" style={footerLinkStyle}>
                Cookie Policy
              </Link>
            </div>
          </div>

          <div className="footer-column">
            <div style={footerTitleStyle}>Customer Services</div>
            <div style={footerListStyle}>
              <Link href="/blog" style={footerLinkStyle}>
                Blog
              </Link>
              <Link href="/collections" style={footerLinkStyle}>
                Collections
              </Link>
              <Link href="/our-brands" style={footerLinkStyle}>
                Our Brands
              </Link>
              <Link href="/our-ceo" style={footerLinkStyle}>
                Our CEO
              </Link>
              <Link href="/kvkk" style={footerLinkStyle}>
                KVKK
              </Link>
            </div>
          </div>

          <div className="footer-newsletter">
            <div style={footerTitleStyle}>Subscribe to our newsletter</div>

            <p
              style={{
                margin: "0 0 16px",
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              Be the first to know about new collections and exclusive offers.
            </p>

            <form style={newsletterFormStyle}>
              <div style={newsletterInputWrapStyle}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email"
                  style={newsletterInputStyle}
                />
              </div>

              <button
                type="submit"
                className="footer-newsletter-button"
                style={newsletterButtonStyle}
              >
                Subscribe
              </button>
            </form>

            <div style={socialWrapperStyle}>
              <a
                href="#"
                aria-label="Instagram"
                className="footer-social-link"
                style={socialStyle}
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="footer-social-link"
                style={socialStyle}
              >
                <LinkedInIcon />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="footer-social-link"
                style={socialStyle}
              >
                <FacebookIcon />
              </a>
            </div>
          </div>
        </div>

        <div style={policyBarStyle}>
          <Link
            href="/privacy-policy"
            className="footer-policy-link"
            style={policyLinkStyle}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="footer-policy-link"
            style={policyLinkStyle}
          >
            Terms & Conditions
          </Link>
          <Link
            href="/cookie-policy"
            className="footer-policy-link"
            style={policyLinkStyle}
          >
            Cookie Policy
          </Link>
          <Link href="/kvkk" className="footer-policy-link" style={policyLinkStyle}>
            KVKK
          </Link>
          <Link
            href="/return-policy"
            className="footer-policy-link"
            style={policyLinkStyle}
          >
            Return Policy
          </Link>
        </div>

        <div
          className="footer-bottom"
          style={{
            minHeight: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)",
            fontSize: 14,
          }}
        >
          <div>© 2026 Patak Textile. All rights reserved.</div>
          <div>
            Corporate textile catalog presentation designed for long-term brand
            growth.
          </div>
        </div>
      </div>

      <style>{`
        .footer-newsletter input::placeholder {
          color: rgba(255,255,255,0.48);
        }

        .footer-social-link:hover {
          transform: translateY(-4px);
          background: #2f7d62 !important;
          border-color: #2f7d62 !important;
          color: #ffffff !important;
          box-shadow: 0 14px 30px rgba(47,125,98,0.24);
        }

        .footer-policy-link:hover {
          color: #ffffff !important;
        }

        .footer-newsletter-button:hover {
          background: #ffffff !important;
          color: #2f7d62 !important;
          border-color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(255,255,255,0.12);
        }

        @media (max-width: 1100px) {
          .footer-grid {
            grid-template-columns: 1.2fr 1fr !important;
            gap: 34px 28px !important;
          }

          .footer-brand {
            grid-column: span 2;
          }
        }

        @media (max-width: 720px) {
          .footer-root {
            margin-top: 56px !important;
          }

          .footer-container {
            padding: 42px 16px 22px !important;
          }

          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
            margin-bottom: 30px !important;
          }

          .footer-brand {
            grid-column: auto;
          }

          .footer-bottom {
            min-height: auto !important;
            align-items: flex-start !important;
            flex-direction: column !important;
            gap: 10px !important;
            font-size: 13px !important;
            line-height: 1.7 !important;
          }
        }
      `}</style>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 9.5V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 19V14.2C11 11.9 12.3 10.6 14.2 10.6C16.1 10.6 17.5 11.9 17.5 14.2V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="6.5" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 8H16V4H13.5C10.8 4 9 5.8 9 8.6V11H6.8V15H9V20H13V15H15.6L16.2 11H13V8.8C13 8.3 13.3 8 14 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

const footerTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.52)",
  marginBottom: 14,
};

const footerListStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const footerLinkStyle: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 700,
};

const footerButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 12,
  background: "#2f7d62",
  color: "#fff",
  border: "1px solid #2f7d62",
  textDecoration: "none",
  fontWeight: 800,
};

const newsletterFormStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 14,
};

const newsletterInputWrapStyle: React.CSSProperties = {
  minHeight: 50,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
};

const newsletterInputStyle: React.CSSProperties = {
  width: "100%",
  border: 0,
  background: "transparent",
  color: "#fff",
  padding: 0,
  outline: "none",
  fontSize: 14,
  fontWeight: 600,
};

const newsletterButtonStyle: React.CSSProperties = {
  minHeight: 50,
  borderRadius: 999,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 14,
  letterSpacing: "0.01em",
  transition: "all 0.22s ease",
};

const socialWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 18,
};

const socialStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.18)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  textDecoration: "none",
  background: "rgba(255,255,255,0.06)",
  transition: "all 0.22s ease",
};

const policyBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 18,
  flexWrap: "wrap",
  padding: "22px 0",
  marginTop: 8,
};

const policyLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.58)",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 700,
  transition: "color 0.2s ease",
};