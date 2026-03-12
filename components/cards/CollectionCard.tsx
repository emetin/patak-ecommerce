import ButtonLink from "../ui/ButtonLink";

type CollectionCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export default function CollectionCard({
  title,
  description,
  image,
  href,
}: CollectionCardProps) {
  return (
    <article className="content-card">
      <div
        className="content-card__media"
        style={{
          backgroundImage: `url(${image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"})`,
        }}
      />
      <div className="content-card__body">
        <div className="content-card__eyebrow">Collection</div>
        <h3 className="content-card__title">{title}</h3>
        <p className="content-card__text">
          {description || "Explore this hospitality-focused textile collection."}
        </p>
        <div className="content-card__footer">
          <ButtonLink href={href} variant="secondary">
            View Collection
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}