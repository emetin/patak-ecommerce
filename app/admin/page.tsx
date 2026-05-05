import Link from "next/link";

const mainCards = [
  {
    title: "Products",
    description:
      "Create, update and organize product content, images and publishing status.",
    href: "/admin/products",
    action: "Manage Products",
  },
  {
    title: "Collections",
    description:
      "Manage collection pages and structure product groups for the website.",
    href: "/admin/collections",
    action: "Manage Collections",
  },
  {
    title: "Blog",
    description:
      "Publish company updates, textile insights and SEO-focused articles.",
    href: "/admin/blog",
    action: "Manage Blog",
  },
  {
    title: "Media Library",
    description:
      "Upload, review and reuse media assets across products and content pages.",
    href: "/admin/media",
    action: "Open Media Library",
  },
];

const quickActions = [
  {
    label: "New Product",
    href: "/admin/products/new",
  },
  {
    label: "Open Products",
    href: "/admin/products",
  },
  {
    label: "Open Collections",
    href: "/admin/collections",
  },
  {
    label: "Open Blog",
    href: "/admin/blog",
  },
  {
    label: "View Website",
    href: "/",
  },
];

export default function AdminDashboardPage() {
  return (
    <>
      <style>{`
        @media (max-width: 1180px) {
          .admin-dashboard-layout {
            grid-template-columns: 1fr !important;
          }

          .admin-dashboard-side-panel {
            order: -1 !important;
          }

          .admin-dashboard-quick-list {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 900px) {
          .admin-dashboard-page {
            gap: 18px !important;
          }

          .admin-dashboard-hero {
            min-height: auto !important;
            padding: 24px !important;
            border-radius: 22px !important;
            align-items: flex-start !important;
          }

          .admin-dashboard-title {
            font-size: 36px !important;
          }

          .admin-dashboard-subtitle {
            font-size: 15px !important;
          }

          .admin-dashboard-actions {
            width: 100% !important;
          }

          .admin-dashboard-actions a {
            width: 100% !important;
          }

          .admin-dashboard-overview {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 18px !important;
          }

          .admin-dashboard-divider {
            display: none !important;
          }

          .admin-dashboard-main-grid {
            grid-template-columns: 1fr !important;
          }

          .admin-dashboard-main-card {
            min-height: auto !important;
            padding: 22px !important;
          }

          .admin-dashboard-side-panel {
            padding: 22px !important;
            border-radius: 22px !important;
          }
        }

        @media (max-width: 560px) {
          .admin-dashboard-hero {
            padding: 20px !important;
          }

          .admin-dashboard-title {
            font-size: 31px !important;
          }

          .admin-dashboard-kicker,
          .admin-dashboard-overview-label,
          .admin-dashboard-side-kicker {
            font-size: 11px !important;
          }

          .admin-dashboard-card-title,
          .admin-dashboard-side-title {
            font-size: 22px !important;
          }

          .admin-dashboard-quick-list {
            grid-template-columns: 1fr !important;
          }

          .admin-dashboard-quick-link {
            min-height: 46px !important;
          }
        }
      `}</style>

      <div className="admin-dashboard-page" style={pageStyle}>
        <section className="admin-dashboard-hero" style={heroStyle}>
          <div style={heroContentStyle}>
            <div className="admin-dashboard-kicker" style={kickerStyle}>
              Patak Textile Admin CMS
            </div>

            <h1 className="admin-dashboard-title" style={titleStyle}>
              Dashboard
            </h1>

            <p className="admin-dashboard-subtitle" style={subtitleStyle}>
              Manage the website content from a clean and protected internal
              control panel.
            </p>
          </div>

          <div className="admin-dashboard-actions" style={heroActionsStyle}>
            <Link href="/admin/products/new" style={primaryButtonStyle}>
              + New Product
            </Link>

            <Link href="/" style={secondaryButtonStyle}>
              View Website
            </Link>
          </div>
        </section>

        <section className="admin-dashboard-overview" style={overviewStyle}>
          <div style={overviewItemStyle}>
            <span
              className="admin-dashboard-overview-label"
              style={overviewLabelStyle}
            >
              System Status
            </span>
            <strong style={overviewValueStyle}>Active</strong>
          </div>

          <div className="admin-dashboard-divider" style={overviewDividerStyle} />

          <div style={overviewItemStyle}>
            <span
              className="admin-dashboard-overview-label"
              style={overviewLabelStyle}
            >
              Access
            </span>
            <strong style={overviewValueStyle}>Protected</strong>
          </div>

          <div className="admin-dashboard-divider" style={overviewDividerStyle} />

          <div style={overviewItemStyle}>
            <span
              className="admin-dashboard-overview-label"
              style={overviewLabelStyle}
            >
              Content Areas
            </span>
            <strong style={overviewValueStyle}>
              Products, Collections, Blog, Media
            </strong>
          </div>
        </section>

        <section className="admin-dashboard-layout" style={layoutGridStyle}>
          <div className="admin-dashboard-main-grid" style={mainGridStyle}>
            {mainCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="admin-dashboard-main-card"
                style={mainCardStyle}
              >
                <div>
                  <h2
                    className="admin-dashboard-card-title"
                    style={cardTitleStyle}
                  >
                    {card.title}
                  </h2>

                  <p style={cardDescriptionStyle}>{card.description}</p>
                </div>

                <span style={cardActionStyle}>{card.action}</span>
              </Link>
            ))}
          </div>

          <aside
            className="admin-dashboard-side-panel"
            style={sidePanelStyle}
          >
            <div style={sidePanelHeaderStyle}>
              <div className="admin-dashboard-side-kicker" style={sidePanelKickerStyle}>
                Quick Access
              </div>

              <h2 className="admin-dashboard-side-title" style={sidePanelTitleStyle}>
                Common Tasks
              </h2>
            </div>

            <div className="admin-dashboard-quick-list" style={quickListStyle}>
              {quickActions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="admin-dashboard-quick-link"
                  style={quickLinkStyle}
                >
                  <span>{item.label}</span>
                  <span style={quickArrowStyle}>→</span>
                </Link>
              ))}
            </div>

            <div style={noteBoxStyle}>
              <div style={noteTitleStyle}>Protected Admin Area</div>
              <p style={noteTextStyle}>
                Admin routes are protected by signed session validation.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}

const pageStyle: React.CSSProperties = {
  display: "grid",
  gap: 24,
};

const heroStyle: React.CSSProperties = {
  minHeight: 190,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
  flexWrap: "wrap",
  padding: 34,
  borderRadius: 28,
  background:
    "linear-gradient(135deg, #ffffff 0%, #fbfaf7 55%, #f3eee6 100%)",
  border: "1px solid #ded4c4",
  boxShadow: "0 18px 50px rgba(17, 24, 39, 0.06)",
};

const heroContentStyle: React.CSSProperties = {
  maxWidth: 760,
};

const kickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#2f7d62",
  marginBottom: 12,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 44,
  lineHeight: 1.05,
  fontWeight: 900,
  letterSpacing: "-0.04em",
  color: "#111827",
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 14,
  marginBottom: 0,
  maxWidth: 660,
  fontSize: 16,
  lineHeight: 1.75,
  color: "#6b6258",
};

const heroActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: 48,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
  borderRadius: 14,
  background: "#2f7d62",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 850,
  border: "1px solid #2f7d62",
  boxShadow: "0 12px 26px rgba(47, 125, 98, 0.18)",
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 48,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
  borderRadius: 14,
  background: "#ffffff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 850,
  border: "1px solid #ded4c4",
};

const overviewStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 22,
  flexWrap: "wrap",
  padding: "20px 24px",
  borderRadius: 22,
  background: "#ffffff",
  border: "1px solid #ded4c4",
};

const overviewItemStyle: React.CSSProperties = {
  display: "grid",
  gap: 5,
};

const overviewLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8a8176",
};

const overviewValueStyle: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.35,
  color: "#111827",
};

const overviewDividerStyle: React.CSSProperties = {
  width: 1,
  height: 38,
  background: "#e5ddd2",
};

const layoutGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 340px",
  gap: 24,
  alignItems: "start",
};

const mainGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 18,
};

const mainCardStyle: React.CSSProperties = {
  minHeight: 210,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 28,
  padding: 26,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid #ded4c4",
  textDecoration: "none",
  color: "#111827",
  boxShadow: "0 12px 32px rgba(17, 24, 39, 0.04)",
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 25,
  lineHeight: 1.15,
  fontWeight: 900,
  letterSpacing: "-0.03em",
};

const cardDescriptionStyle: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 0,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#6b6258",
};

const cardActionStyle: React.CSSProperties = {
  color: "#2f7d62",
  fontWeight: 900,
  fontSize: 14,
};

const sidePanelStyle: React.CSSProperties = {
  display: "grid",
  gap: 18,
  padding: 24,
  borderRadius: 24,
  background: "#111827",
  color: "#ffffff",
  boxShadow: "0 16px 42px rgba(17, 24, 39, 0.12)",
};

const sidePanelHeaderStyle: React.CSSProperties = {
  paddingBottom: 16,
  borderBottom: "1px solid rgba(255,255,255,0.12)",
};

const sidePanelKickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.52)",
  marginBottom: 10,
};

const sidePanelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 25,
  lineHeight: 1.15,
  fontWeight: 900,
};

const quickListStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const quickLinkStyle: React.CSSProperties = {
  minHeight: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "0 14px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 800,
  border: "1px solid rgba(255,255,255,0.1)",
};

const quickArrowStyle: React.CSSProperties = {
  color: "#7dd3a8",
  fontWeight: 900,
};

const noteBoxStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: "rgba(47,125,98,0.18)",
  border: "1px solid rgba(125,211,168,0.22)",
};

const noteTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 900,
  marginBottom: 8,
};

const noteTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.65,
  color: "rgba(255,255,255,0.68)",
};