import type { Metadata } from "next";
import { getSheetData } from "../lib/sheets";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionHeading from "../components/ui/SectionHeading";
import ButtonLink from "../components/ui/ButtonLink";
import CollectionCard from "../components/cards/CollectionCard";
import ProductCard from "../components/cards/ProductCard";
import BlogCard from "../components/cards/BlogCard";
import { buildPageMetadata } from "../lib/seo";

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
  title: "Patak Textile",
  description:
    "Premium hospitality textile collections, hotel bedding, towels, bathrobes and curated textile solutions by Patak Textile.",
  path: "/",
});

export default async function HomePage() {
  const products = (await getSheetData("Products")) as ProductItem[];
  const collections = (await getSheetData("Collections")) as CollectionItem[];
  const blog = (await getSheetData("Blog")) as BlogItem[];

  const featuredProducts = products
    .filter((p) => String(p.status || "").trim().toLowerCase() === "published")
    .slice(0, 3);

  const featuredCollections = collections
    .filter((c) => String(c.status || "").trim().toLowerCase() === "published")
    .slice(0, 3);

  const blogPosts = blog
    .filter((b) => String(b.status || "").trim().toLowerCase() === "published")
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <Container>
          <div className="hero__wrap">
            <div className="hero__content">
              <div className="hero__eyebrow">Trusted by Hotels & Residences</div>

              <h1 className="hero__title">
                Excellence in textile supply for hospitality and home
              </h1>

              <p className="hero__subheadline">Softness You’ll Love</p>

              <p className="hero__text">
                Welcome to Patak Textile, your trusted partner in premium textile
                solutions for distinguished hotels and residences. We bring together
                Turkish craftsmanship, hospitality-focused quality and a cleaner
                digital presentation that feels both corporate and prestigious.
              </p>

              <div className="hero__actions">
                <ButtonLink href="/collections">Explore Collections</ButtonLink>
                <ButtonLink href="/products" variant="secondary">
                  View Products
                </ButtonLink>
              </div>

              <div className="hero__stats">
                <div className="hero__stat">
                  <span className="hero__stat-value">Sustainable</span>
                  <span className="hero__stat-label">
                    Responsible production and carefully selected materials.
                  </span>
                </div>

                <div className="hero__stat">
                  <span className="hero__stat-value">Reliable</span>
                  <span className="hero__stat-label">
                    Strong customer communication and a dependable supply approach.
                  </span>
                </div>

                <div className="hero__stat">
                  <span className="hero__stat-value">Refined</span>
                  <span className="hero__stat-label">
                    Hospitality textile collections built for comfort and long-term use.
                  </span>
                </div>
              </div>
            </div>

            <div className="hero__media">
              <div className="hero__media-badge">Premium Hospitality Textile</div>
            </div>
          </div>
        </Container>
      </section>

      <Section tight>
        <Container>
          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-card__index">01 / Production</span>
              <h3>Sustainable production</h3>
              <p>
                We support responsible textile manufacturing with a more conscious
                approach to production and material selection.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-card__index">02 / Communication</span>
              <h3>Professional support</h3>
              <p>
                Clear customer communication and responsive support help create
                stronger long-term business partnerships.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-card__index">03 / Supply Chain</span>
              <h3>Fast and reliable supply</h3>
              <p>
                Our supply approach is structured to support hospitality projects
                with consistency and dependable fulfillment.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-card__index">04 / Quality</span>
              <h3>Quality control</h3>
              <p>
                We maintain strict quality standards to ensure long-lasting
                performance and a stronger guest experience.
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
                title="A cleaner and more trusted presentation for premium textile supply"
                text="Based in Denizli, Patak Textile combines Turkish textile expertise with hospitality-driven quality standards. This renewed structure aims to present the brand in a way that feels clearer, more modern and more prestigious."
              />
              <p>
                Instead of overwhelming visitors, the homepage now guides them through
                the brand story, product families and editorial content with better
                rhythm. The result is a stronger balance between clean corporate trust
                and premium visual perception.
              </p>
            </div>

            <div className="home-split__quote">
              <div className="home-split__quote-inner">
                <p className="home-split__quote-text">
                  Premium Turkish cotton hotel textiles designed to elevate comfort,
                  aesthetics and reliability.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            kicker="Collections"
            title="Curated hospitality textile groups"
            text="Explore collection families built to make hospitality textile discovery cleaner, faster and more professional."
          />

          {featuredCollections.length > 0 ? (
            <div className="cards-grid cards-grid--3">
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

      <Section>
        <Container>
          <SectionHeading
            kicker="Products"
            title="Premium quality hospitality textile products"
            text="Selected products are presented with a more refined card system while keeping the browsing flow simple and corporate."
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

      <Section tone="soft">
        <Container>
          <SectionHeading
            kicker="Editorial"
            title="Insights, updates and brand perspective"
            text="Editorial content supports trust, discoverability and a more complete brand experience."
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
          <div className="cta-panel">
            <h2>Explore Patak Textile with a more refined and structured experience</h2>
            <p>
              Discover collections, browse products and review editorial content
              through a digital presentation that combines corporate clarity with a
              more prestigious visual layer.
            </p>

            <div className="cta-panel__actions">
              <ButtonLink href="/collections">View Collections</ButtonLink>
              <ButtonLink href="/contact-us" variant="secondary">
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}