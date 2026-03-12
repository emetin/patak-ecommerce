import ButtonLink from "../ui/ButtonLink";

type BlogCardProps = {
  title: string;
  excerpt: string;
  image: string;
  href: string;
};

export default function BlogCard({
  title,
  excerpt,
  image,
  href,
}: BlogCardProps) {
  return (
    <article
      className="card"
      style={{
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="card-media"
        style={{
          backgroundImage: `url(${image})`,
          aspectRatio: "4 / 4.9",
          backgroundPosition: "center",
        }}
      />

      <div
        className="card-body"
        style={{
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <span
          className="card-kicker"
          style={{
            display: "inline-block",
            marginBottom: 10,
          }}
        >
          Editorial
        </span>

        <h3
          style={{
            marginBottom: 12,
            lineHeight: 1.18,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            minHeight: 88,
            color: "rgba(0,0,0,0.68)",
            lineHeight: 1.75,
          }}
        >
          {excerpt || "Read more from our hospitality textile perspective."}
        </p>

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <ButtonLink href={href}>Read Article</ButtonLink>
        </div>
      </div>
    </article>
  );
}