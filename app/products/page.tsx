import Link from "next/link";
import { getSheetData } from "../../lib/sheets";

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
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
  }

  const featuredProducts = products.filter(
    (item) => String(item.featured || "").trim().toLowerCase() === "true"
  );

  return (
    <div className="simple-page">
      <div className="container">
        <div style={{ marginBottom: 18 }}>
          <Link href="/" className="btn-secondary">
            ← Home
          </Link>
        </div>

        <section
          style={{
            marginBottom: 32,
            padding: "32px 0 8px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="card-kicker">Products</span>
          <h1 style={{ maxWidth: 980 }}>
            Premium hospitality textile products with a cleaner presentation
          </h1>
          <p className="lead" style={{ maxWidth: 880, marginBottom: 0 }}>
            Bedding, towels, robes and hospitality essentials are displayed in a
            more structured system that supports better navigation, stronger
            trust and a more polished buying experience.
          </p>
        </section>

        {errorMessage ? (
          <div className="data-box">
            <h3>Hata</h3>
            <pre>{errorMessage}</pre>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            Henüz yayınlanmış ürün bulunamadı. Google Sheets içindeki{" "}
            <strong>Products</strong> tabında <strong>status</strong> alanı{" "}
            <strong>published</strong> olan kayıtlar burada görünecek.
          </div>
        ) : (
          <>
            {featuredProducts.length > 0 ? (
              <section className="section" style={{ paddingTop: 0, paddingBottom: 34 }}>
                <div className="section-head">
                  <div>
                    <h2>Featured Products</h2>
                  </div>
                  <p>
                    Highlighted textile products can guide visitors into the
                    collection system and create stronger first impressions.
                  </p>
                </div>

                <div className="cards-2">
                  {featuredProducts.slice(0, 2).map((product, index) => {
                    const imageUrl =
                      product.image?.trim() ||
                      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

                    return (
                      <article
                        className="card"
                        key={product.id || product.slug || index}
                      >
                        <div
                          className="card-media"
                          style={{
                            backgroundImage: `url(${imageUrl})`,
                            aspectRatio: "16 / 10",
                          }}
                        />
                        <div className="card-body">
                          <span className="card-kicker">
                            {product.collection_slug || "Featured"}
                          </span>
                          <h3>{product.title || "Untitled Product"}</h3>
                          <p>
                            {product.short_description ||
                              product.description ||
                              "No description added yet."}
                          </p>

                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              flexWrap: "wrap",
                              marginTop: 18,
                            }}
                          >
                            {product.slug ? (
                              <Link
                                href={`/products/${product.slug}`}
                                className="btn-primary"
                              >
                                View Product
                              </Link>
                            ) : null}

                            {product.collection_slug ? (
                              <Link
                                href={`/collections/${product.collection_slug}`}
                                className="btn-secondary"
                              >
                                Collection
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <div className="section-head">
              <div>
                <h2>All Products</h2>
              </div>
              <p>
                The full product archive stays organized through consistent
                cards, structure and collection-linked navigation.
              </p>
            </div>

            <div className="cards-3">
              {products.map((product, index) => {
                const imageUrl =
                  product.image?.trim() ||
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

                return (
                  <article className="card" key={product.id || product.slug || index}>
                    <div
                      className="card-media"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        aspectRatio: "4 / 4.5",
                      }}
                    />
                    <div className="card-body">
                      <span className="card-kicker">
                        {product.collection_slug || "Product"}
                      </span>
                      <h3>{product.title || "Untitled Product"}</h3>
                      <p>
                        {product.short_description ||
                          product.description ||
                          "No description added yet."}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          flexWrap: "wrap",
                          marginTop: 18,
                        }}
                      >
                        {product.slug ? (
                          <Link
                            href={`/products/${product.slug}`}
                            className="btn-primary"
                          >
                            View Product
                          </Link>
                        ) : (
                          <span style={{ color: "rgba(0,0,0,0.55)" }}>
                            Slug not defined
                          </span>
                        )}

                        {product.collection_slug ? (
                          <Link
                            href={`/collections/${product.collection_slug}`}
                            className="btn-secondary"
                          >
                            Collection
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}