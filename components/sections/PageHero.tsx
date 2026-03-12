type PageHeroProps = {
  kicker?: string;
  title: string;
  text?: string;
};

export default function PageHero({
  kicker,
  title,
  text,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="page-hero__inner">
          {kicker ? <div className="page-hero__kicker">{kicker}</div> : null}
          <h1 className="page-hero__title">{title}</h1>
          {text ? <p className="page-hero__text">{text}</p> : null}
        </div>
      </div>
    </section>
  );
}