import Link from "next/link";

export default function PortalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="container admin-topbar__inner">
          <div className="admin-brand">
            <div className="admin-brand__title">
              Patak <span>Admin</span>
            </div>
            <div className="admin-brand__subtitle">
              Internal Content Management
            </div>
          </div>

          <nav className="admin-nav">
            <Link href="/portal-ptx-admin">Dashboard</Link>
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/collections">Collections</Link>
            <Link href="/admin/blog">Blog</Link>
            <Link href="/">Public Site</Link>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="container admin-main__inner admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}