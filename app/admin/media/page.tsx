"use client";

import { useEffect, useMemo, useState } from "react";

type MediaItem = {
  id: string;
  file_name: string;
  file_id: string;
  image_url: string;
  mime_type: string;
  size_bytes: string;
  folder: string;
  alt_text: string;
  created_at: string;
};

type MediaResponse = {
  ok?: boolean;
  items?: MediaItem[];
  item?: MediaItem;
  error?: string;
};

function formatSize(size: string) {
  const bytes = Number(size || 0);

  if (!Number.isFinite(bytes) || bytes <= 0) return "-";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPreviewUrl(item: MediaItem) {
  if (item.file_id) {
    return `https://drive.google.com/thumbnail?id=${item.file_id}&sz=w160`;
  }

  return item.image_url || "";
}

function getFileExtension(item: MediaItem) {
  const name = item.file_name || "";
  const parts = name.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1] : "";

  if (ext) return ext.toUpperCase();

  if (item.mime_type?.includes("/")) {
    return item.mime_type.split("/")[1].toUpperCase();
  }

  return "-";
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [folder, setFolder] = useState("general");
  const [altText, setAltText] = useState("");
  const [search, setSearch] = useState("");

  async function loadMedia() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/media/list", {
        cache: "no-store",
      });

      const data = (await response.json()) as MediaResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to load media.");
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

  useEffect(() => {
    loadMedia();
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return items;

    return items.filter((item) =>
      [
        item.file_name,
        item.folder,
        item.alt_text,
        item.image_url,
        item.mime_type,
        item.created_at,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, search]);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (files.length === 0) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const formData = new FormData();

      files.forEach((selectedFile) => {
        formData.append("files", selectedFile);
      });

      formData.append("folder", folder);
      formData.append("alt_text", altText);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as MediaResponse & {
        uploaded?: number;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      const uploadedItems = Array.isArray(data.items)
        ? data.items
        : data.item
          ? [data.item]
          : [];

      setItems((prev) => [...uploadedItems, ...prev]);
      setFiles([]);
      setAltText("");
      setSuccessMessage(`${uploadedItems.length} image(s) uploaded successfully.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setSuccessMessage("Image URL copied.");
    } catch {
      setErrorMessage("Could not copy URL. Please copy it manually.");
    }
  }

  async function handleDelete(item: MediaItem) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image from Google Drive and Media Library?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/media/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          file_id: item.file_id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Delete failed.");
      }

      setItems((prev) => prev.filter((media) => media.id !== item.id));
      setSuccessMessage("Image deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div style={pageWrapStyle}>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={titleStyle}>Files</h1>
          <p style={subtitleStyle}>
            Upload images to Google Drive, copy their URLs, and use them inside
            your custom code.
          </p>
        </div>

        <button type="button" onClick={loadMedia} style={secondaryButtonStyle}>
          Refresh
        </button>
      </div>

      <form onSubmit={handleUpload} style={uploadCardStyle}>
        <div style={formGridStyle}>
          <div>
  <label style={labelStyle}>Images</label>

  <label style={uploadDropStyle}>
    <input
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
      multiple
      onChange={(event) => {
        const selectedFiles = Array.from(event.target.files || []);
        setFiles(selectedFiles);
      }}
      style={hiddenFileInputStyle}
    />

    <span style={uploadIconStyle}>+</span>

    <span style={uploadTextWrapStyle}>
      <strong style={uploadTitleStyle}>
        {files.length > 0 ? `${files.length} file(s) selected` : "Choose images"}
      </strong>
      <span style={uploadHintStyle}>JPG, PNG, WEBP or GIF</span>
    </span>
  </label>
</div>

          <div>
            <label style={labelStyle}>Folder</label>
            <input
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              placeholder="general, banners, blog, hero"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Alt Text</label>
            <input
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Describe this image"
              style={inputStyle}
            />
          </div>
        </div>

        <button type="submit" disabled={uploading} style={primaryButtonStyle}>
          {uploading ? "Uploading..." : "Upload Image(s)"}
        </button>
      </form>

      {errorMessage ? <div style={errorBoxStyle}>{errorMessage}</div> : null}
      {successMessage ? (
        <div style={successBoxStyle}>{successMessage}</div>
      ) : null}

      <div style={tableCardStyle}>
        <div style={toolbarStyle}>
          <button type="button" style={tabButtonStyle}>
            All
          </button>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search files..."
            style={searchInputStyle}
          />

          <div style={countStyle}>
            {filteredItems.length} / {items.length}
          </div>
        </div>

        {loading ? (
          <div style={emptyStateStyle}>Loading media...</div>
        ) : filteredItems.length === 0 ? (
          <div style={emptyStateStyle}>No media found.</div>
        ) : (
          <div style={tableScrollStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>File name</th>
                  <th style={thStyle}>Alt text</th>
                  <th style={thStyle}>Date added</th>
                  <th style={thStyle}>Size</th>
                  <th style={thStyle}>Folder</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => {
                  const previewUrl = getPreviewUrl(item);

                  return (
                    <tr key={item.id} style={trStyle}>
                      <td style={tdStyle}>
                        <div style={fileCellStyle}>
                          <div style={thumbWrapStyle}>
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt={
                                  item.alt_text ||
                                  item.file_name ||
                                  "Media image"
                                }
                                style={thumbStyle}
                                loading="lazy"
                              />
                            ) : (
                              <div style={thumbEmptyStyle}>
                                {getFileExtension(item)}
                              </div>
                            )}
                          </div>

                          <div style={fileTextWrapStyle}>
                            <div style={fileNameStyle} title={item.file_name}>
                              {item.file_name || "-"}
                            </div>
                            <div style={fileTypeStyle}>
                              {getFileExtension(item)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <span style={mutedTextStyle}>
                          {item.alt_text || "-"}
                        </span>
                      </td>

                      <td style={tdStyle}>{formatDate(item.created_at)}</td>

                      <td style={tdStyle}>{formatSize(item.size_bytes)}</td>

                      <td style={tdStyle}>
                        <span style={folderBadgeStyle}>
                          {item.folder || "general"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <div style={actionsStyle}>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.image_url)}
                            style={iconButtonStyle}
                          >
                            Copy URL
                          </button>

                          <a
                            href={item.image_url}
                            target="_blank"
                            rel="noreferrer"
                            style={iconLinkStyle}
                          >
                            Open
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            style={dangerButtonStyle}
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const pageWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: 22,
};

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

const uploadCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 22,
  padding: 22,
  display: "grid",
  gap: 16,
  boxShadow: "0 8px 24px rgba(23,23,23,0.04)",
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr 1fr",
  gap: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 800,
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 50,
  padding: "13px 15px",
  borderRadius: 14,
  border: "1px solid #d9cfbf",
  background: "#fcfbf8",
  outline: "none",
  fontSize: 14,
};

const selectedFilesStyle: React.CSSProperties = {
  marginTop: 8,
  color: "#6f6559",
  fontSize: 13,
  fontWeight: 700,
};

const primaryButtonStyle: React.CSSProperties = {
  width: "fit-content",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 13,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 13,
  border: "1px solid #d9cfbf",
  background: "#fff",
  color: "#171717",
  fontWeight: 800,
  cursor: "pointer",
};

const errorBoxStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  background: "#fff1f1",
  border: "1px solid #f0c9c9",
  color: "#8d2f2f",
  fontWeight: 700,
};

const successBoxStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  background: "#edf8f1",
  border: "1px solid #cfe7d8",
  color: "#1d6a43",
  fontWeight: 700,
};

const tableCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 22,
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(23,23,23,0.04)",
};

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 14,
  borderBottom: "1px solid #eee6da",
};

const tabButtonStyle: React.CSSProperties = {
  minHeight: 36,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #e1d8cb",
  background: "#f8f5ef",
  color: "#171717",
  fontWeight: 800,
  cursor: "pointer",
};

const searchInputStyle: React.CSSProperties = {
  marginLeft: "auto",
  width: 280,
  minHeight: 38,
  padding: "0 13px",
  borderRadius: 12,
  border: "1px solid #d9cfbf",
  background: "#fff",
  outline: "none",
  fontSize: 14,
};

const countStyle: React.CSSProperties = {
  color: "#6f6559",
  fontWeight: 800,
  fontSize: 13,
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
  padding: "13px 16px",
  fontSize: 13,
  color: "#6f6559",
  background: "#faf8f4",
  borderBottom: "1px solid #eee6da",
  fontWeight: 800,
};

const trStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee6da",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 16px",
  verticalAlign: "middle",
  fontSize: 14,
};

const fileCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 300,
};

const thumbWrapStyle: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 10,
  overflow: "hidden",
  background: "#f8f5ef",
  border: "1px solid #e5dccf",
  flex: "0 0 auto",
};

const thumbStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const thumbEmptyStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  color: "#6f6559",
  fontSize: 10,
  fontWeight: 800,
};

const fileTextWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: 3,
  minWidth: 0,
};

const fileNameStyle: React.CSSProperties = {
  fontWeight: 800,
  color: "#171717",
  maxWidth: 360,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const fileTypeStyle: React.CSSProperties = {
  color: "#6f6559",
  fontSize: 12,
  fontWeight: 700,
};

const mutedTextStyle: React.CSSProperties = {
  color: "#6f6559",
};

const folderBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 28,
  padding: "0 10px",
  borderRadius: 999,
  background: "#f8f5ef",
  border: "1px solid #e5dccf",
  color: "#5f564c",
  fontWeight: 800,
  fontSize: 12,
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const iconButtonStyle: React.CSSProperties = {
  minHeight: 34,
  padding: "0 11px",
  borderRadius: 10,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 12,
};

const iconLinkStyle: React.CSSProperties = {
  minHeight: 34,
  padding: "0 11px",
  borderRadius: 10,
  border: "1px solid #d9cfbf",
  background: "#fff",
  color: "#171717",
  fontWeight: 800,
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const dangerButtonStyle: React.CSSProperties = {
  minHeight: 34,
  padding: "0 11px",
  borderRadius: 10,
  border: "1px solid #e5c9c9",
  background: "#fff5f5",
  color: "#8f2d2d",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 12,
};

const emptyStateStyle: React.CSSProperties = {
  padding: 26,
  color: "#6f6559",
  fontWeight: 700,
};

const uploadDropStyle: React.CSSProperties = {
  minHeight: 58,
  borderRadius: 16,
  border: "1px dashed #cdbfAD",
  background: "#fcfbf8",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 14px",
  cursor: "pointer",
};

const hiddenFileInputStyle: React.CSSProperties = {
  display: "none",
};

const uploadIconStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 12,
  background: "#2f7d62",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  fontWeight: 900,
  fontSize: 22,
  flex: "0 0 auto",
};

const uploadTextWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: 2,
};

const uploadTitleStyle: React.CSSProperties = {
  color: "#171717",
  fontSize: 14,
};

const uploadHintStyle: React.CSSProperties = {
  color: "#6f6559",
  fontSize: 12,
};