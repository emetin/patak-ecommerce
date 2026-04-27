export type CareerPosition = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  intro: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
};

export const careerPositions: CareerPosition[] = [
  {
    slug: "accounting-assistant",
    title: "Accounting Assistant",
    department: "Accounting",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    summary:
      "Support daily accounting operations, document tracking and financial administration within a professional textile structure.",
    intro:
      "We are looking for an Accounting Assistant who is detail-oriented, organized and eager to grow within our accounting and administrative operations.",
    responsibilities: [
      "Support daily accounting records and document organization.",
      "Assist with invoice, payment and supplier document tracking.",
      "Maintain accurate filing for financial and administrative documents.",
      "Coordinate with internal teams for missing or updated documents.",
      "Support monthly reporting and basic reconciliation processes.",
    ],
    requirements: [
      "Education or experience in accounting, finance or business administration.",
      "Strong attention to detail and documentation discipline.",
      "Good command of Microsoft Excel or Google Sheets.",
      "Clear communication and follow-up skills.",
      "Ability to work in a structured office environment.",
    ],
    preferred: [
      "Experience in textile, production or trading companies.",
      "Familiarity with accounting software or ERP systems.",
      "Basic English communication skills.",
    ],
  },
  {
    slug: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    summary:
      "Plan and support digital marketing activities across social media, content, website and campaign channels.",
    intro:
      "We are looking for a Digital Marketing Specialist who can support our brand visibility, content planning and digital growth strategy.",
    responsibilities: [
      "Plan and manage social media content calendars.",
      "Support website content updates and campaign landing pages.",
      "Prepare marketing copy for posts, newsletters and digital channels.",
      "Track campaign performance and prepare simple reports.",
      "Coordinate with design, sales and management teams.",
    ],
    requirements: [
      "Experience or education in marketing, communications or related fields.",
      "Understanding of social media platforms and digital content.",
      "Strong writing and communication skills.",
      "Basic knowledge of SEO, Google Ads or Meta Ads.",
      "Ability to work with deadlines and campaign calendars.",
    ],
    preferred: [
      "Experience with Shopify, WordPress or custom CMS systems.",
      "Basic design sense and familiarity with Canva or Adobe tools.",
      "English writing ability for international brand communication.",
    ],
  },
  {
    slug: "web-master-web-developer",
    title: "Web Master / Web Developer",
    department: "Technology",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    summary:
      "Maintain, improve and develop company websites, product pages, landing pages and digital systems.",
    intro:
      "We are looking for a Web Master / Web Developer who can support our websites, improve user experience and help build scalable digital systems.",
    responsibilities: [
      "Maintain and update company websites.",
      "Develop landing pages, product pages and content sections.",
      "Support technical SEO, performance and responsive design improvements.",
      "Work with forms, integrations and basic CMS structures.",
      "Coordinate with marketing and management teams for digital projects.",
    ],
    requirements: [
      "Experience with HTML, CSS, JavaScript and responsive design.",
      "Basic understanding of React or Next.js.",
      "Ability to work with CMS or e-commerce platforms.",
      "Problem-solving mindset and attention to detail.",
      "Ability to test and debug website issues.",
    ],
    preferred: [
      "Experience with Shopify Liquid.",
      "Experience with Google Sheets based CMS structures.",
      "Knowledge of Git and GitHub workflows.",
    ],
  },
  {
    slug: "human-resources-specialist",
    title: "Human Resources Specialist",
    department: "Human Resources",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    summary:
      "Support recruitment, onboarding, employee communication and HR documentation processes.",
    intro:
      "We are looking for a Human Resources Specialist who can contribute to a structured, people-focused and professional workplace culture.",
    responsibilities: [
      "Support recruitment processes and candidate communication.",
      "Organize onboarding documents and orientation plans.",
      "Maintain employee records and HR documentation.",
      "Assist with internal communication and employee follow-up.",
      "Support training, performance and administrative HR processes.",
    ],
    requirements: [
      "Education or experience in human resources, business or psychology.",
      "Strong communication and organization skills.",
      "Discretion and professionalism with employee information.",
      "Good command of office tools and document management.",
      "Positive, solution-oriented and people-focused approach.",
    ],
    preferred: [
      "Experience in recruitment or onboarding.",
      "Knowledge of labor documentation processes.",
      "English communication skills.",
    ],
  },
  {
    slug: "logistics-specialist",
    title: "Logistics Specialist",
    department: "Operations",
    location: "Patak Textile - Denizli, TR",
    type: "Full-time",
    summary:
      "Support shipment planning, warehouse coordination, order follow-up and logistics communication.",
    intro:
      "We are looking for a Logistics Specialist who can support smooth order movement, shipment coordination and operational tracking.",
    responsibilities: [
      "Coordinate shipment and delivery processes.",
      "Track orders, warehouse movements and logistics documents.",
      "Communicate with suppliers, carriers and internal teams.",
      "Support export, domestic shipment and delivery planning.",
      "Prepare operational reports and follow-up lists.",
    ],
    requirements: [
      "Experience or education in logistics, supply chain or operations.",
      "Strong follow-up and organization skills.",
      "Good command of Excel or Google Sheets.",
      "Ability to work with deadlines and operational details.",
      "Clear communication and problem-solving skills.",
    ],
    preferred: [
      "Experience in textile or production logistics.",
      "Knowledge of export documentation.",
      "English communication skills.",
    ],
  },
  {
    slug: "customer-support-specialist-remote",
    title: "Customer Support Specialist",
    department: "Customer Support",
    location: "Remote / Türkiye",
    type: "Remote",
    summary:
      "Support customer communication, order follow-up and service quality through remote customer care operations.",
    intro:
      "We are looking for a Customer Support Specialist who can communicate professionally with customers and support a smooth service experience.",
    responsibilities: [
      "Respond to customer inquiries via email, phone or digital channels.",
      "Support order follow-up and customer communication.",
      "Coordinate with sales, logistics and operations teams.",
      "Maintain clear customer records and communication notes.",
      "Identify recurring issues and suggest process improvements.",
    ],
    requirements: [
      "Customer service or administrative support experience.",
      "Excellent written and verbal communication skills.",
      "Strong problem-solving and follow-up ability.",
      "Comfortable working remotely with digital tools.",
      "Professional and patient customer-focused attitude.",
    ],
    preferred: [
      "Experience in B2B, hospitality, textile or e-commerce support.",
      "Familiarity with CRM systems.",
      "Strong English communication skills.",
    ],
  },
];

export function getCareerPosition(slug: string) {
  return careerPositions.find((position) => position.slug === slug);
}