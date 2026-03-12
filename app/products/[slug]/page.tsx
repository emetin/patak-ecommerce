import { notFound } from "next/navigation";
import { getSheetData } from "../../../lib/sheets";
import Container from "../../../components/ui/Container";
import Section from "../../../components/ui/Section";
import SectionHeading from "../../../components/ui/SectionHeading";
import ProductCard from "../../../components/cards/ProductCard";
import ButtonLink from "../../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../../lib/seo";

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
    const items = (await getSheetData("Products")) as ProductItem[];
    const product =
      items.find(
        (item) =>
          String(item.slug || "").trim().toLowerCase() === decodedSlug &&
          String(item.status || "").trim().toLowerCase() === "published"
      ) || null;

    if (!product) {
      return buildPageMetadata({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        path: `/products/${decodedSlug}`,
      });
    }

    return buildPageMetadata({
      title: product.title || "Product",
      description:
        product.short_description ||
        product.description ||
        "Explore this hospitality textile product.",
      image: product.image || "",
      path: `/products/${decodedSlug}`,
    });
  } catch {
    return buildPageMetadata({
      title: "Products",
      description: "Explore hospitality textile products by Patak Textile.",
      path: `/products/${decodedSlug}`,
    });
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  let product: ProductItem | null = null;
  let relatedProducts: ProductItem[] = [];
  let errorMessage = "";

  try {
    const items = (await getSheetData("Products")) as ProductItem[];

    const foundProduct =
      items.find(
        (item) =>
          String(item.slug || "").trim().toLowerCase() === decodedSlug &&
          String(item.status || "").trim().toLowerCase() === "published"
      ) || null;

    product = foundProduct;

    if (foundProduct) {
      const currentCollectionSlug = String(foundProduct.collection_slug || "")
        .trim()
        .toLowerCase();

      relatedProducts = items
        .filter((item) => {
          const itemSlug = String(item.slug || "").trim().toLowerCase();
          const itemStatus = String(item.status || "").trim().toLowerCase();
          const itemCollectionSlug = String(item.collection_slug || "")
            .trim()
            .toLowerCase();

          return (
            itemSlug !== decodedSlug &&
            itemStatus === "published" &&
            itemCollectionSlug === currentCollectionSlug
          );
        })
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
          <ButtonLink href="/products" variant="secondary">
            ← Back to Products
          </ButtonLink>

          <div className="empty-state" style={{ marginTop: 20 }}>
            <strong>Error:</strong> {errorMessage}
          </div>
        </Container>
      </Section>
    );
  }

  if (!product) {
    notFound();
  }

  const imageUrl =
    product.image?.trim() ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80";

  return (
    <>
      <Section tight>
        <Container>
          <ButtonLink href="/products" variant="secondary">
            ← Back to Products
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
                  backgroundImage: `url(${imageUrl})`,
                }}
              />
            </div>

            <div className="home-split__panel">
              <div className="section-heading__kicker">
                {product.collection_slug || "Product"}
              </div>

              <h1
                style={{
                  margin: "0 0 16px",
                  fontSize: "clamp(34px, 5vw, 64px)",
                  lineHeight: "0.95",
                  letterSpacing: "-0.04em",
                }}
              >
                {product.title || "Untitled Product"}
              </h1>

              {product.short_description ? (
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: 18,
                    lineHeight: 1.8,
                    color: "var(--muted)",
                  }}
                >
                  {product.short_description}
                </p>
              ) : null}

              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: "var(--muted)",
                }}
              >
                {product.description || "No description added yet."}
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
                  <span className="feature-card__index">Collection</span>
                  <h3 style={{ fontSize: 18, marginBottom: 0 }}>
                    {product.collection_slug || "-"}
                  </h3>
                </div>

                <div className="feature-card" style={{ padding: 18 }}>
                  <span className="feature-card__index">Status</span>
                  <h3 style={{ fontSize: 18, marginBottom: 0 }}>
                    {product.status || "-"}
                  </h3>
                </div>

                <div className="feature-card" style={{ padding: 18 }}>
                  <span className="feature-card__index">Featured</span>
                  <h3 style={{ fontSize: 18, marginBottom: 0 }}>
                    {product.featured || "false"}
                  </h3>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                {product.collection_slug ? (
                  <ButtonLink
                    href={`/collections/${product.collection_slug}`}
                    variant="secondary"
                  >
                    View Collection
                  </ButtonLink>
                ) : null}

                <ButtonLink href="/contact-us">Contact Us</ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {relatedProducts.length > 0 ? (
        <Section tone="soft">
          <Container>
            <SectionHeading
              kicker="Related Products"
              title="Other published products from the same collection"
              text="These items belong to the same collection and help visitors continue browsing with a clearer structure."
            />

            <div className="cards-grid cards-grid--3">
              {relatedProducts.map((item, index) => (
                <ProductCard
                  key={`${item.slug || item.title || "related-product"}-${index}`}
                  title={item.title || "Untitled Product"}
                  description={
                    item.short_description ||
                    item.description ||
                    "No description added yet."
                  }
                  image={item.image || ""}
                  href={`/products/${item.slug || ""}`}
                  collectionLabel={item.collection_slug || "Product"}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}