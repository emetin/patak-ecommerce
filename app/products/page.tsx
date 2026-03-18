import type { Metadata } from "next";
import Link from "next/link";
import { getSheetData } from "../../lib/sheets";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import ButtonLink from "../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../lib/seo";

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
  seo_title?: string;
  seo_description?: string;
};

type VariantItem = {
  id?: string;
  product_slug?: string;
  price?: string;
  compare_at_price?: string;
  status?: string;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Products",
  description:
    "Explore premium hospitality textile products including bedding, towels, bathrobes and curated hotel textile solutions by Patak Textile.",
  path: "/products",
});

function formatCollectionLabel(value?: string) {
  const raw = String(value || "").trim();
  if (!raw) return "Product";

  return raw
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parsePrice(value?: string) {
  const num = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

export default async function ProductsPage() {
  let products: ProductItem[] = [];
  let variants: VariantItem[] = [];
  let errorMessage = "";

  try {
    const [productData, variantData] = await Promise.all([
      getSheetData("products"),
      getSheetData("product_variants"),
    ]);

    products = (productData as ProductItem[])
      .filter(
        (item) => String(item.status || "").trim().toLowerCase() === "published"
      )
      .sort((a, b) => {
        const aFeatured = String(a.featured || "").trim().toLowerCase() === "true";
        const bFeatured = String(b.featured || "").trim().toLowerCase() === "true";

        if (aFeatured !== bFeatured) {
          return aFeatured ? -1 : 1;
        }

        return String(a.title || "").localeCompare(String(b.title || ""));
      });

    variants = variantData as VariantItem[];
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";
  }

  const variantsBySlug = new Map<string, VariantItem[]>();

  for (const variant of variants) {
    const slug = String(variant.product_slug || "").trim().toLowerCase();
    if (!slug) continue;

    const current = variantsBySlug.get(slug) || [];
    current.push(variant);
    variantsBySlug.set(slug, current);
  }

  return (
    <>
      <section className="page-hero">
        <Container>
          <div className="page-hero__inner">
            <div className="page-hero__kicker">Products</div>
            <h1 className="page-hero__title">
              A refined hospitality textile catalog
            </h1>
            <p className="page-hero__text">
              Browse hospitality essentials including bedding, towels, robes,
              protectors and curated textile products in a cleaner and more
              structured format.
            </p>
          </div>
        </Container>
      </section>

      <Section tight>
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <ButtonLink href="/" variant="secondary">
              ← Back to Home
            </ButtonLink>

            <div
              style={{
                color: "#6f6559",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {products.length} products
            </div>
          </div>
        </Container>
      </Section>

      {errorMessage ? (
        <Section>
          <Container>
            <div className="empty-state">
              <strong>Error:</strong> {errorMessage}
            </div>
          </Container>
        </Section>
      ) : products.length === 0 ? (
        <Section>
          <Container>
            <div className="empty-state">
              No published products found yet. Items with status set to
              <strong> published</strong> in the products sheet will appear here.
            </div>
          </Container>
        </Section>
      ) : (
        <Section>
          <Container>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 22,
              }}
            >
              {products.map((product, index) => {
                const productVariants = variantsBySlug.get(
                  String(product.slug || "").trim().toLowerCase()
                ) || [];

                const prices = productVariants
                  .map((variant) => parsePrice(variant.price))
                  .filter((price) => price > 0);

                const comparePrices = productVariants
                  .map((variant) => parsePrice(variant.compare_at_price))
                  .filter((price) => price > 0);

                const minPrice = prices.length ? Math.min(...prices) : 0;
                const maxComparePrice = comparePrices.length
                  ? Math.max(...comparePrices)
                  : 0;

                const hasDiscount = maxComparePrice > minPrice && minPrice > 0;

                return (
                  <Link
                    key={`${product.slug || product.title || "product"}-${index}`}
                    href={`/products/${product.slug || ""}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                      height: "100%",
                    }}
                  >
                    <article
                      style={{
                        height: "100%",
                        borderRadius: 22,
                        overflow: "hidden",
                        border: "1px solid #e4dbcf",
                        background: "#fff",
                        boxShadow: "0 10px 30px rgba(23,23,23,0.04)",
                      }}
                    >
                      <div
                        style={{
                          background: "#f6f3ee",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={
                            product.image?.trim() ||
                            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                          }
                          alt={product.title || "Product"}
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          padding: 20,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                          minHeight: 255,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignSelf: "flex-start",
                            padding: "7px 12px",
                            borderRadius: 999,
                            background: "#f3efe8",
                            color: "#2f6f59",
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                          }}
                        >
                          {formatCollectionLabel(product.collection_slug)}
                        </div>

                        <h2
                          style={{
                            margin: 0,
                            fontSize: 21,
                            lineHeight: 1.25,
                            fontWeight: 800,
                          }}
                        >
                          {product.title || "Untitled Product"}
                        </h2>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 800,
                            }}
                          >
                            {minPrice > 0 ? formatMoney(minPrice) : "Request Quote"}
                          </div>

                          {hasDiscount ? (
                            <div
                              style={{
                                fontSize: 15,
                                color: "#857b6f",
                                textDecoration: "line-through",
                                fontWeight: 700,
                              }}
                            >
                              {formatMoney(maxComparePrice)}
                            </div>
                          ) : null}
                        </div>

                        <p
                          style={{
                            margin: 0,
                            color: "#60584d",
                            lineHeight: 1.75,
                            fontSize: 15,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.short_description ||
                            product.description ||
                            "No description added yet."}
                        </p>

                        <div style={{ marginTop: "auto" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 44,
                              padding: "0 18px",
                              borderRadius: 999,
                              border: "1px solid #d8cebf",
                              fontWeight: 800,
                              fontSize: 15,
                            }}
                          >
                            View Product
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}