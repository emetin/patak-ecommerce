type SectionHeadingProps = {
  kicker?: string;
  title: string;
  text?: string;
};

export default function SectionHeading({
  kicker,
  title,
  text,
}: SectionHeadingProps) {
  return (
    <div className="section-head">
      <div>
        {kicker ? <span className="card-kicker">{kicker}</span> : null}
        <h2>{title}</h2>
      </div>
      {text ? <p>{text}</p> : null}
    </div>
  );
}