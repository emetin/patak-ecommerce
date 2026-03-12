type HighlightItem = {
  title: string;
  text: string;
};

type HighlightGridProps = {
  kicker?: string;
  title: string;
  text?: string;
  items: HighlightItem[];
};

export default function HighlightGrid({
  kicker,
  title,
  text,
  items,
}: HighlightGridProps) {
  return (
    <section className="section section--soft">
      <div className="container">
        <div className="section-heading">
          {kicker ? <div className="section-heading__kicker">{kicker}</div> : null}
          <h2 className="section-heading__title">{title}</h2>
          {text ? <p className="section-heading__text">{text}</p> : null}
        </div>

        <div className="feature-grid">
          {items.map((item, index) => (
            <article className="feature-card" key={`${item.title}-${index}`}>
              <span className="feature-card__index">
                {String(index + 1).padStart(2, "0")} / Highlight
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}