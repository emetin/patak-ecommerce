type InfoSplitProps = {
  kicker?: string;
  title: string;
  text: string;
  image: string;
  imageAlt?: string;
  reverse?: boolean;
};

export default function InfoSplit({
  kicker,
  title,
  text,
  image,
  imageAlt = "",
  reverse = false,
}: InfoSplitProps) {
  return (
    <section className="section">
      <div className="container">
        <div className={`info-split ${reverse ? "info-split--reverse" : ""}`}>
          <div
            className="info-split__media"
            style={{ backgroundImage: `url(${image})` }}
            aria-label={imageAlt}
            role="img"
          />
          <div className="info-split__content">
            {kicker ? <div className="section-heading__kicker">{kicker}</div> : null}
            <h2 className="info-split__title">{title}</h2>
            <p className="info-split__text">{text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}