import type { Metadata } from "next";
import { getSheetData } from "../../lib/sheets";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import SectionHeading from "../../components/ui/SectionHeading";
import CollectionCard from "../../components/cards/CollectionCard";
import { buildPageMetadata } from "../../lib/seo";

type CollectionItem = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  seo_title?: string;
  seo_description?: string;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Premium Textile Collections",
  description:
    "Explore Patak Textile’s premium textile collections designed for hospitality, residential and professional spaces.",
  path: "/collections",
});

export default async function CollectionsPage() {
  let collections: CollectionItem[] = [];
  let errorMessage = "";

  try {
    const data = await getSheetData("collections");

    collections = (data as CollectionItem[])
      .filter(
        (item) => String(item.status || "").trim().toLowerCase() === "published"
      )
      .sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || ""))
      );
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";
  }

  return (
    <>
      <section
        style={{
          background:
            "linear-gradient(180deg, #f8f4ed 0%, #f3eee6 60%, #ffffff 100%)",
          borderBottom: "1px solid #ede3d7",
          padding: "84px 0 64px",
        }}
      >
        <Container>
          <div style={{ maxWidth: 880 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 34,
                padding: "0 14px",
                borderRadius: 999,
                background: "#e9e2d6",
                color: "#5f564c",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Collections
            </div>

            <h1
              style={{
                margin: "0 0 18px",
                fontSize: "clamp(2.5rem, 4.8vw, 4.6rem)",
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#171717",
              }}
            >
              Premium Textile Collections for Hospitality and Home
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 760,
                color: "#5d554a",
                fontSize: 17,
                lineHeight: 1.9,
              }}
            >
              Browse Patak Textile’s carefully developed collections, crafted to
              deliver comfort, durability and refined presentation across
              hospitality, residential and professional environments.
            </p>
          </div>
        </Container>
      </section>


      {errorMessage ? (
        <Section>
          <Container>
            <div className="empty-state">
              <strong>Error:</strong> {errorMessage}
            </div>
          </Container>
        </Section>
      ) : collections.length === 0 ? (
        <Section>
          <Container>
            <div className="empty-state">
              No published collections found yet. Items with status set to
              <strong> published</strong> in the collections sheet will appear
              here.
            </div>
          </Container>
        </Section>
      ) : (
        <Section>
          <Container>
            <SectionHeading
              kicker="Collection Directory"
              title="Explore our product categories"
              text="Discover textile categories designed to support hotels, residences and professional projects with reliable quality and refined presentation."
            />

            <div className="cards-grid cards-grid--3">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={`${
                    collection.slug || collection.title || "collection"
                  }-${index}`}
                  title={collection.title || "Untitled Collection"}
                  description={
                    collection.description ||
                    "Explore this textile collection within the Patak Textile catalog."
                  }
                  image={collection.image || ""}
                  href={`/collections/${collection.slug || ""}`}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
