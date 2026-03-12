import Link from "next/link";
import { getSheetData } from "../../../lib/sheets";

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
          (item) =>
            String(item.featured || "").trim().toLowerCase() === "true"
        )
        .slice(0, 3);
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
  }

  if (errorMessage) {
    return (
      <div className="simple-page">
        <div className="container">
          <Link
            href="/collections"
            className="btn-secondary"
            style={{ marginBottom: 18 }}
          >
            ← Collections
          </Link>

          <div className="data-box">
            <h3>Error</h3>
            <pre>{errorMessage}</pre>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="simple-page">
        <div className="container">
          <Link
            href="/collections"
            className="btn-secondary"
            style={{ marginBottom: 18 }}
          >
            ← Collections
          </Link>

          <div className="empty-state">
            Collection not found or not published.
          </div>
        </div>
      </div>
    );
  }

  const heroImage =
    collection.image?.trim() ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="simple-page">
      <div className="container">
        <div style={{ marginBottom: 18 }}>
          <Link href="/collections" className="btn-secondary">
            ← Collections
          </Link>
        </div>

        <section
          style={{
            marginBottom: 30,
            padding: "32px 0 8px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="card-kicker">Collection</span>
          <h1 style={{ maxWidth: 980 }}>
            {collection.title || "Untitled Collection"}
          </h1>
          {collection.description ? (
            <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
              {collection.description}
            </p>
          ) : null}
        </section>

        <section
          className="section"
          style={{ paddingTop: 0, paddingBottom: 34 }}
        >
          <div className="split-section">
            <div
              className="image-feature"
              style={{
                backgroundImage: `url("${heroImage}")`,
                minHeight: 620,
              }}
            />

            <div className="split-card">
              <span className="card-kicker">Collection Overview</span>
              <h2 style={{ maxWidth: 680 }}>
                Curated hospitality products grouped with a clearer structure
              </h2>

              <p>
                {collection.description ||
                  "No description has been added for this collection yet."}
              </p>

              <div className="feature-list">
                <div className="feature-row">
                  <strong>Slug</strong>
                  <span>{collection.slug || "-"}</span>
                </div>

                <div className="feature-row">
                  <strong>Status</strong>
                  <span>{collection.status || "-"}</span>
                </div>

                <div className="feature-row">
                  <strong>Products</strong>
                  <span>{products.length}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 24,
                }}
              >
                <Link href="/products" className="btn-primary">
                  Browse Products
                </Link>

                <Link href="/contact-us" className="btn-secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {featuredProducts.length > 0 ? (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <div>
                <h2>Featured Products</h2>
              </div>
              <p>
                Highlighted published products from this collection.
              </p>
            </div>

            <div className="cards-3">
              {featuredProducts.map((item, index) => {
                const productImage =
                  item.image?.trim() ||
                  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80";

                return (
                  <article className="card" key={item.id || item.slug || index}>
                    <div
                      className="card-media"
                      style={{
                        backgroundImage: `url(${productImage})`,
                        aspectRatio: "4 / 4.5",
                      }}
                    />
                    <div className="card-body">
                      <span className="card-kicker">Featured Product</span>
                      <h3>{item.title || "Untitled Product"}</h3>
                      <p>
                        {item.short_description ||
                          item.description ||
                          "No description has been added yet."}
                      </p>

                      {item.slug ? (
                        <div style={{ marginTop: 18 }}>
                          <Link
                            href={`/products/${item.slug}`}
                            className="btn-primary"
                          >
                            View Product
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <div>
              <h2>All Products in This Collection</h2>
            </div>
            <p>
              Published products currently assigned to this collection.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="cards-3">
              {products.map((item, index) => {
                const productImage =
                  item.image?.trim() ||
                  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80";

                return (
                  <article className="card" key={item.id || item.slug || index}>
                    <div
                      className="card-media"
                      style={{
                        backgroundImage: `url(${productImage})`,
                        aspectRatio: "4 / 4.5",
                      }}
                    />
                    <div className="card-body">
                      <span className="card-kicker">
                        {collection.title || "Collection"}
                      </span>
                      <h3>{item.title || "Untitled Product"}</h3>
                      <p>
                        {item.short_description ||
                          item.description ||
                          "No description has been added yet."}
                      </p>

                      {item.slug ? (
                        <div style={{ marginTop: 18 }}>
                          <Link
                            href={`/products/${item.slug}`}
                            className="btn-primary"
                          >
                            View Product
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              No published products were found in this collection.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}