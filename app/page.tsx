import type { Metadata } from "next";
import Link from "next/link";
import { getSheetData } from "../lib/sheets";
import { normalizeImageUrl } from "../lib/image-url";
import { buildPageMetadata } from "../lib/seo";

export const revalidate = 300;

type CatalogItem = {
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  collection_slug?: string;
  status?: string;
  featured?: string;
  published_at?: string;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Patak Textile | Premium Hospitality Textiles",
  description:
    "Premium Turkish cotton textiles engineered for hotels, resorts, residences and exceptional hospitality experiences worldwide.",
  path: "/",
});

const heroImage =
  "https://drive.google.com/thumbnail?id=1HU7rJ1xdEcG83lrtsQKrc6b19N8izmT-&sz=w2000";

function isPublished(value?: string) {
  return String(value || "").trim().toLowerCase() === "published";
}

function imageOf(item: CatalogItem, fallback: string) {
  return normalizeImageUrl(String(item.image || "").trim()) || fallback;
}

export default async function HomePage() {
  const [productRows, collectionRows, blogRows] = await Promise.all([
    getSheetData("products"),
    getSheetData("collections"),
    getSheetData("blog"),
  ]);

  const products = (productRows as CatalogItem[]).filter((item) =>
    isPublished(item.status)
  );
  const collections = (collectionRows as CatalogItem[]).filter((item) =>
    isPublished(item.status)
  );
  const blog = (blogRows as CatalogItem[])
    .filter((item) => isPublished(item.status))
    .slice(0, 3);

  const featuredCollections = collections.slice(0, 4);
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <section className="editorial-hero">
        <img src={heroImage} alt="Patak Textile hospitality collection" />
        <div className="editorial-hero__veil" />
        <div className="editorial-hero__content">
          <p className="eyebrow eyebrow--light">Made in Denizli · Since 2013</p>
          <h1>Textiles that define the guest experience.</h1>
          <p className="editorial-hero__lead">
            Premium Turkish cotton collections, engineered for the rhythm of
            hospitality and refined for the world&apos;s most considered spaces.
          </p>
          <div className="editorial-hero__actions">
            <Link className="lux-button lux-button--light" href="/collections">
              Discover collections <span>↗</span>
            </Link>
            <Link className="lux-text-link lux-text-link--light" href="/about-us">
              Our story <span>→</span>
            </Link>
          </div>
        </div>
        <div className="editorial-hero__foot">
          <span>Turkish Cotton</span><span>Textile Heritage</span><span>Global Presence</span>
        </div>
      </section>

      <section className="intro-statement shell-wide">
        <p className="eyebrow">Patak Textile</p>
        <div className="intro-statement__grid">
          <h2>Crafted for comfort.<br />Built for performance.</h2>
          <div>
            <p>
              From the textile heartland of Türkiye, we create dependable linen
              programs for hotels, resorts, spas and residences across the world.
              Every collection balances tactile luxury with commercial durability.
            </p>
            <Link className="lux-text-link" href="/about-us">
              Explore our expertise <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="collection-showcase shell-wide">
        <div className="section-intro">
          <div>
            <p className="eyebrow">The collections</p>
            <h2>Designed around every stay.</h2>
          </div>
          <Link className="lux-text-link" href="/collections">
            View all collections <span>→</span>
          </Link>
        </div>

        {featuredCollections.length ? (
          <div className="editorial-grid">
            {featuredCollections.map((item, index) => (
              <Link
                href={`/collections/${item.slug || ""}`}
                className="editorial-card"
                key={`${item.slug}-${index}`}
              >
                <div className="editorial-card__media">
                  <img
                    src={imageOf(item, heroImage)}
                    alt={item.title || "Patak Textile collection"}
                  />
                  <span className="editorial-card__number">0{index + 1}</span>
                </div>
                <div className="editorial-card__body">
                  <div>
                    <h3>{item.title || "Hospitality Collection"}</h3>
                    <p>{item.description || "Premium textiles for considered hospitality spaces."}</p>
                  </div>
                  <span className="circle-arrow">↗</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="editorial-empty">Collections are being curated.</div>
        )}
      </section>

      <section className="craft-story">
        <div className="craft-story__image">
          <img
            src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1800&q=90"
            alt="Textile craftsmanship and premium cotton"
          />
        </div>
        <div className="craft-story__content">
          <p className="eyebrow eyebrow--light">The Patak standard</p>
          <h2>Performance is woven into every detail.</h2>
          <p>
            We combine Turkish cotton expertise with disciplined quality control
            to create textiles that retain their comfort, finish and character
            through the demands of professional use.
          </p>
          <div className="craft-values">
            <div><strong>01</strong><span>Premium Turkish cotton</span></div>
            <div><strong>02</strong><span>Commercial-grade durability</span></div>
            <div><strong>03</strong><span>Responsible production</span></div>
            <div><strong>04</strong><span>Reliable global supply</span></div>
          </div>
          <Link className="lux-button lux-button--outline" href="/services">
            Explore how we produce <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="products-showcase shell-wide">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Selected essentials</p>
            <h2>Quiet luxury, made to work.</h2>
          </div>
          <Link className="lux-text-link" href="/products">
            Browse the catalog <span>→</span>
          </Link>
        </div>
        {featuredProducts.length ? (
          <div className="product-editorial-grid">
            {featuredProducts.map((item, index) => (
              <Link href={`/products/${item.slug || ""}`} className="product-editorial" key={`${item.slug}-${index}`}>
                <div className="product-editorial__image">
                  <img src={imageOf(item, heroImage)} alt={item.title || "Textile product"} />
                  <span>View details ↗</span>
                </div>
                <p>{item.collection_slug || "Patak Textile"}</p>
                <h3>{item.title || "Premium textile essential"}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="editorial-empty">Products are being curated.</div>
        )}
      </section>

      <section className="cotton-journey shell-wide">
        <div className="cotton-journey__intro">
          <p className="eyebrow">From cotton to comfort</p>
          <h2>The story behind every product.</h2>
          <p>
            A Patak Textile product begins long before it reaches a guest room.
            Its character is shaped by material selection, skilled production,
            careful finishing and a culture of quality at every stage.
          </p>
        </div>
        <div className="cotton-journey__steps">
          <article><span>01</span><h3>Fiber</h3><p>Quality begins with carefully selected Turkish cotton and traceable raw materials.</p></article>
          <article><span>02</span><h3>Yarn</h3><p>Fiber is transformed into yarn engineered for softness, strength and consistent performance.</p></article>
          <article><span>03</span><h3>Weaving</h3><p>Textile knowledge and modern production create the structure of each collection.</p></article>
          <article><span>04</span><h3>Finishing</h3><p>Washing, dyeing and finishing give every product its final touch and character.</p></article>
          <article><span>05</span><h3>Quality</h3><p>Each detail is reviewed before products become part of the Patak Textile story.</p></article>
        </div>
      </section>

      <section className="company-window shell-wide">
        <div className="company-window__visual">
          <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=90" alt="Patak Textile global offices" />
        </div>
        <div className="company-window__content">
          <p className="eyebrow">One company, a complete story</p>
          <h2>People, places and principles.</h2>
          <p>Meet our leadership, discover our offices and learn about the standards and certifications that guide how Patak Textile works.</p>
          <div className="company-window__links">
            <Link href="/our-ceo">Our CEO <span>→</span></Link>
            <Link href="/about-us">Company history <span>→</span></Link>
            <Link href="/contact-us">Offices & contact <span>→</span></Link>
            <Link href="/services">Quality standards <span>→</span></Link>
          </div>
        </div>
      </section>

      {blog.length ? (
        <section className="journal shell-wide">
          <div className="section-intro">
            <div><p className="eyebrow">Journal</p><h2>Ideas, materials and perspective.</h2></div>
            <Link className="lux-text-link" href="/blog">Read the journal <span>→</span></Link>
          </div>
          <div className="journal-grid">
            {blog.map((item, index) => (
              <Link href={`/blog/${item.slug || ""}`} className="journal-card" key={`${item.slug}-${index}`}>
                <img src={imageOf(item, heroImage)} alt={item.title || "Patak Textile journal"} />
                <p>Insight · {String(index + 1).padStart(2, "0")}</p>
                <h3>{item.title || "From the Patak Textile journal"}</h3>
                <span>Read article →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="closing-cta">
        <p className="eyebrow">Discover Patak Textile</p>
        <h2>There is a story woven into everything we make.</h2>
        <Link className="lux-button" href="/about-us">Read our company story <span>↗</span></Link>
      </section>
    </>
  );
}
