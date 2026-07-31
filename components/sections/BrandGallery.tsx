"use client";

import { useCallback, useEffect, useState } from "react";

const brands = [
  {
    title: "Patak Textile",
    subtitle: "Corporate Textile Catalog",
    image:
      "https://drive.google.com/thumbnail?id=1rKyG0XBhCBvWwBQX5feZbXMwINCcRGo8&sz=w1600",
  },
  {
    title: "Lavender Dome",
    subtitle: "Hospitality & Lifestyle Brand",
    image:
      "https://drive.google.com/thumbnail?id=1KBZrvcz161JfW6g8egW5NvYXe1lAo6zj&sz=w1600",
  },
];

export default function BrandGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeBrand = activeIndex !== null ? brands[activeIndex] : null;

  const closeModal = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const changeSlide = useCallback((direction: number) => {
    setActiveIndex((currentIndex) =>
      currentIndex === null
        ? null
        : (currentIndex + direction + brands.length) % brands.length
    );
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (activeIndex === null) return;

      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft") changeSlide(-1);
      if (event.key === "ArrowRight") changeSlide(1);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, changeSlide, closeModal]);

  return (
    <>
      <section className="our-brands-gallery">
        <div className="our-brands-gallery__header">
          <span>Brand Portfolio</span>
          <h2>Our textile brands, presented with a clearer identity</h2>
          <p>
            Each brand reflects Patak Textile’s production culture, design
            approach and long-term commitment to premium textile quality.
          </p>
        </div>

        <div className="our-brands-gallery__grid">
          {brands.map((brand, index) => (
            <button
              key={brand.title}
              type="button"
              className="our-brand-card"
              onClick={() => setActiveIndex(index)}
            >
              <div className="our-brand-card__image">
                <img src={brand.image} alt={brand.title} />
              </div>

              <div className="our-brand-card__content">
                <div>
                  <h3>{brand.title}</h3>
                  <p>{brand.subtitle}</p>
                </div>
                <span>View Brand</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {activeBrand ? (
        <div className="our-brand-modal" onClick={closeModal}>
          <button
            type="button"
            className="our-brand-modal__close"
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>

          <button
            type="button"
            className="our-brand-modal__arrow our-brand-modal__arrow--left"
            onClick={(event) => {
              event.stopPropagation();
              changeSlide(-1);
            }}
          >
            ‹
          </button>

          <div
            className="our-brand-modal__content"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={activeBrand.image} alt={activeBrand.title} />

            <div className="our-brand-modal__info">
              <h3>{activeBrand.title}</h3>
              <p>{activeBrand.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            className="our-brand-modal__arrow our-brand-modal__arrow--right"
            onClick={(event) => {
              event.stopPropagation();
              changeSlide(1);
            }}
          >
            ›
          </button>
        </div>
      ) : null}

      <style>{`
        .our-brands-gallery {
          display: grid;
          gap: 52px;
        }

        .our-brands-gallery__header {
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
        }

        .our-brands-gallery__header span {
          display: inline-flex;
          margin-bottom: 14px;
          color: #137231;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .our-brands-gallery__header h2 {
          margin: 0;
          color: #101010;
          font-size: clamp(38px, 4.4vw, 68px);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 900;
        }

        .our-brands-gallery__header p {
          max-width: 700px;
          margin: 22px auto 0;
          color: #6c6257;
          font-size: 18px;
          line-height: 1.75;
        }

        .our-brands-gallery__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 34px;
        }

        .our-brand-card {
          width: 100%;
          border: 1px solid rgba(17, 17, 17, 0.08);
          background: #ffffff;
          border-radius: 32px;
          padding: 20px;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 28px 90px rgba(18, 18, 18, 0.08);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .our-brand-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 34px 100px rgba(19, 114, 49, 0.13);
        }

        .our-brand-card__image {
          overflow: hidden;
          border-radius: 24px;
          aspect-ratio: 16 / 10;
          min-height: 320px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px;
          border: 1px solid rgba(17, 17, 17, 0.06);
        }

        .our-brand-card__image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .our-brand-card__content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          padding: 26px 8px 8px;
        }

        .our-brand-card__content h3 {
          margin: 0;
          color: #101010;
          font-size: 32px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .our-brand-card__content p {
          margin: 8px 0 0;
          color: #756b60;
          font-size: 15px;
          line-height: 1.6;
        }

        .our-brand-card__content span {
          flex-shrink: 0;
          color: #137231;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .our-brand-modal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 34px;
          background: rgba(5, 8, 6, 0.88);
          backdrop-filter: blur(8px);
        }

        .our-brand-modal__content {
          width: min(1180px, 94vw);
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.35);
        }

        .our-brand-modal__content img {
          width: 100%;
          max-height: 78vh;
          object-fit: contain;
          background: #ffffff;
          padding: 24px;
          display: block;
        }

        .our-brand-modal__info {
          padding: 24px 32px 34px;
        }

        .our-brand-modal__info h3 {
          margin: 0;
          font-size: 34px;
          font-weight: 900;
        }

        .our-brand-modal__info p {
          margin: 10px 0 0;
          font-size: 16px;
          color: #6f6559;
        }

        .our-brand-modal__close,
        .our-brand-modal__arrow {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.25s ease;
        }

        .our-brand-modal__close:hover,
        .our-brand-modal__arrow:hover {
          background: rgba(255, 255, 255, 0.24);
        }

        .our-brand-modal__close {
          top: 28px;
          right: 34px;
          width: 52px;
          height: 52px;
          font-size: 34px;
        }

        .our-brand-modal__arrow {
          top: 50%;
          width: 60px;
          height: 60px;
          font-size: 42px;
          transform: translateY(-50%);
        }

        .our-brand-modal__arrow--left {
          left: 34px;
        }

        .our-brand-modal__arrow--right {
          right: 34px;
        }

        @media (max-width: 1100px) {
          .our-brands-gallery__grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .our-brands-gallery__header h2 {
            font-size: clamp(34px, 9vw, 54px);
          }

          .our-brand-card__content {
            flex-direction: column;
            align-items: flex-start;
          }

          .our-brand-card__image {
            min-height: 250px;
          }

          .our-brand-modal__arrow {
            display: none;
          }

          .our-brand-modal {
            padding: 14px;
          }

          .our-brand-modal__content img {
            padding: 12px;
          }
        }
      `}</style>
    </>
  );
}
