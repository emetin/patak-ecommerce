"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SIDEBAR_WIDTH = 270;

const menuItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/forms", label: "Forms" },
  { href: "/admin/media", label: "Media Library" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("ptx-admin-mode");

    return () => {
      document.body.classList.remove("ptx-admin-mode");
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <style jsx global>{`
        body.ptx-admin-mode header,
        body.ptx-admin-mode footer,
        body.ptx-admin-mode [role="banner"],
        body.ptx-admin-mode [role="contentinfo"],
        body.ptx-admin-mode .site-header,
        body.ptx-admin-mode .site-footer,
        body.ptx-admin-mode .site-topbar,
        body.ptx-admin-mode .header,
        body.ptx-admin-mode .footer,
        body.ptx-admin-mode .main-header,
        body.ptx-admin-mode .main-footer,
        body.ptx-admin-mode .navbar,
        body.ptx-admin-mode .mobile-header,
        body.ptx-admin-mode .mobile-menu,
        body.ptx-admin-mode .menu-toggle,
        body.ptx-admin-mode [class*="site-header"],
        body.ptx-admin-mode [class*="site-footer"],
        body.ptx-admin-mode [class*="main-header"],
        body.ptx-admin-mode [class*="main-footer"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          background: #f5f2ec !important;
        }

        body.ptx-admin-mode .site-main,
        body.ptx-admin-mode main:not(.ptx-admin-main) {
          padding: 0 !important;
          margin: 0 !important;
        }

        * {
          box-sizing: border-box;
        }

        .ptx-admin-mobile-bar {
          display: none !important;
        }

        @media (max-width: 900px) {
          .ptx-admin-mobile-bar {
            display: flex !important;
          }

          .ptx-admin-mobile-bar.is-hidden {
            display: none !important;
          }

          .ptx-admin-sidebar {
            width: 286px !important;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }

          .ptx-admin-sidebar.is-open {
            transform: translateX(0);
          }

          .ptx-admin-main {
            margin-left: 0 !important;
            width: 100% !important;
            padding-top: 70px;
          }

          .ptx-admin-main.menu-open {
            padding-top: 0 !important;
          }

          .ptx-admin-content {
            padding: 22px 16px 40px !important;
          }

          .ptx-admin-overlay {
            display: block !important;
          }
        }
      `}</style>

      <div style={shellStyle}>
        <div
          className={`ptx-admin-mobile-bar ${menuOpen ? "is-hidden" : ""}`}
          style={mobileBarStyle}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            style={hamburgerButtonStyle}
            aria-label="Open admin menu"
          >
            <span style={hamburgerLineStyle} />
            <span style={hamburgerLineStyle} />
            <span style={hamburgerLineStyle} />
          </button>

          <div>
            <div style={mobileTitleStyle}>Admin CMS</div>
            <div style={mobileSubtitleStyle}>Patak Textile</div>
          </div>
        </div>

        {menuOpen ? (
          <button
            type="button"
            className="ptx-admin-overlay"
            style={overlayStyle}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
        ) : null}

        <aside
          className={`ptx-admin-sidebar ${menuOpen ? "is-open" : ""}`}
          style={sidebarStyle}
        >
          <div>
            <div style={brandBoxStyle}>
              <div>
                <div style={brandEyebrowStyle}>Patak Textile</div>
                <div style={brandTitleStyle}>Admin CMS</div>
                <div style={brandSubStyle}>Corporate content panel</div>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                style={closeButtonStyle}
                aria-label="Close admin menu"
              >
                ×
              </button>
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

        <main
          className={`ptx-admin-main ${menuOpen ? "menu-open" : ""}`}
          style={mainStyle}
        >
          <div className="ptx-admin-content" style={contentStyle}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

const shellStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "100vh",
  background: "#f5f2ec",
};

const mobileBarStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 70,
  zIndex: 10000,
  alignItems: "center",
  gap: 14,
  padding: "0 16px",
  background: "#111827",
  color: "#ffffff",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const hamburgerButtonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  display: "grid",
  placeItems: "center",
  gap: 4,
  padding: 10,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
};

const hamburgerLineStyle: React.CSSProperties = {
  display: "block",
  width: 20,
  height: 2,
  background: "#ffffff",
  borderRadius: 999,
};

const mobileTitleStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 800,
  lineHeight: 1.2,
};

const mobileSubtitleStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.62)",
  marginTop: 2,
};

const overlayStyle: React.CSSProperties = {
  display: "none",
  position: "fixed",
  inset: 0,
  zIndex: 9998,
  background: "rgba(15,23,42,0.5)",
  border: "none",
  padding: 0,
  cursor: "pointer",
};

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
  zIndex: 9999,
  overflowY: "auto",
};

const mainStyle: React.CSSProperties = {
  marginLeft: SIDEBAR_WIDTH,
  width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
  minHeight: "100vh",
  background: "#f5f2ec",
  position: "relative",
  zIndex: 1,
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1560,
  margin: "0 auto",
  padding: "32px 48px 56px",
};

const brandBoxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  paddingBottom: 24,
  marginBottom: 28,
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

const closeButtonStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  flex: "0 0 auto",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  fontSize: 26,
  lineHeight: 1,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

const navStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
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