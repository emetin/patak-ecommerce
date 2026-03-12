import type { Metadata } from "next";
import { getSheetData } from "../../lib/sheets";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import SectionHeading from "../../components/ui/SectionHeading";
import ProductCard from "../../components/cards/ProductCard";
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
};

export const metadata: Metadata = buildPageMetadata({
  title: "Products",
  description:
    "Explore premium hospitality textile products including bedding, towels, bathrobes and curated hotel textile solutions by Patak Textile.",
  path: "/products",
});

export default async function ProductsPage() {
  let products: ProductItem[] = [];
  let errorMessage = "";

  try {
    const data = await getSheetData("Products");

    products = (data as ProductItem[]).filter(
      (item) => String(item.status || "").trim().toLowerCase() === "published"
    );
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";
  }

  const featuredProducts = products
    .filter((item) => String(item.featured || "").trim().toLowerCase() === "true")
    .slice(0, 3);

  return (
    <>
      <section className="page-hero">
        <Container>
          <div className="page-hero__inner">
            <div className="page-hero__kicker">Products</div>
            <h1 className="page-hero__title">
              Premium hospitality textile products with a cleaner presentation
            </h1>
            <p className="page-hero__text">
              Bedding, towels, robes and hospitality essentials are displayed in a
              more structured system that supports better navigation and a stronger
              premium perception.
            </p>
          </div>
        </Container>
      </section>

      <Section tight>
        <Container>
          <ButtonLink href="/" variant="secondary">
            ← Back to Home
          </ButtonLink>
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
              <strong> published</strong> in the Products sheet will appear here.
            </div>
          </Container>
        </Section>
      ) : (
        <>
          {featuredProducts.length > 0 ? (
            <Section tone="soft">
              <Container>
                <SectionHeading
                  kicker="Featured Products"
                  title="Highlighted textile products for a stronger first impression"
                  text="Featured items help guide visitors into the product system and support a more curated hospitality presentation."
                />

                <div className="cards-grid cards-grid--3">
                  {featuredProducts.map((product, index) => (
                    <ProductCard
                      key={`${product.slug || product.title || "featured-product"}-${index}`}
                      title={product.title || "Untitled Product"}
                      description={
                        product.short_description ||
                        product.description ||
                        "No description added yet."
                      }
                      image={product.image || ""}
                      href={`/products/${product.slug || ""}`}
                      collectionLabel={product.collection_slug || "Featured"}
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
                title="The complete hospitality product archive"
                text="The full product archive stays organized through consistent cards, collection-linked navigation and a more elegant visual structure."
              />

              <div className="cards-grid cards-grid--3">
                {products.map((product, index) => (
                  <ProductCard
                    key={`${product.slug || product.title || "product"}-${index}`}
                    title={product.title || "Untitled Product"}
                    description={
                      product.short_description ||
                      product.description ||
                      "No description added yet."
                    }
                    image={product.image || ""}
                    href={`/products/${product.slug || ""}`}
                    collectionLabel={product.collection_slug || "Product"}
                  />
                ))}
              </div>
            </Container>
          </Section>
        </>
      )}
    </>
  );
}