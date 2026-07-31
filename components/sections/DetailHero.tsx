import Container from "../ui/Container";

type DetailHeroStat = { label: string; value: string | number };
type Props = { kicker: string; title: string; text: string; image: string; stats?: DetailHeroStat[]; actions?: React.ReactNode };

export default function DetailHero({ kicker, title, text, image, stats, actions }: Props) {
  const src = image?.trim() || "https://images.unsplash.com/photo-1528459105426-b9548367069b?auto=format&fit=crop&w=1600&q=85";
  return (
    <section className="detail-hero-modern">
      <Container>
        <div className="detail-hero-modern__grid">
          <div className="detail-hero-modern__copy">
            <p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{text}</p>
            {stats?.length ? <div className="detail-hero-modern__stats">{stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div> : null}
            {actions ? <div className="detail-hero-modern__actions">{actions}</div> : null}
          </div>
          <div className="detail-hero-modern__media"><img src={src} alt={title} /></div>
        </div>
      </Container>
    </section>
  );
}
