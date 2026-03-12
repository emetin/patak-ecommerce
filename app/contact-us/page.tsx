import Link from "next/link";

const contactBlocks = [
  {
    title: "Sales Inquiries",
    text: "For hospitality sourcing, project quotations and textile collection discussions.",
  },
  {
    title: "Customer Support",
    text: "For existing clients, order-related communication and product information requests.",
  },
  {
    title: "Project Requests",
    text: "For hotels, residences, resorts and premium accommodation textile requirements.",
  },
];

export default function ContactUsPage() {
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
          <span className="card-kicker">Contact Us</span>
          <h1 style={{ maxWidth: 960 }}>
            A clearer contact experience for hospitality buyers and project inquiries
          </h1>
          <p className="lead" style={{ maxWidth: 860, marginBottom: 0 }}>
            This page is structured to become the main communication point for
            collection requests, hospitality sourcing discussions and customer
            support.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0, paddingBottom: 34 }}>
          <div className="cards-3">
            {contactBlocks.map((item) => (
              <article className="card" key={item.title}>
                <div className="card-body">
                  <span className="card-kicker">Contact Area</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="split-section">
            <div className="split-card">
              <span className="card-kicker">Direct Communication</span>
              <h2>Hospitality-focused lead and inquiry structure</h2>
              <p>
                We can later place the company address, phone number, email,
                WhatsApp, project request CTA and department-based contact
                routing in this section.
              </p>
              <p>
                The goal is to make contact feel professional, simple and suited
                to the expectations of hospitality buyers and project teams.
              </p>

              <div className="feature-list">
                <div className="feature-row">
                  <strong>Email</strong>
                  <span>sales@pataktextile.com</span>
                </div>
                <div className="feature-row">
                  <strong>Phone</strong>
                  <span>+90 (___) ___ __ __</span>
                </div>
                <div className="feature-row">
                  <strong>Location</strong>
                  <span>Hospitality textile operations and customer support details can be placed here.</span>
                </div>
              </div>
            </div>

            <div className="data-box" style={{ padding: 28 }}>
              <span className="card-kicker">Inquiry Form Area</span>
              <h3 style={{ marginBottom: 10 }}>Project / quotation request</h3>
              <p style={{ marginBottom: 18 }}>
                This area can later become a full contact form connected to
                email routing, CRM or simple lead capture.
              </p>

              <div style={{ display: "grid", gap: 12 }}>
                <input placeholder="Full Name" />
                <input placeholder="Company / Hotel Name" />
                <input placeholder="Email Address" />
                <input placeholder="Phone Number" />
                <textarea
                  placeholder="Tell us about your project or product requirement"
                  style={{ minHeight: 160, resize: "vertical" }}
                />
                <button className="btn-primary" type="button">
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}