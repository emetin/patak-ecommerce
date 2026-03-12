import Link from "next/link";

const brandBlocks = [
  {
    title: "Brand Ecosystem",
    text: "This page can present connected brand structures, business units or related hospitality textile identities.",
  },
  {
    title: "Positioning Clarity",
    text: "A dedicated brand page helps visitors understand how different names or collections connect to the wider textile group.",
  },
  {
    title: "Premium Narrative",
    text: "Strong brand grouping supports trust, scale perception and a more complete corporate presentation.",
  },
];

export default function OurBrandsPage() {
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
          <span className="card-kicker">Our Brands</span>
          <h1 style={{ maxWidth: 920 }}>
            A structured page for connected brands and textile identities
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            This section can later present the wider brand universe behind Patak
            Textile in a cleaner and more confident way.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="cards-3">
            {brandBlocks.map((item) => (
              <article className="card" key={item.title}>
                <div className="card-body">
                  <span className="card-kicker">Brand Layer</span>
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