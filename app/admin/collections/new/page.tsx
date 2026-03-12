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
    .replace(/-+/g, "-");
}

export default function NewCollectionPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("draft");

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
      const response = await fetch("/api/collections/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          image,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Collection eklenemedi.");
      }

      setResultMessage("Collection başarıyla eklendi.");

      setTitle("");
      setSlug("");
      setDescription("");
      setImage("");
      setStatus("draft");
    } catch (error) {
      setResultError(
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="simple-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link
          href="/admin/collections"
          className="btn-secondary"
          style={{ marginBottom: 20 }}
        >
          ← Collections Admin
        </Link>

        <h1>New Collection</h1>
        <p className="lead">
          Buradan yeni koleksiyon ekleyebilirsin. Koleksiyonlar ürünlerin daha
          düzenli ve premium görünmesini sağlar.
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
                placeholder="Bedding Collection"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="bedding"
                style={inputStyle}
              />
              <div style={{ marginTop: 6, color: "#6d655b", fontSize: 14 }}>
                Önerilen slug: <strong>{suggestedSlug || "-"}</strong>
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

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Image URL</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Koleksiyon açıklaması"
                style={{ ...inputStyle, minHeight: 180, resize: "vertical" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Create Collection"}
            </button>

            <Link href="/admin/collections" className="btn-secondary">
              Back to Collections
            </Link>
          </div>

          {resultMessage ? (
            <div style={successBoxStyle}>{resultMessage}</div>
          ) : null}

          {resultError ? (
            <div style={errorBoxStyle}>{resultError}</div>
          ) : null}
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