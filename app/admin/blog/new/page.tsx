"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ImportPanel from "../../../../components/admin/ImportPanel";

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState("false");

  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultError, setResultError] = useState("");

  const suggestedSlug = useMemo(() => makeSlug(title), [title]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setResultMessage("");
    setResultError("");

    try {
      const response = await fetch("/api/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          image,
          status,
          featured,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to create the blog post.");
      }

      setResultMessage("Blog post created successfully.");

      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setImage("");
      setStatus("draft");
      setFeatured("false");
    } catch (error) {
      setResultError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href="/admin/blog" style={backLinkStyle}>
            ← Back to Blog
          </Link>
          <h1 style={titleStyle}>New Blog Post</h1>
          <p style={subtitleStyle}>
            Create a single article or upload a CSV/JSON file for bulk import.
          </p>
        </div>

        <div style={headerActionsStyle}>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.9fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <form onSubmit={handleSubmit} style={cardStyle}>
          <div style={sectionTitleWrapStyle}>
            <h2 style={sectionTitleStyle}>Create Blog Post Manually</h2>
          </div>

          <div style={formGridStyle}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Hotel Linen Buying Guide"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="hotel-linen-buying-guide"
                style={inputStyle}
              />
              <div style={helperTextStyle}>
                Suggested slug: <strong>{suggestedSlug || "-"}</strong>
              </div>
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

            <div>
              <label style={labelStyle}>Image URL</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary"
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full blog content"
                style={{ ...inputStyle, minHeight: 280, resize: "vertical" }}
              />
            </div>
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButtonStyle} disabled={loading}>
              {loading ? "Saving..." : "Create Blog Post"}
            </button>

            <Link href="/admin/blog" style={secondaryButtonStyle}>
              Back to Blog
            </Link>
          </div>

          {resultMessage ? <div style={successBoxStyle}>{resultMessage}</div> : null}
          {resultError ? <div style={errorBoxStyle}>{resultError}</div> : null}
        </form>

        <ImportPanel
          endpoint="/api/blog/import"
          description="Upload a CSV or JSON file, or paste content manually. This panel is suitable for blog content adapted to the Patak structure."
          csvHeader="id,title,slug,excerpt,content,image,status,featured,created_at,updated_at"
        />
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

const titleStyle: React.CSSProperties = {
  fontSize: 42,
  lineHeight: 1.1,
  margin: "10px 0 10px",
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#6f6559",
  fontSize: 16,
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-block",
  textDecoration: "none",
  color: "#5e5448",
  fontWeight: 700,
  marginBottom: 4,
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

const sectionTitleWrapStyle: React.CSSProperties = {
  marginBottom: 18,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
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

const helperTextStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  color: "#7d7266",
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