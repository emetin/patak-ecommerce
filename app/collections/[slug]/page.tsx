import { notFound } from "next/navigation";
import { getSheetData } from "../../../lib/sheets";
import Container from "../../../components/ui/Container";
import Section from "../../../components/ui/Section";
import SectionHeading from "../../../components/ui/SectionHeading";
import ProductCard from "../../../components/cards/ProductCard";
import ButtonLink from "../../../components/ui/ButtonLink";
import DetailHero from "../../../components/sections/DetailHero";
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
  seo_title?: string;
  seo_description?: string;
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
  seo_title?: string;
  seo_description?: string;
};

type CollectionProductItem = {
  id?: string;
  collection_slug?: string;
  product_slug?: string;
  sort_order?: string;
  featured?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

function toBool(value?: string) {
  return String(value || "").trim().toLowerCase() === "true";
}

function toNumber(value?: string, fallback = 999999) {
  const num = Number(String(value || "").trim());
  return Number.isFinite(num) ? num : fallback;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  try {
    const items = (await getSheetData("collections")) as CollectionItem[];
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
      title: collection.seo_title || collection.title || "Collection",
      description:
        collection.seo_description ||
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
    const [collectionItems, productItems, relationItems] = await Promise.all([
      getSheetData("collections"),
      getSheetData("products"),
      getSheetData("collection_products"),
    ]);

    const collections = collectionItems as CollectionItem[];
    const allProducts = productItems as ProductItem[];
    const relations = relationItems as CollectionProductItem[];

    collection =
      collections.find(
        (item) =>
          String(item.slug || "").trim().toLowerCase() === decodedSlug &&
          String(item.status || "").trim().toLowerCase() === "published"
      ) || null;

    if (collection) {
      const publishedProducts = allProducts.filter(
        (item) => String(item.status || "").trim().toLowerCase() === "published"
      );

      const productMap = new Map(
        publishedProducts.map((item) => [
          String(item.slug || "").trim().toLowerCase(),
          item,
        ])
      );

      const validRelations = relations
        .filter((item) => {
          const relationCollectionSlug = String(item.collection_slug || "")
            .trim()
            .toLowerCase();
          const relationStatus = String(item.status || "")
            .trim()
            .toLowerCase();

          return (
            relationCollectionSlug === decodedSlug &&
            (relationStatus === "published" || relationStatus === "")
          );
        })
        .sort(
          (a, b) => toNumber(a.sort_order, 999999) - toNumber(b.sort_order, 999999)
        );

      const relationBasedProducts = validRelations
        .map((relation) =>
          productMap.get(String(relation.product_slug || "").trim().toLowerCase())
        )
        .filter(Boolean) as ProductItem[];

      if (relationBasedProducts.length > 0) {
        products = relationBasedProducts;
        featuredProducts = validRelations
          .filter((item) => toBool(item.featured))
          .map((relation) =>
            productMap.get(String(relation.product_slug || "").trim().toLowerCase())
          )
          .filter(Boolean)
          .slice(0, 3) as ProductItem[];
      } else {
        products = publishedProducts.filter((item) => {
          const itemCollectionSlug = String(item.collection_slug || "")
            .trim()
            .toLowerCase();

          return itemCollectionSlug === decodedSlug;
        });

        featuredProducts = products
          .filter((item) => toBool(item.featured))
          .slice(0, 3);
      }
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

      <DetailHero
        kicker="Collection"
        title={collection.title || "Untitled Collection"}
        text={
          collection.description ||
          "No description has been added for this collection yet."
        }
        image={heroImage}
        stats={[
          {
            label: "Slug",
            value: collection.slug || "-",
          },
          {
            label: "Status",
            value: collection.status || "-",
          },
          {
            label: "Products",
            value: products.length,
          },
        ]}
        actions={
          <>
            <ButtonLink href="/products" variant="secondary">
              Browse Products
            </ButtonLink>
            <ButtonLink href="/contact-us" variant="accent">
              Contact Us
            </ButtonLink>
          </>
        }
      />

      {featuredProducts.length > 0 ? (
        <Section tone="soft">
          <Container>
            <SectionHeading
              kicker="Featured Products"
              title="Highlighted published products from this collection"
              text="Featured items give a stronger introduction to this textile family."
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
            text="These are the published items currently assigned to this collection."
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