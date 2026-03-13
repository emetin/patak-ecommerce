import { notFound } from "next/navigation";
import { getSheetData } from "../../../lib/sheets";
import Container from "../../../components/ui/Container";
import Section from "../../../components/ui/Section";
import SectionHeading from "../../../components/ui/SectionHeading";
import ProductCard from "../../../components/cards/ProductCard";
import ButtonLink from "../../../components/ui/ButtonLink";
import DetailHero from "../../../components/sections/DetailHero";
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
          <div className="empty-state">
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

      <DetailHero
        kicker={product.collection_slug || "Product"}
        title={product.title || "Untitled Product"}
        text={
          product.short_description ||
          product.description ||
          "No description added yet."
        }
        image={imageUrl}
        stats={[
          {
            label: "Collection",
            value: product.collection_slug || "-",
          },
          {
            label: "Status",
            value: product.status || "-",
          },
          {
            label: "Featured",
            value: product.featured || "false",
          },
        ]}
        actions={
          <>
            {product.collection_slug ? (
              <ButtonLink
                href={`/collections/${product.collection_slug}`}
                variant="secondary"
              >
                View Collection
              </ButtonLink>
            ) : null}
            <ButtonLink href="/contact-us" variant="accent">
              Contact Us
            </ButtonLink>
          </>
        }
      />

      <Section>
        <Container>
          <SectionHeading
            kicker="Product Overview"
            title="A more structured product presentation"
            text="This product page is designed to support hospitality buyers with a cleaner, more confident presentation style."
          />
        </Container>
      </Section>

      {relatedProducts.length > 0 ? (
        <Section tone="soft">
          <Container>
            <SectionHeading
              kicker="Related Products"
              title="Other published products from the same collection"
              text="These products help continue browsing within the same textile family."
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