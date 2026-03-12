import Link from "next/link";

export default function PressReleasePage() {
  return (
    <div className="simple-page">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 18 }}>
          <Link href="/" className="btn-secondary">
            ← Home
          </Link>
        </div>

        <section
          style={{
            marginBottom: 30,
            padding: "32px 0 8px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="card-kicker">Press Release</span>
          <h1 style={{ maxWidth: 920 }}>
            Public announcements, brand updates and company news
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            This page can later carry official updates, announcements and
            curated brand communications in a more editorial format.
          </p>
        </section>

        <div className="data-box">
          <h3 style={{ marginBottom: 10 }}>Planned structure</h3>
          <p style={{ marginBottom: 0 }}>
            We can later turn this page into a press archive with date-based
            cards, category tags and announcement detail pages.
          </p>
        </div>
      </div>
    </div>
  );
}