import Link from "next/link";
import { normalizeImageUrl } from "../../lib/image-url";

type Props = { title: string; description: string; image: string; href: string };

export default function CollectionCard({ title, description, image, href }: Props) {
  const src = normalizeImageUrl(image?.trim()) || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85";
  return (
    <Link href={href} className="catalog-card catalog-card--collection">
      <div className="catalog-card__media"><img src={src} alt={title} /><span>Collection</span></div>
      <div className="catalog-card__body"><div><h3>{title}</h3><p>{description}</p></div><i aria-hidden="true">↗</i></div>
    </Link>
  );
}
