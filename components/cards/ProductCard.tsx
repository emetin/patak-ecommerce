import ButtonLink from "../ui/ButtonLink";

type ProductCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
  collectionLabel?: string;
};

export default function ProductCard({
  title,
  description,
  image,
  href,
  collectionLabel,
}: ProductCardProps) {
  return (
    <article className="content-card">
      <div
        className="content-card__media"
        style={{
          backgroundImage: `url(${image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"})`,
        }}
      />
      <div className="content-card__body">
        <div className="content-card__eyebrow">{collectionLabel || "Product"}</div>
        <h3 className="content-card__title">{title}</h3>
        <p className="content-card__text">
          {description || "Explore this hospitality textile product."}
        </p>
        <div className="content-card__footer">
          <ButtonLink href={href} variant="secondary">
            View Product
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}