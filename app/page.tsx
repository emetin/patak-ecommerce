import { getSheetData } from "../lib/sheets";

import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionHeading from "../components/ui/SectionHeading";
import ButtonLink from "../components/ui/ButtonLink";

import CollectionCard from "../components/cards/CollectionCard";
import ProductCard from "../components/cards/ProductCard";
import BlogCard from "../components/cards/BlogCard";

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

export default async function HomePage() {
  const products = (await getSheetData("Products")) as ProductItem[];
  const collections = (await getSheetData("Collections")) as CollectionItem[];
  const blog = (await getSheetData("Blog")) as BlogItem[];

  const featuredProducts = products
    .filter((p) => p.status === "published")
    .slice(0, 3);

  const featuredCollections = collections
    .filter((c) => c.status === "published")
    .slice(0, 3);

  const blogPosts = blog
    .filter((b) => b.status === "published")
    .slice(0, 3);

  return (
    <div className="simple-page">

      {/* HERO */}

      <Section className="home-hero">
        <Container>

          <div className="home-hero-grid">

            <div className="home-hero-copy">

              <span className="card-kicker">
                Hospitality Textile
              </span>

              <h1>
                Premium textile collections designed for hotels and hospitality spaces
              </h1>

              <p>
                Patak Textile focuses on hospitality-oriented textile collections.
                Our structure brings bedding, towels and textile products together
                in a more organized and premium presentation layer.
              </p>

              <div className="home-hero-actions">
                <ButtonLink href="/collections">
                  Explore Collections
                </ButtonLink>

                <ButtonLink href="/products" variant="secondary">
                  View Products
                </ButtonLink>
              </div>

            </div>

            <div
              className="home-hero-media"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80")',
              }}
            />

          </div>

        </Container>
      </Section>

      {/* BRAND STATEMENT */}

      <Section>
        <Container>

          <div className="brand-statement">

            <div className="brand-statement-box">

              <span className="card-kicker">
                Hospitality Focus
              </span>

              <h2>
                A clearer structure for hospitality textile collections
              </h2>

              <p>
                Our product organization focuses on hotel, resort and residence
                environments. Collections are structured to simplify the
                discovery of bedding, towel and textile products used in
                hospitality spaces.
              </p>

              <p>
                The goal is to combine clarity, premium presentation and
                organized product grouping.
              </p>

            </div>

            <div
              className="brand-statement-media"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80")',
              }}
            />

          </div>

        </Container>
      </Section>

      {/* COLLECTIONS */}

      <Section>
        <Container>

          <SectionHeading
            kicker="Collections"
            title="Hospitality textile collections"
            text="Explore structured textile collections designed for hospitality environments."
          />

          <div className="cards-3">

            {featuredCollections.map((item, i) => (
              <CollectionCard
                key={i}
                title={item.title || "Collection"}
                description={item.description || ""}
                image={
                  item.image ||
                  "https://images.unsplash.com/photo-1524758631624-e2822e304c36"
                }
                href={`/collections/${item.slug}`}
              />
            ))}

          </div>

        </Container>
      </Section>

      {/* PRODUCTS */}

      <Section>
        <Container>

          <SectionHeading
            kicker="Products"
            title="Selected textile products"
            text="A selection of hospitality-focused textile items from our catalog."
          />

          <div className="cards-3">

            {featuredProducts.map((item, i) => (
              <ProductCard
                key={i}
                title={item.title || "Product"}
                description={
                  item.short_description ||
                  item.description ||
                  ""
                }
                image={
                  item.image ||
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                }
                href={`/products/${item.slug}`}
                collectionLabel={item.collection_slug}
              />
            ))}

          </div>

        </Container>
      </Section>

      {/* BLOG */}

      <Section>
        <Container>

          <SectionHeading
            kicker="Editorial"
            title="Insights from our textile perspective"
            text="Articles and editorial pieces related to hospitality textiles."
          />

          <div className="cards-3">

            {blogPosts.map((item, i) => (
              <BlogCard
                key={i}
                title={item.title || "Blog Post"}
                excerpt={
                  item.excerpt ||
                  item.content?.slice(0, 120) ||
                  ""
                }
                image={
                  item.image ||
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72"
                }
                href={`/blog/${item.slug}`}
              />
            ))}

          </div>

        </Container>
      </Section>

      {/* CTA */}

      <Section>
        <Container>

          <div className="cta-band">

            <h2>
              Explore hospitality textile collections
            </h2>

            <p>
              Browse our structured product catalog and discover textile
              collections designed for hospitality environments.
            </p>

            <div style={{ marginTop: 20 }}>
              <ButtonLink href="/collections" variant="dark">
                View Collections
              </ButtonLink>
            </div>

          </div>

        </Container>
      </Section>

    </div>
  );
}