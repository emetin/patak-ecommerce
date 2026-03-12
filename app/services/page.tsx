import Link from "next/link";

const serviceItems = [
  {
    title: "Hospitality Textile Supply",
    text: "A cleaner structure for presenting hotel-focused bedding, towels, robes and related textile categories.",
  },
  {
    title: "Collection Planning",
    text: "Products can be grouped under stronger collection logic to support easier discovery and a more premium browsing flow.",
  },
  {
    title: "Project-Oriented Support",
    text: "The site can support hotel, residence, resort and accommodation-based sourcing communication in a clearer way.",
  },
];

export default function ServicesPage() {
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
          <span className="card-kicker">Services</span>
          <h1 style={{ maxWidth: 960 }}>
            Hospitality-focused textile services and structured product presentation
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            This page is designed to present Patak Textile’s service structure
            in a more refined way for hotels, residences, resorts and premium
            accommodation projects.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0, paddingBottom: 34 }}>
          <div className="cards-3">
            {serviceItems.map((item) => (
              <article className="card" key={item.title}>
                <div className="card-body">
                  <span className="card-kicker">Service Area</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="split-section">
            <div className="split-card">
              <span className="card-kicker">Support Structure</span>
              <h2>A more professional way to explain hospitality textile capability</h2>
              <p>
                Instead of listing products alone, this area helps explain how
                Patak Textile supports hospitality buyers through collection
                thinking, textile organization and project-oriented communication.
              </p>
              <p>
                Later, this page can be expanded with service categories,
                embroidery or customization options, project workflow blocks and
                partnership messaging.
              </p>

              <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/contact-us" className="btn-primary">
                  Contact Us
                </Link>
                <Link href="/collections" className="btn-secondary">
                  Explore Collections
                </Link>
              </div>
            </div>

            <div
              className="image-feature"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80")',
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}