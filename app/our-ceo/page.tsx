import Link from "next/link";

export default function OurCEOPage() {
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
          <span className="card-kicker">Our CEO</span>
          <h1 style={{ maxWidth: 920 }}>
            Leadership, vision and the perspective behind the brand
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            This page can later introduce leadership, company direction and the
            premium hospitality perspective that shapes Patak Textile.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="split-section">
            <div
              className="image-feature"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80")',
                minHeight: 560,
              }}
            />

            <div className="split-card">
              <span className="card-kicker">Leadership Profile</span>
              <h2>A dedicated space for company vision and executive narrative</h2>
              <p>
                This page is designed to become a polished leadership profile
                page with biography, vision statement, strategic direction and
                company philosophy.
              </p>
              <p>
                Later, we can add structured biography sections, a timeline,
                mission statements and leadership messaging aligned with the
                hospitality textile brand image.
              </p>

              <div style={{ marginTop: 22 }}>
                <Link href="/about-us" className="btn-primary">
                  About the Company
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}