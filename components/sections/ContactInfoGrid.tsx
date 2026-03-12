type ContactInfoGridProps = {
  email: string;
  phone: string;
  address: string;
  hours?: string;
};

export default function ContactInfoGrid({
  email,
  phone,
  address,
  hours,
}: ContactInfoGridProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="contact-grid">
          <article className="contact-card">
            <div className="section-heading__kicker">Email</div>
            <h3 className="contact-card__title">Send us a message</h3>
            <p className="contact-card__text">{email}</p>
          </article>

          <article className="contact-card">
            <div className="section-heading__kicker">Phone</div>
            <h3 className="contact-card__title">Call our team</h3>
            <p className="contact-card__text">{phone}</p>
          </article>

          <article className="contact-card">
            <div className="section-heading__kicker">Address</div>
            <h3 className="contact-card__title">Visit our office</h3>
            <p className="contact-card__text">{address}</p>
          </article>

          <article className="contact-card">
            <div className="section-heading__kicker">Working Hours</div>
            <h3 className="contact-card__title">Availability</h3>
            <p className="contact-card__text">{hours || "Monday - Friday"}</p>
          </article>
        </div>
      </div>
    </section>
  );
}