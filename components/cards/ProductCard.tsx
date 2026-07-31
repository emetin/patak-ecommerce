import Link from "next/link";
import { normalizeImageUrl } from "../../lib/image-url";

type Props = { title: string; description?: string; image: string; href: string; collectionLabel?: string };

export default function ProductCard({ title, description, image, href, collectionLabel }: Props) {
  const src = normalizeImageUrl(image?.trim()) || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85";
  return (
    <Link href={href} className="catalog-card catalog-card--product">
      <div className="catalog-card__media"><img src={src} alt={title} /><span>{collectionLabel || "Textile"}</span></div>
      <div className="catalog-card__body"><div><h3>{title}</h3>{description ? <p>{description}</p> : null}</div><i aria-hidden="true">↗</i></div>
    </Link>
  );
}
