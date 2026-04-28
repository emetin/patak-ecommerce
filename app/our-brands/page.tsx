import type { Metadata } from "next";
import OurBrandsBanner from "../../components/sections/OurBrandsBanner";
import BrandGallery from "../../components/sections/BrandGallery";
import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Brands",
  description:
    "Explore Patak Textile’s premium brand portfolio through a refined presentation of our textile identity, production strength and hospitality-focused structure.",
  path: "/our-brands",
});

export default function OurBrandsPage() {
  return (
    <>
      <OurBrandsBanner />

      <Section tight>
        <Container>
          <BrandGallery />
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="brand-strength-modern">
            <div className="brand-strength-modern__header">
              <span>Brand Strength</span>
              <h2>What our brand structure communicates</h2>
              <p>
                Our brand world is designed to create a stronger connection
                between textile quality, visual trust and long-term customer
                confidence.
              </p>
            </div>

            <div className="brand-strength-modern__grid">
              {[
                {
                  title: "Trust",
                  text: "A cleaner visual system helps establish stronger confidence in the brand and its capabilities.",
                },
                {
                  title: "Clarity",
                  text: "Organized brand presentation makes it easier for customers to understand our textile world.",
                },
                {
                  title: "Continuity",
                  text: "A consistent brand language supports long-term recognition and stronger corporate identity.",
                },
                {
                  title: "Prestige",
                  text: "Subtle refinement in presentation strengthens the premium image of our textile products.",
                },
              ].map((item) => (
                <div key={item.title} className="brand-strength-modern__card">
                  <span>{item.title.slice(0, 1)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="brand-cta-modern">
            <div>
              <span>Collections</span>
              <h2>Explore our collections through a stronger brand structure</h2>
              <p>
                Review our curated categories and product groups with a cleaner,
                more premium and more consistent presentation layer.
              </p>
            </div>

            <div className="brand-cta-modern__actions">
              <ButtonLink href="/collections">View Collections</ButtonLink>
              <ButtonLink href="/products" variant="secondary">
                Browse Products
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <style>{`
        .brand-strength-modern {
          display: grid;
          gap: 42px;
          padding: 74px 0 36px;
        }

        .brand-strength-modern__header {
          max-width: 760px;
        }

        .brand-strength-modern__header span,
        .brand-cta-modern span {
          display: inline-flex;
          margin-bottom: 14px;
          color: #137231;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .brand-strength-modern__header h2,
        .brand-cta-modern h2 {
          margin: 0;
          color: #101010;
          font-size: clamp(36px, 4vw, 62px);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 900;
        }

        .brand-strength-modern__header p,
        .brand-cta-modern p {
          margin: 18px 0 0;
          color: #6c6257;
          font-size: 17px;
          line-height: 1.75;
        }

        .brand-strength-modern__grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .brand-strength-modern__card {
          min-height: 260px;
          padding: 28px;
          border-radius: 28px;
          background:
            linear-gradient(180deg, #ffffff 0%, #f8f6f0 100%);
          border: 1px solid rgba(17, 17, 17, 0.08);
          box-shadow: 0 20px 70px rgba(18, 18, 18, 0.06);
        }

        .brand-strength-modern__card span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          margin-bottom: 28px;
          border-radius: 999px;
          background: rgba(19, 114, 49, 0.1);
          color: #137231;
          font-weight: 900;
        }

        .brand-strength-modern__card h3 {
          margin: 0;
          color: #101010;
          font-size: 24px;
          font-weight: 900;
        }

        .brand-strength-modern__card p {
          margin: 12px 0 0;
          color: #6f6559;
          font-size: 15px;
          line-height: 1.7;
        }

        .brand-cta-modern {
          margin: 44px 0 36px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 36px;
          align-items: center;
          padding: 46px;
          border-radius: 34px;
          background:
            radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 35%),
            linear-gradient(135deg, #0f4f27 0%, #137231 100%);
          color: #ffffff;
          box-shadow: 0 30px 90px rgba(19, 114, 49, 0.22);
        }

        .brand-cta-modern span,
        .brand-cta-modern h2,
        .brand-cta-modern p {
          color: #ffffff;
        }

        .brand-cta-modern p {
          max-width: 680px;
          opacity: 0.86;
        }

        .brand-cta-modern__actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        @media (max-width: 1050px) {
          .brand-strength-modern__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .brand-cta-modern {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .brand-strength-modern__grid {
            grid-template-columns: 1fr;
          }

          .brand-cta-modern {
            padding: 30px;
          }
        }
      `}</style>
    </>
  );
}