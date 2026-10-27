import Banner from "./Banner";
import Content from "./Content";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/siteUrl";

const PAGE_SLUG = "cataract-surgery-in-moradabad";
const PAGE_URL = `${SITE_URL}/${PAGE_SLUG}`;

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
        url: `${SITE_URL}/Assets/img/services/Cataract-Service.png`,
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
    images: [`${SITE_URL}/Assets/img/services/Cataract-Service.png`],
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

// FAQ Array shared with Content component
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

export default async function CataractSurgeryPage() {
  let schemaList = [];
  try {
    const seoPage = await prisma.seoPage.findFirst({
      where: { slug: PAGE_SLUG, status: "published" },
      select: { schemaJson: true, customSchema: true },
    });
    if (seoPage) {
      if (seoPage.schemaJson) {
        schemaList = Array.isArray(seoPage.schemaJson) ? seoPage.schemaJson : [seoPage.schemaJson];
      } else if (seoPage.customSchema && seoPage.customSchema.trim()) {
        try {
          let raw = seoPage.customSchema.trim();
          if (raw.startsWith("<script") && raw.endsWith("</script>")) {
            raw = raw.replace(/<script[^>]*>/i, "").replace(/<\/script>$/i, "").trim();
          }
          const parsed = JSON.parse(raw);
          schemaList = Array.isArray(parsed) ? parsed : [parsed];
        } catch {}
      }
    }
  } catch (err) {
    console.error("Cataract page schema fetch error:", err?.message || err);
  }

  return (
    <>
      {/* Schema.org Structured Data: strictly from database written via Admin Panel */}
      {schemaList.length > 0 &&
        schemaList.map((item, index) => {
          const jsonText = JSON.stringify(item).replace(/</g, "\\u003c");
          return (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: jsonText }}
            />
          );
        })}

      {/* Main Visual Components */}
      <Banner />
      <Content faqs={FAQS} />
    </>
  );
}
