"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type ProductRecord = Record<string, string>;

type BulkListResponse = {
  ok?: boolean;
  error?: string;
  headers?: string[];
  items?: ProductRecord[];
  total?: number;
};

type BulkUpdateResponse = {
  ok?: boolean;
  error?: string;
  updated?: number;
  message?: string;
};

const DEFAULT_VISIBLE_COLUMNS = [
  "title",
  "slug",
  "status",
  "featured",
  "collection_slug",
  "short_description",
  "seo_title",
  "seo_description",
  "vendor",
  "product_category",
  "type",
  "tags",
];

const READONLY_COLUMNS = new Set(["id", "created_at", "updated_at"]);

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function createRowKey(row: ProductRecord, index: number) {
  return normalizeText(row.slug) || normalizeText(row.id) || `row-${index}`;
}

export default function ProductsBulkEditPage() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ProductRecord[]>([]);
  const [originalRows, setOriginalRows] = useState<ProductRecord[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_VISIBLE_COLUMNS
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const editableHeaders = useMemo(() => {
    return headers.filter((header) => !READONLY_COLUMNS.has(header));
  }, [headers]);

  const visibleEditableColumns = useMemo(() => {
    return visibleColumns.filter((column) => editableHeaders.includes(column));
  }, [editableHeaders, visibleColumns]);

  const changedRows = useMemo(() => {
    const originalMap = new Map<string, ProductRecord>();

    originalRows.forEach((row, index) => {
      originalMap.set(createRowKey(row, index), row);
    });

    return rows.filter((row, index) => {
      const key = createRowKey(originalRows[index] || row, index);
      const original = originalMap.get(key);

      if (!original) return false;

      return headers.some((header) => {
        if (READONLY_COLUMNS.has(header)) return false;
        return normalizeText(original[header]) !== normalizeText(row[header]);
      });
    });
  }, [headers, originalRows, rows]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");
      setErrorMessage("");

      const params = new URLSearchParams();
      params.set("limit", "500");

      if (search.trim()) {
        params.set("q", search.trim());
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await fetch(`/api/products/bulk-list?${params}`, {
        cache: "no-store",
      });

      const data = (await response.json()) as BulkListResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to load products.");
      }

      const nextHeaders = Array.isArray(data.headers) ? data.headers : [];
      const nextRows = Array.isArray(data.items) ? data.items : [];

      setHeaders(nextHeaders);
      setRows(nextRows);
      setOriginalRows(nextRows.map((item) => ({ ...item })));

      setVisibleColumns((prev) => {
        const stillValid = prev.filter((column) => nextHeaders.includes(column));

        if (stillValid.length > 0) {
          return stillValid;
        }

        return nextHeaders
          .filter((column) => !READONLY_COLUMNS.has(column))
          .slice(0, 10);
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  function updateCell(rowIndex: number, column: string, value: string) {
    setRows((prev) =>
      prev.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [column]: value,
            }
          : row
      )
    );
  }

  function toggleColumn(column: string) {
    setVisibleColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((item) => item !== column);
      }

      return [...prev, column];
    });
  }

  function showRecommendedColumns() {
    setVisibleColumns(
      DEFAULT_VISIBLE_COLUMNS.filter((column) => editableHeaders.includes(column))
    );
  }

  function showAllColumns() {
    setVisibleColumns(editableHeaders);
  }

  function hideAllColumns() {
    setVisibleColumns(["title", "slug"].filter((item) => editableHeaders.includes(item)));
  }

  function resetChanges() {
    setRows(originalRows.map((item) => ({ ...item })));
    setMessage("Unsaved changes were reset.");
    setErrorMessage("");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");
      setErrorMessage("");

      const updates = changedRows.map((row) => {
        const original = originalRows.find(
          (item) => normalizeText(item.slug) === normalizeText(row.slug)
        );

        const fallbackOriginal = originalRows.find(
          (item) => normalizeText(item.id) && normalizeText(item.id) === normalizeText(row.id)
        );

        const originalSlug =
          normalizeText(original?.slug) ||
          normalizeText(fallbackOriginal?.slug) ||
          normalizeText(row.slug);

        const values: Record<string, string> = {};

        for (const header of headers) {
          if (READONLY_COLUMNS.has(header)) continue;
          values[header] = normalizeText(row[header]);
        }

        return {
          original_slug: originalSlug,
          values,
        };
      });

      if (updates.length === 0) {
        setMessage("No changes to save.");
        return;
      }

      const response = await fetch("/api/products/bulk-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      const data = (await response.json()) as BulkUpdateResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to save changes.");
      }

      setMessage(data.message || "Bulk changes saved successfully.");
      await loadProducts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href="/admin/products" style={backLinkStyle}>
            ← Back to Products
          </Link>
          <h1 style={titleStyle}>Bulk Edit Products</h1>
          <p style={subtitleStyle}>
            Spreadsheet-style product editing for titles, slugs, status, SEO,
            tags, collection assignments, and other product fields.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || changedRows.length === 0}
            style={primaryButtonStyle}
          >
            {saving ? "Saving..." : `Save Changes (${changedRows.length})`}
          </button>

          <button
            type="button"
            onClick={resetChanges}
            disabled={saving || changedRows.length === 0}
            style={secondaryButtonStyle}
          >
            Reset Changes
          </button>
        </div>
      </div>

      <div style={toolbarStyle}>
        <div>
          <label style={labelStyle}>Search</label>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search all product fields"
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

        <div style={toolbarButtonGroupStyle}>
          <button type="button" onClick={loadProducts} style={secondaryButtonStyle}>
            Refresh
          </button>
          <button
            type="button"
            onClick={showRecommendedColumns}
            style={secondaryButtonStyle}
          >
            Recommended Columns
          </button>
          <button type="button" onClick={showAllColumns} style={secondaryButtonStyle}>
            Show All
          </button>
          <button type="button" onClick={hideAllColumns} style={secondaryButtonStyle}>
            Minimal
          </button>
        </div>
      </div>

      <div style={columnPanelStyle}>
        <div style={columnPanelHeaderStyle}>
          <strong>Columns</strong>
          <span>{visibleEditableColumns.length} visible</span>
        </div>

        <div style={columnGridStyle}>
          {editableHeaders.map((header) => (
            <label key={header} style={columnCheckStyle}>
              <input
                type="checkbox"
                checked={visibleColumns.includes(header)}
                onChange={() => toggleColumn(header)}
              />
              <span>{header}</span>
            </label>
          ))}
        </div>
      </div>

      {message ? <div style={successBoxStyle}>{message}</div> : null}
      {errorMessage ? <div style={errorBoxStyle}>{errorMessage}</div> : null}

      <div style={summaryRowStyle}>
        <div style={summaryBoxStyle}>
          <span>Total Loaded</span>
          <strong>{rows.length}</strong>
        </div>
        <div style={summaryBoxStyle}>
          <span>Changed Rows</span>
          <strong>{changedRows.length}</strong>
        </div>
        <div style={summaryBoxStyle}>
          <span>Editable Columns</span>
          <strong>{editableHeaders.length}</strong>
        </div>
      </div>

      <div style={tableShellStyle}>
        {loading ? (
          <div style={emptyStateStyle}>Loading products...</div>
        ) : rows.length === 0 ? (
          <div style={emptyStateStyle}>No products found.</div>
        ) : visibleEditableColumns.length === 0 ? (
          <div style={emptyStateStyle}>Select at least one column.</div>
        ) : (
          <div style={tableScrollStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={stickyFirstHeaderStyle}>Product</th>
                  {visibleEditableColumns.map((column) => (
                    <th key={column} style={thStyle}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => {
                  const original = originalRows[rowIndex] || {};
                  const rowChanged = headers.some((header) => {
                    if (READONLY_COLUMNS.has(header)) return false;
                    return (
                      normalizeText(original[header]) !== normalizeText(row[header])
                    );
                  });

                  return (
                    <tr key={createRowKey(row, rowIndex)}>
                      <td style={stickyFirstCellStyle}>
                        <div style={productCellStyle}>
                          <strong>{row.title || "Untitled Product"}</strong>
                          <span>{row.slug || "-"}</span>
                          {rowChanged ? (
                            <em style={changedBadgeStyle}>Changed</em>
                          ) : null}
                        </div>
                      </td>

                      {visibleEditableColumns.map((column) => {
                        const changed =
                          normalizeText(original[column]) !==
                          normalizeText(row[column]);

                        const value = row[column] || "";

                        if (column === "status") {
                          return (
                            <td key={column} style={tdStyle}>
                              <select
                                value={value || "draft"}
                                onChange={(event) =>
                                  updateCell(rowIndex, column, event.target.value)
                                }
                                style={{
                                  ...cellInputStyle,
                                  ...(changed ? changedCellStyle : {}),
                                }}
                              >
                                <option value="published">published</option>
                                <option value="draft">draft</option>
                                <option value="archived">archived</option>
                              </select>
                            </td>
                          );
                        }

                        if (column === "featured") {
                          return (
                            <td key={column} style={tdStyle}>
                              <select
                                value={value || "false"}
                                onChange={(event) =>
                                  updateCell(rowIndex, column, event.target.value)
                                }
                                style={{
                                  ...cellInputStyle,
                                  ...(changed ? changedCellStyle : {}),
                                }}
                              >
                                <option value="false">false</option>
                                <option value="true">true</option>
                              </select>
                            </td>
                          );
                        }

                        const isLongField =
                          column.includes("description") ||
                          column === "gallery" ||
                          column === "tags";

                        return (
                          <td key={column} style={tdStyle}>
                            {isLongField ? (
                              <textarea
                                value={value}
                                onChange={(event) =>
                                  updateCell(rowIndex, column, event.target.value)
                                }
                                style={{
                                  ...cellTextareaStyle,
                                  ...(changed ? changedCellStyle : {}),
                                }}
                              />
                            ) : (
                              <input
                                value={value}
                                onChange={(event) =>
                                  updateCell(rowIndex, column, event.target.value)
                                }
                                style={{
                                  ...cellInputStyle,
                                  ...(changed ? changedCellStyle : {}),
                                }}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={footerSaveBarStyle}>
        <div>
          <strong>{changedRows.length}</strong> changed row
          {changedRows.length === 1 ? "" : "s"}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || changedRows.length === 0}
          style={primaryButtonStyle}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
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
  maxWidth: 760,
  lineHeight: 1.6,
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const toolbarStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.5fr 220px 1.5fr",
  gap: 16,
  alignItems: "end",
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 18,
};

const toolbarButtonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 800,
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #d9cfbf",
  background: "#fcfbf8",
  outline: "none",
  fontSize: 14,
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
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid #d9cfbf",
  background: "#fff",
  color: "#171717",
  fontWeight: 800,
  cursor: "pointer",
  textDecoration: "none",
};

const columnPanelStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 18,
};

const columnPanelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 14,
};

const columnGridStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const columnCheckStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: 36,
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid #e4dbcf",
  background: "#f8f5ef",
  fontWeight: 700,
  fontSize: 13,
};

const successBoxStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 16,
  background: "#edf8f1",
  border: "1px solid #cfe7d8",
  color: "#1d6a43",
  fontWeight: 700,
};

const errorBoxStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 16,
  background: "#fff1f1",
  border: "1px solid #f0c9c9",
  color: "#8d2f2f",
  fontWeight: 700,
};

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const summaryBoxStyle: React.CSSProperties = {
  minWidth: 170,
  display: "grid",
  gap: 6,
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 18,
  padding: 16,
};

const tableShellStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  overflow: "hidden",
};

const tableScrollStyle: React.CSSProperties = {
  overflow: "auto",
  maxHeight: "70vh",
};

const tableStyle: React.CSSProperties = {
  width: "max-content",
  minWidth: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 3,
  textAlign: "left",
  padding: 12,
  fontSize: 12,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#7d7266",
  background: "#f8f5ef",
  borderBottom: "1px solid #e5dccf",
  borderRight: "1px solid #eee5d8",
  minWidth: 220,
};

const stickyFirstHeaderStyle: React.CSSProperties = {
  ...thStyle,
  left: 0,
  zIndex: 5,
  minWidth: 260,
};

const tdStyle: React.CSSProperties = {
  padding: 8,
  borderBottom: "1px solid #efe8dc",
  borderRight: "1px solid #f1e8dc",
  verticalAlign: "top",
};

const stickyFirstCellStyle: React.CSSProperties = {
  ...tdStyle,
  position: "sticky",
  left: 0,
  zIndex: 2,
  background: "#fff",
  minWidth: 260,
};

const productCellStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 13,
};

const changedBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  borderRadius: 999,
  padding: "4px 8px",
  background: "#fff7e8",
  border: "1px solid #ecd8ad",
  color: "#8a6418",
  fontStyle: "normal",
  fontWeight: 800,
  fontSize: 11,
};

const cellInputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 210,
  minHeight: 42,
  border: "1px solid transparent",
  background: "transparent",
  borderRadius: 10,
  padding: "8px 10px",
  outline: "none",
  fontSize: 14,
};

const cellTextareaStyle: React.CSSProperties = {
  ...cellInputStyle,
  minHeight: 84,
  resize: "vertical",
  fontFamily: "inherit",
};

const changedCellStyle: React.CSSProperties = {
  background: "#fff7e8",
  border: "1px solid #ecd8ad",
};

const emptyStateStyle: React.CSSProperties = {
  padding: 28,
  color: "#6f6559",
  fontWeight: 700,
};

const footerSaveBarStyle: React.CSSProperties = {
  position: "sticky",
  bottom: 18,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  background: "rgba(255,255,255,0.94)",
  backdropFilter: "blur(10px)",
  border: "1px solid #ddd3c5",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 12px 30px rgba(23,23,23,0.08)",
};