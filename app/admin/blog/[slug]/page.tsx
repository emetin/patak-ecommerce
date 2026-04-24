"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type BlogItem = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  status?: string;
  featured?: string;
  created_at?: string;
  updated_at?: string;
};

function makeSlug(text: string) {
  return String(text || "")
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

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

export default function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug: rawSlug } = use(params);
  const originalSlug = decodeURIComponent(rawSlug).trim().toLowerCase();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState("false");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultError, setResultError] = useState("");

  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const suggestedSlug = useMemo(() => makeSlug(title), [title]);

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/api/blog/list", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data?.error || "Failed to load blog posts.");
        }

        const item = (data.items as BlogItem[]).find(
          (post) =>
            String(post.slug || "").trim().toLowerCase() === originalSlug
        );

        if (!item) {
          throw new Error("Blog post was not found.");
        }

        setTitle(item.title || "");
        setSlug(item.slug || "");
        setExcerpt(item.excerpt || "");
        setContent(item.content || "");
        setImage(item.image || "");
        setStatus(String(item.status || "draft").toLowerCase());
        setFeatured(String(item.featured || "false").toLowerCase());
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [originalSlug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      setResultMessage("");
      setResultError("");

      const response = await fetch("/api/blog/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalSlug,
          title: normalizeText(title),
          slug: normalizeText(slug),
          excerpt: normalizeText(excerpt),
          content: normalizeText(content),
          image: normalizeText(image),
          status: normalizeText(status).toLowerCase(),
          featured: normalizeText(featured).toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to update the blog post.");
      }

      const updatedSlug = String(data?.item?.slug || slug || originalSlug)
        .trim()
        .toLowerCase();

      setResultMessage("Blog post updated successfully.");

      if (updatedSlug && updatedSlug !== originalSlug) {
        router.replace(`/admin/blog/${updatedSlug}`);
      }
    } catch (error) {
      setResultError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setResultMessage("");
      setResultError("");

      const response = await fetch("/api/blog/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: originalSlug,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to delete the blog post.");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      setResultError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImageUploadError("");
    setImageUploading(true);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file.");
      }

      const maxSizeMb = 10;

      if (file.size > maxSizeMb * 1024 * 1024) {
        throw new Error(`Image must be smaller than ${maxSizeMb}MB.`);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.ok || !data.url) {
        throw new Error(data?.error || "Image upload failed.");
      }

      setImage(data.url);
    } catch (error) {
      setImageUploadError(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setImageUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function clearImage() {
    setImage("");
    setImageUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  if (loading) {
    return <div style={cardStyle}>Loading...</div>;
  }

  if (loadError) {
    return (
      <div style={cardStyle}>
        <Link href="/admin/blog" style={secondaryButtonStyle}>
          ← Blog Admin
        </Link>

        <div style={errorBoxStyle}>
          <strong>Error</strong>
          <div style={{ marginTop: 8 }}>{loadError}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href="/admin/blog" style={backLinkStyle}>
            ← Back to Blog
          </Link>

          <h1 style={titleStyle}>Edit Blog Post</h1>

          <p style={subtitleStyle}>
            Update blog content, image, publication status, and featured state.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href={`/blog/${slug}`} style={secondaryButtonStyle}>
            View
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            style={dangerButtonStyle}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Blog Post"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
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
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              style={inputStyle}
              placeholder={suggestedSlug || "blog-post-slug"}
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

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Blog Image</label>

            <div style={imageToolsWrapStyle}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={fileInputStyle}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={secondaryButtonStyle}
                disabled={imageUploading}
              >
                {imageUploading ? "Uploading..." : "Upload Image"}
              </button>

              {image ? (
                <button
                  type="button"
                  onClick={clearImage}
                  style={dangerSmallButtonStyle}
                >
                  Remove Image
                </button>
              ) : null}
            </div>

            {imageUploadError ? (
              <div style={errorInlineStyle}>{imageUploadError}</div>
            ) : null}

            {image ? (
              <div style={imagePreviewCardStyle}>
                <img
                  src={image}
                  alt={title || "Blog image"}
                  style={imagePreviewStyle}
                />
              </div>
            ) : (
              <div style={emptyImageBoxStyle}>No image selected.</div>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Image URL / Stored Value</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={inputStyle}
              placeholder="/uploads/blog/image.jpg"
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ ...inputStyle, minHeight: 260, resize: "vertical" }}
            />
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button type="submit" style={primaryButtonStyle} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {resultMessage ? (
          <div style={successBoxStyle}>{resultMessage}</div>
        ) : null}

        {resultError ? <div style={errorBoxStyle}>{resultError}</div> : null}
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

const helperTextStyle: React.CSSProperties = {
  marginTop: 8,
  color: "#6d655b",
  fontSize: 14,
};

const imageToolsWrapStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
  marginBottom: 14,
};

const fileInputStyle: React.CSSProperties = {
  display: "none",
};

const imagePreviewCardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 320,
  borderRadius: 20,
  overflow: "hidden",
  border: "1px solid #e5ddd2",
  background: "#faf8f4",
  marginTop: 6,
};

const imagePreviewStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  display: "block",
};

const emptyImageBoxStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 320,
  minHeight: 180,
  borderRadius: 20,
  border: "1px dashed #d9cfbf",
  background: "#faf8f4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#7b7367",
  fontWeight: 700,
  marginTop: 6,
  padding: 16,
  textAlign: "center",
};

const errorInlineStyle: React.CSSProperties = {
  marginBottom: 12,
  padding: 12,
  borderRadius: 12,
  background: "#fff1f1",
  border: "1px solid #efc9c9",
  color: "#7a2222",
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
  cursor: "pointer",
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

const dangerSmallButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #e5c9c9",
  background: "#fff5f5",
  color: "#8f2d2d",
  fontWeight: 700,
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