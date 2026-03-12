import { notFound } from "next/navigation";
import { getSheetData } from "../../../lib/sheets";
import Container from "../../../components/ui/Container";
import Section from "../../../components/ui/Section";
import SectionHeading from "../../../components/ui/SectionHeading";
import BlogCard from "../../../components/cards/BlogCard";
import ButtonLink from "../../../components/ui/ButtonLink";
import { buildPageMetadata } from "../../../lib/seo";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  try {
    const items = (await getSheetData("Blog")) as BlogItem[];
    const post =
      items.find(
        (item) =>
          String(item.slug || "").trim().toLowerCase() === decodedSlug &&
          String(item.status || "").trim().toLowerCase() === "published"
      ) || null;

    if (!post) {
      return buildPageMetadata({
        title: "Article Not Found",
        description: "The requested article could not be found.",
        path: `/blog/${decodedSlug}`,
      });
    }

    return buildPageMetadata({
      title: post.title || "Blog Article",
      description:
        post.excerpt ||
        post.content ||
        "Read more from Patak Textile editorial content.",
      image: post.image || "",
      path: `/blog/${decodedSlug}`,
    });
  } catch {
    return buildPageMetadata({
      title: "Blog",
      description: "Editorial content and hospitality textile insights.",
      path: `/blog/${decodedSlug}`,
    });
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  let post: BlogItem | null = null;
  let relatedPosts: BlogItem[] = [];
  let errorMessage = "";

  try {
    const items = (await getSheetData("Blog")) as BlogItem[];

    const foundPost =
      items.find(
        (item) =>
          String(item.slug || "").trim().toLowerCase() === decodedSlug &&
          String(item.status || "").trim().toLowerCase() === "published"
      ) || null;

    post = foundPost;

    if (foundPost) {
      relatedPosts = items
        .filter((item) => {
          const itemSlug = String(item.slug || "").trim().toLowerCase();
          const itemStatus = String(item.status || "").trim().toLowerCase();

          return itemSlug !== decodedSlug && itemStatus === "published";
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
          <ButtonLink href="/blog" variant="secondary">
            ← Back to Blog
          </ButtonLink>

          <div className="empty-state" style={{ marginTop: 20 }}>
            <strong>Error:</strong> {errorMessage}
          </div>
        </Container>
      </Section>
    );
  }

  if (!post) {
    notFound();
  }

  const heroImage =
    post.image?.trim() ||
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80";

  return (
    <>
      <Section tight>
        <Container>
          <ButtonLink href="/blog" variant="secondary">
            ← Back to Blog
          </ButtonLink>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="home-split">
            <div
              className="content-card"
              style={{ overflow: "hidden", minHeight: 520 }}
            >
              <div
                className="content-card__media"
                style={{
                  aspectRatio: "4 / 4",
                  minHeight: 520,
                  backgroundImage: `url(${heroImage})`,
                }}
              />
            </div>

            <div className="home-split__panel">
              <div className="section-heading__kicker">Editorial</div>

              <h1
                style={{
                  margin: "0 0 16px",
                  fontSize: "clamp(34px, 5vw, 64px)",
                  lineHeight: "0.95",
                  letterSpacing: "-0.04em",
                }}
              >
                {post.title || "Untitled Article"}
              </h1>

              {post.excerpt ? (
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: 18,
                    lineHeight: 1.8,
                    color: "var(--muted)",
                  }}
                >
                  {post.excerpt}
                </p>
              ) : null}

              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: "var(--muted)",
                  whiteSpace: "pre-line",
                }}
              >
                {post.content || "No content added yet."}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <ButtonLink href="/contact-us">Contact Us</ButtonLink>
                <ButtonLink href="/blog" variant="secondary">
                  Back to Articles
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {relatedPosts.length > 0 ? (
        <Section tone="soft">
          <Container>
            <SectionHeading
              kicker="More Articles"
              title="Continue exploring the editorial archive"
              text="Additional content helps visitors discover more about the brand, product world and hospitality textile perspective."
            />

            <div className="cards-grid cards-grid--3">
              {relatedPosts.map((item, index) => (
                <BlogCard
                  key={`${item.slug || item.title || "related-blog"}-${index}`}
                  title={item.title || "Untitled Article"}
                  excerpt={
                    item.excerpt ||
                    item.content ||
                    "Read more from our editorial perspective."
                  }
                  image={item.image || ""}
                  href={`/blog/${item.slug || ""}`}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}