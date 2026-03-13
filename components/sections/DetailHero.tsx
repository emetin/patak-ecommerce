type DetailHeroProps = {
  kicker?: string;
  title: string;
  text?: string;
  image: string;
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
  actions?: React.ReactNode;
};

export default function DetailHero({
  kicker,
  title,
  text,
  image,
  stats = [],
  actions,
}: DetailHeroProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="detail-hero">
          <div
            className="detail-hero__media"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="detail-hero__content">
            {kicker ? <div className="section-heading__kicker">{kicker}</div> : null}

            <h1 className="detail-hero__title">{title}</h1>

            {text ? <p className="detail-hero__text">{text}</p> : null}

            {stats.length > 0 ? (
              <div className="detail-hero__stats">
                {stats.map((item, index) => (
                  <article className="detail-hero__stat" key={`${item.label}-${index}`}>
                    <span className="detail-hero__stat-label">{item.label}</span>
                    <strong className="detail-hero__stat-value">{item.value}</strong>
                  </article>
                ))}
              </div>
            ) : null}

            {actions ? <div className="detail-hero__actions">{actions}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}