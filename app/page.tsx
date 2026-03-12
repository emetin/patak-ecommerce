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
          <div className="hero__card">
            <div className="hero__overlay" />
            <div className="hero__content">
              <div className="hero__eyebrow">Hospitality Textile</div>

              <h1 className="hero__title">
                Premium textile collections designed for hotels and hospitality
                spaces
              </h1>

              <p className="hero__text">
                Patak Textile presents bedding, towels, bathrobes and curated
                hospitality products through a cleaner, more structured and more
                prestigious digital experience.
              </p>

              <div className="hero__actions">
                <ButtonLink href="/collections">Explore Collections</ButtonLink>
                <ButtonLink href="/products" variant="secondary">
                  View Products
                </ButtonLink>
              </div>

              <div className="hero__stats">
                <div className="hero__stat">
                  <span className="hero__stat-value">Premium</span>
                  <span className="hero__stat-label">
                    Refined product presentation for hospitality textile categories
                  </span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-value">Organized</span>
                  <span className="hero__stat-label">
                    Structured discovery across collections, products and editorial
                    content
                  </span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-value">Focused</span>
                  <span className="hero__stat-label">
                    Built around hotel, resort, residence and spa textile needs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tight>
        <Container>
          <div className="home-split">
            <div className="home-split__panel">
              <SectionHeading
                kicker="Hospitality Focus"
                title="A clearer structure for hospitality textile collections"
                text="Our product organization is built around the needs of hotel, resort and residence environments. The goal is to simplify discovery while preserving a premium visual language."
              />
              <p>
                This project combines clarity, premium presentation and organized
                product grouping. Instead of overwhelming visitors, it guides them
                toward the right collection, product family and textile category
                with a more editorial flow.
              </p>
            </div>

            <div className="home-split__quote">
              <div className="home-split__quote-inner">
                <p className="home-split__quote-text">
                  Designed to present hospitality textiles with greater elegance,
                  clarity and confidence.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            kicker="Brand Structure"
            title="A premium presentation system for textile categories"
            text="The homepage now introduces Patak Textile through a more polished hierarchy, making collections and products easier to browse while supporting a stronger hospitality image."
          />

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-card__index">01 / Collections</span>
              <h3>Category-driven discovery</h3>
              <p>
                Visitors can move through organized hospitality product groups
                instead of facing a disconnected catalog experience.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-card__index">02 / Products</span>
              <h3>Clear product storytelling</h3>
              <p>
                Product blocks highlight essentials with a more curated editorial
                rhythm suitable for premium textile positioning.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-card__index">03 / Editorial</span>
              <h3>Stronger brand perception</h3>
              <p>
                Blog and content areas support trust, presentation quality and
                long-term SEO growth for the public-facing site.
              </p>
            </article>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            kicker="Collections"
            title="Curated hospitality textile groups"
            text="Explore key collection families structured for hospitality use cases."
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

      <Section tone="soft">
        <Container>
          <SectionHeading
            kicker="Products"
            title="Featured hospitality products"
            text="A quick look at selected items from the current catalog."
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
            kicker="Editorial"
            title="Insights, updates and brand perspective"
            text="Editorial content supports both presentation quality and discoverability."
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
            <h2>Explore hospitality textile collections with a clearer structure</h2>
            <p>
              Browse the product catalog, review collection groupings and discover a
              more polished digital presentation built for Patak Textile.
            </p>
            <div className="cta-panel__actions">
              <ButtonLink href="/collections">View Collections</ButtonLink>
              <ButtonLink href="/products" variant="secondary">
                Browse Products
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}