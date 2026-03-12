type SectionHeadingProps = {
  kicker?: string;
  title: string;
  text?: string;
  center?: boolean;
};

export default function SectionHeading({
  kicker,
  title,
  text,
  center = false,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${center ? "section-heading--center" : ""}`}>
      {kicker ? <div className="section-heading__kicker">{kicker}</div> : null}
      <h2 className="section-heading__title">{title}</h2>
      {text ? <p className="section-heading__text">{text}</p> : null}
    </div>
  );
}