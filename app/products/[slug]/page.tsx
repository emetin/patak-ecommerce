import Link from "next/link";
import { getSheetData } from "../../../lib/sheets";

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
      error instanceof Error ? error.message : "An unknown error occurred.";
  }

  if (errorMessage) {
    return (
      <div className="simple-page">
        <div className="container">
          <Link
            href="/products"
            className="btn-secondary"
            style={{ marginBottom: 18 }}
          >
            ← Products
          </Link>

          <div className="data-box">
            <h3>Error</h3>
            <pre>{errorMessage}</pre>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="simple-page">
        <div className="container">
          <Link
            href="/products"
            className="btn-secondary"
            style={{ marginBottom: 18 }}
          >
            ← Products
          </Link>

          <div className="empty-state">
            Product not found or not published.
          </div>
        </div>
      </div>
    );
  }

  const imageUrl =
    product.image?.trim() ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="simple-page">
      <div className="container">
        <div style={{ marginBottom: 18 }}>
          <Link href="/products" className="btn-secondary">
            ← Products
          </Link>
        </div>

        <section
          style={{
            marginBottom: 30,
            padding: "32px 0 8px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="card-kicker">
            {product.collection_slug || "Product"}
          </span>
          <h1 style={{ maxWidth: 980 }}>
            {product.title || "Untitled Product"}
          </h1>
          {product.short_description ? (
            <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
              {product.short_description}
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
                backgroundImage: `url("${imageUrl}")`,
                minHeight: 620,
              }}
            />

            <div className="split-card">
              <span className="card-kicker">Product Overview</span>
              <h2 style={{ maxWidth: 680 }}>
                Hospitality presentation with clearer structure and stronger
                detail
              </h2>

              <p>{product.description || "No description added yet."}</p>

              <div className="feature-list">
                <div className="feature-row">
                  <strong>Collection</strong>
                  <span>{product.collection_slug || "-"}</span>
                </div>

                <div className="feature-row">
                  <strong>Status</strong>
                  <span>{product.status || "-"}</span>
                </div>

                <div className="feature-row">
                  <strong>Featured</strong>
                  <span>{product.featured || "false"}</span>
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
                {product.collection_slug ? (
                  <Link
                    href={`/collections/${product.collection_slug}`}
                    className="btn-primary"
                  >
                    View Collection
                  </Link>
                ) : null}

                <Link href="/contact-us" className="btn-secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <div>
                <h2>Related Products</h2>
              </div>
              <p>Other published products from the same collection.</p>
            </div>

            <div className="cards-3">
              {relatedProducts.map((item, index) => {
                const relatedImage =
                  item.image?.trim() ||
                  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80";

                return (
                  <article className="card" key={item.id || item.slug || index}>
                    <div
                      className="card-media"
                      style={{
                        backgroundImage: `url(${relatedImage})`,
                        aspectRatio: "4 / 4.5",
                      }}
                    />
                    <div className="card-body">
                      <span className="card-kicker">
                        {item.collection_slug || "Product"}
                      </span>
                      <h3>{item.title || "Untitled Product"}</h3>
                      <p>
                        {item.short_description ||
                          item.description ||
                          "No description added yet."}
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
      </div>
    </div>
  );
}