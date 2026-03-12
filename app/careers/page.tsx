import Link from "next/link";

const careerItems = [
  {
    title: "Growth Environment",
    text: "This page can later communicate team culture, growth mindset and long-term development opportunities.",
  },
  {
    title: "Operational Roles",
    text: "Suitable for warehouse, production, logistics, sales and hospitality textile support positions.",
  },
  {
    title: "Brand Culture",
    text: "A more structured recruitment page helps the brand feel organized, serious and trustworthy for applicants.",
  },
];

export default function CareersPage() {
  return (
    <div className="simple-page">
      <div className="container">
        <div style={{ marginBottom: 18 }}>
          <Link href="/" className="btn-secondary">
            ← Home
          </Link>
        </div>

        <section
          style={{
            marginBottom: 34,
            padding: "32px 0 8px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="card-kicker">Careers</span>
          <h1 style={{ maxWidth: 920 }}>
            A clearer recruitment page for team growth and company culture
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            This page can become the structured hiring area for future roles,
            company culture messaging and recruitment communication.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="cards-3">
            {careerItems.map((item) => (
              <article className="card" key={item.title}>
                <div className="card-body">
                  <span className="card-kicker">Career Area</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}