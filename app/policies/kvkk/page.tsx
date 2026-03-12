import Link from "next/link";

export default function KVKKPage() {
  return (
    <div className="simple-page">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div style={{ marginBottom: 18 }}>
          <Link href="/" className="btn-secondary">
            ← Home
          </Link>
        </div>

        <section
          style={{
            marginBottom: 26,
            padding: "32px 0 8px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="card-kicker">Policy</span>
          <h1>KVKK</h1>
          <p className="lead" style={{ marginBottom: 0 }}>
            This page will hold KVKK-related disclosure and legal content in a structured layout.
          </p>
        </section>

        <div className="data-box" style={{ lineHeight: 1.8 }}>
          <h3>Planned content structure</h3>
          <p>
            We can later add the final KVKK text, disclosure sections, data
            processing explanations and legal information here.
          </p>
        </div>
      </div>
    </div>
  );
}