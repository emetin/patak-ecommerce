"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { normalizeImageUrl } from "../../../../lib/image-url";

type ProductItem = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  image?: string;
  gallery?: string;
  collection_slug?: string;
  status?: string;
  featured?: string;
  seo_title?: string;
  seo_description?: string;
  vendor?: string;
  product_category?: string;
  type?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  updated_at?: string;
};

type ProductImageItem = {
  id?: string;
  product_slug?: string;
  image_url?: string;
  sort_order?: string;
  alt_text?: string;
  is_main?: string;
  created_at?: string;
  updated_at?: string;
};

function normalizeText(value?: string) {
  return String(value || "").trim();
}

function normalizeLower(value?: string) {
  return normalizeText(value).toLowerCase();
}

function isTrue(value?: string) {
  return normalizeLower(value) === "true";
}

function isDefaultValue(value?: string) {
  const normalized = normalizeLower(value);
  return !normalized || normalized === "default";
}

function isRealVariant(item: VariantItem) {
  return (
    !isDefaultValue(item.option1_value) ||
    !isDefaultValue(item.option2_value) ||
    !isDefaultValue(item.option3_value)
  );
}

function buildVariantLabel(item: VariantItem) {
  const values = [item.option1_value, item.option2_value, item.option3_value]
    .map((value) => normalizeText(value))
    .filter((value) => value && value.toLowerCase() !== "default");

  return values.length ? values.join(" / ") : "Default";
}

function toSafeOrder(value?: string) {
  const num = Number(normalizeText(value));
  return Number.isFinite(num) ? num : 999999;
}

function sortImages(images: ProductImageItem[]) {
  return [...images].sort((a, b) => {
    const aMain = isTrue(a.is_main);
    const bMain = isTrue(b.is_main);

    if (aMain !== bMain) {
      return aMain ? -1 : 1;
    }

    return toSafeOrder(a.sort_order) - toSafeOrder(b.sort_order);
  });
}

function makeEditableVariant(item?: VariantItem): VariantItem {
  return {
    id: item?.id || "",
    product_slug: item?.product_slug || "",
    option1_name: item?.option1_name || "Size",
    option1_value: item?.option1_value || "",
    option2_name: item?.option2_name || "",
    option2_value: item?.option2_value || "",
    option3_name: item?.option3_name || "",
    option3_value: item?.option3_value || "",
    sku: item?.sku || "",
    barcode: item?.barcode || "",
    image_id: item?.image_id || "",
    variant_image: item?.variant_image || "",
    status: item?.status || "published",
  };
}

export default function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = use(params);
  const slug = decodeURIComponent(rawSlug).trim().toLowerCase();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [productImages, setProductImages] = useState<ProductImageItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [image, setImage] = useState("");
  const [gallery, setGallery] = useState("");
  const [collectionSlug, setCollectionSlug] = useState("");
  const [statusValue, setStatusValue] = useState("draft");
  const [featured, setFeatured] = useState("false");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [tags, setTags] = useState("");

  const [productSaving, setProductSaving] = useState(false);
  const [productSaveMessage, setProductSaveMessage] = useState("");
  const [productSaveError, setProductSaveError] = useState("");
  const [productDeleteLoading, setProductDeleteLoading] = useState(false);

  const [option1Name, setOption1Name] = useState("Size");
  const [option1Value, setOption1Value] = useState("");
  const [option2Name, setOption2Name] = useState("");
  const [option2Value, setOption2Value] = useState("");
  const [option3Name, setOption3Name] = useState("");
  const [option3Value, setOption3Value] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [variantStatus, setVariantStatus] = useState("published");

  const [variantSaving, setVariantSaving] = useState(false);
  const [variantSaveMessage, setVariantSaveMessage] = useState("");
  const [variantSaveError, setVariantSaveError] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState("");

  const [editingVariantId, setEditingVariantId] = useState("");
  const [editingVariant, setEditingVariant] = useState<VariantItem>(
    makeEditableVariant()
  );
  const [variantUpdateLoadingId, setVariantUpdateLoadingId] = useState("");

  const productLoadedSlugRef = useRef("");
  const variantsLoadedSlugRef = useRef("");
  const imagesLoadedSlugRef = useRef("");

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await fetch(
        `/api/products/get?slug=${encodeURIComponent(slug)}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to load product.");
      }

      const foundProduct = data.item || null;

      if (!foundProduct) {
        throw new Error("Product not found.");
      }

      setProduct(foundProduct);
      setTitle(foundProduct.title || "");
      setDescription(foundProduct.description || "");
      setShortDescription(foundProduct.short_description || "");
      setImage(foundProduct.image || "");
      setGallery(foundProduct.gallery || "");
      setCollectionSlug(foundProduct.collection_slug || "");
      setStatusValue(foundProduct.status || "draft");
      setFeatured(foundProduct.featured || "false");
      setSeoTitle(foundProduct.seo_title || "");
      setSeoDescription(foundProduct.seo_description || "");
      setVendor(foundProduct.vendor || "");
      setProductCategory(foundProduct.product_category || "");
      setTypeValue(foundProduct.type || "");
      setTags(foundProduct.tags || "");
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const loadVariants = useCallback(async () => {
    try {
      setVariantsLoading(true);

      const response = await fetch(
        `/api/variants/list?product_slug=${encodeURIComponent(slug)}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to load variants.");
      }

      const items = Array.isArray(data.items) ? data.items : [];
      setVariants(items.filter((item: VariantItem) => isRealVariant(item)));
    } catch {
      setVariants([]);
    } finally {
      setVariantsLoading(false);
    }
  }, [slug]);

  const loadImages = useCallback(async () => {
    try {
      setImagesLoading(true);

      const response = await fetch(
        `/api/product-images/list?product_slug=${encodeURIComponent(slug)}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to load product images.");
      }

      setProductImages(Array.isArray(data.items) ? data.items : []);
    } catch {
      setProductImages([]);
    } finally {
      setImagesLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    if (productLoadedSlugRef.current === slug) return;

    productLoadedSlugRef.current = slug;
    loadProduct();
  }, [slug, loadProduct]);

  useEffect(() => {
    if (!slug) return;
    if (variantsLoadedSlugRef.current === slug) return;

    variantsLoadedSlugRef.current = slug;
    loadVariants();
  }, [slug, loadVariants]);

  useEffect(() => {
    if (!slug) return;
    if (imagesLoadedSlugRef.current === slug) return;

    imagesLoadedSlugRef.current = slug;
    loadImages();
  }, [slug, loadImages]);

  const sortedImages = useMemo(() => sortImages(productImages), [productImages]);

  const mainImage = useMemo(() => {
    return (
      sortedImages.find((item) => isTrue(item.is_main)) ||
      sortedImages[0] ||
      null
    );
  }, [sortedImages]);

  const currentPrimaryImageUrl = useMemo(() => {
    return normalizeImageUrl(mainImage?.image_url || image || "");
  }, [mainImage, image]);

  const galleryStats = useMemo(() => {
    const imageCount = sortedImages.length;
    const mainImageExists = Boolean(
      sortedImages.find((item) => isTrue(item.is_main))
    );
    const altTextCount = sortedImages.filter((item) =>
      normalizeText(item.alt_text)
    ).length;

    let score = 0;

    if (imageCount > 0) score += 35;
    if (mainImageExists) score += 35;
    if (imageCount >= 3) score += 15;
    if (imageCount > 0 && altTextCount === imageCount) score += 15;

    return {
      imageCount,
      mainImageExists,
      altTextCount,
      score,
    };
  }, [sortedImages]);

  const variantPreview = useMemo(() => {
    const values = [option1Value, option2Value, option3Value]
      .map((value) => normalizeText(value))
      .filter((value) => value && value.toLowerCase() !== "default");

    return values.length ? values.join(" / ") : "No real option selected";
  }, [option1Value, option2Value, option3Value]);

  async function handleProductSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setProductSaving(true);
    setProductSaveMessage("");
    setProductSaveError("");

    try {
      const response = await fetch("/api/products/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title,
          description,
          short_description: shortDescription,
          image,
          gallery,
          collection_slug: collectionSlug,
          status: statusValue,
          featured,
          seo_title: seoTitle,
          seo_description: seoDescription,
          vendor,
          product_category: productCategory,
          type: typeValue,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to update product.");
      }

      setProductSaveMessage("Product updated successfully.");
      await loadProduct();
      await loadImages();
    } catch (error) {
      setProductSaveError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setProductSaving(false);
    }
  }

  async function handleDeleteProduct() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product and all related records?"
    );

    if (!confirmed) return;

    try {
      setProductDeleteLoading(true);

      const response = await fetch("/api/products/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to delete product.");
      }

      window.location.href = "/admin/products";
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setProductDeleteLoading(false);
    }
  }

  async function handleCreateVariant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setVariantSaving(true);
    setVariantSaveMessage("");
    setVariantSaveError("");

    try {
      const response = await fetch("/api/variants/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_slug: slug,
          option1_name: option1Name,
          option1_value: option1Value,
          option2_name: option2Name,
          option2_value: option2Value,
          option3_name: option3Name,
          option3_value: option3Value,
          sku,
          barcode,
          image_id: "",
          variant_image: "",
          status: variantStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to create variant.");
      }

      setVariantSaveMessage("Variant created successfully.");

      setOption1Name("Size");
      setOption1Value("");
      setOption2Name("");
      setOption2Value("");
      setOption3Name("");
      setOption3Value("");
      setSku("");
      setBarcode("");
      setVariantStatus("published");

      await loadVariants();
    } catch (error) {
      setVariantSaveError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setVariantSaving(false);
    }
  }

  async function handleDeleteVariant(id?: string) {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this variant?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(id);

      const response = await fetch("/api/variants/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to delete variant.");
      }

      if (editingVariantId === id) {
        cancelVariantEdit();
      }

      await loadVariants();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setDeleteLoadingId("");
    }
  }

  function startVariantEdit(item: VariantItem) {
    setEditingVariantId(item.id || "");
    setEditingVariant(makeEditableVariant(item));
    setVariantSaveMessage("");
    setVariantSaveError("");
  }

  function cancelVariantEdit() {
    setEditingVariantId("");
    setEditingVariant(makeEditableVariant());
  }

  function updateEditingVariant(patch: Partial<VariantItem>) {
    setEditingVariant((prev) => ({
      ...prev,
      ...patch,
    }));
  }

  async function handleUpdateVariant(id?: string) {
    if (!id) return;

    setVariantUpdateLoadingId(id);
    setVariantSaveMessage("");
    setVariantSaveError("");

    try {
      const response = await fetch("/api/variants/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          option1_name: editingVariant.option1_name,
          option1_value: editingVariant.option1_value,
          option2_name: editingVariant.option2_name,
          option2_value: editingVariant.option2_value,
          option3_name: editingVariant.option3_name,
          option3_value: editingVariant.option3_value,
          sku: editingVariant.sku,
          barcode: editingVariant.barcode,
          image_id: editingVariant.image_id,
          variant_image: editingVariant.variant_image,
          status: editingVariant.status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to update variant.");
      }

      setVariantSaveMessage("Variant updated successfully.");
      cancelVariantEdit();
      await loadVariants();
    } catch (error) {
      setVariantSaveError(
        error instanceof Error ? error.message : "Failed to update variant."
      );
    } finally {
      setVariantUpdateLoadingId("");
    }
  }

  if (loading) {
    return <div style={cardStyle}>Loading...</div>;
  }

  if (pageError || !product) {
    return (
      <div style={errorBoxStyle}>
        <strong>Error:</strong>
        <div style={{ marginTop: 8 }}>{pageError || "Product not found."}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href="/admin/products" style={backLinkStyle}>
            ← Back to Products
          </Link>

          <h1 style={titleStyle}>{product.title || "Product"}</h1>

          <p style={subtitleStyle}>
            Edit product content, catalog details, images, and informational
            variants.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href={`/products/${product.slug}`} style={secondaryButtonStyle}>
            View Product
          </Link>

          <Link
            href={`/admin/products/${slug}/images`}
            style={primaryButtonStyle}
          >
            Image Manager
          </Link>

          <Link
            href={`/admin/products/${slug}/variant-images`}
            style={secondaryButtonStyle}
          >
            Variant Images
          </Link>

          <Link href="/admin/products/new" style={secondaryButtonStyle}>
            + New Product
          </Link>

          <button
            type="button"
            onClick={handleDeleteProduct}
            style={dangerButtonStyle}
            disabled={productDeleteLoading}
          >
            {productDeleteLoading ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>

      <div style={summaryGridStyle}>
        <SummaryCard label="Slug" value={product.slug || "-"} />
        <SummaryCard label="Collection" value={product.collection_slug || "-"} />
        <SummaryCard label="Status" value={product.status || "-"} />
        <SummaryCard
          label="Variants"
          value={variantsLoading ? "..." : String(variants.length)}
        />
      </div>

      <div style={galleryOverviewGridStyle}>
        <div style={cardStyle}>
          <div style={sectionTitleWrapStyle}>
            <h2 style={sectionTitleStyle}>Gallery Progress</h2>
            <p style={sectionTextStyle}>
              Product images are managed from Image Manager. The main image is
              synced automatically to the product image field.
            </p>
          </div>

          <div style={galleryProgressTopStyle}>
            <div style={progressRingWrapStyle}>
              <div style={progressRingStyle}>
                <span style={progressValueStyle}>{galleryStats.score}%</span>
              </div>
            </div>

            <div style={{ display: "grid", gap: 12, flex: 1 }}>
              <ProgressRow
                label="Images Added"
                value={`${galleryStats.imageCount}`}
                ok={galleryStats.imageCount > 0}
              />

              <ProgressRow
                label="Main Image Selected"
                value={galleryStats.mainImageExists ? "Yes" : "No"}
                ok={galleryStats.mainImageExists}
              />

              <ProgressRow
                label="Alt Text Coverage"
                value={`${galleryStats.altTextCount}/${galleryStats.imageCount || 0}`}
                ok={
                  galleryStats.imageCount > 0 &&
                  galleryStats.altTextCount === galleryStats.imageCount
                }
              />

              <ProgressRow
                label="Recommended Gallery Size"
                value={galleryStats.imageCount >= 3 ? "Reached" : "Need 3+"}
                ok={galleryStats.imageCount >= 3}
              />
            </div>
          </div>

          <div style={noticeBoxStyle}>
            For a clean CMS structure, gallery editing should be done from Image
            Manager instead of the product sheet fields.
          </div>

          <div style={buttonRowStyle}>
            <Link
              href={`/admin/products/${slug}/images`}
              style={primaryButtonStyle}
            >
              Manage Gallery Images
            </Link>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleWrapStyle}>
            <h2 style={sectionTitleStyle}>Current Main Image</h2>
            <p style={sectionTextStyle}>
              This is the image used in product cards and detail pages.
            </p>
          </div>

          {imagesLoading ? (
            <div style={emptyStateStyle}>Loading gallery preview...</div>
          ) : currentPrimaryImageUrl ? (
            <div style={mainPreviewWrapStyle}>
              <img
                src={currentPrimaryImageUrl}
                alt={product.title || "Product image"}
                style={mainPreviewImageStyle}
              />

              <div style={mainPreviewMetaStyle}>
                <div style={summaryLabelStyle}>Source</div>
                <div style={mainPreviewValueStyle}>
                  {mainImage?.image_url
                    ? "Image Manager"
                    : "Product image field"}
                </div>

                <div style={{ marginTop: 10 }}>
                  <Link
                    href={`/admin/products/${slug}/images`}
                    style={secondaryButtonStyle}
                  >
                    Edit Gallery
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div style={emptyStateStyle}>
              No image selected yet. Add images from Image Manager.
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleProductSave} style={cardStyle}>
        <div style={sectionTitleWrapStyle}>
          <h2 style={sectionTitleStyle}>Product Details</h2>
          <p style={sectionTextStyle}>
            Update the product information stored in the products sheet.
          </p>
        </div>

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
            <label style={labelStyle}>Collection Slug</label>
            <input
              value={collectionSlug}
              onChange={(e) => setCollectionSlug(e.target.value)}
              placeholder="towels"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
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
            <label style={labelStyle}>Vendor</label>
            <input
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Patak Textile"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Product Category</label>
            <input
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              placeholder="Bath"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Type</label>
            <input
              value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
              placeholder="Towel"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="hotel, luxury, bath"
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Primary Image Field</label>
            <input
              value={image}
              readOnly
              placeholder="Synced by Image Manager"
              style={{
                ...inputStyle,
                background: "#f5f1ea",
                color: "#7a7267",
                cursor: "not-allowed",
              }}
            />

            <div style={helperTextStyle}>
              This field is synced automatically from Image Manager and kept for
              compatibility.
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Legacy Gallery Field</label>
            <textarea
              value={gallery}
              readOnly
              placeholder="Legacy comma-separated image URLs"
              style={{
                ...inputStyle,
                minHeight: 110,
                resize: "vertical",
                background: "#f5f1ea",
                color: "#7a7267",
                cursor: "not-allowed",
              }}
            />

            <div style={helperTextStyle}>
              Legacy field only. Gallery should be managed from Image Manager.
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Short Description</label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Short summary"
              style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full product description"
              style={{ ...inputStyle, minHeight: 220, resize: "vertical" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>SEO Title</label>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="SEO title"
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>SEO Description</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="SEO description"
              style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
            />
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button
            type="submit"
            style={primaryButtonStyle}
            disabled={productSaving}
          >
            {productSaving ? "Saving..." : "Save Product"}
          </button>
        </div>

        {productSaveMessage ? (
          <div style={successBoxStyle}>{productSaveMessage}</div>
        ) : null}

        {productSaveError ? (
          <div style={errorBoxStyle}>{productSaveError}</div>
        ) : null}
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1.15fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <form onSubmit={handleCreateVariant} style={cardStyle}>
          <div style={sectionTitleWrapStyle}>
            <h2 style={sectionTitleStyle}>Add Informational Variant</h2>
            <p style={sectionTextStyle}>
              Add only real product options such as size, color, or pack.
              Default variants are blocked.
            </p>
          </div>

          <div style={formGridStyle}>
            <div>
              <label style={labelStyle}>Option 1 Name</label>
              <input
                value={option1Name}
                onChange={(e) => setOption1Name(e.target.value)}
                placeholder="Size"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Option 1 Value</label>
              <input
                value={option1Value}
                onChange={(e) => setOption1Value(e.target.value)}
                placeholder="Queen"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Option 2 Name</label>
              <input
                value={option2Name}
                onChange={(e) => setOption2Name(e.target.value)}
                placeholder="Color"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Option 2 Value</label>
              <input
                value={option2Value}
                onChange={(e) => setOption2Value(e.target.value)}
                placeholder="White"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Option 3 Name</label>
              <input
                value={option3Name}
                onChange={(e) => setOption3Name(e.target.value)}
                placeholder="Pack"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Option 3 Value</label>
              <input
                value={option3Value}
                onChange={(e) => setOption3Value(e.target.value)}
                placeholder="Set of 2"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>SKU</label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="PTX-SKU-001"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Barcode</label>
              <input
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="123456789"
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Variant Status</label>
              <select
                value={variantStatus}
                onChange={(e) => setVariantStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </div>

          <div style={variantPreviewBoxStyle}>
            Preview: <strong>{variantPreview}</strong>
          </div>

          <div style={buttonRowStyle}>
            <button
              type="submit"
              style={primaryButtonStyle}
              disabled={variantSaving}
            >
              {variantSaving ? "Creating..." : "Add Variant"}
            </button>
          </div>

          {variantSaveMessage ? (
            <div style={successBoxStyle}>{variantSaveMessage}</div>
          ) : null}

          {variantSaveError ? (
            <div style={errorBoxStyle}>{variantSaveError}</div>
          ) : null}
        </form>

        <div style={cardStyle}>
          <div style={sectionTitleWrapStyle}>
            <h2 style={sectionTitleStyle}>Existing Variants</h2>
            <p style={sectionTextStyle}>
              These variants are informational only. They do not include pricing,
              stock, shipping, or checkout data.
            </p>
          </div>

          {variantsLoading ? (
            <div style={emptyStateStyle}>Loading variants...</div>
          ) : variants.length === 0 ? (
            <div style={emptyStateStyle}>
              No real variants added yet. Products without options can stay
              empty.
            </div>
          ) : (
            <div style={variantListStyle}>
              {variants.map((item) => {
                const isEditing = editingVariantId === item.id;

                return (
                  <div key={item.id} style={variantCardStyle}>
                    {isEditing ? (
                      <div style={{ display: "grid", gap: 12, flex: 1 }}>
                        <div style={formGridStyle}>
                          <div>
                            <label style={labelStyle}>Option 1 Name</label>
                            <input
                              value={editingVariant.option1_name || ""}
                              onChange={(e) =>
                                updateEditingVariant({
                                  option1_name: e.target.value,
                                })
                              }
                              style={inputStyle}
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>Option 1 Value</label>
                            <input
                              value={editingVariant.option1_value || ""}
                              onChange={(e) =>
                                updateEditingVariant({
                                  option1_value: e.target.value,
                                })
                              }
                              style={inputStyle}
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>Option 2 Name</label>
                            <input
                              value={editingVariant.option2_name || ""}
                              onChange={(e) =>
                                updateEditingVariant({
                                  option2_name: e.target.value,
                                })
                              }
                              style={inputStyle}
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>Option 2 Value</label>
                            <input
                              value={editingVariant.option2_value || ""}
                              onChange={(e) =>
                                updateEditingVariant({
                                  option2_value: e.target.value,
                                })
                              }
                              style={inputStyle}
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>Option 3 Name</label>
                            <input
                              value={editingVariant.option3_name || ""}
                              onChange={(e) =>
                                updateEditingVariant({
                                  option3_name: e.target.value,
                                })
                              }
                              style={inputStyle}
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>Option 3 Value</label>
                            <input
                              value={editingVariant.option3_value || ""}
                              onChange={(e) =>
                                updateEditingVariant({
                                  option3_value: e.target.value,
                                })
                              }
                              style={inputStyle}
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>SKU</label>
                            <input
                              value={editingVariant.sku || ""}
                              onChange={(e) =>
                                updateEditingVariant({ sku: e.target.value })
                              }
                              style={inputStyle}
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>Barcode</label>
                            <input
                              value={editingVariant.barcode || ""}
                              onChange={(e) =>
                                updateEditingVariant({
                                  barcode: e.target.value,
                                })
                              }
                              style={inputStyle}
                            />
                          </div>

                          <div style={{ gridColumn: "1 / -1" }}>
                            <label style={labelStyle}>Status</label>
                            <select
                              value={editingVariant.status || "published"}
                              onChange={(e) =>
                                updateEditingVariant({
                                  status: e.target.value,
                                })
                              }
                              style={inputStyle}
                            >
                              <option value="published">published</option>
                              <option value="draft">draft</option>
                              <option value="archived">archived</option>
                            </select>
                          </div>
                        </div>

                        <div style={buttonRowStyle}>
                          <button
                            type="button"
                            onClick={() => handleUpdateVariant(item.id)}
                            style={primaryButtonStyle}
                            disabled={variantUpdateLoadingId === item.id}
                          >
                            {variantUpdateLoadingId === item.id
                              ? "Saving..."
                              : "Save Variant"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelVariantEdit}
                            style={secondaryButtonStyle}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div style={variantTitleStyle}>
                            {buildVariantLabel(item)}
                          </div>

                          <div style={variantMetaGridStyle}>
                            <VariantMeta label="SKU" value={item.sku || "-"} />
                            <VariantMeta
                              label="Barcode"
                              value={item.barcode || "-"}
                            />
                            <VariantMeta
                              label="Status"
                              value={item.status || "-"}
                            />
                          </div>
                        </div>

                        <div style={variantActionsStyle}>
                          <button
                            type="button"
                            onClick={() => startVariantEdit(item)}
                            style={secondarySmallButtonStyle}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(item.id)}
                            style={dangerSmallButtonStyle}
                            disabled={deleteLoadingId === item.id}
                          >
                            {deleteLoadingId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={summaryCardStyle}>
      <div style={summaryLabelStyle}>{label}</div>
      <div style={summaryValueStyle}>{value}</div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div style={progressRowStyle}>
      <span>{label}</span>
      <strong style={{ color: ok ? "#1d6a43" : "#8a6418" }}>{value}</strong>
    </div>
  );
}

function VariantMeta({ label, value }: { label: string; value: string }) {
  return (
    <div style={variantMetaItemStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
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
  maxWidth: 760,
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 14,
};

const summaryCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 20,
  padding: 18,
  boxShadow: "0 10px 30px rgba(23,23,23,0.04)",
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#7c7267",
  marginBottom: 8,
  fontWeight: 800,
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  wordBreak: "break-word",
};

const galleryOverviewGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  alignItems: "start",
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

const sectionTextStyle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#6f6559",
  lineHeight: 1.7,
};

const galleryProgressTopStyle: React.CSSProperties = {
  display: "flex",
  gap: 20,
  alignItems: "center",
  marginBottom: 18,
  flexWrap: "wrap",
};

const progressRingWrapStyle: React.CSSProperties = {
  width: 132,
  height: 132,
};

const progressRingStyle: React.CSSProperties = {
  width: 132,
  height: 132,
  borderRadius: "50%",
  background: "#eef8f0",
  border: "10px solid #2f7d62",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const progressValueStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  color: "#1d6a43",
};

const progressRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  padding: "10px 0",
  borderBottom: "1px solid #eee5d9",
  color: "#5f564c",
};

const noticeBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "#f8f5ef",
  border: "1px solid #e3dbcf",
  color: "#5f564c",
  fontSize: 14,
  lineHeight: 1.7,
};

const mainPreviewWrapStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  gap: 18,
  alignItems: "center",
};

const mainPreviewImageStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: 18,
  border: "1px solid #e5ddd2",
  background: "#f5f5f5",
};

const mainPreviewMetaStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
};

const mainPreviewValueStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 18,
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
  textDecoration: "none",
  cursor: "pointer",
};

const secondarySmallButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #d9cfbf",
  background: "#fff",
  color: "#171717",
  fontWeight: 700,
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
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #e5c9c9",
  background: "#fff5f5",
  color: "#8f2d2d",
  fontWeight: 700,
  cursor: "pointer",
};

const emptyStateStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: "#faf8f4",
  border: "1px dashed #d9cfbf",
  color: "#7b7367",
  fontWeight: 700,
};

const variantPreviewBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "#f8f5ef",
  border: "1px solid #e3dbcf",
  color: "#5f564c",
};

const variantListStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const variantCardStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  padding: 16,
  borderRadius: 18,
  background: "#faf8f4",
  border: "1px solid #e5ddd2",
};

const variantActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const variantTitleStyle: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 17,
  marginBottom: 10,
};

const variantMetaGridStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const variantMetaItemStyle: React.CSSProperties = {
  display: "inline-flex",
  gap: 6,
  alignItems: "center",
  padding: "7px 10px",
  borderRadius: 999,
  background: "#fff",
  border: "1px solid #e5ddd2",
  color: "#5f564c",
  fontSize: 13,
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