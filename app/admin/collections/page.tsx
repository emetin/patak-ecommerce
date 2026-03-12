import Link from "next/link";
import { getSheetData } from "../../lib/sheets";

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

export default async function CollectionsPage() {
  let collections: CollectionItem[] = [];
  let errorMessage = "";

  try {
    const data = await getSheetData("Collections");
    collections = (data as CollectionItem[]).filter(
      (item) => (item.status || "").toLowerCase() === "published"
    );
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
  }

  return (
    <div className="simple-page">
      <div className="container">
        <div style={{ marginBottom: 20 }}>
          <Link href="/" className="btn-secondary">
            ← Home
          </Link>
        </div>

        <section
          className="card"
          style={{
            marginBottom: 30,
            overflow: "hidden",
            background:
              "linear-gradient(120deg, rgba(20,17,15,0.94), rgba(42,34,28,0.90))",
            color: "#fff",
            border: "1px solid rgba(176, 138, 90, 0.18)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              gap: 0,
            }}
          >
            <div style={{ padding: 38 }}>
              <span
                className="card-kicker"
                style={{ color: "#e4c79c", marginBottom: 14 }}
              >
                Collections
              </span>

              <h1 style={{ marginTop: 0, marginBottom: 14, color: "#fff" }}>
                Curated textile collections for hospitality presentation
              </h1>

              <p
                className="lead"
                style={{
                  marginBottom: 0,
                  color: "rgba(255,255,255,0.76)",
                  maxWidth: 760,
                }}
              >
                Premium collection structure helps hospitality clients move
                through bedding, towel, bathrobe and related textile families in
                a cleaner and more trusted way.
              </p>
            </div>

            <div
              style={{
                minHeight: 280,
                backgroundImage:
                  'linear-gradient(120deg, rgba(0,0,0,0.18), rgba(0,0,0,0.08)), url("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </section>

        {errorMessage ? (
          <div className="data-box">
            <h3>Hata</h3>
            <pre>{errorMessage}</pre>
          </div>
        ) : collections.length === 0 ? (
          <div className="empty-state">
            Henüz yayınlanmış koleksiyon bulunamadı. Google Sheets içindeki
            <strong> Collections </strong>
            tabında status alanı
            <strong> published </strong>
            olan kayıtlar burada görünecek.
          </div>
        ) : (
          <>
            <div className="section-head">
              <div>
                <h2>All Collections</h2>
              </div>
              <p>
                Her koleksiyon, ürün anlatımını daha güçlü hale getiren bir ana
                giriş noktası olarak çalışır.
              </p>
            </div>

            <div className="cards-3">
              {collections.map((collection, index) => {
                const imageUrl =
                  collection.image?.trim() ||
                  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80";

                return (
                  <article
                    className="card"
                    key={collection.id || collection.slug || index}
                  >
                    <div
                      className="card-media"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className="card-body">
                      <span className="card-kicker">Collection</span>
                      <h3>{collection.title || "Untitled Collection"}</h3>
                      <p>
                        {collection.description || "No description added yet."}
                      </p>

                      <div style={{ marginTop: 18 }}>
                        {collection.slug ? (
                          <Link
                            href={`/collections/${collection.slug}`}
                            className="btn-primary"
                          >
                            View Collection
                          </Link>
                        ) : (
                          <span style={{ color: "#6d655b" }}>Slug not defined</span>
                        )}
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