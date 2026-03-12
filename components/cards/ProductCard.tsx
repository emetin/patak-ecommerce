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
    <article className="card">
      <div
        className="card-media"
        style={{
          backgroundImage: `url(${image})`,
          aspectRatio: "4 / 4.5",
        }}
      />
      <div className="card-body">
        <span className="card-kicker">{collectionLabel || "Product"}</span>
        <h3>{title}</h3>
        <p>{description}</p>

        <div style={{ marginTop: 18 }}>
          <ButtonLink href={href}>View Product</ButtonLink>
        </div>
      </div>
    </article>
  );
}