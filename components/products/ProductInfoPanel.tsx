"use client";

import { useEffect, useMemo, useState } from "react";

export type VariantItem = {
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
  variant_image?: string;
  image_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type ProductInfoPanelProps = {
  product: {
    title?: string;
    slug?: string;
  };
  variants: VariantItem[];
  onVariantChange?: (variant: VariantItem | null) => void;
};

function normalize(value?: string) {
  return String(value || "").trim();
}

function normalizeLower(value?: string) {
  return normalize(value).toLowerCase();
}

function isMeaningfulValue(value?: string) {
  const normalized = normalizeLower(value);
  return Boolean(normalized) && normalized !== "default";
}

function buildVariantLabel(variant: VariantItem) {
  const values = [
    variant.option1_value,
    variant.option2_value,
    variant.option3_value,
  ]
    .map((item) => normalize(item))
    .filter((item) => item && item.toLowerCase() !== "default");

  return values.length ? values.join(" / ") : "";
}

function isRealVariant(variant: VariantItem) {
  return (
    isMeaningfulValue(variant.option1_value) ||
    isMeaningfulValue(variant.option2_value) ||
    isMeaningfulValue(variant.option3_value)
  );
}

function getActiveVariants(variants: VariantItem[]) {
  return variants
    .filter((variant) =>
      ["", "published", "active"].includes(normalizeLower(variant.status))
    )
    .filter(isRealVariant);
}

export default function ProductInfoPanel({
  product,
  variants,
  onVariantChange,
}: ProductInfoPanelProps) {
  const activeVariants = useMemo(() => getActiveVariants(variants), [variants]);
  const [selectedVariantId, setSelectedVariantId] = useState("");

  const selectedVariant = useMemo(() => {
    if (!activeVariants.length) return null;

    return (
      activeVariants.find((variant) => variant.id === selectedVariantId) ||
      activeVariants[0] ||
      null
    );
  }, [activeVariants, selectedVariantId]);

  useEffect(() => {
    onVariantChange?.(selectedVariant);
  }, [selectedVariant, onVariantChange]);

  const inquiryHref = `/contact-us?product=${encodeURIComponent(
    product.title || "Product"
  )}`;

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 28,
        border: "1px solid #e5ddd2",
        background: "#fff",
        display: "grid",
        gap: 22,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.2,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Product Information
        </div>

        <div
          style={{
            color: "#6f6559",
            lineHeight: 1.75,
            fontSize: 15,
          }}
        >
          This product is presented for catalog and project-based inquiries.
          Contact our team for detailed specifications and availability.
        </div>
      </div>

      {activeVariants.length > 0 ? (
        <div style={{ display: "grid", gap: 14 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#7b7367",
              fontWeight: 800,
            }}
          >
            Available Options
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {activeVariants.map((variant, index) => {
              const label = buildVariantLabel(variant);
              const isSelected = selectedVariant?.id === variant.id;

              return (
                <button
                  key={variant.id || `${label}-${index}`}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id || "")}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: 16,
                    borderRadius: 18,
                    border: isSelected
                      ? "1px solid #2f7d62"
                      : "1px solid #e5ddd2",
                    background: isSelected ? "#eef8f0" : "#faf8f4",
                    cursor: "pointer",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      color: "#171717",
                      fontSize: 15,
                    }}
                  >
                    {label || "Option"}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      color: "#5f564c",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {variant.sku ? (
                      <span>
                        <strong>SKU:</strong> {variant.sku}
                      </span>
                    ) : null}

                    {variant.barcode ? (
                      <span>
                        <strong>Barcode:</strong> {variant.barcode}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 12 }}>
        <a href={inquiryHref} style={primaryLinkStyle}>
          Request Product Information
        </a>

        <a href="/contact-us" style={secondaryLinkStyle}>
          Contact Us
        </a>
      </div>
    </div>
  );
}

const primaryLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  borderRadius: 999,
  border: "1px solid #171717",
  background: "#171717",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 15,
  textDecoration: "none",
};

const secondaryLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  borderRadius: 999,
  border: "1px solid #d8cebf",
  background: "#fff",
  color: "#171717",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 15,
  textDecoration: "none",
};