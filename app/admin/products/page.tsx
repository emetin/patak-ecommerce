"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProductItem = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  image?: string;
  gallery?: string;
  collection_slug?: string;
  status?: string;
  featured?: string;
  created_at?: string;
  updated_at?: string;
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/products/list", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data?.error || "Failed to load products.");
        }

        setItems(data.items || []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const collectionOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        items
          .map((item) => String(item.collection_slug || "").trim())
          .filter(Boolean)
      )
    );

    return values.sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const slug = String(item.slug || "").toLowerCase();
      const collectionSlug = String(item.collection_slug || "").toLowerCase();
      const status = String(item.status || "").toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        collectionSlug.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      const matchesCollection =
        collectionFilter === "all" ||
        collectionSlug === collectionFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCollection;
    });
  }, [items, search, statusFilter, collectionFilter]);

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
          <Link href="/admin/products/new" className="btn-primary">
            + New Product
          </Link>
        </div>

        <h1>Products Admin</h1>
        <p className="lead">
          Search, filter, and manage product records from the Sheets-based system.
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
                placeholder="Search by title, slug, or collection"
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
              <label style={labelStyle}>Collection</label>
              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="all">all</option>
                {collectionOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 14, color: "#6d655b" }}>
            Total records: <strong>{items.length}</strong> | Filtered:{" "}
            <strong>{filteredItems.length}</strong>
          </div>
        </div>

        {loading ? (
          <div className="data-box">Loading...</div>
        ) : errorMessage ? (
          <div className="data-box">
            <h3>Error</h3>
            <pre>{errorMessage}</pre>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            No products matched your search or filters.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Collection</th>
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
                    <td>{item.collection_slug || "-"}</td>
                    <td>{item.status || "-"}</td>
                    <td>{item.featured || "-"}</td>
                    <td>{item.updated_at || "-"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {item.slug ? (
                          <Link
                            href={`/admin/products/${item.slug}`}
                            className="btn-secondary"
                          >
                            Edit
                          </Link>
                        ) : null}

                        {item.slug ? (
                          <Link
                            href={`/products/${item.slug}`}
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