import Link from "next/link";

const faqItems = [
  {
    question: "What type of clients does Patak Textile serve?",
    answer:
      "Patak Textile is presented around hospitality-focused textile needs including hotels, residences, resorts, spas and premium accommodation projects.",
  },
  {
    question: "How are products organized on the website?",
    answer:
      "Products are grouped through collection-based navigation so visitors can understand categories and related textile families more clearly.",
  },
  {
    question: "Can collections and products be managed easily?",
    answer:
      "Yes. The system is built on a lean Google Sheets based structure that allows products, collections and editorial content to be updated more practically.",
  },
  {
    question: "Will more pages and features be added later?",
    answer:
      "Yes. The current system is designed as a scalable foundation, so new public pages, richer detail sections and additional workflows can be added over time.",
  },
  {
    question: "Can this structure support premium brand presentation?",
    answer:
      "Yes. The design direction is intentionally focused on white space, strong typography, hospitality trust and more premium visual hierarchy.",
  },
  {
    question: "Can project inquiries be taken through the website?",
    answer:
      "Yes. The contact structure can later be expanded into a project request and lead generation flow for hospitality buyers.",
  },
];

export default function FAQPage() {
  return (
    <div className="simple-page">
      <div className="container">
        <div style={{ marginBottom: 18 }}>
          <Link href="/" className="btn-secondary">
            ← Home
          </Link>
        </div>

        <section
          style={{
            marginBottom: 34,
            padding: "32px 0 8px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="card-kicker">FAQ</span>
          <h1 style={{ maxWidth: 920 }}>
            Frequently asked questions for hospitality textile presentation
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            This section helps explain the structure, positioning and practical
            use of the new Patak Textile website in a simpler and more readable way.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div style={{ display: "grid", gap: 8 }}>
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="data-box"
                style={{ padding: 0, overflow: "hidden" }}
              >
                <summary
                  style={{
                    listStyle: "none",
                    cursor: "pointer",
                    padding: "22px 24px",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#000000",
                  }}
                >
                  {item.question}
                </summary>

                <div
                  style={{
                    padding: "0 24px 24px",
                    color: "rgba(0,0,0,0.65)",
                    fontSize: 16,
                    lineHeight: 1.7,
                  }}
                >
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}