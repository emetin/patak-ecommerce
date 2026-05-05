import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hospitality Projects | Patak Textile",
  description:
    "Explore hospitality textile projects created for hotels, resorts, wellness spaces, residences and premium hospitality environments.",
  alternates: {
    canonical: "/hospitality-projects",
  },
};

type ProjectItem = {
  title: string;
  location: string;
  description: string;
  image: string;
  alt: string;
};

const projects: ProjectItem[] = [
  {
    title: "Luxury Beach Resort",
    location: "Horseshoe Bay, TX",
    image: "https://www.globaltexusa.com/custom1.webp",
    alt: "Luxury velour bathrobes for beachfront resort in Horseshoe Bay Texas",
    description:
      "Luxury velour bathrobes supplied for a beachfront resort in Horseshoe Bay, Texas, designed for premium hotel comfort and elevated guest experience.",
  },
  {
    title: "Five-Star Luxury Hotel",
    location: "Philadelphia, PA",
    image: "https://www.globaltexusa.com/Custom%20Product%20Hotel2.png",
    alt: "Custom embroidered hotel tote bags for five-star hotel in Philadelphia Pennsylvania",
    description:
      "Custom embroidered hotel tote bags produced for a five-star hotel in Philadelphia, Pennsylvania, enhancing brand identity and guest amenities.",
  },
  {
    title: "Luxury Wellness & Fitness Center",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/gymtowel.webp",
    alt: "Premium embroidered gym towels for luxury fitness center in Miami Florida",
    description:
      "Premium embroidered gym towels for a luxury fitness center in Miami, Florida, tailored for hospitality and wellness environments.",
  },
  {
    title: "Luxury Beach Hotel",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-12-.png",
    alt: "Custom embroidered laundry bin cover for luxury hotel in Miami Florida",
    description:
      "Custom embroidered laundry bin covers designed for luxury hotels in Miami, Florida, combining functionality with elegant branding.",
  },
  {
    title: "Luxury Beach Hotel",
    location: "Houston, TX",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-6-.png",
    alt: "Luxury hotel towels for hospitality projects in Houston Texas",
    description:
      "Luxury hotel towels manufactured for hospitality projects in Houston, Texas, offering durability, softness and refined hospitality presentation.",
  },
  {
    title: "Luxury Hotel Event Project",
    location: "Orlando, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-11-.png",
    alt: "Custom embroidered chair covers for hotel events in Orlando Florida",
    description:
      "Custom embroidered chair covers created for hotel events and banquet spaces in Orlando, Florida, designed for luxury hospitality standards.",
  },
  {
    title: "Luxury Resort",
    location: "Orlando, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-13-.png",
    alt: "Custom fit chair covers for resort projects in Orlando Florida",
    description:
      "Custom-fit chair covers produced for resort projects in Orlando, Florida, ensuring premium protection and aesthetic harmony.",
  },
  {
    title: "Luxury Resort",
    location: "Austin, TX",
    image: "https://www.globaltexusa.com/2%20-4-.jpg",
    alt: "Custom chair covers for luxury resorts in Austin Texas",
    description:
      "Custom chair covers manufactured for luxury resorts in Austin, Texas, combining durability with high-end hospitality design.",
  },
  {
    title: "Luxury Hotel Operations",
    location: "Orlando, FL",
    image: "https://www.globaltexusa.com/JW%20Marriott-Custom%20Chair%20Cover.jpg",
    alt: "High quality banquet chair covers for luxury hotel operations in Orlando Florida",
    description:
      "High-quality banquet chair covers produced for luxury hotel operations in Orlando, Florida, designed for frequent hospitality use.",
  },
  {
    title: "Luxury Hotel Slippers",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/slipper.png",
    alt: "Luxury family slipper for resort guests and beachfront hotels in Miami Florida",
    description:
      "Luxury slippers designed for beachfront resorts, hotel pool areas and guest rooms, offering softness, comfort and a premium guest experience.",
  },
  {
    title: "Custom Pool Chair Towel Cover",
    location: "Los Angeles, CA",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-5-.jpg",
    alt: "Custom embroidered pool chair towel covers for luxury hotels and resorts in Los Angeles California",
    description:
      "Custom embroidered pool chair towel covers created for luxury hotels, resorts and poolside hospitality spaces in Los Angeles, California.",
  },
  {
    title: "Premium Resort Lounger Towels",
    location: "Austin, TX",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-4-.jpg",
    alt: "Premium resort lounger towels for luxury poolside hospitality projects in Austin Texas",
    description:
      "Premium resort lounger towels designed for luxury poolside hospitality projects, offering clean presentation, comfort and long-lasting quality.",
  },
  {
    title: "Luxury Children's Hotel Bathrobes",
    location: "New York, NY",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-3-.jpg",
    alt: "Luxury childrens hotel bathrobes for family resorts and five-star hotels in New York",
    description:
      "Luxury children's hotel bathrobes designed for family resorts, spa hotels and five-star hospitality properties.",
  },
  {
    title: "Custom Outdoor Hotel Pillows",
    location: "Las Vegas, NV",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-2-.jpg",
    alt: "Custom outdoor pillows for luxury hotel cabanas and resort lounges in Las Vegas Nevada",
    description:
      "Custom outdoor hotel pillows created for luxury cabanas, resort lounges, poolside seating and hospitality terraces.",
  },
  {
    title: "Luxury Hotel Bedding Set",
    location: "Scottsdale, AZ",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-1-.jpg",
    alt: "Luxury hotel bedding set for five-star guest rooms and resort suites in Scottsdale Arizona",
    description:
      "Luxury hotel bedding set designed for five-star guest rooms, resort suites and boutique hospitality projects.",
  },
  {
    title: "Custom Hotel Headrests",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/headrest.webp",
    alt: "Custom embroidered hotel headrests for premium hotels in Miami Florida",
    description:
      "Custom embroidered headrests designed for premium hotels in Miami, Florida, enhancing guest comfort and brand presentation.",
  },
  {
    title: "Luxury Laundry Bin Covers",
    location: "Dallas, TX",
    image: "https://www.globaltexusa.com/bincover.webp",
    alt: "Luxury embroidered laundry bin covers for hotels in Dallas Texas",
    description:
      "Luxury embroidered laundry bin covers for hotels in Dallas, Texas, offering refined presentation with durable textile performance.",
  },
  {
    title: "Custom Hotel Daybeds",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/daybed.webp",
    alt: "Custom embroidered daybeds for boutique hotels in Miami Florida",
    description:
      "Custom embroidered daybeds designed for boutique hotels in Miami, combining comfort with luxury hospitality design.",
  },
  {
    title: "Premium Chair Covers",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-3-.png",
    alt: "Premium chair covers for luxury hotels in Miami Florida",
    description:
      "Premium chair covers for luxury hotels in Miami, engineered for durability, fit and elegant presentation.",
  },
  {
    title: "Custom Embroidered Bedding Sets",
    location: "West Palm Beach, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-2-.png",
    alt: "Custom embroidered hotel bedding sets for five-star hotels in West Palm Beach Florida",
    description:
      "Custom embroidered hotel bedding sets for five-star hotels in West Palm Beach, crafted for superior comfort and durability.",
  },
  {
    title: "Luxury Residence Amenities",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-1--1.png",
    alt: "Luxury hotel slippers for hospitality projects in Miami Florida",
    description:
      "Luxury hotel slippers produced for hospitality projects in Miami, designed for premium residence and hotel guest experience.",
  },
  {
    title: "Luxury Resort Textile Solutions",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/hotel%20project.png",
    alt: "Luxury resort textiles for hospitality projects in Miami Florida",
    description:
      "Luxury resort textiles designed for hospitality projects in Miami, featuring custom colors and premium materials.",
  },
  {
    title: "International Luxury Hotel Project",
    location: "Ibiza, Spain",
    image: "https://www.globaltexusa.com/hotel%20project2.png",
    alt: "Luxury hotel textile solutions for hospitality projects in Ibiza Spain",
    description:
      "Luxury hotel textile solutions delivered to hospitality projects in Ibiza, designed for high-end resort environments.",
  },
  {
    title: "Premium Hotel Linens",
    location: "Tampa, FL",
    image: "https://www.globaltexusa.com/tampa.png",
    alt: "Premium hotel linens for five-star hotels in Tampa Florida",
    description:
      "Premium hotel linens supplied for five-star hotels in Tampa, designed for durability and luxury guest comfort.",
  },
  {
    title: "Custom Double-Head Chair Covers",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/double.png",
    alt: "Custom double head chair covers for luxury hotel events in Miami Florida",
    description:
      "Custom double-head chair covers produced for luxury hotel events in Miami, ensuring perfect fit and elegant design.",
  },
  {
    title: "Luxury Hotel Daybeds",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/daybad.png",
    alt: "Luxury hotel daybeds for hospitality use in Miami Florida",
    description:
      "Luxury hotel daybeds manufactured for hospitality use in Miami, designed for comfort, durability and premium aesthetics.",
  },
  {
    title: "Premium Hotel Daybeds",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/daybad1.png",
    alt: "Premium hotel daybeds for luxury hospitality projects in Miami Florida",
    description:
      "Premium hotel daybeds produced for luxury hospitality projects in Miami, combining tailored fit with upscale presentation.",
  },
  {
    title: "Custom Hotel Towels",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-9-.png",
    alt: "Custom hotel towels for luxury hospitality projects in Miami Florida",
    description:
      "Custom hotel towels produced for luxury hospitality projects in Miami, offering superior absorbency and softness.",
  },
  {
    title: "Custom Chair Covers",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-7-.png",
    alt: "Custom chair covers designed for luxury hotels in Miami Florida",
    description:
      "Custom chair covers designed for luxury hotels in Miami, tailored for durability and upscale presentation.",
  },
  {
    title: "Premium Hotel Towels",
    location: "Houston, TX",
    image: "https://www.globaltexusa.com/Custom%20Products%20Picturess.png",
    alt: "Premium hotel towels for hospitality projects in Houston Texas",
    description:
      "Premium hotel towels manufactured for hospitality projects in Houston, combining durability with luxury comfort.",
  },
  {
    title: "Luxury Hotel Bedding Set",
    location: "West Palm Beach, FL",
    image: "https://www.globaltexusa.com/Gold%20Stripe%20Bedroom%20Set.jpg",
    alt: "Luxury hotel bedding set with gold stripe embroidery for hospitality and resort bedrooms",
    description:
      "Premium luxury hotel bedding set featuring elegant gold stripe detailing for upscale hospitality bedrooms and resort suites.",
  },
  {
    title: "Luxury Resort & Poolside",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/Custom%20Terry%20Bag%20Black%20-1-.png",
    alt: "Custom terry pool bag for luxury resorts beach clubs and hotel poolside amenities",
    description:
      "Custom terry pool bag created for luxury resorts, beach clubs and premium hotel poolside experiences.",
  },
  {
    title: "Luxury Waffle Bathrobe",
    location: "Houston, TX",
    image: "https://www.globaltexusa.com/4.jpg",
    alt: "Luxury waffle bathrobe for hotel spa resort wellness and premium guest amenities",
    description:
      "Luxury waffle bathrobe designed for hotel spas, wellness centers, resort suites and premium guest amenities.",
  },
  {
    title: "Luxury Beach Lounge Towels",
    location: "Miami, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-19-.png",
    alt: "Luxury beach lounge chair towels for resorts and hotel poolside in Miami Florida",
    description:
      "Premium beach lounge chair towels designed for resorts, beach clubs and hotel poolside areas in Miami.",
  },
  {
    title: "Striped Terry Beach Tote Bag",
    location: "Orlando, FL",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-18-.png",
    alt: "Striped terry beach tote bag for luxury resorts and hospitality beach amenities",
    description:
      "Custom striped terry beach tote bag designed for luxury resorts, private beaches and hotel guest amenities.",
  },
  {
    title: "Custom Hotel Headrest Pillow",
    location: "San Antonio, TX",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-17-.png",
    alt: "Custom embroidered hotel headrest pillow for resort lounge chairs and beach hospitality",
    description:
      "Custom embroidered headrest pillow designed for luxury hotels, resort loungers and outdoor hospitality environments.",
  },
  {
    title: "Luxury Outdoor Daybed",
    location: "New Orleans, LA",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-20-.png",
    alt: "Luxury outdoor daybed cushion for resort poolside and beachfront hospitality areas",
    description:
      "Premium outdoor daybed cushion designed for luxury resorts, beachfront hotels and poolside hospitality environments.",
  },
  {
    title: "Family Beach Poncho Towels",
    location: "San Antonio, TX",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-15-.png",
    alt: "Luxury family beach poncho towels for resort guests and hotel beach amenities",
    description:
      "Soft and breathable beach poncho towels designed for family-friendly resorts, hotel beach services and guest comfort.",
  },
  {
    title: "Premium Hotel Bathrobe",
    location: "Houston, TX",
    image: "https://www.globaltexusa.com/Custom%20Products%20Pictures%20-14-.png",
    alt: "Premium luxury hotel bathrobe for spa bathroom and guest room hospitality use",
    description:
      "Elegant hotel bathrobe designed for spa facilities, luxury bathrooms and guest room comfort.",
  },
];

export default function HospitalityProjectsPage() {
  return (
    <>
      <section style={heroStyle}>
        <img
          src="https://www.globaltexusa.com/elarabanner.jpg"
          alt="Hospitality textile projects for hotels and resorts"
          style={heroImageStyle}
        />

        <div style={heroOverlayStyle} />

        <div style={heroContentStyle}>
          <div style={heroPanelStyle}>
            <div style={heroKickerStyle}>Patak Textile Projects</div>
            <h1 style={heroTitleStyle}>Hospitality Projects</h1>
            <p style={heroTextStyle}>
              Explore textile solutions designed for hotels, resorts, wellness
              spaces and premium hospitality environments.
            </p>
          </div>
        </div>
      </section>

      <section style={introSectionStyle}>
        <div style={introContainerStyle}>
          <div>
            <div style={sectionKickerStyle}>Project Portfolio</div>
            <h2 style={sectionTitleStyle}>
              Textile solutions created for professional hospitality standards
            </h2>
          </div>

          <p style={introTextStyle}>
            From custom towels and bathrobes to poolside textiles, bedding,
            chair covers and branded guest amenities, our project portfolio
            reflects comfort, durability and refined presentation.
          </p>
        </div>
      </section>

      <section style={projectsSectionStyle}>
        <div style={projectsGridStyle}>
          {projects.map((project, index) => (
            <article key={`${project.title}-${project.location}-${index}`} style={cardStyle}>
              <div style={imageWrapStyle}>
                <img src={project.image} alt={project.alt} style={imageStyle} />
              </div>

              <div style={cardBodyStyle}>
                <div style={locationStyle}>{project.location}</div>
                <h3 style={cardTitleStyle}>{project.title}</h3>
                <p style={cardTextStyle}>{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={appointmentSectionStyle}>
        <div style={appointmentInnerStyle}>
          <div>
            <div style={sectionKickerStyle}>Project Support</div>
            <h2 style={appointmentTitleStyle}>
              Need a quotation for your hospitality project?
            </h2>
            <p style={appointmentTextStyle}>
              Contact our team to discuss product options, specifications,
              pricing and availability for your hotel or resort project.
            </p>
          </div>

          <Link href="/contact-us" style={appointmentButtonStyle}>
            Contact Our Team
          </Link>
        </div>
      </section>
    </>
  );
}

const heroStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: 480,
  overflow: "hidden",
  background: "#111827",
};

const heroImageStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const heroOverlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(8,14,27,0.74) 0%, rgba(8,14,27,0.42) 48%, rgba(8,14,27,0.18) 100%)",
};

const heroContentStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  minHeight: 480,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "64px 20px",
};

const heroPanelStyle: React.CSSProperties = {
  width: "min(720px, 100%)",
  textAlign: "center",
  padding: "30px 34px",
  borderRadius: 24,
  background: "rgba(4, 10, 22, 0.58)",
  border: "1px solid rgba(255,255,255,0.22)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.32)",
  backdropFilter: "blur(8px)",
};

const heroKickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#d8bc55",
  marginBottom: 12,
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(34px, 5vw, 64px)",
  lineHeight: 1,
  color: "#ffffff",
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const heroTextStyle: React.CSSProperties = {
  margin: "16px auto 0",
  maxWidth: 620,
  fontSize: "clamp(15px, 1.4vw, 19px)",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.82)",
};

const introSectionStyle: React.CSSProperties = {
  padding: "76px 20px 34px",
  background: "#ffffff",
};

const introContainerStyle: React.CSSProperties = {
  maxWidth: 1220,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "0.9fr 1.1fr",
  gap: 42,
  alignItems: "end",
};

const sectionKickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#2f7d62",
  marginBottom: 12,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 3vw, 46px)",
  lineHeight: 1.08,
  color: "#111827",
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const introTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  lineHeight: 1.9,
  color: "#5f564c",
};

const projectsSectionStyle: React.CSSProperties = {
  padding: "34px 20px 82px",
  background: "#ffffff",
};

const projectsGridStyle: React.CSSProperties = {
  maxWidth: 1320,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
  gap: 24,
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 22,
  overflow: "hidden",
  border: "1px solid #e5dccf",
  boxShadow: "0 14px 36px rgba(17,24,39,0.07)",
};

const imageWrapStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "4 / 3",
  background: "#f3eee6",
  overflow: "hidden",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const cardBodyStyle: React.CSSProperties = {
  padding: 22,
};

const locationStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#2f7d62",
  marginBottom: 10,
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 21,
  lineHeight: 1.25,
  fontWeight: 900,
  color: "#111827",
};

const cardTextStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: 14,
  lineHeight: 1.75,
  color: "#5f564c",
};

const appointmentSectionStyle: React.CSSProperties = {
  padding: "0 20px 86px",
  background: "#ffffff",
};

const appointmentInnerStyle: React.CSSProperties = {
  maxWidth: 1220,
  margin: "0 auto",
  padding: "34px 38px",
  borderRadius: 24,
  background: "#faf8f4",
  border: "1px solid #e5dccf",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 28,
};

const appointmentTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(26px, 2.5vw, 38px)",
  lineHeight: 1.1,
  fontWeight: 900,
  color: "#111827",
  letterSpacing: "-0.035em",
};

const appointmentTextStyle: React.CSSProperties = {
  margin: "12px 0 0",
  maxWidth: 760,
  fontSize: 15,
  lineHeight: 1.8,
  color: "#5f564c",
};

const appointmentButtonStyle: React.CSSProperties = {
  minHeight: 48,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 22px",
  borderRadius: 999,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 900,
  whiteSpace: "nowrap",
};