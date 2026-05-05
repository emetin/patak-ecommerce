"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, CSSProperties } from "react";
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

type ProductsOverviewResponse = {
  ok?: boolean;
  error?: string;
  products?: ProductItem[];
  total?: number;
  totalPages?: number;
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

function createProductKey(item: ProductItem, index: number) {
  return normalizeText(item.slug) || normalizeText(item.id) || `row-${index}`;
}

function encodeSlugList(slugs: string[]) {
  return slugs.map((slug) => encodeURIComponent(slug)).join(",");
}

export default function AdminProductsPage() {
  const router = useRouter();

  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contentFilter, setContentFilter] = useState("all");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [deleteLoadingSlug, setDeleteLoadingSlug] = useState("");
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

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
      setSelectedSlugs([]);
    }, 350);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
    setSelectedSlugs([]);
  }, [statusFilter, contentFilter]);

  const loadOverview = useCallback(
    async (signal?: AbortSignal): Promise<ProductsOverviewResponse> => {
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

      const data = (await response.json()) as ProductsOverviewResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to load products.");
      }

      return data;
    },
    [page, search, statusFilter]
  );

  const applyOverviewData = useCallback((data: ProductsOverviewResponse) => {
    setItems(Array.isArray(data.products) ? data.products : []);
    setTotal(Number(data.total || 0));
    setTotalPages(Number(data.totalPages || 1));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await loadOverview(controller.signal);
        applyOverviewData(data);
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
  }, [loadOverview, applyOverviewData]);

  const reloadCurrentPage = useCallback(async () => {
    try {
      setLoading(true);
      const data = await loadOverview();
      applyOverviewData(data);
      setSelectedSlugs([]);
    } finally {
      setLoading(false);
    }
  }, [loadOverview, applyOverviewData]);

  const filteredItems = useMemo(() => {
    if (contentFilter === "all") return items;

    return items.filter((item) => {
      const imageCount = Number(item.image_count || 0);
      const altCount = Number(item.alt_count || 0);

      if (contentFilter === "no_gallery") return imageCount === 0;

      if (contentFilter === "no_main_image") {
        return imageCount > 0 && !item.main_image_exists;
      }

      if (contentFilter === "missing_alt_text") {
        return imageCount > 0 && altCount < imageCount;
      }

      if (contentFilter === "low_image_count") {
        return imageCount > 0 && imageCount < 3;
      }

      if (contentFilter === "featured") return isTrue(item.featured);
      if (contentFilter === "not_featured") return !isTrue(item.featured);

      return true;
    });
  }, [contentFilter, items]);

  const visibleSlugs = useMemo(() => {
    return filteredItems.map((item) => normalizeText(item.slug)).filter(Boolean);
  }, [filteredItems]);

  const allVisibleSelected =
    visibleSlugs.length > 0 &&
    visibleSlugs.every((slug) => selectedSlugs.includes(slug));

  function clearFilters() {
    setStatusFilter("all");
    setContentFilter("all");
  }

  function toggleProductSelection(slug?: string) {
    const safeSlug = normalizeText(slug);
    if (!safeSlug) return;

    setSelectedSlugs((prev) => {
      if (prev.includes(safeSlug)) {
        return prev.filter((item) => item !== safeSlug);
      }

      return [...prev, safeSlug];
    });
  }

  function toggleAllVisible() {
    setSelectedSlugs((prev) => {
      if (allVisibleSelected) {
        return prev.filter((slug) => !visibleSlugs.includes(slug));
      }

      return Array.from(new Set([...prev, ...visibleSlugs]));
    });
  }

  function openBulkEdit() {
    const slugsToEdit = selectedSlugs.length > 0 ? selectedSlugs : visibleSlugs;

    if (slugsToEdit.length === 0) return;

    router.push(`/admin/products/bulk-edit?slugs=${encodeSlugList(slugsToEdit)}`);
  }

  function handleExportChange(event: ChangeEvent<HTMLSelectElement>) {
    const format = event.currentTarget.value;

    if (!format) return;

    window.location.href = `/api/products/export?format=${format}`;
    event.currentTarget.value = "";
  }

  const handleDeleteSelected = useCallback(async () => {
    if (selectedSlugs.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedSlugs.length} selected product${
        selectedSlugs.length > 1 ? "s" : ""
      }?`
    );

    if (!confirmed) return;

    try {
      setBulkDeleteLoading(true);

      await Promise.all(
        selectedSlugs.map(async (slug) => {
          const response = await fetch("/api/products/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug }),
          });

          const data = await response.json();

          if (!response.ok || !data.ok) {
            throw new Error(data?.error || `Failed to delete ${slug}.`);
          }
        })
      );

      await reloadCurrentPage();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setBulkDeleteLoading(false);
    }
  }, [selectedSlugs, reloadCurrentPage]);

  const handleDelete = useCallback(
    async (slug?: string) => {
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
    },
    [reloadCurrentPage]
  );

  const publishedCount = useMemo(
    () =>
      items.filter((item) => normalizeLower(item.status) === "published").length,
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
    <div style={pageWrapStyle}>
      <div style={pageHeaderStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={titleStyle}>Products</h1>
          <p style={subtitleStyle}>
            Manage product records, review image quality and open selected rows
            in bulk edit.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href="/admin/products/new" style={primaryButtonStyle}>
            + New Product
          </Link>

          <button
            type="button"
            onClick={openBulkEdit}
            disabled={visibleSlugs.length === 0}
            style={secondaryButtonStyle}
          >
            Bulk Edit
          </button>

          {selectedSlugs.length > 0 ? (
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={bulkDeleteLoading}
              style={dangerButtonStyle}
            >
              {bulkDeleteLoading ? "Deleting..." : `Delete (${selectedSlugs.length})`}
            </button>
          ) : null}

          <select
            aria-label="Export products"
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
            value={String(total)}
            active={statusFilter === "all" && contentFilter === "all"}
            onClick={clearFilters}
          />

          <StatButton
            label="Page"
            value={String(items.length)}
            active={false}
            onClick={clearFilters}
          />

          <StatButton
            label="Published"
            value={String(publishedCount)}
            active={statusFilter === "published"}
            onClick={() => {
              setStatusFilter("published");
              setContentFilter("all");
            }}
          />

          <StatButton
            label="Draft"
            value={String(draftCount)}
            active={statusFilter === "draft"}
            onClick={() => {
              setStatusFilter("draft");
              setContentFilter("all");
            }}
          />

          <StatButton
            label="No Gallery"
            value={String(galleryAudit.missingGallery)}
            tone="warning"
            active={contentFilter === "no_gallery"}
            onClick={() => setContentFilter("no_gallery")}
          />

          <StatButton
            label="No Main"
            value={String(galleryAudit.missingMainImage)}
            tone="warning"
            active={contentFilter === "no_main_image"}
            onClick={() => setContentFilter("no_main_image")}
          />

          <StatButton
            label="Alt Missing"
            value={String(galleryAudit.missingAltText)}
            tone="warning"
            active={contentFilter === "missing_alt_text"}
            onClick={() => setContentFilter("missing_alt_text")}
          />

          <StatButton
            label="Low Images"
            value={String(galleryAudit.lowImageCount)}
            tone="warning"
            active={contentFilter === "low_image_count"}
            onClick={() => setContentFilter("low_image_count")}
          />
        </div>

        <div style={filterGridStyle}>
          <input
            aria-label="Search products"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search products..."
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

          <select
            aria-label="Filter by content issue"
            value={contentFilter}
            onChange={(event) => setContentFilter(event.target.value)}
            style={inputStyle}
          >
            <option value="all">all</option>
            <option value="featured">featured</option>
            <option value="not_featured">not featured</option>
            <option value="no_gallery">no gallery</option>
            <option value="no_main_image">no main image</option>
            <option value="missing_alt_text">missing alt text</option>
            <option value="low_image_count">low image count</option>
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
          No products matched your current search or filters.
        </div>
      ) : (
        <>
          <div className="admin-products-mobile-list" style={mobileListStyle}>
            {filteredItems.map((item, index) => {
              const slug = normalizeText(item.slug);
              const selected = selectedSlugs.includes(slug);

              return (
                <ProductMobileRow
                  key={`mobile-${createProductKey(item, index)}`}
                  item={item}
                  selected={selected}
                  onToggleSelected={toggleProductSelection}
                />
              );
            })}
          </div>

          <div className="admin-products-table-card" style={tableCardStyle}>
            <div style={tableScrollStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={checkboxThStyle}>
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAllVisible}
                      />
                    </th>
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
                  {filteredItems.map((item, index) => {
                    const slug = normalizeText(item.slug);
                    const selected = selectedSlugs.includes(slug);

                    return (
                      <ProductRow
                        key={createProductKey(item, index)}
                        item={item}
                        selected={selected}
                        deleteLoadingSlug={deleteLoadingSlug}
                        onToggleSelected={toggleProductSelection}
                        onDelete={handleDelete}
                      />
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
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page >= totalPages || loading}
                style={secondarySmallButtonStyle}
              >
                Next
              </button>
            </div>
          </div>

          <div
            className="admin-products-mobile-pagination"
            style={mobilePaginationStyle}
          >
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1 || loading}
              style={secondarySmallButtonStyle}
            >
              Prev
            </button>

            <div style={paginationInfoStyle}>
              {page} / {totalPages}
            </div>

            <button
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={page >= totalPages || loading}
              style={secondarySmallButtonStyle}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const ProductRow = memo(function ProductRow({
  item,
  selected,
  deleteLoadingSlug,
  onToggleSelected,
  onDelete,
}: {
  item: ProductItem;
  selected: boolean;
  deleteLoadingSlug: string;
  onToggleSelected: (slug?: string) => void;
  onDelete: (slug?: string) => void;
}) {
  const primaryImage = normalizeImageUrl(item.main_image || item.image || "");
  const featured = isTrue(item.featured);
  const issues = Array.isArray(item.gallery_issues) ? item.gallery_issues : [];

  return (
    <tr style={selected ? selectedRowStyle : undefined}>
      <td style={checkboxTdStyle}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelected(item.slug)}
        />
      </td>

      <td style={tdStyle}>
        <div style={productCellStyle}>
          <div style={thumbWrapStyle}>
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={item.title || "Product"}
                style={thumbStyle}
                loading="lazy"
              />
            ) : (
              <div style={thumbEmptyStyle}>No Image</div>
            )}
          </div>

          <div style={productInfoStyle}>
            <div style={productTitleRowStyle}>
              <div style={productTitleStyle}>{item.title || "-"}</div>

              {featured ? (
                <span style={featuredBadgeStyle}>Featured</span>
              ) : null}
            </div>

            <div style={descriptionStyle}>
              {item.short_description || "No short description added yet."}
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
        <div style={galleryInfoStyle}>
          <div style={galleryScoreValueStyle}>
            {Number(item.gallery_score || 0)}%
          </div>

          <div style={galleryMetaStyle}>
            <div>
              <strong>Images:</strong> {Number(item.image_count || 0)}
            </div>
            <div>
              <strong>Main:</strong> {item.main_image_exists ? "Yes" : "No"}
            </div>
            <div>
              <strong>Alt:</strong> {Number(item.alt_count || 0)}/
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
            <Link href={`/products/${item.slug}`} style={secondarySmallButtonStyle}>
              View
            </Link>
          ) : null}

          {item.slug ? (
            <button
              type="button"
              onClick={() => onDelete(item.slug)}
              style={dangerSmallButtonStyle}
              disabled={deleteLoadingSlug === item.slug}
            >
              {deleteLoadingSlug === item.slug ? "Deleting..." : "Delete"}
            </button>
          ) : null}
        </div>
      </td>
    </tr>
  );
});

const ProductMobileRow = memo(function ProductMobileRow({
  item,
  selected,
  onToggleSelected,
}: {
  item: ProductItem;
  selected: boolean;
  onToggleSelected: (slug?: string) => void;
}) {
  const primaryImage = normalizeImageUrl(item.main_image || item.image || "");
  const featured = isTrue(item.featured);
  const issues = Array.isArray(item.gallery_issues) ? item.gallery_issues : [];
  const imageCount = Number(item.image_count || 0);
  const altCount = Number(item.alt_count || 0);
  const galleryScore = Number(item.gallery_score || 0);

  return (
    <article style={mobileRowStyle}>
      <div style={mobileMainRowStyle}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelected(item.slug)}
          style={mobileCheckboxStyle}
          aria-label={`Select ${item.title || "product"}`}
        />

        <Link href={`/admin/products/${item.slug || ""}`} style={mobileThumbLinkStyle}>
          <div style={mobileThumbStyle}>
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={item.title || "Product"}
                style={mobileImageStyle}
                loading="lazy"
              />
            ) : (
              <div style={mobileNoImageStyle}>No image</div>
            )}
          </div>
        </Link>

        <div style={mobileContentStyle}>
          <div style={mobileTitleRowStyle}>
            <Link
              href={`/admin/products/${item.slug || ""}`}
              style={mobileTitleLinkStyle}
            >
              <h3 style={mobileTitleStyle}>{item.title || "-"}</h3>
            </Link>

            <StatusBadge value={item.status || "-"} />
          </div>

          <div style={mobileSubTextStyle}>
            {item.collection_slug || "No collection"} · Gallery {galleryScore}% ·{" "}
            {imageCount} img · Alt {altCount}/{imageCount}
          </div>

          <div style={mobileIssueRowStyle}>
            {featured ? (
              <span style={mobileFeaturedBadgeStyle}>Featured</span>
            ) : null}

            {issues.length > 0 ? (
              issues.slice(0, 1).map((issue) => (
                <span key={issue} style={mobileIssueBadgeStyle}>
                  {issue}
                </span>
              ))
            ) : (
              <span style={mobileOkBadgeStyle}>OK</span>
            )}
          </div>
        </div>
      </div>

      <div style={mobileActionsStyle}>
        {item.slug ? (
          <Link
            href={`/admin/products/${item.slug}`}
            style={mobileActionButtonStyle}
          >
            Edit Product
          </Link>
        ) : null}

        {item.slug ? (
          <Link
            href={`/admin/products/${item.slug}/images`}
            style={mobilePrimaryActionButtonStyle}
          >
            Images
          </Link>
        ) : null}
      </div>
    </article>
  );
});

function StatButton({
  label,
  value,
  active,
  onClick,
  tone = "default",
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
  tone?: "default" | "warning";
}) {
  const isWarning = tone === "warning";

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...statButtonStyle,
        ...(isWarning ? warningStatButtonStyle : {}),
        ...(active ? activeStatButtonStyle : {}),
      }}
      title={`${label}: ${value}`}
    >
      <span style={statLabelStyle}>{label}</span>
      <strong
        style={{
          ...statValueStyle,
          ...(isWarning ? warningStatValueStyle : {}),
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

/* styles */

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

const warningStatButtonStyle: CSSProperties = {
  background: "#fffaf0",
  border: "1px solid #ead8ad",
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

const warningStatValueStyle: CSSProperties = {
  color: "#8a6418",
};

const activeStatValueStyle: CSSProperties = {
  color: "#2f7d62",
};

const filterGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 58px 82px",
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
  gridTemplateColumns: "14px 40px minmax(0, 1fr)",
  gap: 7,
  alignItems: "start",
  width: "100%",
  maxWidth: "100%",
};

const mobileCheckboxStyle: CSSProperties = {
  width: 12,
  height: 12,
  marginTop: 4,
};

const mobileThumbLinkStyle: CSSProperties = {
  display: "block",
  width: 40,
  height: 40,
  textDecoration: "none",
};

const mobileThumbStyle: CSSProperties = {
  width: 40,
  height: 40,
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

const mobileNoImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  padding: 2,
  fontSize: 6,
  lineHeight: 1,
  color: "#8a8176",
  background: "#faf8f4",
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

const mobileIssueRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "nowrap",
  gap: 3,
  marginTop: 4,
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

const mobileIssueBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 14,
  maxWidth: "100%",
  padding: "0 5px",
  borderRadius: 999,
  background: "#fff7e8",
  color: "#8a6418",
  border: "1px solid #ecd8ad",
  fontSize: 7,
  fontWeight: 850,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
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
};

const mobileActionsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 6,
  marginTop: 7,
  marginLeft: 61,
  width: "calc(100% - 61px)",
  maxWidth: "calc(100% - 61px)",
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

const checkboxThStyle: CSSProperties = {
  ...thStyle,
  width: 38,
  textAlign: "center",
};

const tdStyle: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #efe8dc",
  verticalAlign: "top",
  fontSize: 12,
};

const checkboxTdStyle: CSSProperties = {
  ...tdStyle,
  width: 38,
  textAlign: "center",
};

const selectedRowStyle: CSSProperties = {
  background: "#f3fbf6",
};

const productCellStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "52px 1fr",
  gap: 10,
  alignItems: "start",
};

const productInfoStyle: CSSProperties = {
  display: "grid",
  gap: 5,
};

const productTitleStyle: CSSProperties = {
  fontWeight: 850,
  fontSize: 12,
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

const thumbEmptyStyle: CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: 10,
  border: "1px dashed #d8cdbd",
  background: "#faf8f4",
  color: "#8c8174",
  fontWeight: 700,
  fontSize: 9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: 6,
};

const productTitleRowStyle: CSSProperties = {
  display: "flex",
  gap: 6,
  alignItems: "center",
  flexWrap: "wrap",
};

const descriptionStyle: CSSProperties = {
  color: "#6f6559",
  fontSize: 10,
  lineHeight: 1.45,
};

const featuredBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 18,
  padding: "0 6px",
  borderRadius: 999,
  background: "#eef8f0",
  color: "#1d6a43",
  border: "1px solid #cfe7d8",
  fontWeight: 850,
  fontSize: 8,
};

const galleryInfoStyle: CSSProperties = {
  display: "grid",
  gap: 5,
};

const galleryScoreValueStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 850,
  color: "#171717",
};

const galleryMetaStyle: CSSProperties = {
  display: "grid",
  gap: 3,
  fontSize: 10,
  color: "#5f564c",
  lineHeight: 1.4,
};

const okBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 24,
  padding: "0 8px",
  borderRadius: 999,
  background: "#edf8f1",
  color: "#1d6a43",
  border: "1px solid #cfe7d8",
  fontWeight: 850,
  fontSize: 9,
};

const warningListStyle: CSSProperties = {
  display: "flex",
  gap: 5,
  flexWrap: "wrap",
};

const warningBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 24,
  padding: "0 7px",
  borderRadius: 999,
  background: "#fff7e8",
  color: "#8a6418",
  border: "1px solid #ecd8ad",
  fontWeight: 850,
  fontSize: 9,
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

const actionColumnStyle: CSSProperties = {
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

const secondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 24,
  flex: "0 0 auto",
  padding: "0 7px",
  borderRadius: 7,
  border: "1px solid #d9cfbf",
  background: "#ffffff",
  color: "#171717",
  fontWeight: 850,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 8,
  whiteSpace: "nowrap",
};

const dangerButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 24,
  flex: "0 0 auto",
  padding: "0 7px",
  borderRadius: 7,
  border: "1px solid #e5c9c9",
  background: "#fff5f5",
  color: "#8f2d2d",
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

const dangerSmallButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 26,
  padding: "0 8px",
  borderRadius: 8,
  border: "1px solid #e5c9c9",
  background: "#fff5f5",
  color: "#8f2d2d",
  fontWeight: 750,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 10,
};

const paginationWrapStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  padding: 12,
  borderTop: "1px solid #efe8dc",
  flexWrap: "wrap",
};

const mobilePaginationStyle: CSSProperties = {
  display: "none",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const paginationInfoStyle: CSSProperties = {
  fontWeight: 850,
  color: "#5f564b",
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