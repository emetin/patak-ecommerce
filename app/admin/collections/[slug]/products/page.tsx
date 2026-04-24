"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { normalizeImageUrl } from "../../../../../lib/image-url";

type ProductItem = {
  id?: string;
  title?: string;
  slug?: string;
  image?: string;
  collection_slug?: string;
  status?: string;
};

type CollectionProductItem = {
  id?: string;
  collection_slug?: string;
  product_slug?: string;
  sort_order?: string;
  featured?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export default function AdminCollectionProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = use(params);
  const slug = decodeURIComponent(rawSlug).trim().toLowerCase();

  const [links, setLinks] = useState<CollectionProductItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [selectedProductSlugs, setSelectedProductSlugs] = useState<string[]>([]);

  const [sortOrderStart, setSortOrderStart] = useState("1");
  const [featured, setFeatured] = useState("false");
  const [status, setStatus] = useState("published");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState("");

  async function loadLinks() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `/api/collection-products/list?collection_slug=${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to load collection products.");
      }

      setLinks(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      setProductsLoading(true);

      const response = await fetch("/api/products/list?limit=200", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to load products.");
      }

      setProducts(Array.isArray(data.items) ? data.items : []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
    loadProducts();
  }, [slug]);

  const linkedSlugSet = useMemo(() => {
    return new Set(
      links
        .map((item) => String(item.product_slug || "").trim().toLowerCase())
        .filter(Boolean)
    );
  }, [links]);

  const availableProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const productSlug = String(product.slug || "").trim().toLowerCase();
      const title = String(product.title || "").trim().toLowerCase();

      if (!productSlug) return false;
      if (linkedSlugSet.has(productSlug)) return false;

      if (!normalizedSearch) return true;

      return title.includes(normalizedSearch) || productSlug.includes(normalizedSearch);
    });
  }, [products, linkedSlugSet, search]);

  const linkedProducts = useMemo(() => {
    return links.map((link) => {
      const product =
        products.find(
          (item) =>
            String(item.slug || "").trim().toLowerCase() ===
            String(link.product_slug || "").trim().toLowerCase()
        ) || null;

      return { link, product };
    });
  }, [links, products]);

  const selectedSlugSet = useMemo(() => {
    return new Set(selectedProductSlugs);
  }, [selectedProductSlugs]);

  const selectedProducts = useMemo(() => {
    return availableProducts.filter((product) =>
      selectedSlugSet.has(String(product.slug || ""))
    );
  }, [availableProducts, selectedSlugSet]);

  function toggleProduct(slugValue?: string) {
    const safeSlug = String(slugValue || "").trim();

    if (!safeSlug) return;

    setSelectedProductSlugs((prev) => {
      if (prev.includes(safeSlug)) {
        return prev.filter((item) => item !== safeSlug);
      }

      return [...prev, safeSlug];
    });
  }

  function selectAllVisible() {
    const visibleSlugs = availableProducts
      .map((product) => String(product.slug || "").trim())
      .filter(Boolean);

    setSelectedProductSlugs((prev) => {
      const next = new Set(prev);

      for (const item of visibleSlugs) {
        next.add(item);
      }

      return Array.from(next);
    });
  }

  function clearSelection() {
    setSelectedProductSlugs([]);
  }

  async function handleBulkSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (selectedProductSlugs.length === 0) {
      setSaveError("Please select at least one product.");
      return;
    }

    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    try {
      const baseSort = Number(sortOrderStart || "1");
      const safeBaseSort = Number.isFinite(baseSort) ? baseSort : 1;

      let addedCount = 0;

      for (let index = 0; index < selectedProductSlugs.length; index += 1) {
        const productSlug = selectedProductSlugs[index];

        const response = await fetch("/api/collection-products/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collection_slug: slug,
            product_slug: productSlug,
            sort_order: String(safeBaseSort + index),
            featured,
            status,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(
            data?.error || `Failed to link product: ${productSlug}`
          );
        }

        addedCount += 1;
      }

      setSaveMessage(`${addedCount} product(s) linked to collection successfully.`);
      setSelectedProductSlugs([]);
      setSearch("");

      await loadLinks();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove this product from the collection?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(id);

      const response = await fetch("/api/collection-products/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to delete link.");
      }

      await loadLinks();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setDeleteLoadingId("");
    }
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href={`/admin/collections/${slug}`} style={backLinkStyle}>
            ← Back to Collection
          </Link>

          <h1 style={titleStyle}>Collection Products</h1>

          <p style={subtitleStyle}>
            Select multiple products and assign them to this collection in one step.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href="/admin/collections" style={secondaryButtonStyle}>
            All Collections
          </Link>

          <Link href={`/collections/${slug}`} style={primaryButtonStyle}>
            View Collection
          </Link>
        </div>
      </div>

      <div style={summaryGridStyle}>
        <SummaryCard label="Collection" value={slug} />
        <SummaryCard label="Linked Products" value={String(links.length)} />
        <SummaryCard
          label="Selected Products"
          value={String(selectedProductSlugs.length)}
        />
      </div>

      <div style={mainGridStyle}>
        <form onSubmit={handleBulkSubmit} style={cardStyle}>
          <h2 style={sectionTitleStyle}>Bulk Add Products</h2>

          <div style={formGridStyle}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Search Product</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product title or slug"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Start Sort Order</label>
              <input
                value={sortOrderStart}
                onChange={(e) => setSortOrderStart(e.target.value)}
                placeholder="1"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Featured</label>
              <select
                value={featured}
                onChange={(e) => setFeatured(e.target.value)}
                style={inputStyle}
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </div>

          <div style={bulkActionRowStyle}>
            <button
              type="button"
              onClick={selectAllVisible}
              style={secondarySmallButtonStyle}
              disabled={availableProducts.length === 0}
            >
              Select All Visible
            </button>

            <button
              type="button"
              onClick={clearSelection}
              style={secondarySmallButtonStyle}
              disabled={selectedProductSlugs.length === 0}
            >
              Clear Selection
            </button>

            <button
              type="submit"
              style={primaryButtonStyle}
              disabled={saving || selectedProductSlugs.length === 0}
            >
              {saving
                ? "Adding..."
                : `Add Selected Products (${selectedProductSlugs.length})`}
            </button>
          </div>

          {selectedProducts.length > 0 ? (
            <div style={selectedInfoBoxStyle}>
              <strong>Selected:</strong>{" "}
              {selectedProducts.map((item) => item.title || item.slug).join(", ")}
            </div>
          ) : null}

          {productsLoading ? (
            <div style={emptyStateStyle}>Loading products...</div>
          ) : availableProducts.length > 0 ? (
            <div style={productResultListStyle}>
              {availableProducts.map((product) => {
                const safeSlug = String(product.slug || "").trim();
                const isSelected = selectedSlugSet.has(safeSlug);

                return (
                  <button
                    key={safeSlug}
                    type="button"
                    onClick={() => toggleProduct(safeSlug)}
                    style={{
                      ...productResultItemStyle,
                      ...(isSelected ? productResultItemActiveStyle : {}),
                    }}
                  >
                    <div style={checkboxStyle}>
                      {isSelected ? "✓" : ""}
                    </div>

                    <div style={productResultImageWrapStyle}>
                      {product.image ? (
                        <img
                          src={normalizeImageUrl(product.image)}
                          alt={product.title || "Product"}
                          style={productResultImageStyle}
                          loading="lazy"
                        />
                      ) : (
                        <div style={productResultEmptyImageStyle}>No Image</div>
                      )}
                    </div>

                    <div style={{ textAlign: "left", minWidth: 0 }}>
                      <div style={productResultTitleStyle}>
                        {product.title || product.slug}
                      </div>
                      <div style={productResultSlugStyle}>{product.slug}</div>
                      <div style={productResultSlugStyle}>
                        Current collection: {product.collection_slug || "-"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={emptyStateStyle}>
              No available products found for this search.
            </div>
          )}

          {saveMessage ? <div style={successBoxStyle}>{saveMessage}</div> : null}
          {saveError ? <div style={errorBoxStyle}>{saveError}</div> : null}
        </form>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Assigned Products</h2>

          {loading ? (
            <div style={emptyStateStyle}>Loading...</div>
          ) : errorMessage ? (
            <div style={errorBoxStyle}>{errorMessage}</div>
          ) : linkedProducts.length === 0 ? (
            <div style={emptyStateStyle}>No products assigned yet.</div>
          ) : (
            <div style={listStyle}>
              {linkedProducts.map(({ link, product }, index) => (
                <div key={link.id || index} style={listCardStyle}>
                  <div style={linkedProductRowStyle}>
                    <div style={linkedImageWrapStyle}>
                      {product?.image ? (
                        <img
                          src={normalizeImageUrl(product.image)}
                          alt={product.title || "Product"}
                          style={linkedImageStyle}
                          loading="lazy"
                        />
                      ) : (
                        <div style={linkedEmptyImageStyle}>No Image</div>
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={linkedTitleStyle}>
                        {product?.title || link.product_slug || "-"}
                      </div>

                      <div style={mutedTextStyle}>
                        Slug: {link.product_slug || "-"}
                      </div>

                      <div style={linkedMetaStyle}>
                        <span>Sort: {link.sort_order || "-"}</span>
                        <span>Featured: {link.featured || "-"}</span>
                        <span>Status: {link.status || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div style={linkedActionsStyle}>
                    {link.product_slug ? (
                      <Link
                        href={`/admin/products/${link.product_slug}`}
                        style={secondarySmallButtonStyle}
                      >
                        Edit Product
                      </Link>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleDelete(link.id)}
                      style={dangerSmallButtonStyle}
                      disabled={deleteLoadingId === link.id}
                    >
                      {deleteLoadingId === link.id ? "Deleting..." : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={summaryCardStyle}>
      <div style={summaryLabelStyle}>{label}</div>
      <div style={summaryValueStyle}>{value}</div>
    </div>
  );
}

const pageHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 20,
  flexWrap: "wrap",
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-block",
  textDecoration: "none",
  color: "#5e5448",
  fontWeight: 700,
  marginBottom: 4,
};

const titleStyle: React.CSSProperties = {
  fontSize: 38,
  lineHeight: 1.1,
  margin: "10px 0 10px",
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#6f6559",
  fontSize: 16,
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 16,
};

const summaryCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 20,
  padding: 18,
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#7c7267",
  fontWeight: 800,
  marginBottom: 8,
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  wordBreak: "break-word",
};

const mainGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.95fr 1.05fr",
  gap: 24,
  alignItems: "start",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 10px 30px rgba(23,23,23,0.04)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: 24,
  fontWeight: 800,
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
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

const bulkActionRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 22,
  marginBottom: 14,
};

const selectedInfoBoxStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "#eef8f0",
  border: "1px solid #cfe5d4",
  marginBottom: 14,
  color: "#1d6a43",
  lineHeight: 1.6,
};

const productResultListStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 12,
  maxHeight: 480,
  overflowY: "auto",
};

const productResultItemStyle: React.CSSProperties = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "32px 58px 1fr",
  gap: 12,
  alignItems: "center",
  padding: 10,
  borderRadius: 16,
  border: "1px solid #e5dccf",
  background: "#fff",
  cursor: "pointer",
};

const productResultItemActiveStyle: React.CSSProperties = {
  border: "2px solid #2f7d62",
  background: "#eef8f0",
};

const checkboxStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  border: "1px solid #2f7d62",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#2f7d62",
  fontWeight: 900,
  background: "#fff",
};

const productResultImageWrapStyle: React.CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 12,
  overflow: "hidden",
  background: "#f8f5ef",
  border: "1px solid #e5dccf",
};

const productResultImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const productResultEmptyImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 10,
  color: "#8c8174",
};

const productResultTitleStyle: React.CSSProperties = {
  fontWeight: 900,
  color: "#171717",
};

const productResultSlugStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 13,
  color: "#6f6559",
};

const mutedTextStyle: React.CSSProperties = {
  color: "#6f6559",
  fontSize: 13,
  marginTop: 5,
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
  fontSize: 14,
};

const successBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "#eef8f0",
  border: "1px solid #cfe5d4",
};

const errorBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "#fff1f1",
  border: "1px solid #efc9c9",
  color: "#7a2222",
};

const emptyStateStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 18,
  borderRadius: 16,
  background: "#f8f5ef",
};

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const listCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
  border: "1px solid #e8dfd2",
  borderRadius: 18,
  padding: 14,
};

const linkedProductRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "82px 1fr",
  gap: 14,
  alignItems: "start",
};

const linkedImageWrapStyle: React.CSSProperties = {
  width: 82,
  height: 82,
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid #e5dccf",
  background: "#f8f5ef",
};

const linkedImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const linkedEmptyImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#8c8174",
  fontSize: 12,
  textAlign: "center",
};

const linkedTitleStyle: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 16,
};

const linkedMetaStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 10,
  color: "#5f564c",
  fontSize: 13,
};

const linkedActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};