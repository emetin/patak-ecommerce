"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
    <div className="simple-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link
          href="/admin/blog"
          className="btn-secondary"
          style={{ marginBottom: 20 }}
        >
          ← Blog Admin
        </Link>

        <h1>New Blog Post</h1>
        <p className="lead">
          Create a new blog post record for the Sheets-based content system.
        </p>

        <form onSubmit={handleSubmit} className="data-box">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="How Premium Hotel Textiles Improve Guest Experience"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="how-premium-hotel-textiles-improve-guest-experience"
                style={inputStyle}
              />
              <div style={{ marginTop: 6, color: "#6d655b", fontSize: 14 }}>
                Suggested slug: <strong>{suggestedSlug || "-"}</strong>
              </div>
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

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short post summary"
                style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full blog content"
                style={{ ...inputStyle, minHeight: 220, resize: "vertical" }}
              />
            </div>
          </div>

          <div
            style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}
          >
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Create Blog Post"}
            </button>

            <Link href="/admin/blog" className="btn-secondary">
              Back to Blog
            </Link>
          </div>

          {resultMessage ? <div style={successBoxStyle}>{resultMessage}</div> : null}
          {resultError ? <div style={errorBoxStyle}>{resultError}</div> : null}
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #ddd3c5",
  background: "#fff",
  outline: "none",
};

const successBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 14,
  background: "#eef8f0",
  border: "1px solid #cfe5d4",
};

const errorBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 14,
  background: "#fff1f1",
  border: "1px solid #efc9c9",
  color: "#7a2222",
};