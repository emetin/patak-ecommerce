import type { Metadata } from "next";
import { getSheetData } from "../lib/sheets";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionHeading from "../components/ui/SectionHeading";
import ButtonLink from "../components/ui/ButtonLink";
import CollectionCard from "../components/cards/CollectionCard";
import ProductCard from "../components/cards/ProductCard";
import BlogCard from "../components/cards/BlogCard";
import ScrollPromo from "../components/sections/ScrollPromo";
import { buildPageMetadata } from "../lib/seo";

export const revalidate = 300;

type ProductItem = {
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  image?: string;
  collection_slug?: string;
  status?: string;
  featured?: string;
};

type CollectionItem = {
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: string;
};

type BlogItem = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  status?: string;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Patak Textile | Premium Turkish Cotton Hotel Textiles",
  description:
    "Patak Textile delivers premium Turkish cotton textile solutions for hotels, residences and professional hospitality projects from Denizli, Turkey.",
  path: "/",
});

function isPublished(value?: string) {
  return String(value || "").trim().toLowerCase() === "published";
}

export default async function HomePage() {
  const [productsData, collectionsData, blogData] = await Promise.all([
    getSheetData("products"),
    getSheetData("collections"),
    getSheetData("blog"),
  ]);

  const products = (productsData as ProductItem[]).filter((item) =>
    isPublished(item.status)
  );

  const collections = (collectionsData as CollectionItem[]).filter((item) =>
    isPublished(item.status)
  );

  const blog = (blogData as BlogItem[]).filter((item) =>
    isPublished(item.status)
  );

  const featuredProducts = products.slice(0, 3);
  const featuredCollections = collections.slice(0, 4);
  const blogPosts = blog.slice(0, 3);

  return (
    <>
      <section className="home-hero">
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80"
          alt="Premium Turkish cotton hotel textiles"
          className="home-hero__image"
        />

        <div className="home-hero__overlay" />

        <Container>
          <div className="home-hero__inner">
            <div className="home-hero__badge">
              Premium Turkish Cotton Textiles
            </div>

            <div className="home-hero__copy">
              <h1 className="home-hero__title">
                Excellence in Textile Supply for Hospitality and Home
              </h1>

              <p className="home-hero__text">
                Based in Denizli, Turkey, Patak Textile delivers premium textile
                solutions for distinguished hotels, residences and professional
                projects worldwide. We combine Turkish cotton quality, refined
                workmanship and reliable supply standards.
              </p>
            </div>

            <div className="home-hero__actions">
              <ButtonLink href="/collections">Explore Collections</ButtonLink>
              <ButtonLink href="/contact-us" variant="secondary">
                Contact Our Team
              </ButtonLink>
            </div>

            <div className="home-hero__features">
              <div className="home-hero__feature">
                <div className="home-hero__feature-kicker">Material</div>
                <div className="home-hero__feature-title">Turkish Cotton</div>
                <div className="home-hero__feature-text">
                  Natural softness, breathability and long-lasting comfort for
                  professional hospitality use.
                </div>
              </div>

              <div className="home-hero__feature">
                <div className="home-hero__feature-kicker">Production</div>
                <div className="home-hero__feature-title">Sustainable</div>
                <div className="home-hero__feature-text">
                  Responsible material selection and production methods designed
                  to reduce environmental impact.
                </div>
              </div>

              <div className="home-hero__feature">
                <div className="home-hero__feature-kicker">Supply</div>
                <div className="home-hero__feature-title">Reliable</div>
                <div className="home-hero__feature-text">
                  Fast, structured and dependable textile supply for hotels,
                  residences and project-based needs.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ScrollPromo
        items={[
          "Hospitality Textile Supply",
          "100% Premium Turkish Cotton",
          "Sustainable Production",
          "Quality Control and Assurance",
          "Reliable Supply Chain",
          "Customized Textile Solutions",
        ]}
      />

      <Section tight>
        <Container>
          <div className="home-feature-grid">
            <article className="home-feature-card">
              <div style={featureKickerStyle}>01 / Sustainability</div>
              <h3 style={featureTitleStyle}>
                Sustainable production and material selection
              </h3>
              <p style={featureTextStyle}>
                We minimize environmental impact through responsible production
                methods and careful material selection.
              </p>
            </article>

            <article className="home-feature-card">
              <div style={featureKickerStyle}>02 / Support</div>
              <h3 style={featureTitleStyle}>
                Customer communication and support
              </h3>
              <p style={featureTextStyle}>
                We build strong business partnerships through professional
                communication, fast support and solution-focused service.
              </p>
            </article>

            <article className="home-feature-card">
              <div style={featureKickerStyle}>03 / Supply</div>
              <h3 style={featureTitleStyle}>
                Fast and reliable supply chain
              </h3>
              <p style={featureTextStyle}>
                We support our customers with effective supply chain management
                and dependable product availability.
              </p>
            </article>

            <article className="home-feature-card">
              <div style={featureKickerStyle}>04 / Quality</div>
              <h3 style={featureTitleStyle}>
                Quality control and assurance
              </h3>
              <p style={featureTextStyle}>
                We apply strict quality control processes to ensure our products
                meet high standards for professional use.
              </p>
            </article>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="home-split">
            <div className="home-split__panel">
              <SectionHeading
                kicker="About Patak Textile"
                title="Trusted by hotels and residences"
                text="Professional textile solutions with consistent, long-lasting quality."
              />

              <p>
                Welcome to Patak Textile, your trusted partner in premium textile
                solutions for distinguished hotels and residences worldwide.
                Located in Denizli, the heart of Turkish textile craftsmanship,
                we combine industry expertise with refined production standards.
              </p>

              <p>
                Our collections are designed to enhance comfort, aesthetics and
                operational efficiency. From premium bedding to towels and
                project-based textile solutions, we focus on durability,
                softness and consistent performance.
              </p>

              <p>
                Patak Textile brings together traditional craftsmanship and a
                modern, sustainability-driven approach to create textiles that
                leave a lasting impression in every space.
              </p>
            </div>

            <div className="home-split__media">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
                alt="Premium textile production"
              />
              <div className="home-split__media-overlay" />
              <div className="home-split__media-card">
                <div className="home-split__media-card-kicker">
                  Denizli Textile Craftsmanship
                </div>
                <div className="home-split__media-card-title">
                  Comfort, durability and elegance for professional spaces
                </div>
                <div className="home-split__media-card-text">
                  Our textile solutions are created for hotels, residences and
                  environments where quality is noticed every day.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            kicker="Turkish Cotton"
            title="Premium quality hotel textiles"
            text="Our hotel textiles are crafted from premium Turkish cotton, combining natural softness with durability for frequent professional laundering."
          />

          <div className="home-feature-grid">
            <article className="home-feature-card">
              <div style={featureKickerStyle}>Softness</div>
              <h3 style={featureTitleStyle}>Natural comfort</h3>
              <p style={featureTextStyle}>
                Turkish cotton is known for its soft touch, breathability and
                elevated guest experience.
              </p>
            </article>

            <article className="home-feature-card">
              <div style={featureKickerStyle}>Durability</div>
              <h3 style={featureTitleStyle}>Built for hotels</h3>
              <p style={featureTextStyle}>
                Strong fiber quality helps products maintain performance through
                regular commercial use.
              </p>
            </article>

            <article className="home-feature-card">
              <div style={featureKickerStyle}>Maintenance</div>
              <h3 style={featureTitleStyle}>Easy to wash</h3>
              <p style={featureTextStyle}>
                Designed for efficient care, quick maintenance and long-term
                textile reliability.
              </p>
            </article>

            <article className="home-feature-card">
              <div style={featureKickerStyle}>Experience</div>
              <h3 style={featureTitleStyle}>Memorable stays</h3>
              <p style={featureTextStyle}>
                Textiles that support comfort, presentation and guest
                satisfaction at a higher standard.
              </p>
            </article>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            kicker="Collections"
            title="Explore our textile collections"
            text="Browse our hospitality and home textile collections designed for comfort, elegance and reliable performance."
          />

          {featuredCollections.length > 0 ? (
            <div className="cards-grid cards-grid--4">
              {featuredCollections.map((item, i) => (
                <CollectionCard
                  key={`${item.slug || item.title || "collection"}-${i}`}
                  title={item.title || "Collection"}
                  description={
                    item.description ||
                    "Explore this hospitality-focused textile collection."
                  }
                  image={item.image || ""}
                  href={`/collections/${item.slug || ""}`}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">No published collections found yet.</div>
          )}
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            kicker="Product Showcase"
            title="Textile products for professional use"
            text="Discover selected products designed for hotels, residences and refined textile projects."
          />

          {featuredProducts.length > 0 ? (
            <div className="cards-grid cards-grid--3">
              {featuredProducts.map((item, i) => (
                <ProductCard
                  key={`${item.slug || item.title || "product"}-${i}`}
                  title={item.title || "Product"}
                  description={
                    item.short_description ||
                    item.description ||
                    "Explore this hospitality textile product."
                  }
                  image={item.image || ""}
                  href={`/products/${item.slug || ""}`}
                  collectionLabel={item.collection_slug || "Product"}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">No published products found yet.</div>
          )}
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            kicker="Insights"
            title="Textile knowledge and company updates"
            text="Follow our latest updates, press releases and textile-focused insights from Patak Textile."
          />

          {blogPosts.length > 0 ? (
            <div className="cards-grid cards-grid--3">
              {blogPosts.map((item, i) => (
                <BlogCard
                  key={`${item.slug || item.title || "blog"}-${i}`}
                  title={item.title || "Article"}
                  excerpt={
                    item.excerpt ||
                    item.content ||
                    "Read more from our hospitality textile perspective."
                  }
                  image={item.image || ""}
                  href={`/blog/${item.slug || ""}`}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">No published blog posts found yet.</div>
          )}
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="cta-panel-strong">
            <div className="cta-panel-strong__circle--one" />
            <div className="cta-panel-strong__circle--two" />

            <div className="cta-panel-strong__inner">
              <div className="cta-panel-strong__kicker">
                Work with Patak Textile
              </div>

              <h2 className="cta-panel-strong__title">
                Create a stronger textile experience for your guests and
                projects
              </h2>

              <p className="cta-panel-strong__text">
                From Turkish cotton hotel textiles to customized project-based
                solutions, Patak Textile is ready to support your professional
                textile needs with quality, consistency and care.
              </p>

              <div className="cta-panel-strong__actions">
                <ButtonLink href="/collections">View Collections</ButtonLink>
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

const featureKickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#7a7064",
  marginBottom: 12,
};

const featureTitleStyle: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 800,
  color: "#171717",
};

const featureTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#5a5349",
  lineHeight: 1.85,
  fontSize: 15,
};