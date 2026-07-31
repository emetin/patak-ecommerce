import Link from "next/link";
import { normalizeImageUrl } from "../../lib/image-url";

type Props = { title: string; excerpt: string; image: string; href: string };

export default function BlogCard({ title, excerpt, image, href }: Props) {
  const src = normalizeImageUrl(image?.trim()) || "https://images.unsplash.com/photo-1528459105426-b9548367069b?auto=format&fit=crop&w=1400&q=85";
  return (
    <Link href={href} className="catalog-card catalog-card--article">
      <div className="catalog-card__media"><img src={src} alt={title} /><span>Journal</span></div>
      <div className="catalog-card__body"><div><h3>{title}</h3><p>{excerpt}</p></div><i aria-hidden="true">→</i></div>
    </Link>
  );
}
