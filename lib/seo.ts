import type { Metadata } from "next";

const SITE_NAME = "Patak Textile";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.pataktextile.com";

type BuildPageMetadataArgs = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

function truncateText(text: string, maxLength = 160) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength - 3).trim()}...`;
}

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "",
  image,
}: BuildPageMetadataArgs): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const cleanDescription = truncateText(description, 160);
  const url = absoluteUrl(path);
  const ogImage = image?.trim() || absoluteUrl("/og-default.jpg");

  return {
    title: fullTitle,
    description: cleanDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: cleanDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: cleanDescription,
      images: [ogImage],
    },
  };
}