"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

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

  if (!raw) return "-";

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) return raw;

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

  if (status !== "scheduled") return "-";
  if (!publishedAt) return "Missing date";

  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) return "Invalid date";
  if (date.getTime() <= Date.now()) return "Ready to publish";

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

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  function handleExportChange(event: ChangeEvent<HTMLSelectElement>) {
    const format = event.currentTarget.value;

    if (!format) return;

    window.location.href = `/api/blog/export?format=${format}`;
    event.currentTarget.value = "";
  }

  return (
    <div style={pageWrapStyle}>
      <div style={pageHeaderStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={titleStyle}>Blog</h1>
          <p style={subtitleStyle}>
            Manage blog posts, authors, SEO fields, and scheduled publishing.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href="/admin/blog/new" style={primaryButtonStyle}>
            + New Post
          </Link>

          <select
            aria-label="Export blog posts"
            defaultValue=""
            onChange={handleExportChange}
            style={exportSelectStyle}
          >
            <option value="" disabled>
              Export
            </option>
            <option value="csv">Export CSV</option>
            <option value="json">Export JSON</option>
            <option value="xml">Export XML</option>
          </select>
        </div>
      </div>

      <div style={filterCardStyle}>
        <div style={statsRowStyle}>
          <StatButton
            label="Total"
            value={String(items.length)}
            active={statusFilter === "all" && !search.trim()}
            onClick={clearFilters}
          />

          <StatButton
            label="Filtered"
            value={String(filteredItems.length)}
            active={false}
            onClick={clearFilters}
          />

          <StatButton
            label="Published"
            value={String(stats.published)}
            active={statusFilter === "published"}
            onClick={() => setStatusFilter("published")}
          />

          <StatButton
            label="Scheduled"
            value={String(stats.scheduled)}
            active={statusFilter === "scheduled"}
            onClick={() => setStatusFilter("scheduled")}
          />

          <StatButton
            label="Draft"
            value={String(stats.draft)}
            active={statusFilter === "draft"}
            onClick={() => setStatusFilter("draft")}
          />

          <StatButton
            label="Archived"
            value={String(stats.archived)}
            active={statusFilter === "archived"}
            onClick={() => setStatusFilter("archived")}
          />
        </div>

        <div style={filterGridStyle}>
          <input
            aria-label="Search blog posts"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search blog posts..."
            style={inputStyle}
          />

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
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
        <>
          <div className="admin-blog-mobile-list" style={mobileListStyle}>
            {filteredItems.map((item, index) => (
              <BlogMobileRow key={item.id || item.slug || `mobile-${index}`} item={item} />
            ))}
          </div>

          <div className="admin-blog-table-card" style={tableCardStyle}>
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
                    <BlogRow key={item.id || item.slug || index} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function BlogRow({ item }: { item: BlogItem }) {
  return (
    <tr>
      <td style={tdStyle}>
        <div style={postTitleStyle}>{item.title || "-"}</div>
        <div style={slugStyle}>{item.slug || "-"}</div>
        <div style={excerptStyle}>{item.excerpt || "No excerpt added yet."}</div>
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
            <strong>Title:</strong> {item.seo_title ? "Yes" : "Missing"}
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
            <Link href={`/admin/blog/${item.slug}`} style={secondarySmallButtonStyle}>
              Edit
            </Link>
          ) : null}

          {item.slug ? (
            <Link href={`/blog/${item.slug}`} style={secondarySmallButtonStyle}>
              View
            </Link>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

function BlogMobileRow({ item }: { item: BlogItem }) {
  const scheduleState = getScheduleState(item);
  const hasSeoTitle = Boolean(normalizeText(item.seo_title));
  const hasSeoDescription = Boolean(normalizeText(item.seo_description));
  const isFeatured = normalizeLower(item.featured) === "true";

  return (
    <article style={mobileRowStyle}>
      <div style={mobileTitleRowStyle}>
        <Link href={`/admin/blog/${item.slug || ""}`} style={mobileTitleLinkStyle}>
          <h3 style={mobileTitleStyle}>{item.title || "-"}</h3>
        </Link>

        <StatusBadge value={item.status || "-"} />
      </div>

      <div style={mobileSubTextStyle}>
        {item.slug || "No slug"} · {item.author || "No author"}
      </div>

      <p style={mobileExcerptStyle}>
        {item.excerpt || "No excerpt added yet."}
      </p>

      <div style={mobileMetaRowStyle}>
        <ScheduleBadge value={scheduleState} />

        {isFeatured ? (
          <span style={mobileFeaturedBadgeStyle}>Featured</span>
        ) : null}

        <span
          style={
            hasSeoTitle && hasSeoDescription
              ? mobileOkBadgeStyle
              : mobileWarningBadgeStyle
          }
        >
          {hasSeoTitle && hasSeoDescription ? "SEO OK" : "SEO Missing"}
        </span>
      </div>

      <div style={mobileDateStyle}>
        Publish: {formatDateTime(item.published_at)} · Updated:{" "}
        {formatDateTime(item.updated_at)}
      </div>

      <div style={mobileActionsStyle}>
        {item.slug ? (
          <Link href={`/admin/blog/${item.slug}`} style={mobileActionButtonStyle}>
            Edit Post
          </Link>
        ) : null}

        {item.slug ? (
          <Link href={`/blog/${item.slug}`} style={mobilePrimaryActionButtonStyle}>
            View
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function StatButton({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...statButtonStyle,
        ...(active ? activeStatButtonStyle : {}),
      }}
      title={`${label}: ${value}`}
    >
      <span style={statLabelStyle}>{label}</span>
      <strong
        style={{
          ...statValueStyle,
          ...(active ? activeStatValueStyle : {}),
        }}
      >
        {value}
      </strong>
    </button>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  const style: CSSProperties =
    normalized === "published"
      ? publishedBadgeStyle
      : normalized === "scheduled"
        ? scheduledBadgeStyle
        : normalized === "draft"
          ? draftBadgeStyle
          : neutralBadgeStyle;

  return <span style={style}>{value}</span>;
}

function ScheduleBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  const style: CSSProperties =
    normalized === "scheduled"
      ? scheduledSmallBadgeStyle
      : normalized === "ready to publish"
        ? draftSmallBadgeStyle
        : normalized === "missing date" || normalized === "invalid date"
          ? dangerSmallBadgeStyle
          : neutralSmallBadgeStyle;

  return <span style={style}>{value}</span>;
}

const pageWrapStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
};

const pageHeaderStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
};

const titleStyle: CSSProperties = {
  fontSize: 22,
  lineHeight: 1.05,
  margin: 0,
  fontWeight: 850,
};

const subtitleStyle: CSSProperties = {
  marginTop: 4,
  marginBottom: 0,
  color: "#6f6559",
  fontSize: 10,
  lineHeight: 1.35,
  maxWidth: "100%",
};

const headerActionsStyle: CSSProperties = {
  display: "flex",
  gap: 4,
  flexWrap: "nowrap",
  overflowX: "auto",
  paddingBottom: 2,
  width: "100%",
};

const cardStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #ddd3c5",
  borderRadius: 10,
  padding: 8,
};

const filterCardStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #ddd3c5",
  borderRadius: 10,
  padding: 6,
  boxShadow: "0 2px 8px rgba(23,23,23,0.02)",
  overflow: "hidden",
};

const statsRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  flexWrap: "nowrap",
  overflowX: "auto",
  overflowY: "hidden",
  paddingBottom: 4,
  marginBottom: 5,
  scrollbarWidth: "thin",
  width: "100%",
};

const statButtonStyle: CSSProperties = {
  minHeight: 22,
  flex: "0 0 auto",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 4,
  textAlign: "left",
  border: "1px solid #e4dacd",
  borderRadius: 999,
  padding: "3px 6px",
  background: "#fbfaf7",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const activeStatButtonStyle: CSSProperties = {
  background: "#edf8f1",
  border: "1px solid #2f7d62",
};

const statLabelStyle: CSSProperties = {
  fontSize: 7,
  color: "#7c7267",
  fontWeight: 850,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const statValueStyle: CSSProperties = {
  fontSize: 9,
  lineHeight: 1,
  fontWeight: 900,
  color: "#111827",
};

const activeStatValueStyle: CSSProperties = {
  color: "#2f7d62",
};

const filterGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 92px",
  gap: 4,
  alignItems: "center",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 26,
  padding: "4px 6px",
  borderRadius: 7,
  border: "1px solid #d9cfbf",
  background: "#fcfbf8",
  outline: "none",
  fontSize: 8,
};

const mobileListStyle: CSSProperties = {
  display: "none",
  gap: 0,
  width: "100%",
  maxWidth: "100%",
  background: "#ffffff",
  border: "1px solid #ddd3c5",
  borderRadius: 10,
  overflow: "hidden",
};

const mobileRowStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  padding: "8px 8px 7px",
  borderBottom: "1px solid #eee7dc",
  background: "#ffffff",
  overflow: "hidden",
};

const mobileTitleRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gap: 5,
  alignItems: "start",
  minWidth: 0,
};

const mobileTitleLinkStyle: CSSProperties = {
  minWidth: 0,
  color: "inherit",
  textDecoration: "none",
};

const mobileTitleStyle: CSSProperties = {
  margin: 0,
  minWidth: 0,
  fontSize: 10,
  lineHeight: 1.22,
  fontWeight: 900,
  color: "#111827",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  wordBreak: "break-word",
};

const mobileSubTextStyle: CSSProperties = {
  marginTop: 2,
  minWidth: 0,
  fontSize: 8,
  lineHeight: 1.3,
  color: "#6f6559",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const mobileExcerptStyle: CSSProperties = {
  margin: "3px 0 0",
  minWidth: 0,
  fontSize: 8,
  lineHeight: 1.35,
  color: "#6f6559",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
};

const mobileMetaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "nowrap",
  gap: 3,
  marginTop: 5,
  minWidth: 0,
  overflow: "hidden",
};

const mobileFeaturedBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 14,
  padding: "0 5px",
  borderRadius: 999,
  background: "#eef8f0",
  color: "#1d6a43",
  border: "1px solid #cfe7d8",
  fontSize: 7,
  fontWeight: 850,
  whiteSpace: "nowrap",
};

const mobileOkBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 14,
  padding: "0 5px",
  borderRadius: 999,
  background: "#edf8f1",
  color: "#1d6a43",
  border: "1px solid #cfe7d8",
  fontSize: 7,
  fontWeight: 850,
  whiteSpace: "nowrap",
};

const mobileWarningBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 14,
  padding: "0 5px",
  borderRadius: 999,
  background: "#fff7e8",
  color: "#8a6418",
  border: "1px solid #ecd8ad",
  fontSize: 7,
  fontWeight: 850,
  whiteSpace: "nowrap",
};

const mobileDateStyle: CSSProperties = {
  marginTop: 5,
  fontSize: 7,
  lineHeight: 1.35,
  color: "#7c7267",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const mobileActionsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 6,
  marginTop: 7,
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
};

const mobileActionButtonStyle: CSSProperties = {
  minWidth: 0,
  width: "100%",
  minHeight: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 6px",
  borderRadius: 7,
  border: "1px solid #d9cfbf",
  background: "#ffffff",
  color: "#111827",
  textDecoration: "none",
  fontSize: 9,
  lineHeight: 1,
  fontWeight: 850,
  cursor: "pointer",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const mobilePrimaryActionButtonStyle: CSSProperties = {
  ...mobileActionButtonStyle,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#ffffff",
};

const tableCardStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #ddd3c5",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(23,23,23,0.02)",
};

const tableScrollStyle: CSSProperties = {
  overflowX: "auto",
};

const tableStyle: CSSProperties = {
  width: "100%",
  minWidth: 1120,
  borderCollapse: "collapse",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontSize: 10,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#7d7266",
  background: "#f8f5ef",
  borderBottom: "1px solid #e5dccf",
};

const tdStyle: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #efe8dc",
  verticalAlign: "top",
  fontSize: 12,
};

const postTitleStyle: CSSProperties = {
  fontWeight: 900,
  marginBottom: 5,
  fontSize: 12,
};

const slugStyle: CSSProperties = {
  color: "#7d7266",
  fontSize: 10,
  marginBottom: 5,
};

const excerptStyle: CSSProperties = {
  color: "#6f6559",
  fontSize: 10,
  lineHeight: 1.45,
  maxWidth: 340,
};

const seoBoxStyle: CSSProperties = {
  display: "grid",
  gap: 4,
  color: "#6f6559",
  fontSize: 10,
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
};

const primaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 24,
  flex: "0 0 auto",
  padding: "0 7px",
  borderRadius: 7,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#ffffff",
  fontWeight: 850,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 8,
  whiteSpace: "nowrap",
};

const exportSelectStyle: CSSProperties = {
  minHeight: 24,
  flex: "0 0 auto",
  padding: "0 7px",
  borderRadius: 7,
  border: "1px solid #d9cfbf",
  background: "#ffffff",
  color: "#171717",
  fontWeight: 850,
  cursor: "pointer",
  fontSize: 8,
  whiteSpace: "nowrap",
  outline: "none",
};

const secondarySmallButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 26,
  padding: "0 8px",
  borderRadius: 8,
  border: "1px solid #d9cfbf",
  background: "#ffffff",
  color: "#171717",
  fontWeight: 750,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 10,
};

const badgeBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 16,
  padding: "0 5px",
  borderRadius: 999,
  fontWeight: 850,
  fontSize: 7,
  whiteSpace: "nowrap",
};

const smallBadgeBaseStyle: CSSProperties = {
  ...badgeBaseStyle,
  minHeight: 15,
  fontSize: 7,
};

const publishedBadgeStyle: CSSProperties = {
  ...badgeBaseStyle,
  background: "#edf8f1",
  color: "#1d6a43",
  border: "1px solid #cfe7d8",
};

const scheduledBadgeStyle: CSSProperties = {
  ...badgeBaseStyle,
  background: "#eef4ff",
  color: "#24579b",
  border: "1px solid #cdddf6",
};

const draftBadgeStyle: CSSProperties = {
  ...badgeBaseStyle,
  background: "#fff7e8",
  color: "#8a6418",
  border: "1px solid #ecd8ad",
};

const neutralBadgeStyle: CSSProperties = {
  ...badgeBaseStyle,
  background: "#f3f3f3",
  color: "#5e5e5e",
  border: "1px solid #dddddd",
};

const scheduledSmallBadgeStyle: CSSProperties = {
  ...smallBadgeBaseStyle,
  background: "#eef4ff",
  color: "#24579b",
  border: "1px solid #cdddf6",
};

const draftSmallBadgeStyle: CSSProperties = {
  ...smallBadgeBaseStyle,
  background: "#fff7e8",
  color: "#8a6418",
  border: "1px solid #ecd8ad",
};

const dangerSmallBadgeStyle: CSSProperties = {
  ...smallBadgeBaseStyle,
  background: "#fff1f1",
  color: "#8d2f2f",
  border: "1px solid #f0c9c9",
};

const neutralSmallBadgeStyle: CSSProperties = {
  ...smallBadgeBaseStyle,
  background: "#f3f3f3",
  color: "#5e5e5e",
  border: "1px solid #dddddd",
};

const emptyStateStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #ddd3c5",
  borderRadius: 12,
  padding: 12,
  color: "#6f6559",
  fontWeight: 750,
  fontSize: 11,
};

const errorBoxStyle: CSSProperties = {
  padding: 12,
  borderRadius: 12,
  background: "#fff1f1",
  border: "1px solid #f0c9c9",
  color: "#8d2f2f",
};