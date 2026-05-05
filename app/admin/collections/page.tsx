"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

type CollectionItem = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  seo_title?: string;
  seo_description?: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80";

function getSafeImageSrc(value?: string) {
  const src = String(value || "").trim();
  return src || FALLBACK_IMAGE;
}

function normalizeLower(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadCollections() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/collections/list", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data?.error || "Failed to load collections.");
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

    loadCollections();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const title = normalizeLower(item.title);
      const slug = normalizeLower(item.slug);
      const description = normalizeLower(item.description);
      const status = normalizeLower(item.status);

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        description.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const publishedCount = useMemo(
    () => items.filter((item) => normalizeLower(item.status) === "published").length,
    [items]
  );

  const draftCount = useMemo(
    () => items.filter((item) => normalizeLower(item.status) === "draft").length,
    [items]
  );

  const archivedCount = useMemo(
    () => items.filter((item) => normalizeLower(item.status) === "archived").length,
    [items]
  );

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  function handleExportChange(event: ChangeEvent<HTMLSelectElement>) {
    const format = event.currentTarget.value;

    if (!format) return;

    window.location.href = `/api/collections/export?format=${format}`;
    event.currentTarget.value = "";
  }

  return (
    <div style={pageWrapStyle}>
      <div style={pageHeaderStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={titleStyle}>Collections</h1>
          <p style={subtitleStyle}>
            Review and manage collection records used across the Patak content
            structure.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href="/admin/collections/new" style={primaryButtonStyle}>
            + New Collection
          </Link>

          <select
            aria-label="Export collections"
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
            value={String(publishedCount)}
            active={statusFilter === "published"}
            onClick={() => setStatusFilter("published")}
          />

          <StatButton
            label="Draft"
            value={String(draftCount)}
            active={statusFilter === "draft"}
            onClick={() => setStatusFilter("draft")}
          />

          <StatButton
            label="Archived"
            value={String(archivedCount)}
            active={statusFilter === "archived"}
            onClick={() => setStatusFilter("archived")}
          />
        </div>

        <div style={filterGridStyle}>
          <input
            aria-label="Search collections"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search collections..."
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
          No collections matched your current search or filters.
        </div>
      ) : (
        <>
          <div className="admin-collections-mobile-list" style={mobileListStyle}>
            {filteredItems.map((item, index) => (
              <CollectionMobileRow
                key={item.id || item.slug || `mobile-${index}`}
                item={item}
              />
            ))}
          </div>

          <div className="admin-collections-table-card" style={tableCardStyle}>
            <div style={tableScrollStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Collection</th>
                    <th style={thStyle}>Slug</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Updated</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => (
                    <CollectionRow
                      key={item.id || item.slug || index}
                      item={item}
                    />
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

function CollectionRow({ item }: { item: CollectionItem }) {
  return (
    <tr>
      <td style={tdStyle}>
        <div style={collectionCellStyle}>
          <div style={thumbWrapStyle}>
            <img
              src={getSafeImageSrc(item.image)}
              alt={item.title || "Collection"}
              style={thumbStyle}
              loading="lazy"
            />
          </div>

          <div style={collectionInfoStyle}>
            <div style={collectionTitleStyle}>{item.title || "-"}</div>
            <div style={descriptionStyle}>
              {item.description || "No description added yet."}
            </div>
          </div>
        </div>
      </td>

      <td style={tdStyle}>{item.slug || "-"}</td>

      <td style={tdStyle}>
        <StatusBadge value={item.status || "-"} />
      </td>

      <td style={tdStyle}>{item.updated_at || "-"}</td>

      <td style={tdStyle}>
        <div style={actionRowStyle}>
          {item.slug ? (
            <Link
              href={`/admin/collections/${item.slug}`}
              style={secondarySmallButtonStyle}
            >
              Edit
            </Link>
          ) : null}

          {item.slug ? (
            <Link
              href={`/admin/collections/${item.slug}/products`}
              style={primarySmallButtonStyle}
            >
              Products
            </Link>
          ) : null}

          {item.slug ? (
            <Link
              href={`/collections/${item.slug}`}
              style={secondarySmallButtonStyle}
            >
              View
            </Link>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

function CollectionMobileRow({ item }: { item: CollectionItem }) {
  return (
    <article style={mobileRowStyle}>
      <div style={mobileMainRowStyle}>
        <Link
          href={`/admin/collections/${item.slug || ""}`}
          style={mobileThumbLinkStyle}
        >
          <div style={mobileThumbStyle}>
            <img
              src={getSafeImageSrc(item.image)}
              alt={item.title || "Collection"}
              style={mobileImageStyle}
              loading="lazy"
            />
          </div>
        </Link>

        <div style={mobileContentStyle}>
          <div style={mobileTitleRowStyle}>
            <Link
              href={`/admin/collections/${item.slug || ""}`}
              style={mobileTitleLinkStyle}
            >
              <h3 style={mobileTitleStyle}>{item.title || "-"}</h3>
            </Link>

            <StatusBadge value={item.status || "-"} />
          </div>

          <div style={mobileSubTextStyle}>
            {item.slug || "No slug"} · {item.updated_at || "No update date"}
          </div>

          <p style={mobileDescriptionStyle}>
            {item.description || "No description added yet."}
          </p>
        </div>
      </div>

      <div style={mobileActionsStyle}>
        {item.slug ? (
          <Link
            href={`/admin/collections/${item.slug}`}
            style={mobileActionButtonStyle}
          >
            Edit Collection
          </Link>
        ) : null}

        {item.slug ? (
          <Link
            href={`/admin/collections/${item.slug}/products`}
            style={mobilePrimaryActionButtonStyle}
          >
            Products
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
      : normalized === "draft"
        ? draftBadgeStyle
        : neutralBadgeStyle;

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

const mobileMainRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "42px minmax(0, 1fr)",
  gap: 8,
  alignItems: "start",
  width: "100%",
  maxWidth: "100%",
};

const mobileThumbLinkStyle: CSSProperties = {
  display: "block",
  width: 42,
  height: 42,
  textDecoration: "none",
};

const mobileThumbStyle: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 7,
  overflow: "hidden",
  background: "#f6f3ee",
  border: "1px solid #e4dacd",
};

const mobileImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const mobileContentStyle: CSSProperties = {
  minWidth: 0,
  maxWidth: "100%",
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

const mobileDescriptionStyle: CSSProperties = {
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

const mobileActionsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 6,
  marginTop: 7,
  marginLeft: 50,
  width: "calc(100% - 50px)",
  maxWidth: "calc(100% - 50px)",
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

const collectionCellStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "52px 1fr",
  gap: 10,
  alignItems: "start",
};

const thumbWrapStyle: CSSProperties = {
  width: 52,
};

const thumbStyle: CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: 10,
  border: "1px solid #e5dccf",
  background: "#f5f5f5",
  display: "block",
};

const collectionInfoStyle: CSSProperties = {
  display: "grid",
  gap: 5,
};

const collectionTitleStyle: CSSProperties = {
  fontWeight: 850,
  fontSize: 12,
};

const descriptionStyle: CSSProperties = {
  color: "#6f6559",
  fontSize: 10,
  lineHeight: 1.45,
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

const publishedBadgeStyle: CSSProperties = {
  ...badgeBaseStyle,
  background: "#edf8f1",
  color: "#1d6a43",
  border: "1px solid #cfe7d8",
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

const primarySmallButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 26,
  padding: "0 8px",
  borderRadius: 8,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#ffffff",
  fontWeight: 750,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 10,
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