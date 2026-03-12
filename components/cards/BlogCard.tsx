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
    <article className="card">
      <div
        className="card-media"
        style={{
          backgroundImage: `url(${image})`,
          aspectRatio: "4 / 4.6",
        }}
      />
      <div className="card-body">
        <span className="card-kicker">Blog Post</span>
        <h3>{title}</h3>
        <p>{excerpt}</p>

        <div style={{ marginTop: 18 }}>
          <ButtonLink href={href}>Read Article</ButtonLink>
        </div>
      </div>
    </article>
  );
}