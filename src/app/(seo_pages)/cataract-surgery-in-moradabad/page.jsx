import Banner from "./Banner";
import Content from "./Content";
import {
  generateHospitalSchema,
  generatePhysicianSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateProcedureSchema,
  PRIMARY_DOCTORS,
} from "../_lib/schema";

const PAGE_SLUG = "cataract-surgery-in-moradabad";
const PAGE_URL = `https://www.oracleeyehospital.com/${PAGE_SLUG}`;

// 51 characters (50–60 chars, keyword first, ends with "| Oracle Eye Hospital")
const PAGE_TITLE = "Cataract Surgery in Moradabad | Oracle Eye Hospital";

// 158 characters (140–160 chars, keyword + CTA)
const PAGE_DESCRIPTION =
  "Looking for advanced cataract surgery in Moradabad? Oracle Eye Hospital offers stitchless phacoemulsification, robotic precision & premium IOLs. Book today!";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Oracle Eye Hospital",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.oracleeyehospital.com/Assets/img/services/Cataract-Service.png",
        width: 1200,
        height: 630,
        alt: "Advanced Cataract Surgery in Moradabad - Oracle Eye Hospital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["https://www.oracleeyehospital.com/Assets/img/services/Cataract-Service.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// FAQ Array shared with Content component to guarantee 100% schema consistency
export const FAQS = [
  {
    question: "What is the recovery time after cataract surgery in Moradabad?",
    answer:
      "Most patients notice improved vision within 24 to 48 hours following micro-incision phacoemulsification surgery. You can resume basic indoor activities, walking, and reading the very next day. Complete corneal stabilization and final lens settling generally take 2 to 4 weeks, during which prescribed antibiotic and anti-inflammatory eye drops must be used as advised by our specialists.",
  },
  {
    question: "Is cataract surgery painful or does it require injections?",
    answer:
      "No. At Oracle Eye Hospital in Moradabad, modern cataract surgery is performed using topical anesthesia (numbing eye drops). It is completely stitchless, blade-free, and injection-free for the vast majority of cases. Patients feel virtually no pain during the 10 to 15 minute procedure.",
  },
  {
    question: "What types of intraocular lenses (IOLs) are available?",
    answer:
      "We provide a comprehensive range of US-FDA approved foldable intraocular lenses, including Monofocal IOLs (clear distance vision, reading glasses needed), Toric IOLs (correcting corneal astigmatism alongside cataracts), Multifocal & Trifocal IOLs (freedom from glasses for distance, intermediate computer distance, and near reading), and Extended Depth of Focus (EDOF) lenses.",
  },
  {
    question: "Is cataract surgery covered by health insurance and cashless TPA in Moradabad?",
    answer:
      "Yes. Oracle Eye Hospital is empaneled with major health insurance companies, TPAs (Third Party Administrators), and corporate healthcare panels. Our dedicated cashless insurance helpdesk assists you with instant eligibility verification, pre-authorization, and paperless claims.",
  },
  {
    question: "How do I know if I need cataract surgery?",
    answer:
      "If you experience blurred or foggy vision, sensitivity to glare from headlights during night driving, fading colors, double vision in one eye, or rapid changes in spectacle power, you should undergo a comprehensive slit-lamp evaluation at Oracle Eye Hospital. Surgery is recommended when the cataract begins interfering with your daily lifestyle, reading, or driving.",
  },
  {
    question: "Why is phacoemulsification better than traditional cataract surgery?",
    answer:
      "Phacoemulsification uses gentle ultrasonic energy through a microscopic 1.8 mm to 2.2 mm incision to emulsify and remove the clouded lens. Because the opening is self-sealing, no stitches are required, induced astigmatism is minimized, infection risks are extremely low, and visual recovery is significantly faster than older surgical methods.",
  },
  {
    question: "Can both eyes be operated on the same day?",
    answer:
      "For patient safety and optimal post-operative tracking, international ophthalmology guidelines recommend operating on one eye at a time. Typically, the second eye is scheduled within 3 to 7 days once the first eye shows healthy healing and stable vision.",
  },
];

export default function CataractSurgeryPage() {
  const hospitalSchema = generateHospitalSchema();
  const physicianSchema = generatePhysicianSchema(PRIMARY_DOCTORS[0]);
  const faqSchema = generateFAQSchema(FAQS);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Cataract Surgery in Moradabad", url: `/${PAGE_SLUG}` },
  ]);
  const procedureSchema = generateProcedureSchema({
    name: "Micro-Incision Cataract Surgery (Phacoemulsification)",
    description:
      "Stitchless, injection-free outpatient cataract removal with premium intraocular lens (IOL) implantation.",
    procedureType: "SurgicalProcedure",
    bodyLocation: "Eye",
    url: `/${PAGE_SLUG}`,
  });

  return (
    <>
      {/* Structured Data: Hospital / MedicalClinic */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalSchema) }}
      />

      {/* Structured Data: Operating Physician */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />

      {/* Structured Data: FAQPage (mirrors Content.jsx exactly) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Structured Data: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Structured Data: MedicalProcedure */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureSchema) }}
      />

      {/* Main Visual Components */}
      <Banner />
      <Content faqs={FAQS} />
    </>
  );
}
