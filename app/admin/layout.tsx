"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const SIDEBAR_WIDTH = 270;

const menuItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <style jsx global>{`
        .site-topbar,
        .site-header,
        .site-footer {
          display: none !important;
        }

        .site-main {
          padding: 0 !important;
          margin: 0 !important;
        }

        .site-shell {
          min-height: 100vh;
          background: #f5f2ec;
        }

        html,
        body {
          overflow-x: hidden;
          background: #f5f2ec;
        }

        @media (max-width: 900px) {
          .ptx-admin-sidebar {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
          }

          .ptx-admin-main {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

      <aside className="ptx-admin-sidebar" style={sidebarStyle}>
        <div>
          <div style={brandBoxStyle}>
            <div style={brandEyebrowStyle}>Patak Textile</div>
            <div style={brandTitleStyle}>Admin CMS</div>
            <div style={brandSubStyle}>Corporate content panel</div>
          </div>

          <nav style={navStyle}>
            {menuItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...navItemStyle,
                    ...(active ? navItemActiveStyle : {}),
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={sidebarBottomStyle}>
          <Link href="/" style={secondaryButtonStyle}>
            View Website
          </Link>

          <form method="POST" action="/api/admin-auth/logout" style={{ margin: 0 }}>
            <button type="submit" style={logoutButtonStyle}>
              Logout
            </button>
          </form>
        </div>
      </aside>

      <main className="ptx-admin-main" style={mainStyle}>
        <div style={contentStyle}>{children}</div>
      </main>
    </>
  );
}

const sidebarStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: SIDEBAR_WIDTH,
  height: "100vh",
  padding: 24,
  background: "#111827",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRight: "1px solid rgba(255,255,255,0.08)",
  zIndex: 100,
  overflowY: "auto",
};

const mainStyle: React.CSSProperties = {
  marginLeft: SIDEBAR_WIDTH,
  width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
  minHeight: "100vh",
  background: "#f5f2ec",
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1560,
  margin: "0 auto",
  padding: "32px 36px 56px",
};

const brandBoxStyle: React.CSSProperties = {
  paddingBottom: 24,
  borderBottom: "1px solid rgba(255,255,255,0.12)",
};

const brandEyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.52)",
  fontWeight: 800,
  marginBottom: 8,
};

const brandTitleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  lineHeight: 1.1,
};

const brandSubStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  color: "rgba(255,255,255,0.56)",
};

const navStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 28,
};

const navItemStyle: React.CSSProperties = {
  minHeight: 48,
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  borderRadius: 14,
  color: "rgba(255,255,255,0.76)",
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 700,
  border: "1px solid transparent",
};

const navItemActiveStyle: React.CSSProperties = {
  background: "#2f7d62",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.14)",
};

const sidebarBottomStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  paddingTop: 24,
  borderTop: "1px solid rgba(255,255,255,0.12)",
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 800,
  border: "1px solid rgba(255,255,255,0.12)",
};

const logoutButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 44,
  borderRadius: 12,
  background: "#ffffff",
  color: "#111827",
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
};