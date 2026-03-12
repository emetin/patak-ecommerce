import Link from "next/link";
import { getSheetData } from "../../../lib/sheets";

type BlogItem = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  status?: string;
  featured?: string;
  created_at?: string;
  updated_at?: string;
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let post: BlogItem | null = null;
  let relatedPosts: BlogItem[] = [];
  let errorMessage = "";

  try {
    const items = (await getSheetData("Blog")) as BlogItem[];

    const foundPost =
      items.find(
        (item) =>
          String(item.slug || "").trim().toLowerCase() ===
            decodedSlug.toLowerCase() &&
          String(item.status || "").trim().toLowerCase() === "published"
      ) || null;

    post = foundPost;

    if (foundPost) {
      relatedPosts = items
        .filter((item) => {
          const itemSlug = String(item.slug || "").trim().toLowerCase();
          const itemStatus = String(item.status || "").trim().toLowerCase();

          return (
            itemSlug !== decodedSlug.toLowerCase() && itemStatus === "published"
          );
        })
        .slice(0, 3);
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
  }

  if (errorMessage) {
    return (
      <div className="simple-page">
        <div className="container">
          <Link
            href="/blog"
            className="btn-secondary"
            style={{ marginBottom: 18 }}
          >
            ← Blog
          </Link>

          <div className="data-box">
            <h3>Hata</h3>
            <pre>{errorMessage}</pre>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="simple-page">
        <div className="container">
          <Link
            href="/blog"
            className="btn-secondary"
            style={{ marginBottom: 18 }}
          >
            ← Blog
          </Link>

          <div className="empty-state">
            Blog yazısı bulunamadı veya yayınlanmamış durumda.
          </div>
        </div>
      </div>
    );
  }

  const imageUrl =
    post.image?.trim() ||
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="simple-page">
      <div className="container">
        <div style={{ marginBottom: 18 }}>
          <Link href="/blog" className="btn-secondary">
            ← Blog
          </Link>
        </div>

        <section
          style={{
            marginBottom: 30,
            padding: "32px 0 8px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="card-kicker">Blog Post</span>
          <h1 style={{ maxWidth: 980 }}>
            {post.title || "Untitled Post"}
          </h1>
          {post.excerpt ? (
            <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
              {post.excerpt}
            </p>
          ) : null}
        </section>

        <section className="section" style={{ paddingTop: 0, paddingBottom: 34 }}>
          <div
            className="card"
            style={{
              borderRadius: "0",
              overflow: "hidden",
            }}
          >
            <div
              className="card-media"
              style={{
                backgroundImage: `url(${imageUrl})`,
                aspectRatio: "16 / 7",
              }}
            />

            <div className="card-body" style={{ padding: 34 }}>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 18,
                }}
              >
                <span className="status-pill">
                  Status: {post.status || "-"}
                </span>
                <span className="status-pill">
                  Featured: {post.featured || "false"}
                </span>
              </div>

              <div
                className="data-box"
                style={{
                  padding: 28,
                  borderRadius: "0",
                  lineHeight: 1.85,
                  fontSize: 18,
                }}
              >
                <div style={{ whiteSpace: "pre-wrap", color: "rgba(0,0,0,0.75)" }}>
                  {post.content || "No content added yet."}
                </div>
              </div>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 ? (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <div>
                <h2>More Articles</h2>
              </div>
              <p>
                Other published editorial pieces from the blog.
              </p>
            </div>

            <div className="cards-3">
              {relatedPosts.map((item, index) => {
                const relatedImage =
                  item.image?.trim() ||
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

                return (
                  <article className="card" key={item.id || item.slug || index}>
                    <div
                      className="card-media"
                      style={{
                        backgroundImage: `url(${relatedImage})`,
                        aspectRatio: "4 / 4.6",
                      }}
                    />
                    <div className="card-body">
                      <span className="card-kicker">Blog Post</span>
                      <h3>{item.title || "Untitled Post"}</h3>
                      <p>
                        {item.excerpt ||
                          item.content?.slice(0, 160) ||
                          "No excerpt added yet."}
                      </p>

                      {item.slug ? (
                        <div style={{ marginTop: 18 }}>
                          <Link href={`/blog/${item.slug}`} className="btn-primary">
                            Read Article
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