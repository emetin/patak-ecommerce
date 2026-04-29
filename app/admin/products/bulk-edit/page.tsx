"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";

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

type ChangedRowEntry = {
  row: ProductRecord;
  original: ProductRecord;
  rowIndex: number;
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

const MINIMAL_COLUMNS = ["title", "slug", "status", "featured"];
const READONLY_COLUMNS = new Set(["id", "created_at", "updated_at"]);

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function getRowKey(row: ProductRecord, index: number) {
  return normalizeText(row.id) || normalizeText(row.slug) || `row-${index}`;
}

export default function ProductsBulkEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ProductRecord[]>([]);
  const [originalRows, setOriginalRows] = useState<ProductRecord[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_VISIBLE_COLUMNS
  );

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [columnSearch, setColumnSearch] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedSlugsFromUrl = useMemo(() => {
    const raw = searchParams.get("slugs") || "";

    return raw
      .split(",")
      .map((item) => normalizeLower(decodeURIComponent(item)))
      .filter(Boolean);
  }, [searchParams]);

  const editableHeaders = useMemo(() => {
    return headers.filter((header) => !READONLY_COLUMNS.has(header));
  }, [headers]);

  const visibleEditableColumns = useMemo(() => {
    return visibleColumns.filter((column) => editableHeaders.includes(column));
  }, [editableHeaders, visibleColumns]);

  const filteredColumnOptions = useMemo(() => {
    const q = normalizeLower(columnSearch);

    if (!q) return editableHeaders;

    return editableHeaders.filter((header) => normalizeLower(header).includes(q));
  }, [columnSearch, editableHeaders]);

  const changedRowEntries = useMemo<ChangedRowEntry[]>(() => {
    return rows.reduce<ChangedRowEntry[]>((acc, row, rowIndex) => {
      const original = originalRows[rowIndex];

      if (!original) return acc;

      const changed = headers.some((header) => {
        if (READONLY_COLUMNS.has(header)) return false;
        return normalizeText(original[header]) !== normalizeText(row[header]);
      });

      if (changed) {
        acc.push({ row, original, rowIndex });
      }

      return acc;
    }, []);
  }, [headers, originalRows, rows]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");
      setErrorMessage("");

      const response = await fetch("/api/products/bulk-list?limit=500", {
        cache: "no-store",
      });

      const data = (await response.json()) as BulkListResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to load products.");
      }

      const nextHeaders = Array.isArray(data.headers) ? data.headers : [];
      const nextRows = Array.isArray(data.items) ? data.items : [];

      const filteredRows = selectedSlugsFromUrl.length
        ? nextRows.filter((item) =>
            selectedSlugsFromUrl.includes(normalizeLower(item.slug))
          )
        : nextRows;

      setHeaders(nextHeaders);
      setRows(filteredRows);
      setOriginalRows(filteredRows.map((item) => ({ ...item })));

      setVisibleColumns((prev) => {
        const stillValid = prev.filter((column) => nextHeaders.includes(column));

        if (stillValid.length > 0) return stillValid;

        return DEFAULT_VISIBLE_COLUMNS.filter((column) => nextHeaders.includes(column));
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedSlugsFromUrl]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  function showMinimalColumns() {
    setVisibleColumns(
      MINIMAL_COLUMNS.filter((column) => editableHeaders.includes(column))
    );
  }

  function showAllColumns() {
    setVisibleColumns(editableHeaders);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");
      setErrorMessage("");

      const updates = changedRowEntries.map((entry) => {
        const values: Record<string, string> = {};

        for (const header of headers) {
          if (READONLY_COLUMNS.has(header)) continue;
          values[header] = normalizeText(entry.row[header]);
        }

        return {
          original_slug: normalizeText(entry.original.slug),
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

  const editorContent = (
    <div style={editorPageStyle}>
      <div style={editorTopBarStyle}>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          style={backButtonStyle}
        >
          Back
        </button>

        <div style={editorTitleStyle}>
          {loading ? "Loading products..." : `Editing ${rows.length} product${rows.length === 1 ? "" : "s"}`}
        </div>

        <div style={editorActionsStyle}>
          <div style={columnsWrapStyle}>
            <button
              type="button"
              onClick={() => setColumnsOpen((prev) => !prev)}
              style={toolbarButtonStyle}
            >
              Columns
            </button>

            {columnsOpen ? (
              <div style={columnsPanelStyle}>
                <input
                  value={columnSearch}
                  onChange={(event) => setColumnSearch(event.target.value)}
                  placeholder="Search fields"
                  style={columnSearchStyle}
                />

                <div style={columnsActionsStyle}>
                  <button
                    type="button"
                    onClick={showRecommendedColumns}
                    style={tinyButtonStyle}
                  >
                    Recommended
                  </button>
                  <button
                    type="button"
                    onClick={showMinimalColumns}
                    style={tinyButtonStyle}
                  >
                    Minimal
                  </button>
                  <button
                    type="button"
                    onClick={showAllColumns}
                    style={tinyButtonStyle}
                  >
                    All
                  </button>
                </div>

                <div style={columnsSectionTitleStyle}>General</div>

                <div style={columnsListStyle}>
                  {filteredColumnOptions.map((header) => (
                    <label key={header} style={columnItemStyle}>
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
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || changedRowEntries.length === 0}
            style={saveButtonStyle}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {message ? <div style={toastStyle}>{message}</div> : null}
      {errorMessage ? <div style={errorToastStyle}>{errorMessage}</div> : null}

      {loading ? (
        <div style={emptyStateStyle}>Loading products...</div>
      ) : rows.length === 0 ? (
        <div style={emptyStateStyle}>No products were found for this bulk edit.</div>
      ) : visibleEditableColumns.length === 0 ? (
        <div style={emptyStateStyle}>Select at least one column.</div>
      ) : (
        <div style={editorTableWrapStyle}>
          <table style={editorTableStyle}>
            <thead>
              <tr>
                {visibleEditableColumns.map((column) => (
                  <th key={column} style={editorHeaderStyle}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => {
                const original = originalRows[rowIndex] || {};
                const key = getRowKey(row, rowIndex);

                return (
                  <tr key={key}>
                    {visibleEditableColumns.map((column) => {
                      const changed =
                        normalizeText(original[column]) !== normalizeText(row[column]);
                      const value = row[column] || "";

                      if (column === "status") {
                        return (
                          <td key={column} style={editorCellStyle}>
                            <select
                              value={value || "draft"}
                              onChange={(event) =>
                                updateCell(rowIndex, column, event.target.value)
                              }
                              style={{
                                ...editorInputStyle,
                                ...(changed ? changedEditorCellStyle : {}),
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
                          <td key={column} style={editorCellStyle}>
                            <select
                              value={value || "false"}
                              onChange={(event) =>
                                updateCell(rowIndex, column, event.target.value)
                              }
                              style={{
                                ...editorInputStyle,
                                ...(changed ? changedEditorCellStyle : {}),
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
                        <td key={column} style={editorCellStyle}>
                          {isLongField ? (
                            <textarea
                              value={value}
                              onChange={(event) =>
                                updateCell(rowIndex, column, event.target.value)
                              }
                              style={{
                                ...editorTextareaStyle,
                                ...(changed ? changedEditorCellStyle : {}),
                              }}
                            />
                          ) : (
                            <input
                              value={value}
                              onChange={(event) =>
                                updateCell(rowIndex, column, event.target.value)
                              }
                              style={{
                                ...editorInputStyle,
                                ...(changed ? changedEditorCellStyle : {}),
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
  );

  if (!mounted) return null;

  return createPortal(editorContent, document.body);
}

const editorPageStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 2147483647,
  display: "grid",
  gridTemplateRows: "64px auto",
  background: "#f4f4f4",
  color: "#171717",
};

const editorTopBarStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "96px 1fr auto",
  alignItems: "center",
  gap: 16,
  background: "#fff",
  borderBottom: "1px solid #d9d9d9",
  padding: "0 16px",
};

const backButtonStyle: React.CSSProperties = {
  minHeight: 38,
  border: 0,
  background: "transparent",
  color: "#171717",
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "left",
};

const editorTitleStyle: React.CSSProperties = {
  fontWeight: 800,
};

const editorActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const toolbarButtonStyle: React.CSSProperties = {
  minHeight: 38,
  padding: "0 12px",
  borderRadius: 9,
  border: "1px solid #d6d6d6",
  background: "#fff",
  color: "#171717",
  fontWeight: 700,
  cursor: "pointer",
};

const saveButtonStyle: React.CSSProperties = {
  minHeight: 38,
  padding: "0 16px",
  borderRadius: 9,
  border: "1px solid #171717",
  background: "#171717",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const columnsWrapStyle: React.CSSProperties = {
  position: "relative",
};

const columnsPanelStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  zIndex: 50,
  width: 340,
  maxHeight: 560,
  overflow: "auto",
  background: "#fff",
  border: "1px solid #d8d8d8",
  borderRadius: 14,
  padding: 12,
  boxShadow: "0 22px 60px rgba(0,0,0,0.18)",
};

const columnSearchStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 38,
  padding: "8px 10px",
  borderRadius: 9,
  border: "1px solid #cfcfcf",
  outline: "none",
  fontSize: 14,
};

const columnsActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: 10,
  marginBottom: 14,
};

const tinyButtonStyle: React.CSSProperties = {
  minHeight: 30,
  padding: "0 10px",
  borderRadius: 8,
  border: "1px solid #d6d6d6",
  background: "#fff",
  color: "#171717",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 12,
};

const columnsSectionTitleStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#6f6f6f",
  fontWeight: 800,
  margin: "12px 0 8px",
};

const columnsListStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const columnItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minHeight: 34,
  fontSize: 14,
};

const toastStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: 28,
  transform: "translateX(-50%)",
  zIndex: 80,
  background: "#171717",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: 10,
  fontWeight: 700,
};

const errorToastStyle: React.CSSProperties = {
  ...toastStyle,
  background: "#8d2f2f",
};

const emptyStateStyle: React.CSSProperties = {
  padding: 28,
  color: "#6f6559",
  fontWeight: 700,
};

const editorTableWrapStyle: React.CSSProperties = {
  overflow: "auto",
  height: "calc(100vh - 64px)",
  background: "#fff",
};

const editorTableStyle: React.CSSProperties = {
  width: "max-content",
  minWidth: "100%",
  borderCollapse: "collapse",
};

const editorHeaderStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 4,
  textAlign: "left",
  minWidth: 230,
  padding: "10px 12px",
  fontSize: 13,
  fontWeight: 700,
  background: "#f7f7f7",
  borderRight: "1px solid #e1e1e1",
  borderBottom: "1px solid #d9d9d9",
};

const editorCellStyle: React.CSSProperties = {
  minWidth: 230,
  padding: 0,
  borderRight: "1px solid #e8e8e8",
  borderBottom: "1px solid #e8e8e8",
  verticalAlign: "top",
};

const editorInputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 230,
  minHeight: 42,
  border: "1px solid transparent",
  background: "transparent",
  padding: "9px 11px",
  outline: "none",
  fontSize: 14,
};

const editorTextareaStyle: React.CSSProperties = {
  ...editorInputStyle,
  minHeight: 78,
  resize: "vertical",
  fontFamily: "inherit",
};

const changedEditorCellStyle: React.CSSProperties = {
  background: "#fff7e8",
  border: "1px solid #e5c371",
};
