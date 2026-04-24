"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeImageUrl } from "../../../lib/image-url";

type ProductItem = {
  id?: string;
  title?: string;
  slug?: string;
  image?: string;
  main_image?: string;
  collection_slug?: string;
  status?: string;
  featured?: string;
  short_description?: string;
  updated_at?: string;
  image_count?: number;
  alt_count?: number;
  main_image_exists?: boolean;
  gallery_score?: number;
  gallery_issues?: string[];
};

const PAGE_SIZE = 50;

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function isTrue(value: unknown) {
  return normalizeLower(value) === "true";
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteLoadingSlug, setDeleteLoadingSlug] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  async function loadOverview(signal?: AbortSignal) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    if (search.trim()) {
      params.set("q", search.trim());
    }

    const response = await fetch(
      `/api/admin/products-overview?${params.toString()}`,
      {
        cache: "no-store",
        signal,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data?.error || "Failed to load products.");
    }

    return data;
  }

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await loadOverview(controller.signal);

        setItems(Array.isArray(data.products) ? data.products : []);
        setTotal(Number(data.total || 0));
        setTotalPages(Number(data.totalPages || 1));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    }

    run();

    return () => {
      controller.abort();
    };
  }, [page, search, statusFilter]);

  async function reloadCurrentPage() {
    try {
      setLoading(true);
      const data = await loadOverview();
      setItems(Array.isArray(data.products) ? data.products : []);
      setTotal(Number(data.total || 0));
      setTotalPages(Number(data.totalPages || 1));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug?: string) {
    if (!slug) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingSlug(slug);

      const response = await fetch("/api/products/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to delete product.");
      }

      await reloadCurrentPage();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setDeleteLoadingSlug("");
    }
  }

  const publishedCount = useMemo(
    () =>
      items.filter((item) => normalizeLower(item.status) === "published")
        .length,
    [items]
  );

  const draftCount = useMemo(
    () => items.filter((item) => normalizeLower(item.status) === "draft").length,
    [items]
  );

  const galleryAudit = useMemo(() => {
    let missingGallery = 0;
    let missingMainImage = 0;
    let missingAltText = 0;
    let lowImageCount = 0;

    for (const item of items) {
      const imageCount = Number(item.image_count || 0);
      const altCount = Number(item.alt_count || 0);

      if (imageCount === 0) missingGallery += 1;
      if (imageCount > 0 && !item.main_image_exists) missingMainImage += 1;
      if (imageCount > 0 && altCount < imageCount) missingAltText += 1;
      if (imageCount > 0 && imageCount < 3) lowImageCount += 1;
    }

    return {
      missingGallery,
      missingMainImage,
      missingAltText,
      lowImageCount,
    };
  }, [items]);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={titleStyle}>Products</h1>
          <p style={subtitleStyle}>
            Lightweight product overview using one optimized backend request.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href="/admin/products/new" style={primaryButtonStyle}>
            + New Product
          </Link>
          <a href="/api/products/export?format=csv" style={secondaryButtonStyle}>
            Export CSV
          </a>
          <a href="/api/products/export?format=json" style={secondaryButtonStyle}>
            Export JSON
          </a>
          <a href="/api/products/export?format=xml" style={secondaryButtonStyle}>
            Export XML
          </a>
        </div>
      </div>

      <div style={filterCardStyle}>
        <div style={statsRowStyle}>
          <StatBox label="Total Results" value={String(total)} />
          <StatBox label="On This Page" value={String(items.length)} />
          <StatBox label="Published" value={String(publishedCount)} />
          <StatBox label="Draft" value={String(draftCount)} />
          <WarningStatBox label="No Gallery" value={String(galleryAudit.missingGallery)} />
          <WarningStatBox label="No Main Image" value={String(galleryAudit.missingMainImage)} />
          <WarningStatBox label="Missing Alt Text" value={String(galleryAudit.missingAltText)} />
          <WarningStatBox label="Low Image Count" value={String(galleryAudit.lowImageCount)} />
        </div>

        <div style={filterGridStyle}>
          <div>
            <label style={labelStyle}>Search</label>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by title, slug, collection, short description"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
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
      </div>

      {loading ? (
        <div style={cardStyle}>Loading...</div>
      ) : errorMessage ? (
        <div style={errorBoxStyle}>
          <strong>Error:</strong>
          <div style={{ marginTop: 8 }}>{errorMessage}</div>
        </div>
      ) : items.length === 0 ? (
        <div style={emptyStateStyle}>
          No products matched your current search or filters.
        </div>
      ) : (
        <div style={tableCardStyle}>
          <div style={tableScrollStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Slug</th>
                  <th style={thStyle}>Collection</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Gallery</th>
                  <th style={thStyle}>Warnings</th>
                  <th style={thStyle}>Updated</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => {
                  const primaryImage = normalizeImageUrl(
                    item.main_image || item.image || ""
                  );

                  const featured = isTrue(item.featured);
                  const issues = Array.isArray(item.gallery_issues)
                    ? item.gallery_issues
                    : [];

                  return (
                    <tr key={item.id || item.slug || index}>
                      <td style={tdStyle}>
                        <div style={productCellStyle}>
                          <div style={thumbWrapStyle}>
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={item.title || "Product"}
                                style={thumbStyle}
                              />
                            ) : (
                              <div style={thumbEmptyStyle}>No Image</div>
                            )}
                          </div>

                          <div style={{ display: "grid", gap: 6 }}>
                            <div style={productTitleRowStyle}>
                              <div style={{ fontWeight: 800 }}>
                                {item.title || "-"}
                              </div>

                              {featured ? (
                                <span style={featuredBadgeStyle}>Featured</span>
                              ) : null}
                            </div>

                            <div style={descriptionStyle}>
                              {item.short_description ||
                                "No short description added yet."}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={tdStyle}>{item.slug || "-"}</td>
                      <td style={tdStyle}>{item.collection_slug || "-"}</td>

                      <td style={tdStyle}>
                        <StatusBadge value={item.status || "-"} />
                      </td>

                      <td style={tdStyle}>
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={galleryScoreValueStyle}>
                            {Number(item.gallery_score || 0)}%
                          </div>

                          <div style={galleryMetaStyle}>
                            <div>
                              <strong>Images:</strong>{" "}
                              {Number(item.image_count || 0)}
                            </div>
                            <div>
                              <strong>Main:</strong>{" "}
                              {item.main_image_exists ? "Yes" : "No"}
                            </div>
                            <div>
                              <strong>Alt:</strong>{" "}
                              {Number(item.alt_count || 0)}/
                              {Number(item.image_count || 0)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={tdStyle}>
                        {issues.length === 0 ? (
                          <span style={okBadgeStyle}>Gallery looks good</span>
                        ) : (
                          <div style={warningListStyle}>
                            {issues.map((issue) => (
                              <span key={issue} style={warningBadgeStyle}>
                                {issue}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td style={tdStyle}>{item.updated_at || "-"}</td>

                      <td style={tdStyle}>
                        <div style={actionColumnStyle}>
                          {item.slug ? (
                            <Link
                              href={`/admin/products/${item.slug}`}
                              style={secondarySmallButtonStyle}
                            >
                              Edit
                            </Link>
                          ) : null}

                          {item.slug ? (
                            <Link
                              href={`/admin/products/${item.slug}/images`}
                              style={primarySmallButtonStyle}
                            >
                              Images
                            </Link>
                          ) : null}

                          {item.slug ? (
                            <Link
                              href={`/products/${item.slug}`}
                              style={secondarySmallButtonStyle}
                            >
                              View
                            </Link>
                          ) : null}

                          {item.slug ? (
                            <button
                              type="button"
                              onClick={() => handleDelete(item.slug)}
                              style={dangerSmallButtonStyle}
                              disabled={deleteLoadingSlug === item.slug}
                            >
                              {deleteLoadingSlug === item.slug
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={paginationWrapStyle}>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1 || loading}
              style={secondarySmallButtonStyle}
            >
              Previous
            </button>

            <div style={paginationInfoStyle}>
              Page {page} / {totalPages}
            </div>

            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages || loading}
              style={secondarySmallButtonStyle}
            >
              Next
            </button>
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

function WarningStatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={warningStatBoxStyle}>
      <div style={statLabelStyle}>{label}</div>
      <div style={warningStatValueStyle}>{value}</div>
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
      : normalized === "draft"
        ? {
            ...badgeStyle,
            background: "#fff7e8",
            color: "#8a6418",
            border: "1px solid #ecd8ad",
          }
        : {
            ...badgeStyle,
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

const warningStatBoxStyle: React.CSSProperties = {
  minWidth: 160,
  background: "#fff7e8",
  border: "1px solid #ecd8ad",
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

const warningStatValueStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: "#8a6418",
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
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "18px",
  fontSize: 13,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#7d7266",
  background: "#f8f5ef",
  borderBottom: "1px solid #e5dccf",
};

const tdStyle: React.CSSProperties = {
  padding: "18px",
  borderBottom: "1px solid #efe8dc",
  verticalAlign: "top",
  fontSize: 15,
};

const productCellStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "82px 1fr",
  gap: 14,
  alignItems: "start",
};

const thumbWrapStyle: React.CSSProperties = {
  width: 82,
};

const thumbStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid #e5dccf",
  background: "#f5f5f5",
  display: "block",
};

const thumbEmptyStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: 14,
  border: "1px dashed #d8cdbd",
  background: "#faf8f4",
  color: "#8c8174",
  fontWeight: 700,
  fontSize: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: 8,
};

const productTitleRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

const descriptionStyle: React.CSSProperties = {
  color: "#6f6559",
  fontSize: 13,
  lineHeight: 1.6,
};

const featuredBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 28,
  padding: "0 10px",
  borderRadius: 999,
  background: "#eef8f0",
  color: "#1d6a43",
  border: "1px solid #cfe7d8",
  fontWeight: 800,
  fontSize: 12,
};

const galleryScoreValueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#171717",
};

const galleryMetaStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 13,
  color: "#5f564c",
  lineHeight: 1.5,
};

const okBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 32,
  padding: "0 12px",
  borderRadius: 999,
  background: "#edf8f1",
  color: "#1d6a43",
  border: "1px solid #cfe7d8",
  fontWeight: 800,
  fontSize: 12,
};

const warningListStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const warningBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 30,
  padding: "0 10px",
  borderRadius: 999,
  background: "#fff7e8",
  color: "#8a6418",
  border: "1px solid #ecd8ad",
  fontWeight: 800,
  fontSize: 12,
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
};

const actionColumnStyle: React.CSSProperties = {
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

const primarySmallButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 14,
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

const dangerSmallButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #e5c9c9",
  background: "#fff5f5",
  color: "#8f2d2d",
  fontWeight: 700,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 14,
};

const paginationWrapStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: 18,
  borderTop: "1px solid #efe8dc",
  flexWrap: "wrap",
};

const paginationInfoStyle: React.CSSProperties = {
  fontWeight: 800,
  color: "#5f564b",
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