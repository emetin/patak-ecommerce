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
    <article className="content-card">
      <div
        className="content-card__media"
        style={{
          backgroundImage: `url(${image || "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80"})`,
        }}
      />
      <div className="content-card__body">
        <div className="content-card__eyebrow">Editorial</div>
        <h3 className="content-card__title">{title}</h3>
        <p className="content-card__text">
          {excerpt || "Read more from our hospitality textile perspective."}
        </p>
        <div className="content-card__footer">
          <ButtonLink href={href} variant="secondary">
            Read Article
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}