"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BlogItem = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  status?: string;
  featured?: string;
  created_at?: string;
  updated_at?: string;
};

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/blog/list", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data?.error || "Blog kayıtları alınamadı.");
        }

        setItems(data.items || []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const slug = String(item.slug || "").toLowerCase();
      const excerpt = String(item.excerpt || "").toLowerCase();
      const status = String(item.status || "").toLowerCase();
      const featured = String(item.featured || "").toLowerCase();

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        slug.includes(query) ||
        excerpt.includes(query);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      const matchesFeatured =
        featuredFilter === "all" || featured === featuredFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [items, search, statusFilter, featuredFilter]);

  return (
    <div className="simple-page">
      <div className="container">
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <Link href="/admin" className="btn-secondary">
            ← Admin
          </Link>
          <Link href="/admin/blog/new" className="btn-primary">
            + New Blog Post
          </Link>
        </div>

        <h1>Blog Admin</h1>
        <p className="lead">
          Blog içeriklerini ara, filtrele ve yönet.
        </p>

        <div className="data-box" style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: 14,
            }}
          >
            <div>
              <label style={labelStyle}>Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, slug veya excerpt ara"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="all">all</option>
                <option value="published">published</option>
                <option value="draft">draft</option>
                <option value="archived">archived</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Featured</label>
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="all">all</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 14, color: "#6d655b" }}>
            Toplam kayıt: <strong>{items.length}</strong> | Filtrelenen:{" "}
            <strong>{filteredItems.length}</strong>
          </div>
        </div>

        {loading ? (
          <div className="data-box">Yükleniyor...</div>
        ) : errorMessage ? (
          <div className="data-box">
            <h3>Hata</h3>
            <pre>{errorMessage}</pre>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            Aramana veya filtrelerine uygun blog kaydı bulunamadı.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id || item.slug || index}>
                    <td>{item.title || "-"}</td>
                    <td>{item.slug || "-"}</td>
                    <td>{item.status || "-"}</td>
                    <td>{item.featured || "-"}</td>
                    <td>{item.updated_at || "-"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {item.slug ? (
                          <Link
                            href={`/admin/blog/${item.slug}`}
                            className="btn-secondary"
                          >
                            Edit
                          </Link>
                        ) : null}

                        {item.slug ? (
                          <Link
                            href={`/blog/${item.slug}`}
                            className="btn-secondary"
                          >
                            View
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #ddd3c5",
  background: "#fff",
  outline: "none",
};