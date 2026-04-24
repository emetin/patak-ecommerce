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
  author?: string;
  status?: string;
  featured?: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
};

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function formatDateTime(value?: string) {
  const raw = normalizeText(value);

  if (!raw) {
    return "-";
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getScheduleState(item: BlogItem) {
  const status = normalizeLower(item.status);
  const publishedAt = normalizeText(item.published_at);

  if (status !== "scheduled") {
    return "-";
  }

  if (!publishedAt) {
    return "Missing date";
  }

  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  if (date.getTime() <= Date.now()) {
    return "Ready to publish";
  }

  return "Scheduled";
}

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
          throw new Error(data?.error || "Failed to load blog posts.");
        }

        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  const stats = useMemo(() => {
    let draft = 0;
    let scheduled = 0;
    let published = 0;
    let archived = 0;

    for (const item of items) {
      const status = normalizeLower(item.status);

      if (status === "draft") draft += 1;
      if (status === "scheduled") scheduled += 1;
      if (status === "published") published += 1;
      if (status === "archived") archived += 1;
    }

    return {
      draft,
      scheduled,
      published,
      archived,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const title = normalizeLower(item.title);
      const slug = normalizeLower(item.slug);
      const excerpt = normalizeLower(item.excerpt);
      const content = normalizeLower(item.content);
      const author = normalizeLower(item.author);
      const seoTitle = normalizeLower(item.seo_title);
      const seoDescription = normalizeLower(item.seo_description);
      const status = normalizeLower(item.status);

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        excerpt.includes(normalizedSearch) ||
        content.includes(normalizedSearch) ||
        author.includes(normalizedSearch) ||
        seoTitle.includes(normalizedSearch) ||
        seoDescription.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={titleStyle}>Blog</h1>
          <p style={subtitleStyle}>
            Manage blog posts, authors, SEO fields, and scheduled publishing.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href="/admin/blog/new" style={primaryButtonStyle}>
            + New Post
          </Link>

          <a href="/api/blog/export?format=csv" style={secondaryButtonStyle}>
            Export CSV
          </a>

          <a href="/api/blog/export?format=json" style={secondaryButtonStyle}>
            Export JSON
          </a>

          <a href="/api/blog/export?format=xml" style={secondaryButtonStyle}>
            Export XML
          </a>
        </div>
      </div>

      <div style={filterCardStyle}>
        <div style={statsRowStyle}>
          <StatBox label="Total Records" value={String(items.length)} />
          <StatBox label="Filtered Results" value={String(filteredItems.length)} />
          <StatBox label="Published" value={String(stats.published)} />
          <StatBox label="Scheduled" value={String(stats.scheduled)} />
          <StatBox label="Draft" value={String(stats.draft)} />
          <StatBox label="Archived" value={String(stats.archived)} />
        </div>

        <div style={filterGridStyle}>
          <div>
            <label style={labelStyle}>Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, slug, author, excerpt, content, or SEO fields"
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
              <option value="scheduled">scheduled</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={cardStyle}>Loading...</div>
      ) : errorMessage ? (
        <div style={errorBoxStyle}>
          <strong>Error:</strong>
          <div style={{ marginTop: 8 }}>{errorMessage}</div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={emptyStateStyle}>
          No blog posts matched your current search or filters.
        </div>
      ) : (
        <div style={tableCardStyle}>
          <div style={tableScrollStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Post</th>
                  <th style={thStyle}>Author</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Publish Date</th>
                  <th style={thStyle}>Schedule</th>
                  <th style={thStyle}>SEO</th>
                  <th style={thStyle}>Featured</th>
                  <th style={thStyle}>Updated</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id || item.slug || index}>
                    <td style={tdStyle}>
                      <div style={postTitleStyle}>{item.title || "-"}</div>

                      <div style={slugStyle}>{item.slug || "-"}</div>

                      <div style={excerptStyle}>
                        {item.excerpt || "No excerpt added yet."}
                      </div>
                    </td>

                    <td style={tdStyle}>{item.author || "-"}</td>

                    <td style={tdStyle}>
                      <StatusBadge value={item.status || "-"} />
                    </td>

                    <td style={tdStyle}>{formatDateTime(item.published_at)}</td>

                    <td style={tdStyle}>
                      <ScheduleBadge value={getScheduleState(item)} />
                    </td>

                    <td style={tdStyle}>
                      <div style={seoBoxStyle}>
                        <div>
                          <strong>Title:</strong>{" "}
                          {item.seo_title ? "Yes" : "Missing"}
                        </div>
                        <div>
                          <strong>Description:</strong>{" "}
                          {item.seo_description ? "Yes" : "Missing"}
                        </div>
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {normalizeLower(item.featured) === "true" ? "Yes" : "No"}
                    </td>

                    <td style={tdStyle}>{formatDateTime(item.updated_at)}</td>

                    <td style={tdStyle}>
                      <div style={actionRowStyle}>
                        {item.slug ? (
                          <Link
                            href={`/admin/blog/${item.slug}`}
                            style={secondarySmallButtonStyle}
                          >
                            Edit
                          </Link>
                        ) : null}

                        {item.slug ? (
                          <Link
                            href={`/blog/${item.slug}`}
                            style={secondarySmallButtonStyle}
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
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={statBoxStyle}>
      <div style={statLabelStyle}>{label}</div>
      <div style={statValueStyle}>{value}</div>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  const style: React.CSSProperties =
    normalized === "published"
      ? {
          ...badgeStyle,
          background: "#edf8f1",
          color: "#1d6a43",
          border: "1px solid #cfe7d8",
        }
      : normalized === "scheduled"
        ? {
            ...badgeStyle,
            background: "#eef4ff",
            color: "#24579b",
            border: "1px solid #cdddf6",
          }
        : normalized === "draft"
          ? {
              ...badgeStyle,
              background: "#fff7e8",
              color: "#8a6418",
              border: "1px solid #ecd8ad",
            }
          : normalized === "archived"
            ? {
                ...badgeStyle,
                background: "#f3f3f3",
                color: "#5e5e5e",
                border: "1px solid #dddddd",
              }
            : {
                ...badgeStyle,
                background: "#f3f3f3",
                color: "#5e5e5e",
                border: "1px solid #dddddd",
              };

  return <span style={style}>{value}</span>;
}

function ScheduleBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  const style: React.CSSProperties =
    normalized === "scheduled"
      ? {
          ...smallBadgeStyle,
          background: "#eef4ff",
          color: "#24579b",
          border: "1px solid #cdddf6",
        }
      : normalized === "ready to publish"
        ? {
            ...smallBadgeStyle,
            background: "#fff7e8",
            color: "#8a6418",
            border: "1px solid #ecd8ad",
          }
        : normalized === "missing date" || normalized === "invalid date"
          ? {
              ...smallBadgeStyle,
              background: "#fff1f1",
              color: "#8d2f2f",
              border: "1px solid #f0c9c9",
            }
          : {
              ...smallBadgeStyle,
              background: "#f3f3f3",
              color: "#5e5e5e",
              border: "1px solid #dddddd",
            };

  return <span style={style}>{value}</span>;
}

const pageHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 20,
  flexWrap: "wrap",
};

const titleStyle: React.CSSProperties = {
  fontSize: 42,
  lineHeight: 1.1,
  margin: 0,
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  color: "#6f6559",
  fontSize: 16,
  maxWidth: 760,
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 24,
};

const filterCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 10px 30px rgba(23,23,23,0.04)",
};

const statsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 14,
  flexWrap: "wrap",
  marginBottom: 20,
};

const statBoxStyle: React.CSSProperties = {
  minWidth: 160,
  background: "#f8f5ef",
  border: "1px solid #e3dbcf",
  borderRadius: 18,
  padding: 16,
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#7c7267",
  marginBottom: 8,
  fontWeight: 700,
};

const statValueStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
};

const filterGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 800,
  fontSize: 15,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #d9cfbf",
  background: "#fcfbf8",
  outline: "none",
  fontSize: 15,
};

const tableCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(23,23,23,0.04)",
};

const tableScrollStyle: React.CSSProperties = {
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 1120,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "18px 18px",
  fontSize: 13,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#7d7266",
  background: "#f8f5ef",
  borderBottom: "1px solid #e5dccf",
};

const tdStyle: React.CSSProperties = {
  padding: "18px 18px",
  borderBottom: "1px solid #efe8dc",
  verticalAlign: "top",
  fontSize: 15,
};

const postTitleStyle: React.CSSProperties = {
  fontWeight: 900,
  marginBottom: 6,
};

const slugStyle: React.CSSProperties = {
  color: "#7d7266",
  fontSize: 13,
  marginBottom: 8,
};

const excerptStyle: React.CSSProperties = {
  color: "#6f6559",
  fontSize: 13,
  lineHeight: 1.6,
  maxWidth: 340,
};

const seoBoxStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: "#6f6559",
  fontSize: 13,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 32,
  padding: "0 12px",
  borderRadius: 999,
  fontWeight: 800,
  fontSize: 13,
  whiteSpace: "nowrap",
};

const smallBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 30,
  padding: "0 10px",
  borderRadius: 999,
  fontWeight: 800,
  fontSize: 12,
  whiteSpace: "nowrap",
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  textDecoration: "none",
};

const secondaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid #d9cfbf",
  background: "#fff",
  color: "#171717",
  fontWeight: 800,
  cursor: "pointer",
  textDecoration: "none",
};

const secondarySmallButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #d9cfbf",
  background: "#fff",
  color: "#171717",
  fontWeight: 700,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 14,
};

const emptyStateStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 28,
  color: "#6f6559",
  fontWeight: 700,
};

const errorBoxStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 16,
  background: "#fff1f1",
  border: "1px solid #f0c9c9",
  color: "#8d2f2f",
};