import Link from "next/link";

export default function AdminRedirectInfoPage() {
  return (
    <div className="simple-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="data-box">
          <span className="card-kicker">Restricted Area</span>
          <h1 style={{ marginTop: 0 }}>Management entry moved</h1>
          <p className="lead" style={{ marginBottom: 18 }}>
            This area is not intended as the public management entry point.
            Please use the dedicated internal access route instead.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/" className="btn-secondary">
              Go Home
            </Link>

            <Link href="/portal-ptx-admin" className="btn-primary">
              Open Management Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}