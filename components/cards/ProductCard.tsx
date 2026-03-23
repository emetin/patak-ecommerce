import Link from "next/link";
import ButtonLink from "../ui/ButtonLink";

type ProductCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
  collectionLabel?: string;
  price?: number | string;
  compareAtPrice?: number | string;
  featured?: boolean;
};

function parsePrice(value?: number | string) {
  if (value === undefined || value === null || value === "") return 0;
  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function ProductCard({
  title,
  description,
  image,
  href,
  collectionLabel,
  price,
  compareAtPrice,
  featured = false,
}: ProductCardProps) {
  const finalPrice = parsePrice(price);
  const finalCompareAtPrice = parsePrice(compareAtPrice);
  const hasDiscount =
    finalPrice > 0 &&
    finalCompareAtPrice > 0 &&
    finalCompareAtPrice > finalPrice;

  const imageSrc =
    image ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

  return (
    <article
      className="content-card"
      style={{
        overflow: "hidden",
        borderRadius: 24,
        border: "1px solid #e5ddd2",
        background: "#fff",
        boxShadow: "0 10px 30px rgba(23,23,23,0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        href={href}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
        }}
      >
        <div
          className="content-card__media"
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            background: "#f6f3ee",
            overflow: "hidden",
          }}
        >
          <img
            src={imageSrc}
            alt={title || "Product"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.35s ease",
            }}
          />

          {featured ? (
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                display: "inline-flex",
                alignItems: "center",
                minHeight: 32,
                padding: "0 12px",
                borderRadius: 999,
                background: "#2f7d62",
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Featured
            </div>
          ) : null}
        </div>
      </Link>

      <div
        className="content-card__body"
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <div
          className="content-card__eyebrow"
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            padding: "7px 12px",
            borderRadius: 999,
            background: "#f3efe8",
            color: "#2f6f59",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {collectionLabel || "Product"}
        </div>

        <h3
          className="content-card__title"
          style={{
            margin: 0,
            fontSize: 22,
            lineHeight: 1.25,
            fontWeight: 800,
          }}
        >
          <Link
            href={href}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {title}
          </Link>
        </h3>

        {(finalPrice > 0 || hasDiscount) && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#171717",
              }}
            >
              {finalPrice > 0 ? formatMoney(finalPrice) : "Request Quote"}
            </div>

            {hasDiscount ? (
              <div
                style={{
                  fontSize: 15,
                  color: "#857b6f",
                  textDecoration: "line-through",
                  fontWeight: 700,
                }}
              >
                {formatMoney(finalCompareAtPrice)}
              </div>
            ) : null}
          </div>
        )}

        <p
          className="content-card__text"
          style={{
            margin: 0,
            color: "#60584d",
            lineHeight: 1.75,
            fontSize: 15,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || "Explore this hospitality textile product."}
        </p>

        <div
          className="content-card__footer"
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <ButtonLink href={href} variant="secondary">
            View Product
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}