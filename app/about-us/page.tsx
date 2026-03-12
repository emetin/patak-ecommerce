import Link from "next/link";

const values = [
  {
    title: "Hospitality Focus",
    text: "We build textile presentation around the needs of hotels, residences, resorts and premium accommodation projects.",
  },
  {
    title: "Premium Material Language",
    text: "Our digital structure reflects comfort, consistency, softness and a more elevated hospitality textile positioning.",
  },
  {
    title: "Clear Collection Thinking",
    text: "Collections, products and editorial content work together to present the brand with stronger clarity.",
  },
];

const strengths = [
  {
    title: "Brand Presentation",
    text: "A more refined visual experience helps Patak Textile communicate trust and premium textile value more effectively.",
  },
  {
    title: "Structured Product World",
    text: "Products and collections are grouped in a clearer way so clients understand the offering more quickly.",
  },
  {
    title: "Scalable Foundation",
    text: "The system is built lean now and can expand later with richer content, page types and brand storytelling.",
  },
];

export default function AboutUsPage() {
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
          <span className="card-kicker">About Us</span>
          <h1 style={{ maxWidth: 960 }}>
            A cleaner and more premium hospitality textile brand presentation
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            Patak Textile is positioned around hospitality-focused textile
            presentation, premium visual language and a more organized way of
            showing collections, products and brand value.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0, paddingBottom: 34 }}>
          <div className="cards-3">
            {values.map((item) => (
              <article className="card" key={item.title}>
                <div className="card-body">
                  <span className="card-kicker">Core Value</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0, paddingBottom: 34 }}>
          <div className="split-section">
            <div className="split-card">
              <span className="card-kicker">Brand Direction</span>
              <h2>Textile presentation shaped for hotels and residences</h2>
              <p>
                This page is designed to become the central brand narrative
                space. It can carry the Patak Textile story, production
                strengths, hospitality positioning, quality standards and
                long-term textile expertise in a more elegant format.
              </p>
              <p>
                Instead of a generic company page, this structure allows the
                brand to feel more intentional, more premium and more aligned
                with hospitality expectations.
              </p>

              <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/collections" className="btn-primary">
                  Explore Collections
                </Link>
                <Link href="/products" className="btn-secondary">
                  View Products
                </Link>
              </div>
            </div>

            <div
              className="image-feature"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80")',
              }}
            />
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <div>
              <h2>What this foundation supports</h2>
            </div>
            <p>
              The new structure is not just visual. It creates a more useful and
              scalable way to communicate textile expertise.
            </p>
          </div>

          <div className="cards-3">
            {strengths.map((item) => (
              <article className="card" key={item.title}>
                <div className="card-body">
                  <span className="card-kicker">Strength</span>
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