"use client";

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function handleLogout() {
    await fetch("/api/admin-auth/logout", {
      method: "POST",
    });

    window.location.href = "/portal-ptx-admin";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <div
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "#f8f8f8",
        }}
      >
        <div
          className="container"
          style={{
            minHeight: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#000000",
              }}
            >
              PATAK <span style={{ color: "#065319" }}>ADMIN</span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(0,0,0,0.6)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Internal content management
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/admin/products" className="btn-secondary">
              Products
            </Link>
            <Link href="/admin/blog" className="btn-secondary">
              Blog
            </Link>
            <Link href="/admin/collections" className="btn-secondary">
              Collections
            </Link>
            <Link href="/" className="btn-secondary">
              Public Site
            </Link>
            <button type="button" className="btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}