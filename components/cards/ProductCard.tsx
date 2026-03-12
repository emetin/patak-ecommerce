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
          aspectRatio: "4 / 4.8",
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
          {collectionLabel || "Product"}
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
            minHeight: 72,
            color: "rgba(0,0,0,0.68)",
            lineHeight: 1.75,
          }}
        >
          {description || "Explore this hospitality textile product."}
        </p>

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <ButtonLink href={href}>View Product</ButtonLink>
        </div>
      </div>
    </article>
  );
}