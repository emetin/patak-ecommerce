export default function OurBrandsBanner() {
  return (
    <section className="our-brands-banner">
      <div className="our-brands-banner__inner">
        <div className="our-brands-banner__content">
          <span>Our Brands</span>
          <h1>A refined brand world shaped by textile expertise</h1>
          <p>
            Explore the visual identity, production strength and trusted
            structure behind Patak Textile’s growing brand portfolio.
          </p>
        </div>

        <div className="our-brands-banner__visual">
          <div className="our-brands-banner__image our-brands-banner__image--main">
            <img
              src="https://drive.google.com/thumbnail?id=1rKyG0XBhCBvWwBQX5feZbXMwINCcRGo8&sz=w1200"
              alt="Patak Textile Brand"
            />
          </div>

          <div className="our-brands-banner__image our-brands-banner__image--floating">
            <img
              src="https://drive.google.com/thumbnail?id=1KBZrvcz161JfW6g8egW5NvYXe1lAo6zj&sz=w900"
              alt="Lavender Dome Brand"
            />
          </div>
        </div>
      </div>

      <style>{`
        .our-brands-banner {
          position: relative;
          overflow: hidden;
          padding: 92px 20px 110px;
          background:
            radial-gradient(circle at 12% 18%, rgba(19, 114, 49, 0.12), transparent 30%),
            linear-gradient(135deg, #f7f4ee 0%, #ffffff 54%, #eef3ed 100%);
          border-bottom: 1px solid rgba(19, 114, 49, 0.1);
        }

        .our-brands-banner__inner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 64px;
          align-items: center;
        }

        .our-brands-banner__content span {
          display: inline-flex;
          margin-bottom: 18px;
          color: #137231;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .our-brands-banner__content h1 {
          margin: 0;
          max-width: 720px;
          color: #101010;
          font-size: clamp(48px, 6vw, 88px);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-weight: 900;
        }

        .our-brands-banner__content p {
          margin: 26px 0 0;
          max-width: 620px;
          color: #62594f;
          font-size: 19px;
          line-height: 1.8;
        }

        .our-brands-banner__visual {
          position: relative;
          min-height: 430px;
        }

        .our-brands-banner__image {
          position: absolute;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(17, 17, 17, 0.08);
          box-shadow: 0 30px 90px rgba(19, 40, 28, 0.14);
        }

        .our-brands-banner__image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          background: #ffffff;
          padding: 22px;
        }

        .our-brands-banner__image--main {
          inset: 0 34px 56px 0;
          border-radius: 34px;
        }

        .our-brands-banner__image--floating {
          right: 0;
          bottom: 0;
          width: 48%;
          height: 46%;
          border-radius: 26px;
        }

        @media (max-width: 900px) {
          .our-brands-banner {
            padding: 70px 18px 80px;
          }

          .our-brands-banner__inner {
            grid-template-columns: 1fr;
            gap: 42px;
          }

          .our-brands-banner__visual {
            min-height: 360px;
          }

          .our-brands-banner__image--main {
            inset: 0 0 70px 0;
          }

          .our-brands-banner__image--floating {
            width: 58%;
          }
        }
      `}</style>
    </section>
  );
}