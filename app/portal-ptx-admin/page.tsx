import Link from "next/link";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminPanel from "../../components/admin/AdminPanel";
import AdminStats from "../../components/admin/AdminStats";

export default function PortalAdminPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Patak Textile Management Panel"
        text="Manage products, collections and editorial content through a cleaner internal interface."
        actions={
          <>
            <Link href="/admin/products/new" className="button-link btn-accent">
              New Product
            </Link>
            <Link href="/admin/collections/new" className="button-link btn-secondary">
              New Collection
            </Link>
            <Link href="/admin/blog/new" className="button-link btn-secondary">
              New Article
            </Link>
          </>
        }
      />

      <AdminStats
        items={[
          { label: "Content Areas", value: 3 },
          { label: "Primary Modules", value: "Products / Collections / Blog" },
          { label: "Environment", value: "Google Sheets CMS" },
        ]}
      />

      <AdminPanel
        title="Quick Access"
        text="Jump directly into the content areas you use most."
      >
        <div className="admin-link-grid">
          <Link href="/admin/products" className="admin-link-card">
            <span className="admin-link-card__eyebrow">Catalog</span>
            <h3 className="admin-link-card__title">Products</h3>
            <p className="admin-link-card__text">
              View, create and update product records.
            </p>
          </Link>

          <Link href="/admin/collections" className="admin-link-card">
            <span className="admin-link-card__eyebrow">Structure</span>
            <h3 className="admin-link-card__title">Collections</h3>
            <p className="admin-link-card__text">
              Manage the main collection organization.
            </p>
          </Link>

          <Link href="/admin/blog" className="admin-link-card">
            <span className="admin-link-card__eyebrow">Editorial</span>
            <h3 className="admin-link-card__title">Blog</h3>
            <p className="admin-link-card__text">
              Create and edit articles for the public site.
            </p>
          </Link>
        </div>
      </AdminPanel>

      <AdminPanel
        title="Internal Note"
        text="Use this panel for content management only. Public navigation and brand pages should be reviewed from the live frontend."
      >
        <div className="admin-note">
          Keep slugs clean, use published status only for ready content, and prefer
          consistent image sizing for a better frontend result.
        </div>
      </AdminPanel>
    </>
  );
}