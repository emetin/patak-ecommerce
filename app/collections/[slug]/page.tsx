import { notFound } from "next/navigation";
import { getSheetData } from "../../../lib/sheets";
import Container from "../../../components/ui/Container";
import Section from "../../../components/ui/Section";
import SectionHeading from "../../../components/ui/SectionHeading";
import ProductCard from "../../../components/cards/ProductCard";
import ButtonLink from "../../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../../lib/seo";

type CollectionItem = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type ProductItem = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  image?: string;
  gallery?: string;
  collection_slug?: string;
  status?: string;
  featured?: string;
  created_at?: string;
  updated_at?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  try {
    const items = (await getSheetData("Collections")) as CollectionItem[];
    const collection =
      items.find(
        (item) =>
          String(item.slug || "").trim().toLowerCase() === decodedSlug &&
          String(item.status || "").trim().toLowerCase() === "published"
      ) || null;

    if (!collection) {
      return buildPageMetadata({
        title: "Collection Not Found",
        description: "The requested collection could not be found.",
        path: `/collections/${decodedSlug}`,
      });
    }

    return buildPageMetadata({
      title: collection.title || "Collection",
      description:
        collection.description ||
        "Explore this hospitality textile collection by Patak Textile.",
      image: collection.image || "",
      path: `/collections/${decodedSlug}`,
    });
  } catch {
    return buildPageMetadata({
      title: "Collections",
      description: "Explore hospitality textile collections by Patak Textile.",
      path: `/collections/${decodedSlug}`,
    });
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  let collection: CollectionItem | null = null;
  let products: ProductItem[] = [];
  let featuredProducts: ProductItem[] = [];
  let errorMessage = "";

  try {
    const [collectionItems, productItems] = await Promise.all([
      getSheetData("Collections"),
      getSheetData("Products"),
    ]);

    const collections = collectionItems as CollectionItem[];
    const allProducts = productItems as ProductItem[];

    collection =
      collections.find(
        (item) =>
          String(item.slug || "").trim().toLowerCase() === decodedSlug &&
          String(item.status || "").trim().toLowerCase() === "published"
      ) || null;

    if (collection) {
      products = allProducts.filter((item) => {
        const itemStatus = String(item.status || "").trim().toLowerCase();
        const itemCollectionSlug = String(item.collection_slug || "")
          .trim()
          .toLowerCase();

        return itemStatus === "published" && itemCollectionSlug === decodedSlug;
      });

      featuredProducts = products
        .filter(
          (item) => String(item.featured || "").trim().toLowerCase() === "true"
        )
        .slice(0, 3);
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";
  }

  if (errorMessage) {
    return (
      <Section>
        <Container>
          <ButtonLink href="/collections" variant="secondary">
            ← Back to Collections
          </ButtonLink>

          <div className="empty-state" style={{ marginTop: 20 }}>
            <strong>Error:</strong> {errorMessage}
          </div>
        </Container>
      </Section>
    );
  }

  if (!collection) {
    notFound();
  }

  const heroImage =
    collection.image?.trim() ||
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80";

  return (
    <>
      <Section tight>
        <Container>
          <ButtonLink href="/collections" variant="secondary">
            ← Back to Collections
          </ButtonLink>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="home-split">
            <div
              className="content-card"
              style={{ overflow: "hidden", minHeight: 520 }}
            >
              <div
                className="content-card__media"
                style={{
                  aspectRatio: "4 / 4",
                  minHeight: 520,
                  backgroundImage: `url(${heroImage})`,
                }}
              />
            </div>

            <div className="home-split__panel">
              <div className="section-heading__kicker">Collection</div>

              <h1
                style={{
                  margin: "0 0 16px",
                  fontSize: "clamp(34px, 5vw, 64px)",
                  lineHeight: "0.95",
                  letterSpacing: "-0.04em",
                }}
              >
                {collection.title || "Untitled Collection"}
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: "var(--muted)",
                }}
              >
                {collection.description ||
                  "No description has been added for this collection yet."}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 14,
                  marginTop: 28,
                }}
              >
                <div className="feature-card" style={{ padding: 18 }}>
                  <span className="feature-card__index">Slug</span>
                  <h3 style={{ fontSize: 18, marginBottom: 0 }}>
                    {collection.slug || "-"}
                  </h3>
                </div>

                <div className="feature-card" style={{ padding: 18 }}>
                  <span className="feature-card__index">Status</span>
                  <h3 style={{ fontSize: 18, marginBottom: 0 }}>
                    {collection.status || "-"}
                  </h3>
                </div>

                <div className="feature-card" style={{ padding: 18 }}>
                  <span className="feature-card__index">Products</span>
                  <h3 style={{ fontSize: 18, marginBottom: 0 }}>
                    {products.length}
                  </h3>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <ButtonLink href="/products" variant="secondary">
                  Browse Products
                </ButtonLink>
                <ButtonLink href="/contact-us">Contact Us</ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {featuredProducts.length > 0 ? (
        <Section tone="soft">
          <Container>
            <SectionHeading
              kicker="Featured Products"
              title="Highlighted published products from this collection"
              text="Featured items help present the collection with more visual clarity and stronger browsing flow."
            />

            <div className="cards-grid cards-grid--3">
              {featuredProducts.map((item, index) => (
                <ProductCard
                  key={`${item.slug || item.title || "featured-product"}-${index}`}
                  title={item.title || "Untitled Product"}
                  description={
                    item.short_description ||
                    item.description ||
                    "No description has been added yet."
                  }
                  image={item.image || ""}
                  href={`/products/${item.slug || ""}`}
                  collectionLabel={collection.title || "Featured Product"}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <SectionHeading
            kicker="All Products"
            title={`Published products in ${collection.title || "this collection"}`}
            text="These are the currently published products assigned to this collection."
          />

          {products.length > 0 ? (
            <div className="cards-grid cards-grid--3">
              {products.map((item, index) => (
                <ProductCard
                  key={`${item.slug || item.title || "collection-product"}-${index}`}
                  title={item.title || "Untitled Product"}
                  description={
                    item.short_description ||
                    item.description ||
                    "No description has been added yet."
                  }
                  image={item.image || ""}
                  href={`/products/${item.slug || ""}`}
                  collectionLabel={collection.title || "Collection"}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No published products were found in this collection.
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}