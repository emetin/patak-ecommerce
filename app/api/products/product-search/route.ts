import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";
import { normalizeImageUrl } from "../../../../lib/image-url";

type ProductItem = {
  title?: string;
  slug?: string;
  image?: string;
  status?: string;
};

function normalize(value?: string) {
  return String(value || "").trim().toLowerCase();
}

function titleMatchesQuery(titleValue: string | undefined, query: string) {
  const title = normalize(titleValue);

  if (!title || !query) {
    return false;
  }

  const words = title.split(/[\s\-_/]+/).filter(Boolean);

  return words.includes(query);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = normalize(searchParams.get("q") || "");

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const productData = (await getSheetData("products")) as ProductItem[];

    const products = productData
      .filter((product) => normalize(product.status) === "published")
      .filter((product) => titleMatchesQuery(product.title, query))
      .slice(0, 6)
      .map((product) => ({
        title: product.title || "Untitled Product",
        slug: product.slug || "",
        image: normalizeImageUrl(product.image || ""),
      }));

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      {
        products: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}