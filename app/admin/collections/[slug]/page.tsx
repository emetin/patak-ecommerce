"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CollectionItem = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: string;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
};

export default function AdminCollectionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);

  const [item, setItem] = useState<CollectionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(false);

  async function loadPage() {
    try {
      setLoading(true);
      setPageError("");

      const response = await fetch("/api/collections/list", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to load collection.");
      }

      const found =
        (data.items || []).find(
          (entry: CollectionItem) =>
            String(entry.slug || "").trim().toLowerCase() === slug.toLowerCase()
        ) || null;

      if (!found) {
        throw new Error("Collection not found.");
      }

      setItem(found);
      setTitle(found.title || "");
      setDescription(found.description || "");
      setImage(found.image || "");
      setStatus(found.status || "draft");
      setSeoTitle(found.seo_title || "");
      setSeoDescription(found.seo_description || "");
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, [slug]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    try {
      const response = await fetch("/api/collections/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title,
          description,
          image,
          status,
          seo_title: seoTitle,
          seo_description: seoDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to update collection.");
      }

      setSaveMessage("Collection updated successfully.");
      await loadPage();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collection?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      const response = await fetch("/api/collections/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to delete collection.");
      }

      window.location.href = "/admin/collections";
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return <div style={cardStyle}>Loading...</div>;
  }

  if (pageError || !item) {
    return (
      <div style={errorBoxStyle}>
        <strong>Error:</strong>
        <div style={{ marginTop: 8 }}>{pageError || "Collection not found."}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href="/admin/collections" style={backLinkStyle}>
            ← Back to Collections
          </Link>
          <h1 style={titleStyle}>{item.title || "Collection"}</h1>
          <p style={subtitleStyle}>
            Edit collection details and manage its structure.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link
            href={`/admin/collections/${slug}/products`}
            style={secondaryButtonStyle}
          >
            Products
          </Link>
          <Link href={`/collections/${slug}`} style={secondaryButtonStyle}>
            View
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            style={dangerButtonStyle}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={cardStyle}>
        <div style={formGridStyle}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Slug</label>
            <input value={slug} style={inputStyle} disabled />
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Image URL</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: 180, resize: "vertical" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>SEO Title</label>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>SEO Description</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
            />
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button type="submit" style={primaryButtonStyle} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {saveMessage ? <div style={successBoxStyle}>{saveMessage}</div> : null}
        {saveError ? <div style={errorBoxStyle}>{saveError}</div> : null}
      </form>
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
  fontSize: 40,
  lineHeight: 1.1,
  margin: "10px 0 10px",
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#6f6559",
  fontSize: 16,
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
  boxShadow: "0 10px 30px rgba(23,23,23,0.04)",
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

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 24,
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
  textDecoration: "none",
};

const dangerButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid #e5c9c9",
  background: "#fff5f5",
  color: "#8f2d2d",
  fontWeight: 800,
  cursor: "pointer",
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