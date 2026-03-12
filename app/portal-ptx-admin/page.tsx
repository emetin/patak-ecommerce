"use client";

import { useState } from "react";

export default function HiddenAdminEntryPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultError, setResultError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setResultError("");

      const response = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Giriş başarısız.");
      }

      window.location.href = "/admin/products";
    } catch (error) {
      setResultError(
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="simple-page">
      <div className="container" style={{ maxWidth: 700 }}>
        <section
          className="data-box"
          style={{
            padding: 32,
          }}
        >
          <span className="card-kicker">Management Access</span>
          <h1 style={{ marginTop: 0 }}>Internal login</h1>
          <p className="lead" style={{ marginBottom: 22 }}>
            This area is reserved for internal content management. Please enter
            the access password to continue.
          </p>

          <form onSubmit={handleLogin} style={{ display: "grid", gap: 14 }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter management password"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Checking..." : "Enter Management Area"}
            </button>
          </form>

          {resultError ? (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fafafa",
                color: "#000000",
              }}
            >
              {resultError}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}