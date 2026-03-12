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
    <div
      className="section-head"
      style={{
        display: "grid",
        gap: 18,
        alignItems: "end",
        marginBottom: 28,
      }}
    >
      <div style={{ maxWidth: 760 }}>
        {kicker ? (
          <span
            className="card-kicker"
            style={{
              display: "inline-block",
              marginBottom: 12,
              letterSpacing: "0.14em",
            }}
          >
            {kicker}
          </span>
        ) : null}

        <h2
          style={{
            marginBottom: text ? 14 : 0,
            lineHeight: 1.08,
            maxWidth: 820,
          }}
        >
          {title}
        </h2>

        {text ? (
          <p
            style={{
              maxWidth: 760,
              margin: 0,
              fontSize: 17,
              lineHeight: 1.8,
              color: "rgba(0,0,0,0.68)",
            }}
          >
            {text}
          </p>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        style={{
          width: 88,
          height: 1,
          background: "rgba(0,0,0,0.14)",
        }}
      />
    </div>
  );
}