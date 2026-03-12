import Link from "next/link";
import { getSheetData } from "../../lib/sheets";

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

export default async function BlogPage() {
  let posts: BlogItem[] = [];
  let errorMessage = "";

  try {
    const data = await getSheetData("Blog");
    posts = (data as BlogItem[]).filter(
      (item) => String(item.status || "").trim().toLowerCase() === "published"
    );
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
  }

  const featuredPosts = posts.filter(
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
          <span className="card-kicker">Editorial Content</span>
          <h1 style={{ maxWidth: 980 }}>
            Hospitality textile insights, stories and brand-driven articles
          </h1>
          <p className="lead" style={{ maxWidth: 880, marginBottom: 0 }}>
            The blog supports trust, expertise and premium perception with a
            cleaner editorial layout that fits the overall hospitality-focused
            presentation.
          </p>
        </section>

        {errorMessage ? (
          <div className="data-box">
            <h3>Hata</h3>
            <pre>{errorMessage}</pre>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            Henüz yayınlanmış blog yazısı bulunamadı. Google Sheets içindeki{" "}
            <strong>Blog</strong> tabında <strong>status</strong> alanı{" "}
            <strong>published</strong> olan kayıtlar burada görünecek.
          </div>
        ) : (
          <>
            {featuredPosts.length > 0 ? (
              <section className="section" style={{ paddingTop: 0, paddingBottom: 34 }}>
                <div className="section-head">
                  <div>
                    <h2>Featured Articles</h2>
                  </div>
                  <p>
                    Highlighted editorial pieces strengthen brand voice and help
                    build authority in the hospitality textile space.
                  </p>
                </div>

                <div className="cards-2">
                  {featuredPosts.slice(0, 2).map((post, index) => {
                    const imageUrl =
                      post.image?.trim() ||
                      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";

                    return (
                      <article className="card" key={post.id || post.slug || index}>
                        <div
                          className="card-media"
                          style={{
                            backgroundImage: `url(${imageUrl})`,
                            aspectRatio: "16 / 10",
                          }}
                        />
                        <div className="card-body">
                          <span className="card-kicker">Featured Article</span>
                          <h3>{post.title || "Untitled Post"}</h3>
                          <p>
                            {post.excerpt ||
                              post.content?.slice(0, 180) ||
                              "No excerpt added yet."}
                          </p>

                          <div style={{ marginTop: 18 }}>
                            {post.slug ? (
                              <Link
                                href={`/blog/${post.slug}`}
                                className="btn-primary"
                              >
                                Read Article
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
                <h2>All Articles</h2>
              </div>
              <p>
                Published articles are listed in a simpler editorial structure
                with stronger readability and cleaner visual rhythm.
              </p>
            </div>

            <div className="cards-3">
              {posts.map((post, index) => {
                const imageUrl =
                  post.image?.trim() ||
                  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";

                return (
                  <article className="card" key={post.id || post.slug || index}>
                    <div
                      className="card-media"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        aspectRatio: "4 / 4.6",
                      }}
                    />
                    <div className="card-body">
                      <span className="card-kicker">Blog Post</span>
                      <h3>{post.title || "Untitled Post"}</h3>
                      <p>
                        {post.excerpt ||
                          post.content?.slice(0, 160) ||
                          "No excerpt added yet."}
                      </p>

                      <div style={{ marginTop: 18 }}>
                        {post.slug ? (
                          <Link href={`/blog/${post.slug}`} className="btn-primary">
                            Read Article
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