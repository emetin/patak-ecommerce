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
      (item) => String(item.status || "").trim().toLowerCase() === "published"
    );
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
  }

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
          <span className="card-kicker">Collections</span>
          <h1 style={{ maxWidth: 920 }}>
            Curated hospitality textile collections
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            Explore collection groups built for hotels, residences, resorts and
            premium accommodation projects. This structure helps visitors move
            through textile families in a cleaner and more trusted way.
          </p>
        </section>

        {errorMessage ? (
          <div className="data-box">
            <h3>Hata</h3>
            <pre>{errorMessage}</pre>
          </div>
        ) : collections.length === 0 ? (
          <div className="empty-state">
            Henüz yayınlanmış koleksiyon bulunamadı. Google Sheets içindeki{" "}
            <strong>Collections</strong> tabında <strong>status</strong> alanı{" "}
            <strong>published</strong> olan kayıtlar burada görünecek.
          </div>
        ) : (
          <>
            <div className="section-head">
              <div>
                <h2>All Collections</h2>
              </div>
              <p>
                Collection pages work as the main hospitality navigation layer
                and organize the product world more clearly.
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
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        aspectRatio: "4 / 4.3",
                      }}
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
                          <span style={{ color: "rgba(0,0,0,0.55)" }}>
                            Slug not defined
                          </span>
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