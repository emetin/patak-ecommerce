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

export default function NewProductPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [image, setImage] = useState("");
  const [gallery, setGallery] = useState("");
  const [collectionSlug, setCollectionSlug] = useState("");
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
      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          short_description: shortDescription,
          image,
          gallery,
          collection_slug: collectionSlug,
          status,
          featured,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Ürün eklenemedi.");
      }

      setResultMessage("Ürün başarıyla eklendi.");

      setTitle("");
      setSlug("");
      setDescription("");
      setShortDescription("");
      setImage("");
      setGallery("");
      setCollectionSlug("");
      setStatus("draft");
      setFeatured("false");
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
        <Link href="/admin/products" className="btn-secondary" style={{ marginBottom: 20 }}>
          ← Products Admin
        </Link>

        <h1>New Product</h1>
        <p className="lead">
          Buradan Google Sheets tabanlı sistem için yeni ürün ekleyebilirsin.
          İlk sürümde sade ama çalışan bir yapı kuruyoruz.
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
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Luxury Hotel Towel Set"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Slug
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="luxury-hotel-towel-set"
                style={inputStyle}
              />
              <div style={{ marginTop: 6, color: "#6d655b", fontSize: 14 }}>
                Önerilen slug: <strong>{suggestedSlug || "-"}</strong>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Collection Slug
              </label>
              <input
                value={collectionSlug}
                onChange={(e) => setCollectionSlug(e.target.value)}
                placeholder="towels"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Status
              </label>
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
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Featured
              </label>
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
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Image URL
              </label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Gallery
              </label>
              <textarea
                value={gallery}
                onChange={(e) => setGallery(e.target.value)}
                placeholder="İleride çoklu görsel için virgülle ayrılmış url veya json kullanılabilir."
                style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Short Description
              </label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Kısa ürün özeti"
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uzun açıklama"
                style={{ ...inputStyle, minHeight: 180, resize: "vertical" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Create Product"}
            </button>

            <Link href="/admin/products" className="btn-secondary">
              Back to Products
            </Link>
          </div>

          {resultMessage ? (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                background: "#eef8f0",
                border: "1px solid #cfe5d4",
              }}
            >
              {resultMessage}
            </div>
          ) : null}

          {resultError ? (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                background: "#fff1f1",
                border: "1px solid #efc9c9",
                color: "#7a2222",
              }}
            >
              {resultError}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #ddd3c5",
  background: "#fff",
  outline: "none",
};