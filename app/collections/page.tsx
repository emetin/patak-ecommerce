import type { Metadata } from "next";
import { getSheetData } from "../../lib/sheets";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import SectionHeading from "../../components/ui/SectionHeading";
import CollectionCard from "../../components/cards/CollectionCard";
import ButtonLink from "../../components/ui/ButtonLink";
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
  title: "Collections",
  description:
    "Explore curated hospitality textile collections for hotels, resorts, residences and premium accommodation projects by Patak Textile.",
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
      <section className="page-hero">
        <Container>
          <div className="page-hero__inner">
            <div className="page-hero__kicker">Collections</div>
            <h1 className="page-hero__title">
              Curated hospitality textile collections
            </h1>
            <p className="page-hero__text">
              Explore collection groups built for hotels, residences, resorts and
              premium accommodation projects. This structure helps visitors move
              through textile families in a cleaner and more trusted way.
            </p>
          </div>
        </Container>
      </section>

      <Section tight>
        <Container>
          <ButtonLink href="/" variant="secondary">
            ← Back to Home
          </ButtonLink>
        </Container>
      </Section>

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
              kicker="All Collections"
              title="The main navigation layer for the hospitality catalog"
              text="Collection pages organize the product world more clearly and help users move through hospitality textile categories with greater confidence."
            />

            <div className="cards-grid cards-grid--3">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={`${collection.slug || collection.title || "collection"}-${index}`}
                  title={collection.title || "Untitled Collection"}
                  description={
                    collection.description || "No description added yet."
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