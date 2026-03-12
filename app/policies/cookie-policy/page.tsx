import Link from "next/link";

export default function CookiePolicyPage() {
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
          <h1>Cookie Policy</h1>
          <p className="lead" style={{ marginBottom: 0 }}>
            This page will hold formal cookie policy content in a clearer legal reading layout.
          </p>
        </section>

        <div className="data-box" style={{ lineHeight: 1.8 }}>
          <h3>Planned content structure</h3>
          <p>
            We can later place the final cookie policy text here with section
            titles, policy definitions, cookie usage descriptions and user rights.
          </p>
        </div>
      </div>
    </div>
  );
}