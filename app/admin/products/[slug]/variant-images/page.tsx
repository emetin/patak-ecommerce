"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { normalizeImageUrl } from "../../../../../lib/image-url";

type ProductImageItem = {
  id?: string;
  product_slug?: string;
  image_url?: string;
  sort_order?: string;
  alt_text?: string;
  is_main?: string;
};

type VariantItem = {
  id?: string;
  product_slug?: string;
  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;
  sku?: string;
  barcode?: string;
  image_id?: string;
  variant_image?: string;
  status?: string;
};

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function buildVariantLabel(item: VariantItem) {
  const values = [item.option1_value, item.option2_value, item.option3_value]
    .map((value) => normalizeText(value))
    .filter((value) => value && value.toLowerCase() !== "default");

  return values.length ? values.join(" / ") : item.sku || "Default Variant";
}

export default function AdminVariantImagesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = use(params);
  const slug = decodeURIComponent(rawSlug).trim().toLowerCase();

  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [savingVariantId, setSavingVariantId] = useState("");

  const imageMap = useMemo(() => {
    const map = new Map<string, ProductImageItem>();

    for (const image of images) {
      const id = normalizeText(image.id);
      if (id) {
        map.set(id, image);
      }
    }

    return map;
  }, [images]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [imagesResponse, variantsResponse] = await Promise.all([
        fetch(`/api/product-images/list?product_slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        }),
        fetch(`/api/variants/list?product_slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        }),
      ]);

      const imagesData = await imagesResponse.json();
      const variantsData = await variantsResponse.json();

      if (!imagesResponse.ok || !imagesData.ok) {
        throw new Error(imagesData?.error || "Failed to load images.");
      }

      if (!variantsResponse.ok || !variantsData.ok) {
        throw new Error(variantsData?.error || "Failed to load variants.");
      }

      setImages(Array.isArray(imagesData.items) ? imagesData.items : []);
      setVariants(Array.isArray(variantsData.items) ? variantsData.items : []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAssignImage(variant: VariantItem, imageId: string) {
    const variantId = normalizeText(variant.id);
    if (!variantId) return;

    const selectedImage = imageMap.get(imageId);

    try {
      setSavingVariantId(variantId);

      const response = await fetch("/api/variants/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: variantId,
          image_id: imageId,
          variant_image: selectedImage?.image_url || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to update variant image.");
      }

      await loadData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update variant image."
      );
    } finally {
      setSavingVariantId("");
    }
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href={`/admin/products/${slug}`} style={backLinkStyle}>
            ← Back to Product
          </Link>
          <h1 style={titleStyle}>Variant Images</h1>
          <p style={subtitleStyle}>
            Connect product gallery images with product variants.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={cardStyle}>Loading...</div>
      ) : errorMessage ? (
        <div style={errorBoxStyle}>{errorMessage}</div>
      ) : variants.length === 0 ? (
        <div style={emptyStateStyle}>No variants found for this product.</div>
      ) : (
        <div style={cardStyle}>
          <div style={listStyle}>
            {variants.map((variant, index) => {
              const selectedImage = imageMap.get(normalizeText(variant.image_id));
              const variantId = normalizeText(variant.id) || String(index);

              return (
                <div key={variantId} style={variantCardStyle}>
                  <div>
                    <div style={variantTitleStyle}>
                      {buildVariantLabel(variant)}
                    </div>
                    <div style={variantMetaStyle}>
                      SKU: {variant.sku || "-"} | Status: {variant.status || "-"}
                    </div>
                  </div>

                  <div style={imagePreviewWrapStyle}>
                    {selectedImage?.image_url ? (
                      <img
                        src={normalizeImageUrl(selectedImage.image_url)}
                        alt={selectedImage.alt_text || "Variant image"}
                        style={imagePreviewStyle}
                      />
                    ) : (
                      <div style={emptyImageStyle}>No Image</div>
                    )}
                  </div>

                  <select
                    value={variant.image_id || ""}
                    onChange={(event) =>
                      handleAssignImage(variant, event.target.value)
                    }
                    disabled={savingVariantId === variant.id}
                    style={selectStyle}
                  >
                    <option value="">No image</option>
                    {images.map((image) => (
                      <option key={image.id} value={image.id || ""}>
                        {image.alt_text || image.id || image.image_url || "Image"}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 10px 30px rgba(23,23,23,0.04)",
};

const errorBoxStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 16,
  background: "#fff1f1",
  border: "1px solid #f0c9c9",
  color: "#8d2f2f",
};

const emptyStateStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 28,
  color: "#6f6559",
  fontWeight: 700,
};

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const variantCardStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 90px 280px",
  gap: 16,
  alignItems: "center",
  border: "1px solid #e8dfd2",
  borderRadius: 18,
  padding: 16,
};

const variantTitleStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 17,
};

const variantMetaStyle: React.CSSProperties = {
  marginTop: 6,
  color: "#6f6559",
  fontSize: 13,
};

const imagePreviewWrapStyle: React.CSSProperties = {
  width: 90,
};

const imagePreviewStyle: React.CSSProperties = {
  width: 90,
  height: 90,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid #e8dfd2",
};

const emptyImageStyle: React.CSSProperties = {
  width: 90,
  height: 90,
  borderRadius: 14,
  border: "1px dashed #d8cdbd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#8c8174",
  fontSize: 12,
  fontWeight: 700,
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 14,
  border: "1px solid #d9cfbf",
  background: "#fcfbf8",
  padding: "0 14px",
  fontSize: 14,
};